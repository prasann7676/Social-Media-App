//first see login.jsx, there there are more comments
import { Avatar, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser } from '../../Actions/User';
import "./Register.css";

const Register = () => {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [avatar,setAvatar] = useState("");
  const dispatch = useDispatch();
  const {loading,error} = useSelector(state => state.user);
  const alert = useAlert();


  const submitHandler = (e)=>{
    e.preventDefault();
    console.log(name,email,avatar);
    dispatch(registerUser(name,email,password,avatar));
  }


  const handleAvatarChange = (e)=>{
    const file= e.target.files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(file);
    Reader.onload = ()=>{
        if(Reader.readyState===2){
            setAvatar(Reader.result);
        }
    }
  }

  //useEfect used to give alert error when there is an error, while registering 
  useEffect(()=>{
    if(error){
        alert.error(error);
        dispatch({type:"clearErrors"});
    }
  },[dispatch,alert,error])


  return (
    <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{padding:"2vmax"}} gutterBottom>Social Aap!</Typography>
            <Avatar src={avatar} alt="User" sx={{height:"10vmax",width:"10vmax"}}/>
            <input type="file" accept="image/*" onChange={handleAvatarChange}/>
            <input className="registerInputs" type="name" placeholder='Name' required value={name} onChange={(e)=>setName(e.target.value)}/>
            <input className="registerInputs" type="email" placeholder='Email' required value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input className="registerInputs" type="password" placeholder='Password' required value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <Link to="/"><Typography>Already Signed Up? Login Now</Typography></Link>
            <Button disabled={loading} type="submit">Sign Up</Button>
        </form>
    </div>
  )
}

export default Register