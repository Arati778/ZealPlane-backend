// In your routes file (e.g., routes/posts.js)
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const ValidateToken = require("../midleware/validateTokenHandler");
const postUpload = require("../midleware/PostUpload");

// Existing routes
router.get("/", postController.getPosts);
router.get("/:id", ValidateToken, postController.getPostById);
router.post(
  "/",
  postUpload.single("post_image"),
  ValidateToken,
  postController.createPost
);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
router.put("/votes/:id", ValidateToken, postController.updateVotes);
// Route to check if the user has voted
router.get("/:id/vote", ValidateToken, postController.getUserVote);

router.get("/user/:username", postController.getPostsByAuthor);

// Comment routes
router.post("/:id/comments", ValidateToken, postController.addComment);
router.put(
  "/:id/comments/:commentId",
  ValidateToken,
  postController.updateComment
);
router.delete(
  "/:id/comments/:commentId",
  ValidateToken,

  postController.deleteComment
);
// Get posts by community
router.get("/community/:communityId", postController.getPostsByCommunity);

module.exports = router;
