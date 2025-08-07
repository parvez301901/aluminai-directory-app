const express = require('express');
const clerkAuth = require('../clerkAuth');
const User = require('../models/User');
const Post = require('../models/Post');

const router = express.Router();

// --- Profile Management ---
// Get current user's profile
router.get('/profile', clerkAuth, async (req, res) => {
  try {
    const user = await User.findOne({ clerkUserId: req.user.sub });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update current user's profile
router.put('/profile', clerkAuth, async (req, res) => {
  try {
    const update = req.body;
    const user = await User.findOneAndUpdate(
      { clerkUserId: req.user.sub },
      update,
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Social Feed ---
// Get all posts (optionally filter by group)
router.get('/posts', clerkAuth, async (req, res) => {
  try {
    const { group } = req.query;
    const filter = group ? { group } : {};
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new post
router.post('/posts', clerkAuth, async (req, res) => {
  try {
    const post = new Post({ ...req.body, userId: req.user.sub });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Reactions ---
// Add reaction to a post
router.post('/posts/:postId/reactions', clerkAuth, async (req, res) => {
  try {
    const { type } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    // Remove previous reaction by this user
    post.reactions = post.reactions.filter(r => r.userId !== req.user.sub);
    // Add new reaction
    post.reactions.push({ userId: req.user.sub, type });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Alumni Search ---
router.get('/alumni', clerkAuth, async (req, res) => {
  try {
    const { name, location, jobTitle, group } = req.query;
    let filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (location) filter.location = location;
    if (jobTitle) filter.jobTitle = jobTitle;
    if (group) filter.group = group;
    const alumni = await User.find(filter);
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
