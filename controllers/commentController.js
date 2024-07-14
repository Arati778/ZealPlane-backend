const asyncHandler = require('express-async-handler');
const Comment = require('../models/commentModel');
const Project = require('../models/projectModel');
const User = require('../models/userModel');

// Add a comment to a project
const addComment = asyncHandler(async (req, res) => {
  const { userId, projectId, comment } = req.body;

  // Validate that all required fields are provided
  if (!userId || !projectId || !comment) {
    res.status(400);
    throw new Error('User ID, Project ID, and comment are required');
  }

  // Validate that the project exists
  const projectExists = await Project.findById(projectId);
  if (!projectExists) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Validate that the user exists
  const userExists = await User.findById(userId);
  if (!userExists) {
    res.status(404);
    throw new Error('User not found');
  }

  const newComment = new Comment({
    userId,
    projectId,
    comment,
  });

  const createdComment = await newComment.save();
  res.status(201).json(createdComment);
});

// Get all comments for a project
const getCommentsByProjectId = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const comments = await Comment.find({ projectId }).populate('userId', 'username');
  res.json(comments);
});

// Remove a comment from a project
const removeComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (comment) {
    await comment.remove();
    res.json({ message: 'Comment removed' });
  } else {
    res.status(404);
    throw new Error('Comment not found');
  }
});

module.exports = {
  addComment,
  getCommentsByProjectId,
  removeComment,
};
