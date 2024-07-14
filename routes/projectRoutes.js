const express = require("express");
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  getProjectsByUsername,
  createProject,
  updateProject,
} = require("../controllers/projectController");

// Middleware for handling file uploads
const projectUpload = require("../midleware/projectUpload");

// Route to get all projects
router.get("/", getAllProjects);

// Route to get project by projectId
router.get("/id/:projectId", getProjectById);

// Route to get projects by username
router.get("/username/:username", getProjectsByUsername);

// Route to create a new project
router.post("/", projectUpload.single("thumbnailImage"), createProject);

// Route to update project by projectId
router.put("/id/:projectId", projectUpload.single("thumbnailImage"), updateProject);

module.exports = router;
