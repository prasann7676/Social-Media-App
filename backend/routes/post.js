const express = require("express");
const { createPost, likeAndUnlikePost, deletePost, getPostsOfFollowing, updateCaption, commentOnPost, deleteComment } = require("../controllers/post");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

// isAuthenticated,createPost are handlers(middlewares)
// which would be executed in order that is first isAuthenticated(only logged in user can create post) then createPost
//but its not that if first we have written put reuqest then delete request, then these request would be in order.

// for uploading/creating a new post
router.route("/post/upload").post(isAuthenticated,createPost);

// for liking or disliking a post.

// as all functions likeAndUnlikePost, deletePost have the same URL , therefore we can write this way.
router.route("/post/:id").get(isAuthenticated,likeAndUnlikePost).put(isAuthenticated,updateCaption).delete(isAuthenticated,deletePost);

// this /posts toute will give all posts of user who the current user is following
router.route("/posts").get(isAuthenticated,getPostsOfFollowing);

// This id is actually the post id.
router.route("/post/comment/:id").put(isAuthenticated,commentOnPost).delete(isAuthenticated,deleteComment);

module.exports = router;