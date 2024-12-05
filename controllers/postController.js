const Post = require("../models/Post");
// const Community = require("../models/community");

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    // Get all posts without any filtering by community
    const posts = await Post.find().sort({ timestamp: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).send("Server Error");
  }
};
// Get all posts
exports.getPosts = async (req, res) => {
  try {
    // Get all posts without any filtering by community
    const posts = await Post.find().sort({ timestamp: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).send("Server Error");
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    // Find the post by postId
    const post = await Post.findById(req.params.id);

    // If the post is not found, return a 404 response
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Get uniqueId from the token (assumed to be added to req.user by authentication middleware)
    const uniqueIdFromToken = req.user.uniqueId;

    // Check if uniqueId is present in the post
    if (!post.uniqueId) {
      return res.status(200).json({
        post,
        status: "visitor", // No uniqueId in post, status as visitor
      });
    }

    // Compare the uniqueId from the token with the post's uniqueId
    if (uniqueIdFromToken === post.uniqueId) {
      // If the uniqueId matches, return the post with status "admin"
      return res.status(200).json({
        post,
        status: "admin", // User is the admin of this post
      });
    }

    // If the uniqueId doesn't match, return the post with status "visitor"
    return res.status(200).json({
      post,
      status: "visitor", // User is a visitor, can't modify
    });
  } catch (err) {
    // Handle server errors
    console.error("Error fetching post by ID:", err.message);
    res.status(500).send("Server Error");
  }
};

// Get posts by author
exports.getPostsByAuthor = async (req, res) => {
  const { username } = req.params;

  try {
    // Fetch posts by the specified author
    const posts = await Post.find({ author: username }).sort({ timestamp: -1 }); // Sort posts by timestamp in descending order

    if (posts.length === 0) {
      return res.status(404).json({ msg: "No posts found for this author." });
    }

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts by author:", err.message);
    res.status(500).send("Server Error");
  }
};

exports.createPost = async (req, res) => {
  const { title, profilePic, body, author, uniqueId } = req.body;
  const image = req.file ? req.file.path : null;
  try {
    // Create a new post, including the image URL if it exists
    const newPost = new Post({
      title,
      profilePic,
      body,
      author,
      uniqueId,
      image, // Include the image URL (Cloudinary URL)
      comments: [], // Initialize with an empty array for comments
    });

    const post = await newPost.save();
    res.json(post); // Send back the created post object
  } catch (err) {
    console.error("Error creating post:", err.message);
    res.status(500).send(`Server Error: ${err.message}`);
  }
};

// Update a post by ID
exports.updatePost = async (req, res) => {
  const { title, body, image, communityId } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (title) post.title = title;
    if (body) post.body = body;
    if (image) post.image = image;

    // Update the community if provided
    if (communityId) {
      const community = await Community.findById(communityId);
      if (!community)
        return res.status(404).json({ msg: "Community not found" });
      post.community = communityId;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err.message);
    res.status(500).send("Server Error");
  }
};

// Example for adding a community filter in deletePost if needed
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    await Post.deleteOne({ _id: req.params.id }); // Correct method to delete the post

    res.json({ msg: "Post removed successfully" });
  } catch (err) {
    console.error("Error deleting post:", err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateVotes = async (req, res) => {
  if (!req.user || !req.user.uniqueId) {
    return res.status(400).json({ msg: "User ID is missing" });
  }

  const uniqueId = req.user.uniqueId; // Fetch userId from the token

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    // Find if the user has already voted
    const existingVoteIndex = post.votes.findIndex(
      (vote) => vote.uniqueId === uniqueId
    );

    if (existingVoteIndex !== -1) {
      // User has already upvoted, undo the vote
      post.votes.splice(existingVoteIndex, 1);
      post.upvoteCount = Math.max(0, post.upvoteCount - 1);
    } else {
      // Add a new upvote
      post.votes.push({
        uniqueId,
        voteValue: 1,
        timestamp: new Date(),
      });

      post.upvoteCount += 1;
    }

    // Save the post with updated votes
    const updatedPost = await post.save();

    res.json({
      upvoteCount: updatedPost.upvoteCount,
      votes: updatedPost.votes,
    });
  } catch (err) {
    console.error("Error updating votes:", err.message);
    res.status(500).send("Server Error");
  }
};

exports.getUserVote = async (req, res) => {
  if (!req.user || !req.user.uniqueId) {
    return res.status(400).json({ msg: "User ID is missing" });
  }

  const uniqueId = req.user.uniqueId; // Fetch user ID from the token

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    // Check if the user has voted
    const userVote = post.votes.find((vote) => vote.uniqueId === uniqueId);

    if (!userVote) {
      return res.json({ hasVoted: false, voteValue: null });
    }

    res.json({
      hasVoted: true,
      voteValue: userVote.voteValue,
      timestamp: userVote.timestamp,
    });
  } catch (err) {
    console.error("Error checking user vote:", err.message);
    res.status(500).send("Server Error");
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    // Log the token data to see what you're receiving
    console.log("Token data:", req.user);

    const { body } = req.body;
    console.log("Comment body:", body);

    const uniqueId = req.user?.uniqueId; // Get userId from the token
    const author = req.user?.username;
    const profilePic = req.user?.profilePic;

    // Log extracted user data
    console.log(
      "User data - uniqueId:",
      uniqueId,
      ", author:",
      author,
      ", profilePic:",
      profilePic
    );

    // Validate that the necessary data (author and profilePic) are present
    if (!author || !profilePic) {
      console.log("Validation error: Missing author or profilePic");
      return res.status(400).json({
        msg: "Author or profile picture missing. Comment cannot be added.",
      });
    }

    if (!uniqueId) {
      console.error("Validation error: uniqueId missing");
    }

    // Attempt to find the post by ID
    const postId = req.params.id;
    console.log("Finding post with ID:", postId);

    const post = await Post.findById(postId);
    if (!post) {
      console.log("Post not found with ID:", postId);
      return res.status(404).json({ msg: "Post not found" });
    }

    console.log("Post found. Adding new comment...");

    // Create a new comment object with user info
    const newComment = {
      body,
      author, // Add username
      profilePic, // Add profile picture URL
      date: new Date(),
      uniqueId,
    };

    // Log the new comment object
    console.log("New comment object:", newComment);

    post.comments.push(newComment);
    await post.save();

    console.log("Comment added successfully. Returning updated comments...");
    res.json(post.comments);
  } catch (err) {
    console.error("Error adding comment:", err.message, err.stack);
    res.status(500).send("Server Error");
  }
};

exports.updateComment = async (req, res) => {
  const { commentId, body } = req.body;
  const user = req.user; // Assuming you extract user info from the token in middleware

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    console.log("comment are not found");

    // Check if the username matches the comment's username
    if (comment.uniqueId !== user.uniqueId) {
      return res.status(403).json({ msg: "Unauthorized action" });
    }

    comment.body = body;
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error("Error updating comment:", err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const user = req.user; // Assuming you extract user info from the token in middleware

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    // Check if the username matches the comment's username
    if (comment.uniqueId !== user.uniqueId) {
      return res.status(403).json({ msg: "Unauthorized action" });
    }

    // Filter out the comment
    post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error("Error deleting comment:", err.message);
    res.status(500).send("Server Error");
  }
};

exports.getPostsByCommunity = async (req, res) => {
  const { communityId } = req.params;
  try {
    const posts = await Post.find({ community: communityId }).sort({
      timestamp: -1,
    });
    if (posts.length === 0) {
      return res
        .status(404)
        .json({ msg: "No posts found for this community." });
    }
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts by community:", err.message);
    res.status(500).send("Server Error");
  }
};
