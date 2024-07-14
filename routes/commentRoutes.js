const express = require('express');
const router = express.Router();
const {
  addComment,
  getCommentsByProjectId,
  removeComment,
} = require('../controllers/commentController');

router.post('/', addComment);
router.get('/project/:projectId', getCommentsByProjectId);
router.delete('/:commentId', removeComment);

module.exports = router;
