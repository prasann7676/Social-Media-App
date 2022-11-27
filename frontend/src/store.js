//This is the redux store, where all states will be stored globally, and can be accessed and changed from any component or nested components
import {configureStore} from '@reduxjs/toolkit';
import { likeReducer, myPostsReducer, userPostsReducer } from './Reducers/Post';
import { allUsersReducer, postOfFollowingReducer, userProfileReducer, userReducer } from './Reducers/User';

//configureStore is a function which has a list of all reducers(the function which can change the states)
const store = configureStore({
    reducer: {
        // These keys like user, postOfFollowing, allUsers, like etc
        // will be used in useSelector to get the current value of the states mentioned in the respective reducers
        // For example, by accesseing state.user inside useSelector we can access the current values of loading, user, isAuthenticated and error
        // which is part of the userReducer reducer inside the reducer folder in user file
        user:userReducer,
        postOfFollowing:postOfFollowingReducer,
        allUsers:allUsersReducer,
        like:likeReducer,
        myPosts:myPostsReducer,
        userPosts:userPostsReducer,
        userProfile:userProfileReducer,
    }
});
export default store;
