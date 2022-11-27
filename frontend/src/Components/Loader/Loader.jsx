//whenever there is loading(wheather it be during login, or during api calls or etc)
import React from "react";
import "./Loader.css";
const Loader = () => {
  return (
    <div className="loadingPage">
      <div className="loadingCircle"></div>
    </div>
  );
};

export default Loader;