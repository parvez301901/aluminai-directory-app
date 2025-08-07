// User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String },
  graduationYear: { type: Number },
  department: { type: String },
  jobTitle: { type: String },
  location: { type: String },
  group: { type: String }, // batch/department
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
