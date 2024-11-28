const express = require("express");
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  getProjectsByUsername,
  createProject,
  updateProject,
  addThumbnailImage,
  getCommentById,
  updateComment, // Add missing functions
  deleteComment, // Add missing functions
  likeProject,
  commentOnProject,
} = require("../controllers/projectController");
const ValidateToken = require("../midleware/validateTokenHandler");

// Middleware for handling file uploads
const projectUpload = require("../midleware/projectUpload");

// Route to get all projects
router.get("/", getAllProjects);

// Route to get project by projectId
router.get("/id/:projectId", ValidateToken, getProjectById);

// Route to get projects by username
router.get("/username/:username", getProjectsByUsername);

// Route to create a new project
router.post("/", projectUpload.singleThumbnail, createProject);

// Route to update project by projectId
router.put(
  "/id/:projectId",
  [projectUpload.singleThumbnail, projectUpload.multipleImages],
  updateProject
);

router.post("/id/:projectId", projectUpload.singleThumbnail, addThumbnailImage);

router.post("/:projectId", ValidateToken, commentOnProject); // This will map to /api/comments/:projectId

// Update a comment in a project
router.put("/:projectId/comments/:commentId", ValidateToken, updateComment);

// Delete a comment from a project
router.delete("/:projectId/:commentId", deleteComment); // This will map to /api/comments/:projectId/:commentId

// Like/Unlike routes
router.post("/:projectId/like", ValidateToken, likeProject);

router.get("/:projectId/:commentId", getCommentById);

module.exports = router;
