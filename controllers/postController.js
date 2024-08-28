// controllers/postController.js
const Post = require('../models/Post');

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  const { title, body, subreddit, author, image } = req.body;

  try {
    const newPost = new Post({
      title,
      body,
      subreddit,
      author,
      image,
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Update post votes (upvote/downvote)
exports.updateVotes = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    post.votes = req.body.votes;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  const { body } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    post.comments.push({ body });
    await post.save();
    res.json(post.comments);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
