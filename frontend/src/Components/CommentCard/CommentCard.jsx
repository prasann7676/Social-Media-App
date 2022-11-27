//Component to show the all the comments under the post as a for of cards 
//This component will be called under mapping of every comment in the post(so this component handles a single comment card with certain parameters passed as a prop)
import { Button, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import "./CommentCard.css"
import {Delete} from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux';
import { deleteCommentOnPost } from '../../Actions/Post';
import { getFollowingPosts, getMyPosts } from '../../Actions/User';

//Here userId is not the userId of the current logged in user instead it is for the user who commented on the post.
const CommentCard = ({userId,name,avatar,comment,commentId,postId,isAccount}) => {
  const {user} = useSelector(state=>state.user);
  const dispatch = useDispatch();


  const deleteCommentHandler = async ()=>{
    await dispatch(deleteCommentOnPost(postId,commentId))

    // Remember, when we delete a comment, then without these below line, it will not get updated untill refreshed
    if(isAccount){
      dispatch(getMyPosts());
    }else{
      dispatch(getFollowingPosts())
    }
  }
  
  return (
    <div className="commentUser">
      {/* In comment card we first display the avatar and name of the user who commented on it. */}
        <Link to={`/user/${userId}`}>
            <img src={avatar} alt={name}/>
            <Typography style={{minWidth:"6vmax"}}>{name}</Typography>
        </Link>
        <Typography>{comment}</Typography>
        {/* If we are in the account section(from the navbar of the home page) of the loggedIn user then we will show the option for deleting the comment(as all posts will be seen which is ours)*/}
        {/* But we are are in the home section, then we only need to display the delete material UI button, if current logged in user's id is equal to the user' id who have commented on the post */}
        {
            isAccount?
            <Button onClick={deleteCommentHandler}>
                <Delete/>
            </Button>:userId===user._id?(
                <Button onClick={deleteCommentHandler}>
                {/* This is the material UI button for delete which we imported above in this components */}
                    <Delete/>
                </Button>
            ):null
        }
        
    </div>
  )
}

export default CommentCard