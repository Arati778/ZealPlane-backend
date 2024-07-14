// const mongoose = require("mongoose");

// const projectSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       default: true,
//     },
//     projectDescription: {
//       type: String,
//       default: true,
//     },
    // projectId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   default: mongoose.Types.ObjectId,
    //   unique: true,
//     },
//     id: {
//       type: Number,
//       unique: true,
//     },
//       tags: {
//         type: [String],
//         default: [],
//       },
//       subTags: {
//         type: [String],
//         default: [],
//       },
//       websiteLink: {
//         type: String,
//         default: null,
//       },
//       username: {
//         type: String,
//         required: true,
//       },
//       publisher: {
//         type: String,
//         default: null,
//       },
//       teammates: {
//         type: [String],
//         default: [],
//       },
//       thumbnail: {
//           type: String,
//           default: true,
//       },
//       ratings: {
//         type: Number,
//         default: 0,
//       },
//       feedback: {
//         type: [String],
//         default: [],
//       },
//   },
//   {
//     timestamps: true,
//   }
// );

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  thumbnailImage: { type: String },
  username: { type: String, required: true },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  id: {
    type: Number, 
    required: true,
  },
  tags: [{ type: String }],
  subtags: [{ type: String }],
  publisher: { type: String },
  teammates: [{ type: String }],
  ratings: { type: Number, min: 0, max: 5 }
});

module.exports = mongoose.model('Project', projectSchema);


