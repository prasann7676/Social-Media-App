//This is the user reducer file
import { createReducer } from "@reduxjs/toolkit";
const intialState = {}

// createReducer have all the cases when we used to write in switch case in context API to change the state
// This will take initialState as first parameter and set of reducers with there function in second parameter

//This reducer is responsible for user authentication-type details(register, login, logout etc)
export const userReducer = createReducer(intialState,{
    LoginRequest:(state)=>{
        state.loading = true;
    },
    LoginSuccess:(state,action)=>{
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    LoginFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },
    RegisterRequest:(state)=>{
        state.loading = true;
    },
    RegisterSuccess:(state,action)=>{
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    RegisterFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },
    LoadUserRequest:(state)=>{
        state.loading = true;
    },
    LoadUserSuccess:(state,action)=>{
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    LoadUserFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },
    LogoutUserRequest:(state)=>{
        state.loading = true;
    },
    LogoutUserSuccess:(state)=>{
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
    },
    LogoutUserFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = true;
    },
    clearErrors:(state)=>{
        state.error = null;
    }
});

export const postOfFollowingReducer = createReducer(intialState,{
    postOfFollowingRequest:(state)=>{
        state.loading = true;
    },
    postOfFollowingSuccess:(state,action)=>{ 
        state.loading = false;
        state.posts = action.payload;
    },
    postOfFollowingFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors:(state)=>{
        state.error = null;
    }
});

export const allUsersReducer = createReducer(intialState,{
    allUsersRequest:(state)=>{
        state.loading = true;
    },
    allUsersSuccess:(state,action)=>{ 
        state.loading = false;
        state.users = action.payload;
    },
    allUsersFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors:(state)=>{
        state.error = null;
    }
});

export const userProfileReducer = createReducer(intialState,{
    userProfileRequest:(state)=>{
        state.loading = true;
    },
    userProfileSuccess:(state,action)=>{ 
        state.loading = false;
        state.user = action.payload;
    },
    userProfileFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors:(state)=>{
        state.error = null;
    }
});