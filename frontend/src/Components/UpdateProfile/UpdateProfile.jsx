//This component is very similar to the register.jsx component(just changing, register to updateProfile and some other things thats it)
import { Avatar, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, updateProfile } from '../../Actions/User';
import Loader from '../Loader/Loader';
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const {loading,error,user} = useSelector(state => state.user);
  const {loading:updateLoading,error:updateError,message} = useSelector(state => state.like);

  //Initial states of name, email will be initial value of these for the users(which needs to be updated)
  const [name,setName] = useState(user.name);
  const [email,setEmail] = useState(user.email);

  const [avatar,setAvatar] = useState("");

  //Previous avatar if user.
  const [avatarPreview,setAvatarPreview] = useState(user.avatar.url);
  const dispatch = useDispatch();
  const alert = useAlert();
  const submitHandler = async (e)=>{
    e.preventDefault();
    await dispatch(updateProfile(name,email,avatar))

    //For showing fresh/instant data, while rendering home or account page(where user info is shown)
    //without this we first need to refresh the page(then only updated profile info will get rendered)
    dispatch(loadUser());
  }
  const handleAvatarChange = (e)=>{
    const file= e.target.files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(file);
    Reader.onload = ()=>{
        if(Reader.readyState===2){
            setAvatarPreview(Reader.result);
            setAvatar(Reader.result);
        }
    }
  }
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (updateError) {
      alert.error(updateError);
      dispatch({ type: "clearErrors" });
    }

    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [dispatch, error, alert, updateError, message]);
  return (
    loading?<Loader/>:(
        <div className="updateProfile">
            <form className="updateProfileForm" onSubmit={submitHandler}>
            <Typography variant="h3" gutterBottom>Update Profile</Typography>
                <Avatar src={avatarPreview} alt="User" sx={{height:"10vmax",width:"10vmax"}}/>
                <input type="file" accept="image/*" onChange={handleAvatarChange}/>
                <input className="updateProfileInputs" type="name" placeholder='Name' required value={name} onChange={(e)=>setName(e.target.value)}/>
                <input className="updateProfileInputs" type="email" placeholder='Email' required value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <Button disabled={updateLoading} type="submit">Update</Button>
            </form>
        </div>
    )
  )
}


export default UpdateProfile