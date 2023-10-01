import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/home/left-sidebar-container.css";
import "../../../styles/home/style.css";
import { AuthContext } from "../../../context/AuthContext";
import { GroupContext } from "../../../context/GroupContext";
import CreateGroup from "../../group/common/CreateGroup";

export default function Sidebar() {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext);
    const { showGroupCreate, setShowGroupCreate, showGroupList, fetchGroupInfo } = useContext(GroupContext)

    const showCreateGroup = () => {
        setShowGroupCreate(true);
    }

    const handleLinkClick = async(groupId) => {
       await fetchGroupInfo(groupId);
    }

    const goProfile = (username) => {
        navigate(`/${username}`);
    }

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
                    <li className="links link-avatar sidebar-link-avatar" onClick={() => goProfile(user?.username)} >
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
                        <Link to="">
                            <i className="watch icon"></i>
                            <span className="text nav-text">Watch</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="">
                            <i className="page icon"></i>
                            <span className="text nav-text">Page</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="">
                            <i className="market icon"></i>
                            <span className="text nav-text">Marketplace</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="">
                            <i className="game icon"></i>
                            <span className="text nav-text">Game</span>
                        </Link>
                    </li>

                    <li>
                        <Link to=""
                            onClick={showCreateGroup}
                        >
                            <i className="fas fa-users icon"></i>
                            <span className="text nav-text">Group</span>
                        </Link>
                    </li>
                    <hr />

                    {showGroupList.map((group, index) => (
                        <li key={index} className="group-image">
                            <Link to={`/groups/${group?.group.id}`} onClick={() => handleLinkClick(group?.group.id)}>
                                <div className="image-group">
                                    <img src={group?.group.image} alt="" />
                                </div>
                                <span className="text nav-text">{group?.group.groupName}</span>
                            </Link>
                        </li>
                    ))}
                </div>
            </div>

            <CreateGroup></CreateGroup>
        </>
    );
}