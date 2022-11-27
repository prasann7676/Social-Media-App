import { Avatar, Button, Typography,Dialog } from '@mui/material';
import React, { useEffect, useState } from 'react'
import {MoreVert,Favorite,FavoriteBorder,ChatBubbleOutline,DeleteOutline} from "@mui/icons-material";
import { Link } from 'react-router-dom';
import "./Post.css";
import { useDispatch, useSelector } from 'react-redux';
import { addCommentOnPost, deletePost, likePost, updatePost } from '../../Actions/Post';
import { getFollowingPosts, getMyPosts, loadUser, getUserPosts } from '../../Actions/User';
import User from '../User/User';
import CommentCard from '../CommentCard/CommentCard';
const Post = ({postId,caption,postImage,likes=[],comments=[],ownerImage,ownerName,ownerId,isDelete=false,isAccount=false,page="home"}) => {
  
    const [liked,setLiked] = useState(false);
    //This useState is used for dialog box for like(to show the list of users who have liked the post)
    const [likesUser,setLikesUser] = useState(false);
    // This commentValue useState is used to store the comment entered by the user(at every instant, it will be updated at every instant)
    const [commentValue,setCommentValue] = useState("");
     // This useState is used to dialog box for comment()
    const [commentToggle,setCommentToggle] = useState(false);
    // This commentValue useState is used to store the caption entered by the user(at every instant, it will be updated at every instant) for caption editing(3 dots on post)
    // Its initial state will be the caption we got from above(while calling post component it is passed as prop)
    const [captionValue,setCaptionValue] = useState(caption);
    // used for edit caption dialog box
    const [captionToggle,setCaptionToggle] = useState(false);
   
    const dispatch = useDispatch();
    const {user} = useSelector(state=>state.user);

    const handleLike = async ()=>{
        //liked state will store the opposite state of the current one now.
        setLiked(!liked);
        // we will send the function created in Action/post file to like/unlike the post
        //It is important to await for this dispatch so that like list and everything is updated first in the database
        await dispatch(likePost(postId))

        //If we clicked on account button on navbar(there should only see our post, not posts of users who the current logged in user is following)
        if(isAccount){
            //we dispatch this so that the posts list for the users get updated(as we have populated the likes array while sending post as response)
            //Therefore, instantly the number of likes will get updated(when cliked on like button).
            //IF not done this, then this will only update on reloading the page.
            dispatch(getMyPosts());
        }else{
            //If we donot use this dispatch then the count of likes under a post is not instantly updated when we like or dislike the post(thogh it will get updated after reload, but not without reload)
            //This dispatch is used to update the likes list of the post
            //As related backend function(check this function in action/user then check related controller function in backend according to the route of the api call)
            //This function in the controller/post also populate the list, which indirectly updates the like list.
            if(page==="home")
                dispatch(getFollowingPosts())
            else
                dispatch(getUserPosts(ownerId))
        }
    }

    const addCommentHandler = async (e)=>{
        //To prevent the form from submitting when submitted
        e.preventDefault();
        //dispatching addCommentOnPost action to update the comments list and update the database
        await dispatch(addCommentOnPost(postId,commentValue));
        if(isAccount){
            dispatch(getMyPosts());
        }else{
            dispatch(getFollowingPosts())
        }
    }


    const updateCaptionHandler = async (e)=>{
        e.preventDefault();
        dispatch(updatePost(captionValue,postId));
        dispatch(getMyPosts());
    }

    // If we will not use await here, then posts will be deleted but, will still render in the account page(when reloaded only then it will disappear)
    const deletePostHandler = async ()=>{
        await dispatch(deletePost(postId));
        dispatch(getMyPosts());

        //This is done to update the post list for user(this is used to show the length of posts array in right side, to display the number of posts of this user)
        dispatch(loadUser());
    }
    
    // This useEffect is to handle the case when we liked a post and refresh, 
    // then the post we liked/disliked will come to its initial state which is false(for liked useState)
    // There whenever the likes array is changed or user is changed, this useEffect will run
    // Which will see if this particular post's list of liked user includes currently logged in user
    // If so then make the liked state as true.  
    useEffect(()=>{
        likes.forEach((item)=>{
            if(item._id===user._id){
             setLiked(true);
            } 
        })
    },[likes,user._id])

    return (
    <div className="post">
        <div className="postHeader">
            {isAccount&&<Button onClick={()=>setCaptionToggle(!captionToggle)}>
                <MoreVert/>
            </Button>}
        </div>
        <img src={postImage} alt="Post"/>
        <div className="postDetails">
            <Avatar src={ownerImage} alt="User" sx={{height:"3vmax",width:"3vmax"}}/>
            <Link to={`/user/${ownerId}`}>
                <Typography fontWeight={700}>{ownerName}</Typography>
            </Link>
            <Typography fontWeight={100} color="rgba(0,0,0,0.582)" style={{alignSelf:"center"}}>{caption}</Typography>
        </div>
        {/*This is an invisible type of button for showing the list of users who liked the current post  */}
        {/* Also when we click this button we make likesUser useState value to chenge so as to open the dialog box */}
        {/* Moreover, if the like list is empty, or no one has liked this post, then we will disable this button */}
        <button style={{border:"none",backgroundColor:"white",cursor:"pointer",margin:"1vmax 2vmax"}} onClick={()=>setLikesUser(!likesUser)} disabled={likes.length===0?true:false}>
            {/* This typography is showing how many number of likes does this post contain */}
            <Typography>{likes&&likes.length} Likes</Typography>
        </button>
        <div className="postFooter">
            {/* Button for liking the post */}
            <Button onClick={handleLike}>
                {/*According to if the user has liked or disliked the post, it will show red heart pr empty heart under the given post.  */}
                {liked?<Favorite style={{color:"red"}}/>:<FavoriteBorder/>}
            </Button>
            {/* This is the button for commenting on the post */}
            {/* We will toggle the commentToggle useSate, so as to get a dialog box, to comment on the post */}
            <Button onClick={()=>setCommentToggle(!commentToggle)}>
                <ChatBubbleOutline />
            </Button>
            {isDelete&&
                <Button onClick={deletePostHandler}>
                    <DeleteOutline/>
                </Button>
            }
        </div>
        {/* This dialog box will only open when likesUser is true */}
        {/* While closing of this dialog box, we make the likesUser useState change its current value(so, if it was true, because of which the dialog box opened, so we will now make it false, when the dialog box will close)  */}
        <Dialog open={likesUser} onClose={()=>setLikesUser(!likesUser)}>
            <div className="DialogBox">
            {/* It will list of users who have liked the current post */}
                <Typography variant="h4">Liked by</Typography>
                {
                    likes.map((like)=>(
                        <User
                        key={like._id}
                        userId={like._id}
                        name={like.name}
                        avatar={like.avatar?.url}
                      />
                    ))
                }
            </div>
        </Dialog>
        {/* This dialog box is used to open a form to enter the comment on the post */}
        {/* This contain a input field to enter the comment and an add button to add the comment on the post */}
        <Dialog open={commentToggle} onClose={()=>setCommentToggle(!commentToggle)}>
            <div className="DialogBox">
                <Typography variant="h4">Comments</Typography>
                {/* Form to enter a comment on the post */}
                <form className='commentForm' onSubmit={addCommentHandler}>
                    <input type="text" value={commentValue} onChange={(e)=>setCommentValue(e.target.value)} placeholder="Comment Here ..." required/>
                    <Button type="submit" variant="contained">Add</Button>
                </form>
                {/* After entering the comment on the dialog box, we have to show the comment under the posts by mapping on the comments array*/}
                {/* Here we are not writing comment._id inside map because we populated the comments.user in postOfFollowing function in backend(controllers/post) so, it not only contains the _id but info of the user too*/}
                {/* Therefore, we write comment.user._id */}
                {
                    comments.length>0?comments.map((comment)=>(
                        <CommentCard key={comment._id} userId={comment.user._id} name={comment.user.name} avatar={comment.user.avatar?.url} comment={comment.comment} commentId={comment._id} isAccount={isAccount} postId={postId}/>
                    )):<Typography>No Comments yet</Typography>
                }
            </div>
        </Dialog>
        <Dialog open={captionToggle} onClose={()=>setCaptionToggle(!captionToggle)}>
            <div className="DialogBox">
                <Typography variant="h4">Update Caption</Typography>
                <form className='commentForm' onSubmit={updateCaptionHandler}>
                    <input type="text" value={captionValue} onChange={(e)=>setCaptionValue(e.target.value)} placeholder="Caption Here ..." required/>
                    <Button type="submit" variant="contained">Update</Button>
                </form>
            </div>
        </Dialog>
    </div>
  )
}

export default Post