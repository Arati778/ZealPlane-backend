const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Assuming you have a User model
const router = express.Router();

// Refresh token endpoint
router.post("/", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token required." });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Fetch the user from the database using the user ID from the refresh token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create a new access token
    const newAccessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        uniqueId: user.uniqueId,
        username: user.username,
        profilePic: user.profilePic,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // New access token expiration time
    );

    // Send the new access token to the frontend
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Error refreshing token:", err);
    res.status(403).json({ message: "Invalid refresh token." });
  }
});

module.exports = router;
