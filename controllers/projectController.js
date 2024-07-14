// const express = require("express");
// const asyncHandler = require("express-async-handler");
// const Project = require("../models/projectModel");

// // // // Create a new project
// // // const createProject = asyncHandler(async (req, res) => {
// // //   const {
// // //     title,
// // //     projectDescription,
// // //     // tags,
// // //     // subTags,
// // //     websiteLink,
// // //     publisher,
// // //     // teammates,
// // //     // images,
// // //     likes,
// // //     // wishlist,
// // //     // enquired,
// // //     ratings,
// // //     // feedback,
// // //     id,
// // //     username
// // //   } = req.body;

// // //   // Validate that id and username are provided
// // //   if (!id || !username) {
// // //     res.status(400);
// // //     throw new Error('User ID and username are required');
// // //   }

// // //   // Validate that id and username are of correct type (assuming id should be a number and username a string)
// // //   if (typeof id !== 'number' || typeof username !== 'string') {
// // //     res.status(400);
// // //     throw new Error('Invalid data types for User ID and/or username');
// // //   }

// // //   const project = new Project({
// // //     title,
// // //     projectDescription,
// // //     projectId: new mongoose.Types.ObjectId(), // Automatically generates a new ObjectId
// // //     id,
// // //     username,
// // //     // tags: tags || [],
// // //     // subTags: subTags || [],
// // //     websiteLink: websiteLink || null,
// // //     publisher: publisher || null,
// // //     // teammates: teammates || [],
// // //     // images: images || [],
// // //     likes: likes || 0,
// // //     // wishlist: wishlist || [],
// // //     // enquired: enquired || [],
// // //     ratings: ratings || 0,
// // //     // feedback: feedback || [],
// // //   });

// // //   const createdProject = await project.save();
// // //   res.status(201).json(createdProject);
// // // });

// // // // Get all projects based on timestamp (for home page)
// // // const getAllProjects = asyncHandler(async (req, res) => {
// // //   const projects = await Project.find({}).sort({ createdAt: -1 });
// // //   res.json(projects);
// // // });

// // // // Get project by ID
// // // const getProjectById = asyncHandler(async (req, res) => {
// // //   const project = await Project.findById(req.params.id);

// // //   if (project) {
// // //     res.json(project);
// // //   } else {
// // //     res.status(404);
// // //     throw new Error("Project not found");
// // //   }
// // // });

// // // // Get all projects with pagination and filter by user ID
// // // const getProjectsPaginated = asyncHandler(async (req, res) => {
// // //   const { page = 1, limit = 5, userId } = req.query;

// // //   // Create a query object to filter by _id if provided
// // //   const query = userId ? { id: userId } : {};

// // //   const projects = await Project.find(query)
// // //     .sort({ createdAt: -1 })
// // //     .skip((page - 1) * limit)
// // //     .limit(Number(limit));

// // //   const totalProjects = await Project.countDocuments(query);
// // //   const totalPages = Math.ceil(totalProjects / limit);

// // //   res.json({
// // //     projects,
// // //     currentPage: Number(page),
// // //     totalPages,
// // //   });
// // // });

// // // // Update project by ID
// // // const updateProject = asyncHandler(async (req, res) => {
// // //   const {
// // //     title,
// // //     projectDescription,
// // //     tags,
// // //     subTags,
// // //     websiteLink,
// // //     publisher,
// // //     teammates,
// // //     images,
// // //     likes,
// // //     wishlist,
// // //     enquired,
// // //     ratings,
// // //     feedback,
// // //   } = req.body;

// // //   const project = await Project.findById(req.params.id);

// // //   if (project) {
// // //     project.title = title || project.title;
// // //     project.projectDescription =
// // //       projectDescription || project.projectDescription;
// // //     project.tags = tags || project.tags;
// // //     project.subTags = subTags || project.subTags;
// // //     project.websiteLink = websiteLink || project.websiteLink;
// // //     project.publisher = publisher || project.publisher;
// // //     project.teammates = teammates || project.teammates;
// // //     project.images = images || project.images;
// // //     project.likes = likes !== undefined ? likes : project.likes;
// // //     project.wishlist = wishlist || project.wishlist;
// // //     project.enquired = enquired || project.enquired;
// // //     project.ratings = ratings !== undefined ? ratings : project.ratings;
// // //     project.feedback = feedback || project.feedback;

// // //     const updatedProject = await project.save();
// // //     res.json(updatedProject);
// // //   } else {
// // //     res.status(404);
// // //     throw new Error("Project not found");
// // //   }
// // // });

// // // // Delete project by ID
// // // const deleteProject = asyncHandler(async (req, res) => {
// // //   const project = await Project.findById(req.params.id);

// // //   if (project) {
// // //     await project.remove();
// // //     res.json({ message: "Project removed" });
// // //   } else {
// // //     res.status(404);
// // //     throw new Error("Project not found");
// // //   }
// // // });

