const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the user!"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please add the email address!"],
      unique: [true, "Email address already exists"],
    },
    password: {
      type: String,
      required: function () {
        // Make password required only if googleId is not present
        return !this.googleId;
      },
      default: "",
    },
    uniqueId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    dob: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    profilePic: {
      type: String,
      default: null,
    },
    Background: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    contactNumber: {
      type: String,
      default: null,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    address: {
      type: String,
      default: null,
    },
    jobRole: {
      type: String,
      default: null,
    },
    level: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
      unique: true, // Ensure Google ID is unique
    },
    googleToken: {
      type: String,
      default: null, // Store Google token if needed
    },
  },
  {
    timestamps: true,
  }
);

// Custom validation for the schema (Optional, additional check)
userSchema.pre("validate", function (next) {
  if (!this.googleId && !this.password) {
    this.invalidate(
      "password",
      "Password is required unless logging in with Google"
    );
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
