const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Routes for posts
router.get('/', postController.getPosts);               // Get all posts
router.get('/:id', postController.getPostById);         // Get a single post by ID
router.post('/', postController.createPost);            // Create a new post
router.put('/:id', postController.updatePost);          // Update an existing post by ID
router.delete('/:id', postController.deletePost);       // Delete a post by ID

// Route for updating post votes (upvote/downvote)
router.put('/:id/votes', postController.updateVotes);   // Update votes for a post

// Routes for comments
router.post('/:id/comments', postController.addComment);               // Add a comment to a post
router.put('/:id/comments/:commentId', postController.updateComment);   // Update a specific comment by ID
router.delete('/:id/comments/:commentId', postController.deleteComment); // Delete a specific comment by ID

module.exports = router;
