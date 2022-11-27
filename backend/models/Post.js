const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    caption:String,
    image:{
        public_id:String,
        url:String
    },
    // _id of the post's writer or owner.
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        //ref means it will take reference from User.js(i.e user collection)
        ref:"User"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comments:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            comment:{
                type:String,
                required:true
            }
        }
    ]
});

module.exports = mongoose.model("Post",postSchema);