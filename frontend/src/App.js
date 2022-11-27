import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Header from './Components/Header/Header';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './Actions/User';
import Account from './Components/Account/Account';
import NewPost from './Components/NewPost/NewPost';
import Register from './Components/Register/Register';
import UpdateProfile from './Components/UpdateProfile/UpdateProfile';
import UpdatePassword from './Components/UpdatePassword/UpdatePassword';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import UserProfile from './Components/UserProfile/UserProfile';
import Search from './Components/Search/Search';
import NotFound from './Components/NotFound/NotFound';
function App() {
  const dispatch = useDispatch();

  //useSelector is used for accessinf the redux state current values
  const {isAuthenticated} = useSelector(state=>state.user);
 
  // This useEffect is used to handle reload problem(to restore user when reloaded the page)
  useEffect(()=>{
    dispatch(loadUser());
  },[dispatch]);

  return (
    // BrowserRouter is named as Router, so originally it sould be <BrowserRouter>
    <Router>
      {/* Header would only be shown when user is authenticated */}
      {isAuthenticated&&<Header/>}
      <Routes>
        <Route path="/" element={isAuthenticated?<Home/>:<Login/>}/>
        <Route path="/account" element={isAuthenticated?<Account/>:<Login/>}/>
        <Route path="/newpost" element={isAuthenticated?<NewPost/>:<Login/>}/>
        <Route path="/register" element={isAuthenticated?<Account/>:<Register/>}/>
        <Route path="/update/profile" element={isAuthenticated?<UpdateProfile/>:<Login/>}/>
        <Route path="/update/password" element={isAuthenticated?<UpdatePassword/>:<Login/>}/>
        {/* If user is Authenticated then, they can updatePassword, but when user is not authenticated then only forgotPassword would be rendered. */}
        <Route path="/forgot/password" element={isAuthenticated?<UpdatePassword/>:<ForgotPassword/>}/>
        <Route path="/password/reset/:token" element={isAuthenticated?<UpdatePassword/>:<ResetPassword/>}/>
        <Route path="/user/:id" element={isAuthenticated?<UserProfile/>:<Login/>}/>
        <Route path="/search" element={isAuthenticated?<Search/>:<Login/>}/>
        {/* If given route does not match any given route, then we will show not found component */}
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  );
}

export default App;
