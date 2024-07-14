const asyncHandler = require('express-async-handler');
const Enquiry = require('../models/enquiryModel');
const Project = require('../models/projectModel');
const User = require('../models/userModel');

// Add an enquiry to a project
const addEnquiry = asyncHandler(async (req, res) => {
  const { userId, projectId, enquiry } = req.body;

  // Validate that all required fields are provided
  if (!userId || !projectId || !enquiry) {
    res.status(400);
    throw new Error('User ID, Project ID, and enquiry are required');
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

  const newEnquiry = new Enquiry({
    userId,
    projectId,
    enquiry,
  });

  const createdEnquiry = await newEnquiry.save();
  res.status(201).json(createdEnquiry);
});

// Get all enquiries for a project
const getEnquiriesByProjectId = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const enquiries = await Enquiry.find({ projectId }).populate('userId', 'username');
  res.json(enquiries);
});

// Remove an enquiry from a project
const removeEnquiry = asyncHandler(async (req, res) => {
  const { enquiryId } = req.params;

  const enquiry = await Enquiry.findById(enquiryId);

  if (enquiry) {
    await enquiry.remove();
    res.json({ message: 'Enquiry removed' });
  } else {
    res.status(404);
    throw new Error('Enquiry not found');
  }
});

module.exports = {
  addEnquiry,
  getEnquiriesByProjectId,
  removeEnquiry,
};
