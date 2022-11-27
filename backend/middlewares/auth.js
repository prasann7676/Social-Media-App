const User = require("../models/User");
const jwt = require("jsonwebtoken")

// this function tells if the user is logged in or not
// as when a user logs in or registered, a token is generated and stored in his sessional cookies
// so, if this token is empty(or not generated), then user is not logged in.
exports.isAuthenticated = async (req,res,next)=>{
    try{

        // we have to user cookieParser inorder to fetch this req.cookie
        const {token}=req.cookies;
        if(!token){
            return res.status(401).json({
                message:"Please Login First"
            });
        }
        // This decoded object will contain the _id of the document(which was passed as payload in sign method(in User.js(models)))
        const decoded = await jwt.verify(token,process.env.JWT_SECRET);
        // Finding the user with specified _id and save that user info from the database to this request user.
        // So, now we can access the user info, by writing req.user, till the user is logged in
        req.user = await User.findById(decoded._id);

        // as we dont want to return anything, when token is valid
        // so we say the server to execute other middleware(using next) and to not stop here.
        next();
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}