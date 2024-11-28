// otpService.js

const nodemailer = require("nodemailer");

let otpStore = {}; // Temporary storage for OTPs (can be replaced with a database)

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
};

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Change to your email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

const storeOTP = (email, otp) => {
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // Store OTP with expiry
};

const verifyOTP = (email, otp) => {
  const otpEntry = otpStore[email];
  if (otpEntry && otpEntry.otp === otp && Date.now() < otpEntry.expires) {
    delete otpStore[email]; // Clear OTP after successful verification
    return true;
  }
  return false;
};

module.exports = { generateOTP, sendOTPEmail, storeOTP, verifyOTP };
