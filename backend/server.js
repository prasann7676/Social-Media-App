const app = require("./app");
const {connectDatabase} = require("./config/database");
//cloudinary is a package to store image url's, we will use it to store the user's avatar
const cloudinary = require("cloudinary");

// This function mainly connects with the database
connectDatabase();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

// listening to the environment variable PORT 
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
});