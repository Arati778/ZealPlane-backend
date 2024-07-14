const express = require('express');
const router = express.Router();
const {
  addLike,
  getLikesByProjectId,
  removeLike,
} = require('../controllers/LikeController');

router.post('/', addLike);
router.get('/project/:projectId', getLikesByProjectId);
router.delete('/:likeId', removeLike);

module.exports = router;
