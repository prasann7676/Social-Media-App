import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { createNewPost } from "../../Actions/Post";
import { loadUser } from "../../Actions/User";
import "./NewPost.css";
const NewPost = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");

  //we have stored the states inside the like reducer only for newPost creation.
  const { loading, error, message } = useSelector((state) => state.like);
  const dispatch = useDispatch();
  const alert = useAlert();

  const handleImageChange = (e) => {
    //we will choose the first file which is uploaded as image(if there are multiple)
    const file = e.target.files[0];

    const Reader = new FileReader();

    //Image would be read as URL(this URL is the url file location of the system(not sure))
    Reader.readAsDataURL(file);

    //onload is a function from which we can determine the state of the Reader
    //readyState has 3 values 0->initial, 1->processing, 2-> processed.
    //So, if Reader is processed we, update the image state.
    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setImage(Reader.result);
      }
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    //for creating new post(called action function)
    await dispatch(createNewPost(caption, image));

    //For updating the posts list for the user(loadUser updates the data related to user currently logged in), (which will be used to display the number of post in right-side)
    //without using this when we upload a new post, number of post shown in right-side of the account section will not be updated without refreshing the page.
    dispatch(loadUser());
  };

  //useEffect for displaying error and messages related to creation of new posts
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [dispatch, error, message, alert]);

  return (
    <div className="newPost">
      <form className="newPostForm" onSubmit={submitHandler}>
        <Typography variant="h3">New Post</Typography>

        {image && <img src={image} alt="post" />}
        {/* input accepts file of any type(for image) that is why accept="image/*" *->all types of images */}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {/* input for adding caption to the post */}
        <input
          type="text"
          placeholder="Caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        {/* We will make the button disabled when loading is true*/}
        <Button disabled={loading} type="submit">
          Post
        </Button>
      </form>
    </div>
  );
};

export default NewPost;