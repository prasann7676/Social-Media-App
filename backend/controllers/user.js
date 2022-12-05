const User = require("../models/User");
const Post = require("../models/Post");
const {sendEmail} = require("../middlewares/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const mongoose = require('mongoose');

exports.register = async (req,res)=>{
    try{
        const {name,email,password,avatar}=req.body;

        // checking/Finding in the database if this email already exists.
        let user = await User.findOne({email});
        if(user){
            // The HyperText Transfer Protocol (HTTP) 400 Bad Request response status code 
            // indicates that the server cannot or will not process the request due to 
            // something that is perceived to be a client error (for example, malformed request syntax, 
            // invalid request message framing, or deceptive request routing).
            return res.status(400).json({success:false,message:"User Already Exists"})
        }

        const myCloud = await cloudinary.v2.uploader.upload(avatar,{
            folder:"avatars"
        });


        // We have to give public id and url to the avatar attribute for a user.
        user = await User.create({name,email,password,avatar:{public_id:myCloud.public_id,url:myCloud.secure_url}});

        // we are using tokens,cookies in registration process also, so that after registraion
        // user automatically logs in too.
        const token = await user.generateToken();
        const options = {
            expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly:true
        }
        // 201 status means
        // The request has been fulfilled and resulted in a new resource being created.
        res.status(201).cookie("token",token,options)
        .json({
            success:true,
            user,
            token
        });
    }catch(error){
        console.log("is it ok?")
        // 500 means that the server encountered an unexpected condition that prevented it from fulfilling the request.
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.login = async(req,res)=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        .then(con=>console.log(`Database Connected: ${con.connection.host}`))
        .catch((err)=>console.log("error in connecting database database.js try block",err))
        
        const {email,password} = req.body;
        // .select("+password") will say that I have to access the password field in the document
        // this is necessary as during creation of user schema, in the password field
        // we made select as false.
        const user = await User.findOne({email}).select("+password").populate("posts followers following");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User does not exist"
            });
        }
        // checking if the password entered is correct or not.
        // This function is in models/Users
        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect Password",
            });
        }

        // JWTs are mainly used for authentication. After a user signs in to an application, 
        // the application then assigns JWT to that user. Subsequent requests by the user will include the assigned JWT. 
        // This token tells the server what routes, services, and resources the user is allowed to access.
        const token = await user.generateToken();
        // There are different options you can configure for the cookie server side
        // we are adding an expiry to the cookies
        // i.e, we are allowed to remain logged in till 90 days(but if we log out before that then too coolie will clear)
        // An HttpOnly Cookie is a tag added to a browser cookie that prevents client-side scripts from accessing data. 
        // It provides a gate that prevents the specialized cookie from being accessed by anything other than the server.
        const options = {
            expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly:true
        }
        // The HTTP 200 OK success status response code indicates that the request has succeeded
        // https://stackoverflow.com/questions/17769011/how-does-cookie-based-authentication-work
        // After the request is made, the server validates the user on the backend by querying the database. 
        // If the request is valid, it will create a session by using the user information fetched from the database 
        // and store them. For each session a unique ID called the session ID is created. 
        // By default, the session ID will be given to the client through the Browser.
        // so, cookies(small temporary storage) stores the session info for every user, temporarily till they do not log out.

        // so here we are saving the cookies for this user session in the response.
        // tokens is stored in this sessional cookies.
        // To keep them secure, you should always store JWTs inside an httpOnly cookie. 
        // This is a special kind of cookie that's only sent in HTTP requests to the server. 
        // It's never accessible (both for reading or writing) from JavaScript running in the browser.
        res.status(200).cookie("token",token,options)
        .json({
            success:true,
            user,
            token
        });

        // After this cookies are stored in the response(when user logs in(here) or registers)
        // further, any requests from this user to thr server will contain this cookies(with all info in it)
        // this can be accessed by req.cookies
    }catch(error){
        res.status(500).json({
            connectionStatus: mongoose.connection.readyState,
            success:false,
            message:`error while login in controllers users ${error.message}`
        });
    }
}

