const express = require("express");
const app = express();
// cookieParser is used to fetch the cookies created for a user.
const cookieParser = require("cookie-parser");
const path = require("path");

//dotenv is used to have env variables from the specified path

// if NODE_ENV is not in production, that means, its only in the development phase(not in production)
if(process.env.NODE_ENV!=="production"){
    require("dotenv").config({path:"backend/config/config.env"});
}

// Using inbuilt middlewares
//Limit for uploading image for creating new post is till 50 mb
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb",extended:true}));
app.use(cookieParser());

// Importing Routes
const post = require("./routes/post");
const user = require("./routes/user");

// Using Routes
// This added the prefix to the root route
// all route mentioned now would be starting with this prefix now.
// for ex - localhost:3000/api/v1 this is the prefix
app.use("/api/v1",post);
app.use("/api/v1",user);

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

module.exports= app;