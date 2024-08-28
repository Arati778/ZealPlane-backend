const asynchandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// Register User
const registerUser = asynchandler(async (req, res) => {
  const {
    username,
    email,
    password,
    fullName,
    description,
    dob,
    gender,
    profilePic,
    location,
    contactNumber,
    address,
    jobRole,
    level,
  } = req.body;

  console.log("Register User Request Body:", req.body);

  if (!username || !email || !password) {
    res.status(400);
    console.log("Missing required fields");
    throw new Error("All fields are mandatory!");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    console.log("User already registered:", userAvailable);
    throw new Error("User already registered!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashedPassword);

  const uniqueId = uuidv4(); // Generate a UUID for the uniqueId
  const status = `Active-${uniqueId}`; // Example status format

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    uniqueId,
    status,
    fullName: fullName || null,
    description: description || null,
    dob: dob || null,
    gender: gender || null,
    profilePic: profilePic || null,
    location: location || null,
    contactNumber: contactNumber || null,
    address: address || null,
    jobRole: jobRole || null,
    level: level || null,
  });

  console.log(`User created: ${user}`);

  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
      uniqueId: user.uniqueId,
      status: user.status,
    });
  } else {
    res.status(400);
    console.log("Invalid user data");
    throw new Error("User data is not valid");
  }
});

// Google Login
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLoginUser = asynchandler(async (req, res) => {
  const { token } = req.body;

  console.log("Received token from frontend:", token);

  if (!token) {
    res.status(400);
    console.log("Token is required");
    throw new Error("Token is required");
  }

  try {
    // Verify the token using Google OAuth2Client
    console.log("Verifying Google token...");
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Google token payload:", payload);

    // Extract user information from the payload
    const { email, name, picture, sub: googleId } = payload;

    // Check if the user already exists in your database
    let user = await User.findOne({ email });
    console.log("User found in database:", user);

    if (!user) {
      // If the user doesn't exist, create a new user
      user = new User({
        username: name,
        email: email,
        profilePic: picture,
        googleId: googleId,
        password: "", // Ensure that the password field is not required for Google-authenticated users
        uniqueId: uuidv4(), // Generate a UUID for the uniqueId
        status: `Active-${uuidv4()}`, // Example status format
      });

      await user.save();
      console.log("New user created:", user);
    } else {
      // Update existing user's name and profile picture with Google info
      user.username = name; 
      user.profilePic = picture;
      await user.save();
      console.log("User updated with Google info:", user);
    }

    // Generate a JWT for your application
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, uniqueId: user.uniqueId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // Token expiry time
    );

    console.log("Generated access token:", accessToken);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      token: accessToken,
      id: user.uniqueId,
    });
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    res.status(500);
    throw new Error("Google sign-in failed");
  }
});

module.exports = { googleLoginUser };

// Login User
const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("Login User Request Body:", req.body);

  // Validate email and password
  if (!email || !password) {
    res.status(400);
    console.log("Missing email or password");
    throw new Error("All fields are mandatory!");
  }

  // Check if user exists
  const user = await User.findOne({ email });
  console.log("User found in database:", user);

  if (user && (await bcrypt.compare(password, user.password))) {
    // User authenticated, generate token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, uniqueId: user.uniqueId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // Token expiry time
    );

    res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      token: accessToken,
      id: user.uniqueId,
    });
  } else {
    res.status(401);
    console.log("Invalid email or password");
    throw new Error("Invalid email or password");
  }
});

// Get Current User
const currentUser = asynchandler(async (req, res) => {
  try {
    console.log("Request to get current user:", req.user);

    const user = await User.findById(req.user._id); // Assuming you have middleware that sets req.user
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404);
      console.log("User not found");
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Unable to retrieve current user:", error);
    res.status(500);
    throw new Error("Unable to retrieve current user");
  }
});

// Get User by ID
const getUserById = asynchandler(async (req, res) => {
  const { id } = req.params;

  console.log(`Request to get user by ID: ${id}`);

  // Find user by unique ID
  const user = await User.findOne({ uniqueId: id });
  console.log("User found by ID:", user);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    console.log(`User not found with ID: ${id}`);
    throw new Error("User not found");
  }
});

// Update User
const updateUser = asynchandler(async (req, res) => {
  const { id } = req.params;
  const {
    username,
    email,
    fullName,
    description,
    dob,
    gender,
    location,
    contactNumber,
    address,
    jobRole,
    level,
    status,
  } = req.body;

  console.log(`Request to update user with ID: ${id}`);

  // Find user by unique ID
  const user = await User.findOne({ uniqueId: id });

  if (!user) {
    console.log(`User not found with ID: ${id}`);
    res.status(404);
    throw new Error("User not found");
  }

  user.username = username || user.username;
  user.email = email || user.email;
  user.fullName = fullName || user.fullName;
  user.description = description || user.description;
  user.dob = dob || user.dob;
  user.gender = gender || user.gender;
  user.location = location || user.location;
  user.contactNumber = contactNumber || user.contactNumber;
  user.address = address || user.address;
  user.jobRole = jobRole || user.jobRole;
  user.level = level || user.level;
  user.status = status || user.status;

  // Update profilePic if a new file is uploaded
  if (req.file) {
    user.profilePic = req.file.path;
  }

  const updatedUser = await user.save();
  console.log("User updated:", updatedUser);

  res.status(200).json(updatedUser);
});

// Delete User
const deleteUser = asynchandler(async (req, res) => {
  const { id } = req.params;

  console.log(`Request to delete user with ID: ${id}`);

  const user = await User.findOneAndDelete({ uniqueId: id });
  if (user) {
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    console.log(`User not found with ID: ${id}`);
    throw new Error("User not found");
  }
});

module.exports = {
  registerUser,
  googleLoginUser,
  loginUser,
  currentUser,
  getUserById,
  updateUser,
  deleteUser,
};
