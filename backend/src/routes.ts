import express, { Request, Response, NextFunction } from 'express';
import clerkAuth from './clerkAuth';
import User, { IUser } from './models/User';
import Post, { IPost } from './models/Post';

const router = express.Router();

// --- Profile Management ---
router.get('/profile', clerkAuth, async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ clerkUserId: (req as any).user.sub });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/profile', clerkAuth, async (req: Request, res: Response) => {
  try {
    const update = req.body;
    const user = await User.findOneAndUpdate(
      { clerkUserId: (req as any).user.sub },
      update,
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Social Feed ---
router.get('/posts', clerkAuth, async (req: Request, res: Response) => {
  try {
    const { group } = req.query;
    const filter = group ? { group } : {};
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/posts', clerkAuth, async (req: Request, res: Response) => {
  try {
    const post = new Post({ ...req.body, userId: (req as any).user.sub });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Reactions ---
router.post('/posts/:postId/reactions', clerkAuth, async (req: Request, res: Response) => {
  try {
    const { type } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    // Remove previous reaction by this user
    post.reactions = post.reactions.filter(r => r.userId !== (req as any).user.sub);
    // Add new reaction
    post.reactions.push({ userId: (req as any).user.sub, type });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Alumni Search ---
router.get('/alumni', clerkAuth, async (req: Request, res: Response) => {
  try {
    const { name, location, jobTitle, group } = req.query;
    let filter: any = {};
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

// Get alumni by Clerk user ID (public profile)
router.get('/alumni/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ clerkUserId: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
