import React, { useState } from 'react'
import "./Header.css"
import {Link} from "react-router-dom";
import {
    Home,
    HomeOutlined,
    Add,
    AddOutlined,
    Search,
    SearchOutlined,
    AccountCircle,
    AccountCircleOutlined
} from "@mui/icons-material";
const Header = () => {
    // is to show some hover effect on the clicked header option(home, search, account etc)
    //we have'nt intiallised the useState with NULL or empty because, if some diretly types the URL(for any options on the header) 
    //the the icon with not get hover effect(but we are still there), This is because
    //we have'nt clicked the icon, instead directly went on it
    // Therefore, we will initialise the use state with the URL name(so, if we enter a URL)
    // Like if we type localhost:3000/account then useState will initally store /account
  const [tab,setTab] = useState(window.location.pathname);

  return (
    <div className='header'>
        <Link to="/" onClick={()=>setTab("/")}>
            {tab==="/"?<Home style={{color:"black"}}/>:<HomeOutlined/>}
        </Link>
        <Link to="/newpost" onClick={()=>setTab("/newpost")}>
            {tab==="/newpost"?<Add style={{color:"black"}}/>:<AddOutlined/>}
        </Link>
        <Link to="/search" onClick={()=>setTab("/search")}>
            {tab==="/search"?<Search style={{color:"black"}}/>:<SearchOutlined/>}
        </Link>
        <Link to="/account" onClick={()=>setTab("/account")}>
            {tab==="/account"?<AccountCircle style={{color:"black"}}/>:<AccountCircleOutlined/>}
        </Link>
    </div>
  )
}

export default Header