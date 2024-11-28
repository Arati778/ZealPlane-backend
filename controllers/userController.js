const asynchandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

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

  // Check for required fields
  if (!username || !email || !password) {
    res.status(400);
    console.log("Missing required fields");
    throw new Error("Username, email, and password are mandatory!");
  }

  // Check if the username already exists
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    res.status(400);
    console.log("Username already exists:", usernameExists);
    throw new Error("Username already taken!");
  }

  // Check if the email is already registered
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    console.log("User already registered:", userAvailable);
    throw new Error("User with this email already registered!");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashedPassword);

  // Generate a unique ID and set user status
  const uniqueId = uuidv4();
  const status = `Active-${uniqueId}`; // Example status format

  // Create a new user
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

  // Send response
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

    // Get the first name from the user's full name
    const firstName = name.split(" ")[0]; // Extract first name and make it lowercase
    console.log("Extracted firstName:", firstName);

    // Check if the user already exists in your database
    let user = await User.findOne({ email });
    console.log("User found in database:", user);

    if (!user) {
      // Use the first name as the base username
      let username = firstName;

      let isUsernameTaken = true;
      let counter = 1;

      // Try creating a new user and handle duplicate username using error handling
      while (isUsernameTaken) {
        try {
          // Try creating the user with the generated username
          user = new User({
            fullName: name, // Save Google name in fullName
            email: email,
            profilePic: picture,
            googleId: googleId,
            username: username, // Save the username
            password: "", // Password not required for Google-authenticated users
            uniqueId: uuidv4(),
            status: `Active-${uuidv4()}`,
          });

          await user.save(); // Attempt to save the new user
          console.log("New user created:", user);
          isUsernameTaken = false; // If save is successful, break out of the loop
        } catch (err) {
          // If a MongoDB unique constraint error occurs, it means the username is already taken
          if (err.code === 11000) {
            // Handle unique constraint violation error (duplicate username)
            console.log("Username is already taken. Trying again...");
            // Modify the username by appending a counter
            username = `${firstName}_${counter}`;
            counter++;
          } else {
            // For any other errors, rethrow them
            throw err;
          }
        }
      }
    } else {
      // If user exists, update the fullName only if it's null
      if (!user.fullName) {
        user.fullName = name;
      }
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
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        username: user.username, // Include the unique username in the response
        id: user.uniqueId,
      },
      token: accessToken,
    });
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    res.status(500);
    throw new Error("Google sign-in failed");
  }
});

module.exports = { googleLoginUser };

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
    // User authenticated, generate access token and refresh token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        uniqueId: user.uniqueId,
        username: user.username,
        profilePic: user.profilePic,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // Access token expires in 5 seconds
    );

    // Generate refresh token with longer expiry
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" } // Refresh token expires in 30 days
    );

    // Send refresh token as an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "Strict", // Ensures the cookie is sent only in requests to the same domain
    });

    // Send the access token in the response body
    res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      profilePic: user.profilePic,
      jobRole: user.jobRole,
      token: accessToken, // Access token
      refreshToken: refreshToken, // Send the refresh token here
      id: user.uniqueId,
    });
  } else {
    res.status(401);
    console.log("Invalid email or password");
    throw new Error("Invalid email or password");
  }
});

const currentUser = asynchandler(async (req, res) => {
  try {
    console.log("Request to get current user:", req.user); // Log the request user

    // Check if req.user is defined and has the _id property
    if (!req.user || !req.user.userId) {
      console.error("User ID is missing from request:", req.user);
      return res.status(401).json({ message: "User not authorized" });
    }
    // Assuming req.user contains the user data
    res.status(200).json(req.user); // Send the user data in the response
  } catch (error) {
    console.error("Unable to retrieve current user:", error);
    res.status(500).json({ message: "Unable to retrieve current user" });
  }
});

const getUserById = asynchandler(async (req, res) => {
  const { id } = req.params; // ID of the user being accessed
  const uniqueIdFromToken = req.user.uniqueId; // Unique ID from the token

  console.log(`Request to get user by ID: ${id}`);

  // Find user by uniqueId
  const user = await User.findOne({ uniqueId: id });
  console.log("User found by ID:", user);

  if (user) {
    // Determine the user's status based on whether the IDs match
    const status = uniqueIdFromToken === id ? "admin" : "visitor";

    // Respond with user data and status
    res.status(200).json({
      user,
      status,
    });
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

const getUserByUsername = asynchandler(async (req, res) => {
  // Extract username from params or search query
  const username = req.params.username || req.query.search;

  console.log(`Request to get user by username or search query: ${username}`); // Log request

  // Check if username or search query is provided
  if (!username) {
    return res.status(400).json({
      title: "Bad Request",
      message: "Username or search query is required",
    });
  }

  // Find user by username using regex for partial matches
  const users = await User.find({
    username: { $regex: username, $options: "i" },
  }); // 'i' makes the search case-insensitive

  console.log("User(s) found by username:", users); // Log the found user(s)

  if (users.length > 0) {
    res.status(200).json(users); // Respond with user data
  } else {
    console.log(`User not found with username: ${username}`); // Log not found
    res.status(404).json({
      title: "Not found",
      message: "User not found",
    }); // Respond with a structured JSON error message
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
  getUserByUsername,
};
