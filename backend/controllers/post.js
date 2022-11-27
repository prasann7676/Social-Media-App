const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary");

exports.createPost = async (req,res)=>{
    try{
        // uploading the image related to the post
        // in mycloudinary.com, inside media library, we will store these URL's in the posts folder
        const myCloud = await cloudinary.v2.uploader.upload(req.body.image,{
            folder:"posts"
        });

        //Data related to the uploaded image
        const newPostData = {
            caption:req.body.caption,
            image:{
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            },
            // when user clicks on create post, then first isAuthenticated function will run 
            // to check if a user is logged in or not, if he is logged in, then we will store 
            // this user's info in req.user, which is accessed here.
            owner:req.user._id
        }
        // create function creates and save the document simultaneously in the database.
        // this returns a mongoose query object, which can be used to call other functions carrying CRUD operations etc.
        const post = await Post.create(newPostData);

        // fincding the user who is requesting to create a new post.
        const user = await User.findById(req.user._id);

        // unshift function is used to insert this post._id in front of the array, as this post is the latest.
        user.posts.unshift(post._id);

        //Do not forget to save the document again.
        await user.save();
        res.status(201).json({
            success:true,
            message:"Post created"
        })
    }catch (error){
        // The HyperText Transfer Protocol (HTTP) 500 Internal Server Error 
        // server error response code indicates that the server encountered an unexpected condition 
        // that prevented it from fulfilling the request
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//will delete the post, update the database and also clear the storage related to this post from the cloudinary posts folder
exports.deletePost = async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            });
        }

        // post could only be deleted by the owner of the post.
        if(post.owner.toString()!==req.user._id.toString()){
            // 401 Unauthorized response status code
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            });
        }

        //this will delete the uploaded image from posts folder in cloudinary
        await cloudinary.v2.uploader.destroy(post.image.public_id);

        // deleted this post info from the post collection.
        await post.remove();
        const user = await User.findById(req.user._id);
        const index = user.posts.indexOf(req.params.id);

        // removed this post_id from this user's info
        user.posts.splice(index,1);
        await user.save();
        res.status(200).json({
            success:true,
            message:"Post Deleted"
        })
    }catch (error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// used to like or unlike a post.
// if we go to http://localhost:4000/api/v1/post/:id
// this will make us access the particular post with this specified id and update the database.
exports.likeAndUnlikePost = async (req,res)=>{
    try{
        // info of post related to this :id
        const post = await Post.findById(req.params.id);

        // If there is no post related to this _id, then we will return
        // 404 - server cannot find the requested resource.
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            });
        }

        // checking if this user has already liked this particular post or not.
        if(post.likes.includes(req.user._id)){
            // if this user has already liked this post earlier, then we need to unlike this post.
            const index = post.likes.indexOf(req.user._id);

            // delete this user_id from the likes array
            // starting from index till length 1.
            post.likes.splice(index,1);
            await post.save();
            return res.status(200).json({
                success:true,
                message:"Post Unliked"
            })
        }else{
            // if user has not liked it yet.
            post.likes.push(req.user._id);
            await post.save();
            return res.status(200).json({
                success:true,
                message:"Post Liked"
            })
        }
    }catch (error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// getting posts of all users to whom the currently logged in user is following
exports.getPostsOfFollowing = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id);
        // posts will be an array containing _id of all users this logged in user is following
        const posts = await Post.find({
            owner:{
                // in is used to find all _id of users, to whom this logged in user is following 
                $in:user.following
            }
            // populate means if we dont populate anything, this posts list(i.e. the returned query object list) will only contain id's of such posts, other attributes will be empty
            // But if we populate owner, likes and comments.user then posts list will also contain these info relate dto the post documents
        }).populate("owner likes comments.user");
        res.status(200).json({
            success:true,
            posts:posts.reverse()
        })
    }catch (error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// updating the caption of a post, only by the owner of the post.
exports.updateCaption = async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);

        // if no post with this id. 
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            });
        }

        // only owner should could change the caption.
        if(post.owner.toString()!==req.user._id.toString()){
            // 401 Unauthorized response status code
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }
        post.caption = req.body.caption;
        await post.save();
        res.status(200).json({
            success:true,
            message:"Post updated"
        })
    }catch (error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// creates or update the comments on a particular post(with id as req.params.id)
exports.commentOnPost = async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            });
        }
        // commentIndex will contain the index of the object inside comments attribute
        // related to this logged in user.
        let commentIndex = -1;
        post.comments.forEach((comment,index)=>{
            if(comment.user.toString()===req.user._id.toString()){
                commentIndex = index;
            }
        })
        // If logged in user has already commented on this particular post
        if(commentIndex>=0){
            // we will update the comment(or say overwrite the comment - prev comment to new comment)
            post.comments[commentIndex].comment = req.body.comment;
            await post.save();
            res.status(200).json({
                success:true,
                message:"Comment updated"
            });
        }else{
            // push a new object inside the comment array
            // as there have been no comment related to this user.
            post.comments.push({
                user:req.user._id,
                comment:req.body.comment
            });
            await post.save();
            return res.status(200).json({
                success:true,
                message:"Comment added"
            });
        }
    }catch (error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// deletes comment from a particular post.
exports.deleteComment = async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            });
        }
        // if the logged in user is the same user who have created this post.(or is the owner of the post)
        // Then this user should have the access to delete comment from all the users. 
        // Otherwise, user can only delete a comment of his own.
        if(post.owner.toString()===req.user._id.toString()){
            if(req.body.commentId===undefined){
                return res.status(400).json({
                    success:false,
                    message:"Comment id not provided"
                });
            }
            post.comments.forEach((comment,index)=>{
                // If requested comment ID(that the logged in user wants to delete)
                // matches the current iteration id, then delete the comment.
                if(comment._id.toString()===req.body.commentId.toString()){
                    return post.comments.splice(index,1);
                }
            })
            await post.save();
            return res.status(200).json({
                success:true,
                message:"Selected Comment deleted"
            });
        }else{
            // commentIndex will store the index at which, comment of the logged in user
            // is stored in the comments array of the owner's post.
            let commentIndex = -1;
            post.comments.forEach((comment,index)=>{
                if(comment.user.toString()===req.user._id.toString()){
                    commentIndex = index;
                }
            })
            // If there exists a comment of this logged in user for this post.
            if(commentIndex>=0){
                post.comments.splice(commentIndex,1);
                await post.save();
                return res.status(200).json({
                    success:true,
                    message:"Comment deleted"
                });
            }else{
                return res.status(404).json({
                    success:false,
                    message:"Comment not found"
                });
            } 
        }    

    }catch (error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}