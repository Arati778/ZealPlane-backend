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
      required: [true, "Please add the correct password"],
    },
    uniqueId: {
      type: Number,
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
  }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
