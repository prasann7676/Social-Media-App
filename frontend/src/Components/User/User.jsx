//component in the sidebar(and dialog boxes), where list of users will be shown, so if one clicks on some user
//They will be redirected to the profile of that user.
import { Typography } from '@mui/material';
import React from 'react'
import {Link} from "react-router-dom";

const User = ({userId,name,avatar}) => {
  return (
    <Link to={`/user/${userId}`} className='homeUser'>
        <img src={avatar} alt={name}/>
        <Typography>{name}</Typography>
    </Link>
  )
}

export default User