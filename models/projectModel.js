const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },  // Automatically adds timestamp when comment is created
});

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    thumbnailImage: { type: String },
    thumbnailImages: [{ type: String }],
    images: [{ type: String }],
    username: { type: String, required: true }, // Project creator's username
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      unique: true,
    },
    id: { type: Number, required: true }, // Consider if this is necessary; it should be unique if so
    tags: [{ type: String }],
    subtags: [{ type: String }],
    publisher: { type: String },
    teammates: [{ type: String }],
    ratings: { type: Number, min: 0, max: 5 },
    comments: [commentSchema], // Array of comments for the project
    likes: { type: Number, default: 0 }, // Number of likes for the project
    likedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Project', projectSchema);