exports.logout = async (req,res)=>{
    try{
        // during logout, value of the token will be given as NULL
        // because this user is logging out.
       res.status(200).cookie("token",null,{expires:new Date(Date.now()),httpOnly:true})
       .json({
        success:true,
        message:"Logged Out"
       }) 
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

//To follow or unfollow the reqested users
exports.followUser = async (req,res)=>{
    try{
        // userToFollow -> id of the user to be followed
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);

        // If user to be followed id is not found
        if(!userToFollow){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }

        // if current logged in user already follows the user to be followed
        if(loggedInUser.following.includes(userToFollow._id)){
            // unfollow this user
            const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
            loggedInUser.following.splice(indexfollowing,1);
            const indexfollowers = userToFollow.followers.indexOf(loggedInUser._id);
            userToFollow.followers.splice(indexfollowers,1);
            await loggedInUser.save();
            await userToFollow.save();
            res.status(200).json({
                success:true,
                message:"User Unfollowed"
            })      
        }else{
            loggedInUser.following.push(userToFollow._id);
            userToFollow.followers.push(loggedInUser._id);
            await loggedInUser.save();
            await userToFollow.save();
            res.status(200).json({
                success:true,
                message:"User Followed"
            })
        }
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

// for changing passwords.
exports.updatePassword = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id).select("+password");
        const {oldPassword,newPassword} = req.body;

        // oldPassword or newPassword cannot be empty
        if(!oldPassword||!newPassword){
            return res.status(400).json({
                success:false,
                message:"Please provide old and new password"
            })
        }

        // checking if the password matches.
        const isMatch = await user.matchPassword(oldPassword);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect old password"
            })
        }

        // editing the old password to new one.
        // remember before assigning password would automatically get hashed
        // as we added a pre function in models/User which will run everytime before saving of user document.
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password updated"
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

