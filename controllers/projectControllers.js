// const express = require('express');
// const asyncHandler = require('express-async-handler');
// const Project = require('../models/projectModel');

// // Create a new project
// const createProject = asyncHandler(async (req, res) => {
//   const { name, description, thumbnailImage, username } = req.body;
//   const project = new Project({
//     name,
//     description,
//     thumbnailImage,
//     username
//   });
//   const savedProject = await project.save();
//   res.status(201).json(savedProject);
// });

// // Get all projects
// const getAllProjects = asyncHandler(async (req, res) => {
//   const projects = await Project.find();
//   res.json(projects);
// });

// // Get a project by projectId
// const getProjectById = asyncHandler(async (req, res) => {
//   const { projectId } = req.params;
//   const project = await Project.findById(projectId);
//   if (!project) {
//     return res.status(404).json({ message: 'Project not found' });
//   }
//   res.json(project);
// });

// // Update a project by projectId
// const updateProjectById = asyncHandler(async (req, res) => {
//   const { projectId } = req.params;
//   const { name, description, thumbnailImage, username } = req.body;
//   const updatedProject = await Project.findByIdAndUpdate(
//     projectId,
//     { name, description, thumbnailImage, username },
//     { new: true }
//   );
//   if (!updatedProject) {
//     return res.status(404).json({ message: 'Project not found' });
//   }
//   res.json(updatedProject);
// });

// // Delete a project by projectId
// const deleteProjectById = asyncHandler(async (req, res) => {
//   const { projectId } = req.params;
//   const deletedProject = await Project.findByIdAndDelete(projectId);
//   if (!deletedProject) {
//     return res.status(404).json({ message: 'Project not found' });
//   }
//   res.json({ message: 'Project deleted successfully' });
// });

// module.exports = {
//   createProject,
//   getAllProjects,
//   getProjectById,
//   updateProjectById,
//   deleteProjectById
// };
