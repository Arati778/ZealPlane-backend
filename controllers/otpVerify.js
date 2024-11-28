const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust the import path
const { generateOTP, sendOTPEmail, storeOTP, verifyOTP } = require("../midleware/otpController"); // Adjust import path

const loginUser = asyncHandler(async (req, res) => {
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
    // Generate OTP
    const otp = generateOTP();
    storeOTP(email, otp); // Store the OTP
    await sendOTPEmail(email, otp); // Send OTP to user's email

    return res.status(200).json({ message: "OTP sent to your email." });
  } else {
    res.status(401);
    console.log("Invalid email or password");
    throw new Error("Invalid email or password");
  }
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error("Email and OTP are required.");
  }

  if (verifyOTP(email, otp)) {
    // OTP is valid, generate access token
    const accessToken = jwt.sign(
      { userId: email }, // Replace with your userId logic
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // Token expiry time
    );

    return res.status(200).json({
      message: "Login successful!",
      accessToken,
      user: {
        email,
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid or expired OTP.");
  }
});

module.exports = { loginUser, verifyOTP };
