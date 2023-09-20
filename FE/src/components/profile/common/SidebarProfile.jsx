import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function Sidebar() {
    const { user } = useContext(AuthContext);

    return (
        <>
            <div className="left-sidebar">
                <div className="container-top-content">
                    <li className="links">
                        <a href="">
                            <i
                                className="fas fa-home icon"
                                style={{ color: "black", minWidth:"50px" }}
                            />
                        </a>
                    </li>
                    <li className="links link-avatar select" style={{transform:"translate(6px)"}}>
                            <div className="sidebar-avatar">
                                <img 
                                    src={user.avatar} alt="load" />
                            </div>
                    </li>
                </div>
                <div className="mid-content">
                    <li>
                        <a href="">
                            <i className="watch icon" />
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <i className="page icon" />
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <i className="market icon" />
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <i className="game icon" />
                        </a>
                    </li>
                </div>
            </div>
        </>
    )
}