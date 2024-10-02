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

// Update a post by ID (CRUD update operation)
exports.updatePost = async (req, res) => {
  const { title, body, subreddit, image } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Update fields if they exist in the request body
    if (title) post.title = title;
    if (body) post.body = body;
    if (subreddit) post.subreddit = subreddit;
    if (image) post.image = image;

    // Save updated post
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Delete a post by ID (CRUD delete operation)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    await post.remove(); // Delete post
    res.json({ msg: 'Post removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Update post votes (upvote/downvote)
exports.updateVotes = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Update the votes count
    post.votes = req.body.votes;
    await post.save();

    // Return the updated votes count
    res.json({ votes: post.votes });
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
    res.json(post.comments); // Return updated comments
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Update a comment (CRUD update operation)
exports.updateComment = async (req, res) => {
  const { commentId, body } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Find the comment in the post
    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    comment.body = body; // Update comment body
    await post.save();

    res.json(post.comments); // Return updated comments
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Delete a comment from a post (CRUD delete operation)
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Remove the comment from the array
    post.comments = post.comments.filter((comment) => comment._id != commentId);
    await post.save();

    res.json(post.comments); // Return updated comments
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
