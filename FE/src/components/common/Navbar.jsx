import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import $ from 'jquery';
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";
import { ProfileContext } from "../../context/ProfileContext";
import { SearchBar } from "../search/SearchBar";
import { SearchResultsList } from "../search/SearchResultsList";
import { CometChatUI } from '../../cometchat-chat-uikit-react-3/CometChatWorkspace/src';
import axios from "axios";
import Notification from "./Notification";
import { GroupContext } from '../../context/GroupContext';
import { PostContext } from "../../context/PostContext";
import { baseUrl } from "../../utils/services"

export default function Navbar() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { fetchUserProfile, setUserProfile } = useContext(ProfileContext);
    const { fetchGroupInfo } = useContext(GroupContext)
    const { fetchPostUser } = useContext(PostContext)
    const [results, setResults] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [userRequest, setUserRequest] = useState({})
    const [userPost, setUserPost] = useState({});
    const [down, setDown] = useState(false);
    const [count, setCount] = useState(0);
    const [isUnread, setIsUnread] = useState(false);
    const [status, setStatus] = useState([]);
    const [userGroupRequest, setUserGroupRequest] = useState([]);
    const [groupRequest, setGroupRequest] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                let count = 0
                if (Object.keys(userRequest).length !== 0) {
                    const data = {
                        sender: userRequest.id,
                        receiver: user.id,
                        des: userRequest.userAccepted
                            ? "accepted your friend request"
                            : "just sent a friend request",
                    };
                    await axios.post(`${baseUrl}/friendNotifications`, data);
                    setUserRequest({});
                }

                if (Object.keys(userPost).length !== 0) {
                    const data = {
                        sender: userPost.id,
                        status: userPost.postId,
                        des: "just like your post",
                    };
                    await axios.post(`${baseUrl}/statusNotifications`, data);
                    setUserPost({});
                }
                if (Object.keys(groupRequest).length !== 0) {

                    const data = {
                        sender: groupRequest.id,
                        receiver: groupRequest.receiver,
                        group: groupRequest.groupId,
                        des: groupRequest.userAccepted ?
                            "has accepted your request to join the group"
                            : "just sent a request to join group"

                    };

                    await axios.post(`${baseUrl}/groupNotifications`, data);
                    setGroupRequest({});
                }
                if (Object.keys(status).length !== 0) {
                    const data = {
                        sender: status.id,
                        status: status.postId,
                        des: "just comment your post",
                    };

                    await axios.post(`${baseUrl}/statusNotifications`, data);
                    setStatus({});
                }

                const response = await axios.get(
                    `${baseUrl}/statusNotifications/receiverId/${user.id}`
                );

                const notifications1 = response.data
                setNotifications(notifications1);

                // Sử dụng biến newNotificationCount cho mục đích khác nếu cần thiết
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchData();
    }, [user.id, setUserRequest, setUserPost, userRequest, userPost, setStatus, status, setGroupRequest, groupRequest]);

    const handleUserRequest = (data) => {
        setUserRequest(data);
        setCount(count => count + 1)
    };

    const handleUserPost = (data) => {
        setUserPost(data);
        setCount(count => count + 1)

    };
    const handleStatus = (data) => {
        setStatus(data);
        setCount(count => count + 1)

    };
    const handleGroupRequest = (data) => {
        setGroupRequest(data)
        setCount(count => count + 1)

    };

    const toggleNotifi = () => {
        if (down) {
            setDown(false);
            setCount(0)

        } else {
            setDown(true);
            setCount(0)
        }
        $('.profile-menu').hide();
        setUserPost({});
        setUserRequest({});
    };

    const boxStyle = {
        height: down ? 'auto' : '0px',
        maxHeight: '450px',
        opacity: down ? 1 : 0
    };

    // hêt
    const showInfo = () => {
        setDown(false);
        $('.profile-menu').toggle();
    };

    const logout = async () => {
        try {
            await firebase.auth().signOut();
            navigate("/")
            window.location.reload();
            localStorage.clear();
        } catch (error) {
            console.error("Error :", error);
        }
    };

    const goUserInfo = (res) => {
        setDown(false);
        const currentDomain = window.location.pathname.split("/")[1];
        if (`/${user?.username}` !== `/${currentDomain}`) {
            // navigate(`/${user?.username}`);
            // setUserProfile(res)
            window.location.href = `/${user?.username}`;
            $('.profile-menu').hide();
        } else {
            $('.profile-menu').hide();
        }

    };

    const clearSearchResult = () => {
        setResults([]);
    }
    const showPost = async (statusId, notificationId) => {
        await axios.put(`${baseUrl}/statusNotifications/update/${notificationId}`)
        setDown(false);
        navigate(`/status/${statusId}`)
        await fetchPostUser()
    }
    const goProfileUser = async (item) => {
        if (item.group) {
            await axios.put(`${baseUrl}/groupNotifications/update/${item.id}`);
            setDown(false);
            navigate(`/groups/${item.group.id}`);
            await fetchGroupInfo(item.group.id);
        } else {
            await axios.put(`${baseUrl}/friendNotifications/update/${item.id}`);
            setDown(false);
            navigate(`/${item.sender.username}`);
            await fetchUserProfile()
        }
    }
    // xu ly nut chua doc
    const showIsReadNotification = async () => {
        try {
            const response = await axios.get(`${baseUrl}/statusNotifications/receiverId/${user.id}`);
            const notifications = response.data.filter(item => item.isRead === false);
            setNotifications(notifications);
            setIsUnread(true);
        } catch (error) {
            console.error(error);
        }
    };


    const showAllNotification = async () => {
        const response = await axios.get(`${baseUrl}/statusNotifications/receiverId/${user.id}`)
        setNotifications(response.data);
        setIsUnread(false);
    }

    const handleClick = (event) => {
        event.preventDefault();
        window.location.href = "/";
    };

    return (
        <>
            {/*{!down && <Notification setUserRequest={setUserRequest} setUserPost={setUserPost}></Notification>}*/}
            <Notification setUserRequest={handleUserRequest} setUserPost={handleUserPost} setStatus={handleStatus} setGroupRequest={handleGroupRequest} />
            <header>
                <div className="fb-nav">
                    <div className="title">
                        <Link to={"/"} onClick={handleClick}>F4kebook</Link>
                    </div>
                    <div className="search-box">
                        <SearchBar setResults={setResults} results={results} clearSearchResult={clearSearchResult} />
                        <SearchResultsList results={results} clearSearchResult={clearSearchResult} />
                    </div>
                    <div className="home-media">
                        <div className="social-media">
                            <Link
                                to="/messages"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Messenger"
                                style={{ transform: "translateY(7px)" }}
                            >
                                <i className="fab fa-facebook-messenger"></i>
                            </Link>
                            <Link
                                onClick={(event) => {
                                    event.preventDefault();
                                }}
                                to=""
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Notification"
                                style={{
                                    transform: "translateY(7px)",
                                    position: "relative"
                                }}
                            >
                                <i
                                    className="fas fa-bell"
                                    onClick={toggleNotifi}
                                    style={{
                                        position: "relative"
                                    }}
                                ></i>
                                {!down && count > 0 && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            height: "25px",
                                            width: "25px",
                                            top: "-10px",
                                            right: "-10px",
                                            padding: "3px 6px",
                                            backgroundColor: "red",
                                            color: "white",
                                            fontWeight: "bold",
                                            borderRadius: "50%",
                                            fontSize: "12px",
                                            textAlign: "center"
                                        }}
                                    >
                                        {count}
                                    </span>
                                )}
                            </Link>
                            <div className="notifi-box" id="box" style={boxStyle}>
                                <div className="content11" style={{ padding: "10px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginRight: "5px" }}>
                                        <h2>
                                            Notifications
                                        </h2>

                                        <button type="button" className="btn btn-light "
                                            style={{ borderRadius: "50%", height: "40px", width: "40px" }}>
                                            <i className="fas fa-ellipsis-h"></i>
                                        </button>

                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <button
                                            type="button"
                                            className={isUnread ? "btn btn-light" : "btn btn-outline-primary"}
                                            style={{
                                                borderRadius: "20px",
                                                marginLeft: "10px",
                                                fontWeight: "bold"
                                            }}
                                            onClick={showAllNotification}
                                        >
                                            All
                                        </button>
                                        <button
                                            type="button"
                                            className={isUnread ? "btn btn-outline-primary" : "btn btn-light"}
                                            style={{
                                                borderRadius: "20px",
                                                marginLeft: "10px",
                                                fontWeight: "bold"
                                            }}
                                            onClick={showIsReadNotification}
                                        >
                                            Unread
                                        </button>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginLeft: "10px",
                                        marginTop: "10px",
                                        alignItems: "end"
                                    }}>
                                        <h5> New </h5>
                                        <button type="button" className="btn btn-light "
                                            style={{ color: "#1877F2", fontWeight: "bold" }} onClick={showAllNotification} >See all
                                        </button>

                                    </div>
                                    {notifications.length > 0 ? (
                                        notifications.map((item, index) => (
                                            typeof item.status !== "undefined" ? (
                                                <div className="notifi-item" key={index}
                                                    onClick={() => showPost(item.status.id, item.id)
                                                    }>
                                                    <div style={{ position: "relative" }}>
                                                        <div className="item-image">
                                                            <img src={item.sender.avatar} alt="img" />
                                                        </div>
                                                        {item.des === "just like your post" && <div className="icon-avatar"
                                                            style={{ background: "#4e59ff" }}>
                                                            <i className="fas fa-thumbs-up"></i>

                                                        </div>}

                                                        {item.des === "just comment your post" &&
                                                            < div className="icon-avatar"
                                                                style={{ background: "lightgreen" }}>

                                                                <i className="fas fa-sticky-note"></i>

                                                            </div>
                                                        }

                                                    </div>
                                                    <div className="text">
                                                        <h4>
                                                            {item.sender.fullname}
                                                            <span >{item.des}</span>
                                                        </h4>
                                                        {(() => {
                                                            const timeString = item.time;
                                                            const date = new Date(timeString);
                                                            const now = new Date();
                                                            const timeDiffInMinutes = Math.floor((now - date) / (1000 * 60));
                                                            let timeAgo;

                                                            if (timeDiffInMinutes === 0) {
                                                                timeAgo = "Just now";
                                                            } else if (timeDiffInMinutes < 60) {
                                                                timeAgo = `${timeDiffInMinutes} minutes ago`;
                                                            } else {
                                                                const hours = Math.floor(timeDiffInMinutes / 60);
                                                                const minutes = timeDiffInMinutes % 60;
                                                                if (hours >= 24) {
                                                                    timeAgo = "1 day ago";
                                                                } else if (minutes === 0) {
                                                                    timeAgo = `${hours} hours`;
                                                                } else {
                                                                    timeAgo = `${hours} hours ${minutes} minutes ago`;
                                                                }
                                                            }
                                                            return (
                                                                <div>
                                                                    <p>{timeAgo}</p>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div >
                                                    <div style={{
                                                        width: "20px", height: "100%"
                                                    }}>
                                                        {!item.isRead && <div className="icon-read"></div>}
                                                    </div>
                                                </div >

                                            ) : (
                                                <div className="notifi-item" key={index}
                                                    onClick={() => goProfileUser(item)}>
                                                    {item.des === "has accepted your request to join the group" &&

                                                        <div style={{ position: "relative" }}>
                                                            <div className="item-image">
                                                                <img src={item.group.image} alt="img" />
                                                            </div>
                                                            <div className="icon-avatar">
                                                                <div className="icon-avatar"
                                                                    style={{ background: "#6de46d" }}>
                                                                    <i className="fas fa-users"></i>                                                            </div>

                                                            </div>
                                                        </div>}
                                                    {item?.des === "Just sent a request to join group" && (
                                                        <div style={{ position: "relative" }}>
                                                            <div className="item-image">
                                                                <img src={item?.sender.avatar} alt="img" />
                                                            </div>
                                                            <div className="icon-avatar">
                                                                <div className="icon-avatar" style={{ background: "#6de46d" }}>
                                                                    <i className="fas fa-users"></i>                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {(item.des === "Just sent a friend request" || item.des === "accepted your friend request") && (
                                                        <div style={{ position: "relative" }}>
                                                            <div className="item-image">
                                                                <img src={item.sender.avatar} alt="img" />
                                                            </div>
                                                            <div className="icon-avatar">
                                                                <div className="icon-avatar" style={{ background: "#4e59ff" }}>
                                                                    <i className="fas fa-user"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}


                                                    <div className="text">
                                                        <h4>
                                                            {item.sender.fullname}
                                                            <span>{item.des}</span>
                                                        </h4>
                                                        {(() => {
                                                            const timeString = item.time;
                                                            const date = new Date(timeString);
                                                            const now = new Date();
                                                            const timeDiffInMinutes = Math.floor((now - date) / (1000 * 60));
                                                            let timeAgo;

                                                            if (timeDiffInMinutes === 0) {
                                                                timeAgo = "Just now";
                                                            } else if (timeDiffInMinutes < 60) {
                                                                timeAgo = `${timeDiffInMinutes} minutes ago`;
                                                            } else {
                                                                const hours = Math.floor(timeDiffInMinutes / 60);
                                                                const minutes = timeDiffInMinutes % 60;
                                                                if (hours >= 24) {
                                                                    timeAgo = "1 day ago";
                                                                } else if (minutes === 0) {
                                                                    timeAgo = `${hours} hours`;
                                                                } else {
                                                                    timeAgo = `${hours} hours ${minutes} minutes ago`;
                                                                }
                                                            }
                                                            return (
                                                                <div>
                                                                    <p>{timeAgo}</p>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                    <div style={{
                                                        width: "20px", height: "100%"
                                                    }}>
                                                        {!item.isRead && <div className="icon-read"></div>}
                                                    </div>
                                                </div>

                                            )
                                        ))
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            </div>


                            <div className="avatar-nav" style={{ transform: "translateY(-7px)" }}>
                                <div
                                    className="avatar-navbar"
                                    data-toggle="tooltip"
                                    data-placement="bottom"
                                    title="Avatar"
                                >
                                    <img src={user?.avatar} alt="Avatar" onClick={() => showInfo()} />
                                </div>
                                <ol className="profile-menu" style={{ display: "none" }}>
                                    <li onClick={goUserInfo}>My Profile</li>
                                    <li data-toggle="modal" data-target="#myModal" onClick={() => logout()}>Log Out
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
