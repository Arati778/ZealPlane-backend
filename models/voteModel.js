const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  uniqueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Links to user
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // Links to post
  voteValue: { type: Number, enum: [1, -1], required: true }, // 1 (upvote), -1 (downvote)
  timestamp: { type: Date, default: Date.now },
});

// Prevent duplicate votes from the same user on a post
VoteSchema.index({ uniqueId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", VoteSchema);
