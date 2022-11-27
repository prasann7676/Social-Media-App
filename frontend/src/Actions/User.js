// the user is logged in using this function, using backend api for login.
import axios from 'axios';

//These action functions can be called inside dispatch, so trigger state change through reducers, which is implemented inside these action functions

export const loginUser = (email,password)=> async (dispatch)=>{
    try{
        dispatch({type:"LoginRequest"});
        //It would be a post request for login
        const {data} = await axios.post("/api/v1/login",{email,password},{
            headers:{
                "Content-Type":"application/json"
            }
        });
        dispatch({type:"LoginSuccess",payload:data.user});
    }catch(error){
        dispatch({type:"LoginFailure",payload:error.response.data.message});
    }
}

//When we refresh the page, the info of logged in user will be restored fron /me api(which gets user from stored cookies)
export const loadUser = ()=> async (dispatch)=>{
    try{
        dispatch({type:"LoadUserRequest"});
        const {data} = await axios.get("/api/v1/me");
        console.log(data);
        dispatch({type:"LoadUserSuccess",payload:data.user});
    }catch(error){
        dispatch({type:"LoadUserFailure",payload:error.response.data.message});
    }
}

//will give the list of posts of all the users, who the current logged in user is following
export const getFollowingPosts = ()=> async (dispatch)=>{
    try{
        dispatch({type:"postOfFollowingRequest"});
        // getting list of posts from backend api
        const {data} = await axios.get("/api/v1/posts");
        dispatch({type:"postOfFollowingSuccess",payload:data.posts});
    }catch(error){
        dispatch({type:"postOfFollowingFailure",payload:error.response.data.message});
    }
}

//Gives the list of all users currently registered for the website
export const getallUsers = (name="")=> async (dispatch)=>{
    try{
        dispatch({type:"allUsersRequest"});
        // we pass this name as a query to this URL
        const {data} = await axios.get(`/api/v1/users?name=${name}`);
        dispatch({type:"allUsersSuccess",payload:data.users});
    }catch(error){
        dispatch({type:"allUsersFailure",payload:error.response.data.message});
    }
}

//Gives the list of posts that the currently logged in user have created
// In backend it also populates the comment.user like and owner, so it indirectly updates the database.
export const getMyPosts = ()=> async (dispatch)=>{
    try{
        dispatch({type:"myPostsRequest"});
        const {data} = await axios.get("/api/v1/my/posts");
        dispatch({type:"myPostsSuccess",payload:data.posts});
    }catch(error){
        dispatch({type:"myPostsFailure",payload:error.response.data.message});
    }
}

//action for logging out user.
export const logoutUser = ()=> async (dispatch)=>{
    try{
        dispatch({type:"LogoutUserRequest"});
        await axios.get("/api/v1/logout");
        dispatch({type:"LogoutUserSuccess"});
    }catch(error){
        dispatch({type:"LogoutUserFailure",payload:error.response.data.message});
    }
}

//For registering new user into the website
export const registerUser = (name,email,password,avatar)=> async (dispatch)=>{
    try{
        dispatch({type:"RegisterRequest"});
        const {data} = await axios.post("/api/v1/register",{name,email,password,avatar},{
            headers:{
                "Content-Type":"application/json"
            }
        });
        dispatch({type:"RegisterSuccess",payload:data.user});
    }catch(error){
        console.log(error)
        dispatch({type:"RegisterFailure",payload:error.response.data.message});
    }
}

//Action for updating the profile of the user(email,name or avatar (not password))
export const updateProfile = (name,email,avatar)=> async (dispatch)=>{
    try{
        dispatch({type:"updateProfileRequest"});
        const {data} = await axios.put("/api/v1/update/profile",{name,email,avatar},{
            headers:{
                "Content-Type":"application/json"
            }
        });
        dispatch({type:"updateProfileSuccess",payload:data.message});
    }catch(error){
        dispatch({type:"updateProfileFailure",payload:error.response.data.message});
    }
}

//Action for updating the password, updates the database while beckend api call
export const updatePassword = (oldPassword,newPassword)=> async (dispatch)=>{
    try{
        dispatch({type:"updatePasswordRequest"});
        const {data} = await axios.put("/api/v1/update/password",{oldPassword,newPassword},{
            headers:{
                "Content-Type":"application/json"
            }
        });
        dispatch({type:"updatePasswordSuccess",payload:data.message});
    }catch(error){
        dispatch({type:"updatePasswordFailure",payload:error.response.data.message});
    }
}

//Action to complete delete the profile, database gets updated while calling backend api.
export const deleteMyProfile = ()=> async (dispatch)=>{
    try{
        dispatch({type:"deleteProfileRequest"});
        const {data} = await axios.delete("/api/v1/delete/me");
        dispatch({type:"deleteProfileSuccess",payload:data.message});
    }catch(error){
        dispatch({type:"deleteProfileFailure",payload:error.response.data.message});
    }
}

//Action for forgot password, database is updated while calling the backend api.
export const forgotPassword = (email)=> async (dispatch)=>{
    try{
        dispatch({type:"forgotPasswordRequest"});
        const {data} = await axios.post("/api/v1/forgot/password",{
                email
            },{
                headers:{
                    "Content-Type":"application/json"
                }
            } 
        );
        dispatch({type:"forgotPasswordSuccess",payload:data.message});
    }catch(error){
        dispatch({type:"forgotPasswordFailure",payload:error.response.data.message});
    }
}

//Action for reseting password, after forgot password
export const resetPassword = (token,password)=> async (dispatch)=>{
    try{
        dispatch({type:"resetPasswordRequest"});
        const {data} = await axios.put(`/api/v1/password/reset/${token}`,{
                password
            },{
                headers:{
                    "Content-Type":"application/json"
                }
            } 
        );
        dispatch({type:"resetPasswordSuccess",payload:data.message});
    }catch(error){
        dispatch({type:"resetPasswordFailure",payload:error.response.data.message});
    }
}

//Action for getting the requested user's posts
export const getUserPosts = (id)=> async (dispatch)=>{
    try{
        dispatch({type:"userPostsRequest"});
        const {data} = await axios.get(`/api/v1/userposts/${id}`);
        dispatch({type:"userPostsSuccess",payload:data.posts});
    }catch(error){
        dispatch({type:"userPostsFailure",payload:error.response.data.message});
    }
}

//Action for getting the requested user's profile(and functionality to follow and unfollow them) and updates the database
export const getUserProfile = (id)=> async (dispatch)=>{
    try{
        dispatch({type:"userProfileRequest"});
        const {data} = await axios.get(`/api/v1/user/${id}`);
        dispatch({type:"userProfileSuccess",payload:data.user});
    }catch(error){
        dispatch({type:"userProfileFailure",payload:error.response.data.message});
    }
}

//Action to follow or unfollow reuqested users
export const followAndUnfollowUser = (id)=> async (dispatch)=>{
    try{
        dispatch({type:"followUserRequest"});
        const {data} = await axios.get(`/api/v1/follow/${id}`);
        dispatch({type:"followUserSuccess",payload:data.message});
    }catch(error){
        dispatch({type:"followUserFailure",payload:error.response.data.message});
    }
}