const mongoose = require("mongoose");

// Define the Comment Schema
const CommentSchema = new mongoose.Schema({
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
  author: { type: String }, // Author's username
  uniqueId: { type: String }, // Make it optional
  profilePic: { type: String }, // Author's profile picture
});

// Define the Vote Schema (modified to not require unique: true)
const VoteSchema = new mongoose.Schema({
  uniqueId: { type: String }, // User's unique ID (no uniqueness constraint)
  timestamp: { type: Date, default: Date.now },
  voteValue: { type: Number, enum: [1, -1] }, // Can only be 1 (upvote) or -1 (downvote)
});

// Define the Post Schema
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  profilePic: { type: String },
  body: { type: String, required: true },
  subreddit: { type: String },
  uniqueId: { type: String },
  author: { type: String },
  timestamp: { type: Date, default: Date.now },
  votes: { type: [VoteSchema], default: [] }, // Array of votes
  comments: { type: [CommentSchema], default: [] },
  image: { type: String },
});

// Export the Post model
module.exports = mongoose.model("Post", PostSchema);
