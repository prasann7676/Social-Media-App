//This component is responsible for the account section(when user clicks on the account section in the navbar)
// We can see this in App.js, we user clicks on Route "/account"
// Its working is similar to the home component.
import { Avatar, Button, Dialog, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { deleteMyProfile, getMyPosts, logoutUser } from '../../Actions/User';
import Loader from '../Loader/Loader';
import Post from '../Post/Post';
import User from '../User/User';
import "./Account.css"
const Account = () => {
  const dispatch = useDispatch();
  const {loading,error,posts} = useSelector(state=>state.myPosts);
  const {user,loading:userLoading} = useSelector(state=>state.user);
  const alert = useAlert();
  const {error: msgError,message,loading:deleteLoading} = useSelector(state=>state.like);

  //Used for followers dialog box
  const [followersToggle,setFollowersToggle] = useState(false);

  //used for following dialog box
  const [followingToggle,setFollowingToggle] = useState(false);

  const logoutHandler = ()=>{
    dispatch(logoutUser());
    alert.success("Logged out successfully");
  }

  const deleteProfileHandler = async ()=>{
    await dispatch(deleteMyProfile());
    //After deleting the profile we also need to logout the user(as it does'nt exist now)
    dispatch(logoutUser());
  }

  console.log(posts)

  useEffect(()=>{
    dispatch(getMyPosts());
  },[dispatch])


  useEffect(()=>{
    if(error){
      alert.error(error);
      dispatch({type:"clearErrors"})
    }
    if(msgError){
        alert.error(msgError);
        dispatch({type:"clearErrors"})
    }
    if(message){
        alert.success(message);
        dispatch({type:"clearMessage"})
    }
  },[alert,msgError,message,dispatch,error])
  return (
    // If loading(related to myPost reducer state(redux)) or userLoading(while taking time in login)
    // Then we will render the loader component.km
    loading||userLoading===true?(
        <Loader/>
    ):(
        // on the left side of the account section page, we will show the posts created by the user
        // Whereas on the right side we will show the user's(avatar, followers, following, logout, update password, update profile etc)
        <div className='account'>
            <div className="accountleft">
                {
                    posts&&posts.length>0?posts.map((post)=>(
                        post&&
                        <Post 
                            key={post._id} 
                            postId={post._id}
                            caption={post.caption}
                            postImage={post.image?.url}
                            likes={post.likes}
                            comments={post.comments}
                            ownerImage={post.owner?.avatar?.url}
                            ownerName={post.owner?.name}
                            ownerId={post.owner?._id}
                            // sending isAccount true, so that we can know we are in account section
                            isAccount={true}
                            // We can delete any posts if we are in account section(as all posts seen will be posts that are created by us)
                            isDelete={true}
                        />
                    )):<Typography variant="h6">You have not made any post</Typography>
                }
            </div>
            <div className="accountright">
                {/* showing user's Avatar and name */}
                <Avatar src={user.avatar?.url} sx={{height:"8vmax",width:"8vmax"}}/>
                <Typography variant="h5">{user.name}</Typography>

                {/* This div is for showing the number of followers of currently logged in user. */}
                <div>
                    <button onClick={()=>setFollowersToggle(!followersToggle)}>
                        <Typography>Followers</Typography>
                    </button>
                    <Typography>{user?.followers?.length}</Typography>
                </div>

                {/* This div is for showing the number of users the currently logged in user in following. */}
                <div>
                    <button onClick={()=>setFollowingToggle(!followingToggle)}>
                        <Typography>Following</Typography>
                    </button>
                    <Typography>{user?.following?.length}</Typography>
                </div>

                {/* This div is for showing the number of posts created by the user */}
                <div>
                    <Typography>Posts</Typography>
                    <Typography>{user?.posts?.length}</Typography>
                </div>

                {/* Logout button */}
                <Button variant="contained" onClick={logoutHandler}>Logout</Button>

                {/* Update profile */}
                <Link to="/update/profile">Edit Profile</Link>

                {/* Update password */}
                <Link to="/update/password">Change Password</Link>

                {/* deleting profile botton */}
                <Button variant="text" style={{color:"red",margin:"2vmax"}} onClick={deleteProfileHandler} disabled={deleteLoading}>Delete My Account</Button>

                {/* Toggle box to show the user who follow the current logged in user */}
                <Dialog open={followersToggle} onClose={()=>setFollowersToggle(!followersToggle)}>
                    <div className="DialogBox">
                        <Typography variant="h4">Followers</Typography>
                            {
                                user&&user.followers.length>0?user.followers.map((follower)=>(
                                    <User
                                        key={follower._id}
                                        userId={follower._id}
                                        name={follower.name}
                                        avatar={follower.avatar?.url}
                                    />
                                )):<Typography style={{margin:"2vmax"}}>You have no followers</Typography>
                            }
                    </div>
                </Dialog>

                {/* Following dialog box */}
                <Dialog open={followingToggle} onClose={()=>setFollowingToggle(!followingToggle)}>
                    <div className="DialogBox">
                        <Typography variant="h4">Following</Typography>
                            {
                                user&&user.following.length>0?user.following.map((follow)=>(
                                    <User
                                        key={follow._id}
                                        userId={follow._id}
                                        name={follow.name}
                                        avatar={follow.avatar?.url}
                                    />
                                )):<Typography style={{margin:"2vmax"}}>You are not following anyone</Typography>
                            }
                    </div>
                </Dialog>
            </div>
        </div>
    )
  )
}

export default Account