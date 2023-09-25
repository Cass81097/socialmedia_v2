import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/home/left-sidebar-container.css";
import "../../../styles/home/style.css";
import { AuthContext } from "../../../context/AuthContext";

export default function Sidebar() {
    const { user } = useContext(AuthContext)

    return (
        <>
            <div className="left-sidebar-container">
                <div className="container-top-content-sidebar">
                    <li className="links">
                        <Link to="/">
                            <i className="select fas fa-home icon"></i>
                            <span className="text nav-text">Home</span>
                        </Link>
                    </li>
                    <li className="links link-avatar sidebar-link-avatar" >
                        <div className="sidebar-avatar">
                            <img
                                src={user.avatar} alt="load" />
                        </div>
                        <p className="sidebar-avatar-name">
                            {user.fullname}
                        </p>
                    </li>
                    <hr />
                </div>

                <div className="mid-content-container">
                    <li>
                        <Link to="/watch">
                            <i className="watch icon"></i>
                            <span className="text nav-text">Watch</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/page">
                            <i className="page icon"></i>
                            <span className="text nav-text">Page</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/marketplace">
                            <i className="market icon"></i>
                            <span className="text nav-text">Marketplace</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/game">
                            <i className="game icon"></i>
                            <span className="text nav-text">Game</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/groups">
                            <i className="fas fa-users icon"></i>
                            <span className="text nav-text">Group</span>
                        </Link>
                    </li>

                    <hr />
                </div>
            </div>
        </>
    );
}