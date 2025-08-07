// Post.js
const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // clerkUserId
  type: { type: String, enum: ['like', 'celebrate', 'support'], required: true },
}, { _id: false });

const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // clerkUserId
  content: { type: String, required: true },
  reactions: [ReactionSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
