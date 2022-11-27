import {createReducer} from "@reduxjs/toolkit"
const intialState = {}

//We will make different reducers maily when  states of both reducers tends to be used at the same time
//So, if we make this functionalities in the same reducers(states name would be same), then we could'nt figure which state is changing
//So, for avoiding errors, try to make different reducers(but if we are sure these 2 functionality will not be used at the same time, then making in a single reducer is better)
//This reducer will contain redux states for both like, comment, newpost, updateProfile, updatePassword, deleteProfile, ForgotPassword, resetPassword and followUser
//All this functionality under this reducer mainly have 3 sections(for every functionality listed above)
//FunctionalityRequest, FunctionalitySuccess and FunctionalityFailure
export const likeReducer = createReducer(intialState,{
    likeRequest:(state)=>{
        state.loading = true;
    },
    likeSuccess:(state,action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    likeFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    addCommentRequest:(state)=>{
        state.loading = true;
    },
    addCommentSuccess:(state,action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    addCommentFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    deleteCommentRequest:(state)=>{
        state.loading = true;
    },
    deleteCommentSuccess:(state,action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    deleteCommentFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    newPostRequest:(state)=>{
        state.loading = true;
    },
    newPostSuccess:(state,action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    newPostFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    updateCaptionRequest:(state)=>{
        state.loading = true;
    },
    updateCaptionSuccess:(state,action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    updateCaptionFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    deletePostRequest:(state)=>{
        state.loading = true;
    },
    deletePostSuccess:(state,action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    deletePostFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    updateProfileRequest:(state)=>{
        state.loading = true;
    },
    updateProfileSuccess:(state,action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    updateProfileFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    updatePasswordRequest:(state)=>{
        state.loading = true;
    },
    updatePasswordSuccess:(state,action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    updatePasswordFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    deleteProfileRequest:(state)=>{
        state.loading = true;
    },
    deleteProfileSuccess:(state,action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    deleteProfileFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    forgotPasswordRequest:(state)=>{
        state.loading = true;
    },
    forgotPasswordSuccess:(state,action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    forgotPasswordFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    resetPasswordRequest:(state)=>{
        state.loading = true;
    },
    resetPasswordSuccess:(state,action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    resetPasswordFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    followUserRequest:(state)=>{
        state.loading = true;
    },
    followUserSuccess:(state,action)=>{
        state.loading = false;
        state.message = action.payload;
    },
    followUserFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors:(state)=>{
        state.error = null;
    },
    clearMessage:(state)=>{
        state.message = null;
    }
})

//This reducer is mainly for account section(when user clicks on account section for the home page's navbar)
export const myPostsReducer = createReducer(intialState,{
    myPostsRequest:(state)=>{
        state.loading = true;
    },
    myPostsSuccess:(state,action)=>{
        state.loading = false;
        state.posts = action.payload;
    },
    myPostsFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors:(state)=>{
        state.error = null;
    },
})


//This Reducer is mainly used when, we want to see some user profile(may be ours or others through visiting the URL /users/:id) 
export const userPostsReducer = createReducer(intialState,{
    userPostsRequest:(state)=>{
        state.loading = true;
    },
    userPostsSuccess:(state,action)=>{
        state.loading = false;
        state.posts = action.payload;
    },
    userPostsFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors:(state)=>{
        state.error = null;
    },
})