// to update either name, email or avatar.
exports.updateProfile = async (req,res)=>{
    try{
       const user = await User.findById(req.user._id);
       const {name,email,avatar} = req.body;
       if(name){
        user.name=name;
       } 
       if(email){
        user.email=email;
       }

       //If there already is an avatar for this user, then first we will delete it from cloudinary cloud, then upload the new avatar.
       if(avatar){
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
            const myCloud = await cloudinary.v2.uploader.upload(avatar,{
                folder:"avatars"
            })

            //updating public id and url.
            user.avatar.public_id=myCloud.public_id;
            user.avatar.url=myCloud.secure_url;
       }
       await user.save();
       res.status(200).json({
        success: true,
        message: "Profile updated"
    })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

//for completely deleting the profile of the user.
exports.deleteMyProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const posts = user.posts;
      const followers = user.followers;
      const following = user.following;
      const userId = user._id;
  
      // Removing Avatar from cloudinary
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  
      await user.remove();
  
      // Logout user after deleting profile
      // As we are passing the token as NULL here.
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
  
      // Delete all posts related to that user
      for (let i = 0; i < posts.length; i++) {
        const post = await Post.findById(posts[i]);

        //Deleting the image saved in the post folder of cloudinary related to all posts of this user's.
        await cloudinary.v2.uploader.destroy(post.image.public_id);
        await post.remove();
      }
  
      // Removing User from Followers Following
      for (let i = 0; i < followers.length; i++) {
        const follower = await User.findById(followers[i]);
  
        const index = follower.following.indexOf(userId);
        follower.following.splice(index, 1);
        await follower.save();
      }
  
      // Removing User from Following's Followers
      for (let i = 0; i < following.length; i++) {
        const follows = await User.findById(following[i]);
  
        const index = follows.followers.indexOf(userId);
        follows.followers.splice(index, 1);
        await follows.save();
      }
  
      // removing all comments of the user from all posts
      const allPosts = await Post.find();
  
      for (let i = 0; i < allPosts.length; i++) {
        const post = await Post.findById(allPosts[i]._id);
  
        for (let j = 0; j < post.comments.length; j++) {
          if (post.comments[j].user === userId) {
            //Deleting this post's comment from the database.
            post.comments.splice(j, 1);
          }
        }
        await post.save();
      }

      // removing all likes of the user from all posts(simimlar to removing comments from database)
  
      for (let i = 0; i < allPosts.length; i++) {
        const post = await Post.findById(allPosts[i]._id);
  
        for (let j = 0; j < post.likes.length; j++) {
          if (post.likes[j] === userId) {
            post.likes.splice(j, 1);
          }
        }
        await post.save();
      }
  
      res.status(200).json({
        success: true,
        message: "Profile Deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};

// gives all info related to the logged in user
exports.myProfile = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id).populate("posts followers following");
        res.status(200).json({
            success:true,
            user
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

// gives all info related to any user(for whom the current user is requesting)
exports.getUserProfile = async (req,res)=>{
    try{
        const user = await User.findById(req.params.id).populate("posts followers following");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        res.status(200).json({
            success:true,
            user
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

// gives info for all users present in the database.
exports.getAllUsers = async (req,res)=>{
    try{
        //query are the things given after the ? in URL
        //For ex: /users/name="customer1", so here req.query.name will be customer1
        //regex actually finds all the names where req.query.name is a substring of the name
        //So if a user name is Iamcustomer123, then too it will find this(as it contain a substring customer1)
        //In case the query name is empty, then it will find all the users
        //options: "i" means case insensitive
        const users = await User.find({name:{$regex:req.query.name,$options:"i"}});
        res.status(200).json({
            success:true,
            users
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.forgotPassword = async (req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        // This token(unhashed one) would be sent to the specified email of the user, who applied for forgot passsword
        // the user clicks on the link in the email
        // Then we would check we the token we got by clicking the link is equal to 
        // that stored in the database(in resetPasswordToken attribute)(It was generated and stored when user clicked on forgot password)
        // This stored token is the same token generated which was sent to the email, but was hashed using sha256 algorithm.
        const resetPasswordToken = user.getResetPasswordToken();
        await user.save();

        //we are creating a reset password URL which would be sent to the specified email of the user, who requested for forgot password
        //req.protocol is the type of request protocol that we are using
        // i.e, either http ot https etc
        //host means the host address(while running in local host is actually localhost:3000)
        const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetPasswordToken}`;

        //This message will be sent to the user's email, where this resetUrl will be present.
        const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a POST request with a new password to ${resetUrl}. If you did not request this, please ignore this email and your password will remain unchanged.`;
        try{
            //This sendEmail is defined in middlewares/sendEmail
            await sendEmail({
                email:user.email,
                subject:"Password Reset Token",
                message
            })
            res.status(200).json({
                success:true,
                message:`Email has been sent to ${user.email}`
            })
        }catch(error){
            //in case the email was not sent(error in sending), then the resetPasswordToken we stored
            //in the database is of no use, as user again clicks for forget password, a new token would be generated and processed
            //so, we would make thik resetPasswordToken and resetPasswordExpire as undefined in the database(document of the user)

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.status(500).json({
                success:false,
                message:error.message
            });
        }
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

// When user selects forgot password, and a mail is sent to his email
// user clicks the link given(this url contain the token)
// This function handle reseting the old password to new one, after forgot password process.
exports.resetPassword = async (req,res)=>{
    try{
        // we are using the same hash function to hash this token(which is given in the url)
        // Then we will find the user having this token in resetPasswordToken
        // If there exist no user having this data, then either the token is expired or the token is wrong
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        //$gt means strictly greater. i.e. we are finding such a user document where
        //resetPasswordToken is matching and expiry time is greater then current time.
        // in parameters for findOne as attribte name and value are same, then we can simply write their name
        const user = await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}});
        if(!user){
            // The HyperText Transfer Protocol (HTTP) 401 Unauthorized response status code indicates that the client request has not been completed because it lacks valid authentication credentials for the requested resource.
            return res.status(401).json({
                success:false,
                message:"Password reset token is invalid or has expired"
            })
        }

        //If user do not give any password, then mongoDB will automatically handle it.
        //As it is part of the model schema
        user.password = req.body.password;
        //Making both attributes undefined is IMP
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({
            success:true,
            message:"Password has been reset"
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

//stores of the posts(with population of likes, comments.user and owner) which the currently logged in user have made(or owned)
exports.getMyPosts = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id);
        const posts=[];
        for(let i=0;i<user.posts.length;i++){
            //user.posts[i] will contain an _id which is a reference to the post in the post model schema
            const post = await Post.findById(user.posts[i]).populate("likes comments.user owner");
            posts.push(post);
        }
        res.status(200).json({
            success:true,
            posts
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

//Gives all posts whose owner is the specific user(whose id's is mentioned in the URL)
exports.getUserPosts = async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const posts=[];
        for(let i=0;i<user.posts.length;i++){
            const post = await Post.findById(user.posts[i]).populate("likes comments.user owner");
            posts.push(post);
        }
        res.status(200).json({
            success:true,
            posts
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}
