const express = require('express');
const { registerUser, loginUser, currentUser, getUserById, updateUser, deleteUser } = require('./controllers/userController');
const upload = require('./midleware/upload'); // Import the configured multer instance

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Get current user route
router.get('/me', currentUser);

// Get user by ID
router.get('/:id', getUserById);

// Update user (with profilePic upload)
router.put('/:id', upload.single('profilePic'), updateUser);

// Delete user
router.delete('/:id', deleteUser);

module.exports = router;
