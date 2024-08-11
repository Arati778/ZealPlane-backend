const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference type
    ref: 'User', // Reference to User model
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId, // Reference type
    ref: 'Project', // Reference to Project model if applicable
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
