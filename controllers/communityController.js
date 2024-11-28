// controllers/communityController.js
const Community = require('../models/community');

// Create a new community
// Create a new community
exports.createCommunity = async (req, res) => {
  // Destructure necessary fields from the request body
  const { name, description, image } = req.body;
  
  // Check if req.user exists (user must be authenticated)
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  // Get the username of the authenticated user
  const createdBy = req.user.username;

  console.log("Authenticated user:", req.user);  // Log the entire user object to debug
  console.log("Created by:", createdBy);  // Log the createdBy username

  try {
    // Create a new community document
    const newCommunity = new Community({
      name,
      description,
      image,
      createdBy,
    });

    // Save the new community to the database
    await newCommunity.save();
    res.status(201).json(newCommunity);  // Return the newly created community
  } catch (error) {
    console.error('Error creating community:', error); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};



// Get a community by ID
exports.getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    res.status(200).json(community);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all communities
exports.getCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
