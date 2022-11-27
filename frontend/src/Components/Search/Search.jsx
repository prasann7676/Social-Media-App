//Component to search a user using the name of the user.
import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getallUsers } from "../../Actions/User";
import User from "../User/User";
import "./Search.css";

const Search = () => {
  const [name, setName] = useState("");

  //users is the list of users which matches with name(precisely speaking, which matches the the user database name's substring)
  const { users, loading } = useSelector((state) => state.allUsers);

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();

    //dispatching the getallUsers action with name is this instant name state value (when user hit the search button)
    dispatch(getallUsers(name));
  };

  return (
    <div className="search">
      <form className="searchForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Search User
        </Typography>

        <input
          type="text"
          value={name}
          placeholder="Name"
          required
          onChange={(e) => setName(e.target.value)}
        />

        <Button disabled={loading} type="submit">
          Search
        </Button>

        {/* Displaying all the users who matches the name search result */}
        <div className="searchResults">
          {users &&
            users.map((user) => (
              <User
                key={user._id}
                userId={user._id}
                name={user.name}
                avatar={user.avatar.url}
              />
            ))}
        </div>
      </form>
    </div>
  );
};

export default Search;