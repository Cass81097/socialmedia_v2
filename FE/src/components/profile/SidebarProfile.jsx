import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function SidebarProfile() {
    const { user } = useContext(AuthContext);

    const goHome = () => {
        console.log("ab");
    }

    return (
        <>
            <div className="left-sidebar">
                <div className="container-top-content">
                    <li className="links" onClick={goHome}>
                        <Link to="/">
                            <i
                                className="fas fa-home icon"
                                style={{ color: "black", minWidth: "48px", cursor:"pointer !important" }}
                                
                            />
                        </Link>
                    </li>
                    
                    <li className="links link-avatar select" style={{ transform: "translate(6px)" }}>
                        <div className="sidebar-avatar">
                            <img src={user.avatar} alt="load" />
                        </div>
                    </li>
                </div>
                <div className="mid-content">
                    <li>
                        <Link to="/">
                            <i className="watch icon" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="page icon" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="market icon" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="game icon" />
                        </Link>
                    </li>
                </div>
            </div>
        </>
    );
}