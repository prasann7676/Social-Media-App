import axios from "axios";

//action for like post which will call the backend api to update the like list and other things in the database
export const likePost = (id)=> async (dispatch)=>{
    try{
        dispatch({type:" likeRequest"});
        const {data} = await axios.get(`/api/v1/post/${id}`);
        // If we see in controllers/post file we can see we are returning message in response of the http api call
        // This message is used as payload for dispatch to assign message state in redux
        dispatch({type:"likeSuccess",payload:data.message});
    }catch(error){
        dispatch({type:"likeFailure",payload:error.response.data.message});
    }
}

//Action for commenting on the post, which calls the backend api which update the comments list in the database
export const addCommentOnPost = (id,comment)=> async (dispatch)=>{
    try{
        dispatch({type:" addCommentRequest"});
        const {data} = await axios.put(`/api/v1/post/comment/${id}`,{
                comment
            },{
                headers:{
                    "Content-Type":"application/json"
                },
            }
        );
        // we will assign the data.message in the payload, which is used to assign it to the message state of the likeReducer reducer
        dispatch({type:"addCommentSuccess",payload:data.message});
    }catch(error){
        dispatch({type:"addCommentFailure",payload:error.response.data.message});
    }
}

//Action for deleting the comments, which calls the backend api which updates the comments list and other info in the database
export const deleteCommentOnPost = (id,commentId)=> async (dispatch)=>{
    try{
        dispatch({type:" deleteCommentRequest"});
        const {data} = await axios.delete(`/api/v1/post/comment/${id}`,{
            data:{commentId}
        });
        dispatch({type:"deleteCommentSuccess",payload:data.message});
    }catch(error){
        dispatch({type:"deleteCommentFailure",payload:error.response.data.message});
    }
}

//Action for creating new post, database will also be updated(as a vew post is being added)
export const createNewPost = (caption,image)=> async (dispatch)=>{
    try{
        dispatch({type:" newPostRequest"});
        const {data} = await axios.post("/api/v1/post/upload",{
                caption,
                image
            },
            {
                "Content-Type":"application/json"
            }
        )
        dispatch({type:"newPostSuccess",payload:data.message});
    }catch(error){
        dispatch({type:"newPostFailure",payload:error.response.data.message});
    }
}

//action for updating the post, also make changes in the database
export const updatePost = (caption,id)=> async (dispatch)=>{
    try{
        dispatch({type:"updateCaptionRequest"});
        // make sure it is put request as, at the same `route/api/v1/post/${id}` if we make get request, it will like/unlike the post.
        const {data} = await axios.put(`/api/v1/post/${id}`,{
                caption,
            },
            {
                "Content-Type":"application/json"
            }
        )
        dispatch({type:"updateCaptionSuccess",payload:data.message});
    }catch(error){
        dispatch({type:"updateCaptionFailure",payload:error.response.data.message});
    }
}

//action for deleting the post, will update the database as well
export const deletePost = (id)=> async (dispatch)=>{
    try{
        dispatch({type:"deletePostRequest"});
        const {data} = await axios.delete(`/api/v1/post/${id}`);
        dispatch({type:"deletePostSuccess",payload:data.message});
    }catch(error){
        dispatch({type:"deletePostFailure",payload:error.response.data.message});
    }
}

