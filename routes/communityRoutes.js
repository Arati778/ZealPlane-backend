// routes/communities.js
const express = require('express');
const router = express.Router();
const communityController = require('../controllers/CommunityController');
const ValidateToken = require('../midleware/validateTokenHandler');

// Create a new community
router.post('/post', ValidateToken, communityController.createCommunity);

// Get all communities
router.get('/', communityController.getCommunities);

// Get a community by ID
router.get('/:id', communityController.getCommunityById);

module.exports = router;