// // // module.exports = {
// // //   createProject,
// // //   getAllProjects,
// // //   getProjectById,
// // //   getProjectsPaginated,
// // //   updateProject,
// // //   deleteProject,
// // // };

// // const asyncHandler = require("express-async-handler");
// // const mongoose = require("mongoose");
// // const Project = require("../models/projectModel");

// // // Create a new project
// // const createProject = asyncHandler(async (req, res) => {
// //   const {
// //     title,
// //     projectDescription,
// //     tags,
// //     subTags,
// //     websiteLink,
// //     publisher,
// //     teammates,
// //     ratings,
// //     feedback,
// //     id,
// //     username
// //   } = req.body;

// //   // Create a new project object
// //   const project = new Project({
// //     title,
// //     projectDescription,
// //     projectId: new mongoose.Types.ObjectId(), // Automatically generates a new ObjectId
// //     id,
// //     username,
// //     tags: tags || [],
// //     subTags: subTags || [],
// //     websiteLink: websiteLink || null,
// //     publisher: publisher || null,
// //     teammates: teammates || [],
// //     ratings: ratings || 0,
// //     feedback: feedback || [],
// //   });

// //   // Check if a file was uploaded and set the thumbnail URL
// //   if (req.file) {
// //     project.thumbnail = req.file.path;
// //   }

// //   // Save the project to the database
// //   const createdProject = await project.save();
// //   res.status(201).json(createdProject);
// // });

// // // Get all projects based on timestamp (for home page)
// // const getAllProjects = asyncHandler(async (req, res) => {
// //   const projects = await Project.find({}).sort({ createdAt: -1 });
// //   res.json(projects);
// // });

// // // Get project by ID
// // const getProjectById = asyncHandler(async (req, res) => {
// //   const project = await Project.findById(req.params.id);

// //   if (project) {
// //     res.json(project);
// //   } else {
// //     res.status(404);
// //     throw new Error("Project not found");
// //   }
// // });

// // // Get all projects with pagination and filter by user ID
// // const getProjectsPaginated = asyncHandler(async (req, res) => {
// //   const { page = 1, limit = 5, userId } = req.query;

// //   // Create a query object to filter by userId if provided
// //   const query = userId ? { id: userId } : {};

// //   const projects = await Project.find(query)
// //     .sort({ createdAt: -1 })
// //     .skip((page - 1) * limit)
// //     .limit(Number(limit));

// //   const totalProjects = await Project.countDocuments(query);
// //   const totalPages = Math.ceil(totalProjects / limit);

// //   res.json({
// //     projects,
// //     currentPage: Number(page),
// //     totalPages,
// //   });
// // });

// // // Update project by ID
// // const updateProject = asyncHandler(async (req, res) => {
// //   const { title, projectDescription } = req.body;

// //   const project = await Project.findById(req.params.id);

// //   if (project) {
// //     project.title = title || project.title;
// //     project.projectDescription =
// //       projectDescription || project.projectDescription;

// //     const updatedProject = await project.save();
// //     res.json(updatedProject);
// //   } else {
// //     res.status(404);
// //     throw new Error("Project not found");
// //   }
// // });

// // // Delete project by ID
// // const deleteProject = asyncHandler(async (req, res) => {
// //   const project = await Project.findById(req.params.id);

// //   if (project) {
// //     await project.remove();
// //     res.json({ message: "Project removed" });
// //   } else {
// //     res.status(404);
// //     throw new Error("Project not found");
// //   }
// // });

// // module.exports = {
// //   createProject,
// //   getAllProjects,
// //   getProjectById,
// //   getProjectsPaginated,
// //   updateProject,
// //   deleteProject,
// // };
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Project = require("../models/projectModel");

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
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
      return res.status(404).json({ message: "Project not found" });
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
      return res.status(404).json({ message: "No projects found for this username" });
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

  if (!id || !username) {
    return res.status(400).json({ message: "Username and id are required." });
  }

  const project = new Project({
    name,
    description,
    thumbnailImage,
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

// Update an existing project
const updateProject = async (req, res) => {
  const {
    name,
    description,
    username,
    tags,
    subtags,
    publisher,
    teammates,
    ratings,
  } = req.body;
  const thumbnailImage = req.file ? req.file.path : null;

  try {
    const project = await Project.findOne({ projectId: req.params.projectId });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.thumbnailImage = thumbnailImage || project.thumbnailImage;
    project.username = username || project.username;
    project.tags = tags || project.tags;
    project.subtags = subtags || project.subtags;
    project.publisher = publisher || project.publisher;
    project.teammates = teammates || project.teammates;
    project.ratings = ratings || project.ratings;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  getProjectsByUsername,
  createProject,
  updateProject,
};
