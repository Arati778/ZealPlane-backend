const asyncHandler = require('express-async-handler');
const Like = require('../models/LikeModel');
const Project = require('../models/projectModel');
const User = require('../models/userModel');

// Add a like to a project
const addLike = asyncHandler(async (req, res) => {
  const { userId, likerId, projectId } = req.body;

  // Validate that all required IDs are provided
  if (!userId || !likerId || !projectId) {
    res.status(400);
    throw new Error('User ID, Liker ID, and Project ID are required');
  }

  // Validate that the project exists
  const projectExists = await Project.findById(projectId);
  if (!projectExists) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Validate that the user and liker exist
  const userExists = await User.findById(userId);
  const likerExists = await User.findById(likerId);
  if (!userExists || !likerExists) {
    res.status(404);
    throw new Error('User or Liker not found');
  }

  // Check if the like already exists
  const existingLike = await Like.findOne({ userId, likerId, projectId });
  if (existingLike) {
    res.status(400);
    throw new Error('Like already exists');
  }

  // Create and save the new like
  const like = new Like({
    userId,
    likerId,
    projectId,
  });

  // const createdLike = await like.save();

  // // Increment the like count in the project model
  // projectExists.likeCount = projectExists.likeCount + 1;
  // await projectExists.save();

  res.status(201).json({
    message: 'Like added successfully',
    // createdLike,
    // likeCount: projectExists.likeCount
  });
});

// Get all likes for a project
const getLikesByProjectId = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // Find likes for the given project
  const likes = await Like.find({ projectId })
    .populate('userId', 'username') // Populate userId with username
    .populate('likerId', 'username'); // Populate likerId with username

  res.json(likes);
});

// Remove a like from a project
const removeLike = asyncHandler(async (req, res) => {
  const { likeId } = req.params;

  // Find the like by ID
  const like = await Like.findById(likeId);

  if (like) {
    // Decrement the like count in the project model
    const project = await Project.findById(like.projectId);
    if (project) {
      project.likeCount = project.likeCount > 0 ? project.likeCount - 1 : 0;
      await project.save();
    }

    await like.remove();
    res.json({ message: 'Like removed', likeCount: project.likeCount });
  } else {
    res.status(404);
    throw new Error('Like not found');
  }
});

module.exports = {
  addLike,
  getLikesByProjectId,
  removeLike,
};
