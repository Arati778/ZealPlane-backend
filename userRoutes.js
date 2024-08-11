const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("./controllers/userController");
const upload = require("./midleware/upload"); // Import the configured multer instance
const ValidateToken = require("./midleware/validateTokenHandler");

const router = express.Router();

// Register route   
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Get current user route
router.get("/me", ValidateToken, currentUser);

// Get user by ID
router.get("/:id", getUserById);

// Update user (with profilePic upload)
// Ensure token is validated before handling file upload
router.put("/:id", upload.single("profilePic"), ValidateToken, updateUser);

// Delete user
router.delete("/:id", ValidateToken, deleteUser);

module.exports = router;
