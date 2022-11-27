//Home page will contain list of posts and in sidebar list of users
import { Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { getallUsers, getFollowingPosts } from '../../Actions/User';
import Loader from '../Loader/Loader';
import Post from '../Post/Post';
import User from '../User/User';
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  // Here using useSelector we are accessing the current values of teh state inside respective reducers
  // error: msgError means msgError will denote error value of like related(which contain error, message for like or comment) reducer(in store file whichever value(in this case reducer) is related to like key, this reducer's error value)
  // we are doing so because we are using error name also for postOfFollowing reducer.(similar for loading state too)
  const {error: msgError,message} = useSelector(state=>state.like);
  const {loading,posts,error} = useSelector(state=>state.postOfFollowing);
  const {users,loading:usersLoading} = useSelector(state=>state.allUsers);
  
  //This useEffect is used to update the database with current value
  //(not sure about this point, either this is correct or this useEffect only works on initial render(ig we only use dispatch in dependecy array because we are using it inside the useEffect, so we need to pass it))Whenever any dispacth is called in any function in this component, we will try to update the database at that instant
  //So that we can use the updated values in the database for rendering other information
  useEffect(()=>{
    //So, using this the posts list will get updated
    //Without using this dispatch inside this useEffect, posts list will not get instant updation
    dispatch(getFollowingPosts())
    //This will update the list of all users currently registered for the website
    dispatch(getallUsers())
  },[dispatch])

  //This useffect is responsible for showing alerts for like and comment(for ex, post liked or comment added or comment updated)
  //alert.error will render an alert with cross and red alert
  //Whereas alert.success will render an alert with a tick and green alert
  useEffect(()=>{
    //If there is an error while redering post of users who the current logged in user is following
    if(error){
      alert.error(error);
      dispatch({type:"clearErrors"})
    }
    //If there was an error in liking(or unliking) the post
    if(msgError){
        alert.error(msgError);
        dispatch({type:"clearErrors"})
    }
    // Message got from post api for liking/unliking the post(either message will be liked or unliked)
    if(message){
        alert.success(message);
        dispatch({type:"clearMessage"})
    }
  },[alert,msgError,message,dispatch,error])

  return (
    loading===true||usersLoading===true?<Loader/>:
    <div className="home">
      <div className="homeleft">
       {
        // we have to render all posts related to all users who the current user is following
        posts && posts.length>0? posts.map((post)=>(
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
          />
        )):<Typography variant="h6">No posts yet</Typography>
       }
      </div>
      <div className="homeright">
        {
          // rendering all users currently registered for the website.
          users && users.length>0? users.map((user)=>(
            <User
              key={user._id}
              userId={user._id}
              name={user.name}
              avatar={user.avatar?.url}
            />
          )):<Typography variant="h6">No users yet</Typography>
        }
      </div>
    </div>
  )
}

export default Home