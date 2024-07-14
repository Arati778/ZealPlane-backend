const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  enquiry: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;
