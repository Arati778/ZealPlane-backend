const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  commentText: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  username: {
    type: String,
  },
  uniqueId: {
    // Added to track the user who made the comment
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set to the current date
  },
});

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uniqueId: {
    // Added to uniquely identify the user who made the rating
    type: String,
    required: true,
  },
  ratingValue: { type: Number, required: true }, // Rating (1-5 stars)
  date: { type: Date, default: Date.now },
});

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    profilePic: { type: String },
    description: { type: String, required: true },
    thumbnailImage: { type: String },
    thumbnailImages: [{ type: String }],
    images: [{ type: String }],
    username: { type: String, required: true }, // Project creator's username
    uniqueId: {
      // Added to associate the project with a specific user
      type: String,
    },
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
    ratings: [ratingSchema],
    comments: [commentSchema], // Array of comments for the project
    likes: { type: Number, default: 0 }, // Number of likes for the project
    likedBy: {
      type: [{ uniqueId: String }], // Added uniqueId for users who liked the project
      default: [],
    },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Project", projectSchema);
