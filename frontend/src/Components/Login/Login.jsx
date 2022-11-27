//for login page
import React, { useEffect, useState } from 'react'
import "./Login.css";
import { Typography,Button } from '@mui/material';
import {Link} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import { loginUser } from '../../Actions/User';
import { useAlert } from 'react-alert';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const {error} = useSelector(state=>state.user);
  const {message} = useSelector(state=>state.like);
  const alert = useAlert();
  
  const loginHandler = (e)=>{
    e.preventDefault();// to prevent refresh of login page
    //loginUser function is in action folder in user file
    dispatch(loginUser(email,password));
  }

  //useEffect to show alert accoring to the verdict(success or failure)
  //For ex if user enters wrong password while login, then error alert will show, displaying wrong password.
  useEffect(()=>{
    if(error){
      alert.error(error);
      dispatch({type:"clearErrors"})
    } 
    if(message){
      alert.success(message);
      dispatch({type:"clearMessage"})
    }
  },[error,dispatch,alert,message])


  return (
    <div className='login'>
        <form className='loginForm' onSubmit={loginHandler}>
            <Typography variant="h3" style={{padding:"2vmax"}} gutterBottom>Social Aap!</Typography>
            <input type="email" placeholder='Email' required value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder='Password' required value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <Link to="/forgot/password"><Typography>Forgot Password</Typography></Link>
            <Button type="submit">Login</Button>
            <Link to="/register">
                <Typography>Don't have an account?</Typography>
            </Link>
        </form>
    </div>
  )
}

export default Login