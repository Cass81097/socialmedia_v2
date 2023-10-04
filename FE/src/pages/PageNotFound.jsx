import React from "react";
import { Link } from "react-router-dom";
import "../styles/error_page.css"

const PageNotFound = () => {
    return (
        <div className="container" style={{maxWidth:"100%"}}>
            <div className="gif">
                <img src="https://i.postimg.cc/2yrFyxKv/giphy.gif" alt="gif_ing" />
            </div>
            <div className="content">
                <h1 className="main-heading">This content isn't available right now.</h1>
                <p className="text-page">
                When this happens, it's usually because the owner only shared it with a small group of people, changed who can see it or it's been deleted.
                </p>
                <Link to="/home">
                    <button>Go to News Feed <i className="far fa-hand-point-right"></i></button>
                </Link>

            </div>
        </div>
    );
}

export default PageNotFound;
