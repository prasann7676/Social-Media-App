//If we go to the URL /users/:id (where id is for the particular user)
//Then this component will render and info related to that user will be shown
//Its very similar to account component(but here there are less functionality as no logout change password etc)
//Conversely, it is having some extra functionality like to follow or unfollow this user(whom id we have opened)
import { Avatar, Button, Dialog, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  followAndUnfollowUser,
  getUserPosts,
  getUserProfile,
} from "../../Actions/User";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import User from "../User/User";

const UserProfile = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const {
    user,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.userProfile);

  //current logged in user is set as me(as user here depicts the user profile whom we have opened)
  const { user: me } = useSelector((state) => state.user);

  //Post will contain all posts where the requested user(not logged in user) is the owner
  const { loading, error, posts } = useSelector((state) => state.userPosts);
  const {
    error: followError,
    message,
    loading: followLoading,
  } = useSelector((state) => state.like);

  const params = useParams();
  //This useState is to show the dialog box which contain followers users (of the user whose profie is rendered)
  const [followersToggle, setFollowersToggle] = useState(false);
  //This useState is to show the dialog box which contain users to whom this user is following(of the user whose profie is rendered)
  const [followingToggle, setFollowingToggle] = useState(false);
  //State to detect the current status of following or unfollowing done by the currently logged in user.
  const [following, setFollowing] = useState(false);
  const [myProfile, setMyProfile] = useState(false);

  const followHandler = async () => {
    //Changing the current state of following(reverse of prev state value)
    setFollowing(!following);
    await dispatch(followAndUnfollowUser(user._id));
    dispatch(getUserProfile(params.id));
  };

  //useEffect for getting updated, posts and profile for the requested user.
  useEffect(() => {
    dispatch(getUserPosts(params.id));
    dispatch(getUserProfile(params.id));
  }, [dispatch, params.id]);


  // Remember, we cannot merge the just above the just below useEffect
  // This is because dipatch(getUserProfile) actually calls the respective backend api
  // which send the user as the response, which is then assigned to the "user" redux state inside userProfileReducer reducer
  // Therefore, whenever this dispatch will run, user state will update
  // so, as the dependency array as user also in it, therefore, just after dispatching userProfile, again useEggect will run and so on, creating an infinite loop
  // Or continuous rendering.
  // Therefore, to stop this, we keep both separatelt
  // Consicely, we need to keep user different from dispatch(because dispatch will tend to change user).

  //useEffect to set myProfile value(if currently logged in user have clicked on his own profile)
  //Also to handle reload issue(if we reload the page, follow button will always show follow(because initial value of following is false))
  useEffect(() => {
    if (me._id === params.id) {
      setMyProfile(true);
    }
    if (user) {
      //we loop in the followers array(of user whose profile is requested)
      //If we find the any id equal to the id of the currently logged in user, then surely the currently logged in user is following this user.
      //so we make following as true(so, if we again reload the page, it will not show the inital default value but, the updated value.)
      user.followers.forEach((item) => {
        if (item._id === me._id) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      });
    }
  }, [user, me._id, params.id]); 

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (followError) {
      alert.error(followError);
      dispatch({ type: "clearErrors" });
    }

    if (userError) {
      alert.error(userError);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alert, error, message, followError, userError, dispatch]);

  return loading === true || userLoading === true ? (
    <Loader />
  ) : (
    <div className="account">
      <div className="accountleft">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post?._id}
              postId={post?._id}
              caption={post?.caption}
              postImage={post?.image?.url}
              likes={post?.likes}
              comments={post?.comments}
              ownerImage={post?.owner?.avatar?.url}
              ownerName={post?.owner?.name}
              ownerId={post?.owner?._id}
              // page denotes that if we are in home page or /user/:id page (because in both cases isAccount is false, but it is not handled in post component)
              page="userPost"
            />
          ))
        ) : (
          <Typography variant="h6">{user?._id===me?._id?<span>You have </span>:<span>User has </span>} has not made any post</Typography>
        )}
      </div>
      <div className="accountright">
        {user && (
          <>
            <Avatar
              src={user.avatar.url}
              sx={{ height: "8vmax", width: "8vmax" }}
            />

            <Typography variant="h5">{user.name}</Typography>

            <div>
              <button onClick={() => setFollowersToggle(!followersToggle)}>
                <Typography>Followers</Typography>
              </button>
              <Typography>{user.followers.length}</Typography>
            </div>

            <div>
              <button onClick={() => setFollowingToggle(!followingToggle)}>
                <Typography>Following</Typography>
              </button>
              <Typography>{user.following.length}</Typography>
            </div>

            <div>
              <Typography>Posts</Typography>
              <Typography>{user.posts.length}</Typography>
            </div>

            {/* If we have opened the profile of the logged in user only the, there should be no follow/unfollow button*/}
            {myProfile ? null : (
              <Button
                variant="contained"
                style={{ background: following ? "red" : "" }}
                onClick={followHandler}
                disabled={followLoading}
              >
                {/* showing the opposite button, relative to the current following status */}
                {following ? "Unfollow" : "Follow"}
              </Button>
            )}
          </>
        )}
        <Dialog
          open={followersToggle}
          onClose={() => setFollowersToggle(!followersToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Followers</Typography>

            {user && user.followers.length > 0 ? (
              user.followers.map((follower) => (
                <User
                  key={follower._id}
                  userId={follower._id}
                  name={follower.name}
                  avatar={follower.avatar.url}
                />
              ))
            ) : (
              <Typography style={{ margin: "2vmax" }}>
               {user?._id===me?._id?<span>You have </span>:<span>User has </span>} no followers
              </Typography>
            )}
          </div>
        </Dialog>

        <Dialog
          open={followingToggle}
          onClose={() => setFollowingToggle(!followingToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Following</Typography>

            {user && user.following.length > 0 ? (
              user.following.map((follow) => (
                <User
                  key={follow._id}
                  userId={follow._id}
                  name={follow.name}
                  avatar={follow.avatar.url}
                />
              ))
            ) : (
              <Typography style={{ margin: "2vmax" }}>
                {user?._id===me?._id?<span>You're </span>:<span>User is </span>}not following anyone
              </Typography>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default UserProfile;