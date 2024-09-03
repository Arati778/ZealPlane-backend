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
    // Create a new Post object
    const newPost = new Post({
      title,
      body,
      subreddit,
      author,
      image,
      // `timestamp` and `votes` will use default values if not provided
      comments: [], // Initialize with an empty array
    });

    // Save the post to the database
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error('Error creating post:', err.message); // Log detailed error message
    res.status(500).send(`Server Error: ${err.message}`);
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
