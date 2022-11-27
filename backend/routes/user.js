const express = require("express");
const { register, login, followUser, logout, updatePassword, updateProfile, deleteMyProfile, myProfile, getUserProfile, getAllUsers, forgotPassword, resetPassword, getMyPosts, getUserPosts} = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();


// remember we use Use PUT when you want to modify a single resource which is already a part of resources collection.
// whereas, post request can be made when we are creating some new resouces.
// generally, PUT is used for UPDATE operations and POST used for CREATE operations.
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated,logout);
router.route("/follow/:id").get(isAuthenticated,followUser);
router.route("/update/password").put(isAuthenticated,updatePassword);
router.route("/update/profile").put(isAuthenticated,updateProfile);
// deleting my profile
router.route("/delete/me").delete(isAuthenticated,deleteMyProfile);
router.route("/me").get(isAuthenticated,myProfile);
router.route("/my/posts").get(isAuthenticated,getMyPosts);
router.route("/userposts/:id").get(isAuthenticated,getUserPosts);
router.route("/user/:id").get(isAuthenticated,getUserProfile);
router.route("/users").get(isAuthenticated,getAllUsers);

//There would be no isAuthenticated method passed in these 2 routes
//As forgot and reset password willl only be needed when user is not logged in.
router.route("/forgot/password").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

module.exports = router;