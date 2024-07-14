const asynchandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let userCounter = 0; // Static counter for unique IDs (not recommended for production)

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
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashedPassword);

  userCounter += 1; // Increment counter for each new user
  const status = `Active-${userCounter}`; // Example status format
  const uniqueId = userCounter;

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
    throw new Error("User data is not valid");
  }
});

// Login User
const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    // User authenticated, generate token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // token expiry time
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
    throw new Error("Invalid email or password");
  }
});

// Get Current User
const currentUser = asynchandler(async (req, res) => {
  res.json(req.user);
});

// Get User by ID
const getUserById = asynchandler(async (req, res) => {
  const { id } = req.params;

  // Find user by unique ID
  const user = await User.findOne({ uniqueId: id });

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
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

  // Find user by unique ID
  const user = await User.findOne({ uniqueId: id });

  if (user) {
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

    res.status(200).json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


// Delete User
const deleteUser = asynchandler(async (req, res) => {
  const { id } = req.params;

  // Find user by unique ID
  const user = await User.findOne({ uniqueId: id });

  if (user) {
    await user.remove();
    res.status(200).json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = { registerUser, loginUser, currentUser, getUserById, updateUser, deleteUser };
