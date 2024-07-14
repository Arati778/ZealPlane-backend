const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    default: null,
  },
  fullName: {
    type: String,
    required: true,
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
  description: {
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
  accountStatus: {
    type: String,
    default: null,
  },
  roles: {
    type: String,
    required: true,
  },
  jobRole: {
    type: String,
    default: null,
  },
  level: {
    type: String,
    default: null,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('', profileSchema);
