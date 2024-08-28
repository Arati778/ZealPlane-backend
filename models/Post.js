// models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  subreddit: { type: String, required: true },
  author: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
  comments: [
    {
      body: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  image: { type: String },
});

module.exports = mongoose.model('Post', PostSchema);
