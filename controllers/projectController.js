
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Project = require('../models/projectModel');
const Notification = require('../models/notificationModel');
const User = require('../models/userModel');


const getAllProjects = async (req, res) => {
  try {
    // Find projects where thumbnailImage is not null or an empty string, and thumbnailImages array is not null or empty
    const projects = await Project.find({
      thumbnailImage: { $ne: null, $ne: "" },  // Ensure thumbnailImage is neither null nor empty
      $and: [
        { thumbnailImages: { $ne: null } },    // Ensure thumbnailImages is not null
        { thumbnailImages: { $not: { $size: 0 } } } // Ensure thumbnailImages is not an empty array
      ]
    });
    
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// Get a project by projectId
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all projects by username
const getProjectsByUsername = async (req, res) => {
  try {
    const projects = await Project.find({ username: req.params.username });
    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this username' });
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new project
const createProject = async (req, res) => {
  const {
    name,
    description,
    username,
    id,
    tags,
    subtags,
    publisher,
    teammates,
    ratings,
  } = req.body;

  const thumbnailImage = req.file ? req.file.path : null;
  const images = req.files ? req.files.map(file => file.path) : [];

  if (!id || !username) {
    return res.status(400).json({ message: 'Username and id are required.' });
  }

  const project = new Project({
    name,
    description,
    thumbnailImage,
    images,
    username,
    projectId: new mongoose.Types.ObjectId(),
    id,
    tags,
    subtags,
    publisher,
    teammates,
    ratings,
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const addThumbnailImage = async (req, res) => {
  try {
    const { projectId } = req.body;

    console.log('Received request to add a thumbnail image.');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const newThumbnail = req.file ? req.file.path : null;
    console.log('New thumbnail path:', newThumbnail);

    if (!newThumbnail) {
      console.log('No thumbnail image uploaded.');
      return res.status(400).json({ message: 'No thumbnail image uploaded.' });
    }

    // Ensure the projectId is provided
    if (!projectId) {
      console.log('No projectId provided.');
      return res.status(400).json({ message: 'Project ID is required.' });
    }

    // Convert projectId to ObjectId and attempt to find and update the project with the new thumbnail image
    const updatedProject = await Project.findOneAndUpdate(
      { projectId: new mongoose.Types.ObjectId(projectId) },
      { $push: { thumbnailImages: newThumbnail } }, // Use $push to add the new thumbnail image to the array
      { new: true } 
    );

    if (!updatedProject) {
      console.log(`Project with ID ${projectId} not found.`);
      return res.status(404).json({ message: 'Project not found.' });
    }

    console.log('Project updated successfully:', updatedProject);
    res.status(200).json(updatedProject);
  } catch (err) {
    console.error('Error occurred while updating the project:', err.message);
    res.status(500).json({ message: err.message });
  }
};


const updateProject = async (req, res) => {
  const {
    name,
    description,
    tags,
    subtags,
    publisher,
    teammates,
    ratings,
  } = req.body;

  // Extract the Cloudinary URLs of uploaded files
  const thumbnailImage = req.file ? req.file.path : null; // req.file.path is the URL for Cloudinary
  const additionalImages = req.files ? req.files.map(file => file.path) : []; // req.files.map(file => file.path) gives URLs

  try {
    // Find the project to update
    const project = await Project.findOne({ projectId: req.params.projectId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update the project's fields
    project.name = name || project.name;
    project.description = description || project.description;
    project.thumbnailImage = thumbnailImage || project.thumbnailImage;
    project.images = additionalImages.length > 0 ? [...project.images, ...additionalImages] : project.images;
    project.tags = tags || project.tags;
    project.subtags = subtags || project.subtags;
    project.publisher = publisher || project.publisher;
    project.teammates = teammates || project.teammates;
    project.ratings = ratings || project.ratings;

    // Save the updated project
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const addComment = async (req, res) => {
  const { username, body } = req.body;

  if (!body) {
    return res.status(400).json({ message: 'Comment body is required' });
  }

  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const projectOwner = await User.findById(project.userId); // Fetch the project owner

    // Create a new comment with a timestamp
    const newComment = {
      username,
      body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add the comment to the project's comments array
    project.comments.push(newComment);

    // Save the updated project
    await project.save();

    // Create a notification for the project owner if someone comments on their project
    if (req.user.id !== projectOwner._id.toString()) {
      const notificationMessage = `${username} commented on your project "${project.name}"`;

      const notification = new Notification({
        recipient: projectOwner._id, // Notify the project owner
        sender: req.user.id,         // User who added the comment
        message: notificationMessage,
        projectId: project._id,
      });
      await notification.save();
    }

    return res.status(201).json(newComment); // Return the newly added comment
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update a comment in a project
const updateComment = async (req, res) => {
  const { commentId, body } = req.body;
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Find the comment to update
    const comment = project.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.body = body;
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a comment from a project
const deleteComment = async (req, res) => {
  const { commentId } = req.body;
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Remove the comment
    project.comments.id(commentId).remove();
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const likeProject = async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId }).populate('likedBy', 'username'); // Populate 'likedBy' with user data
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Ensure likedBy is initialized as an array
    if (!project.likedBy) {
      project.likedBy = [];
    }

    const userId = req.user.id; // Assuming req.user contains the user ID after authentication

    // Check if the user has already liked the project
    const userIndex = project.likedBy.findIndex(user => user._id.toString() === userId);

    if (userIndex === -1) {
      // User has not liked the project yet, so like it
      project.likes += 1;
      project.likedBy.push(userId); // Add user to likedBy array
    } else {
      // User has already liked the project, so unlike it
      project.likes -= 1;
      project.likedBy.splice(userIndex, 1); // Remove user from likedBy array
    }

    // Save the updated project
    const updatedProject = await project.save();

    // Re-populate likedBy to include user details
    const populatedProject = await Project.findById(updatedProject._id).populate('likedBy', 'username');

    // Emit the updated project data via Socket.io
    req.io.emit('projectLiked', {
      projectId: populatedProject.projectId,
      likes: populatedProject.likes,
      likedBy: populatedProject.likedBy,
    });

    res.json(populatedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




module.exports = {
  getAllProjects,
  getProjectById,
  getProjectsByUsername,
  createProject,
  updateProject,
  addComment,
  updateComment,
  deleteComment,
  likeProject,
  addThumbnailImage
};