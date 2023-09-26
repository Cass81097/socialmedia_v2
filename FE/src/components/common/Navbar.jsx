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

export default function Navbar() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { setUserProfile } = useContext(ProfileContext);
    const [results, setResults] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [userRequest, setUserRequest] = useState({})
    const [userPost, setUserPost] = useState({});
    const [down, setDown] = useState(false);
    const [count, setCount] = useState(0);
    const [isUnread, setIsUnread] = useState(false);
    const [status, setStatus] = useState([])


    useEffect(() => {
        const fetchData = async () => {
            try {
                let count = 0
                if (Object.keys(userRequest).length !== 0) {
                    const data = {
                        sender: userRequest.id,
                        receiver: user.id,
                        des: userRequest.userAccepted
                            ? "đã đồng ý lời mời kết bạn của bạn"
                            : "vừa mới gửi lời mời kết bạn tới bạn",
                    };
                    await axios.post("http://localhost:5000/friendNotifications", data);
                    setUserRequest({});
                }

                if (Object.keys(userPost).length !== 0) {
                    const data = {
                        sender: userPost.id,
                        status: userPost.postId,
                        des: "đã like bài viết của bạn",
                    };
                    await axios.post("http://localhost:5000/statusNotifications", data);
                    setUserPost({});
                }
                if (Object.keys(status).length !== 0) {
                    const data = {
                        sender: status.id,
                        status: status.postId,
                        des: "đã bình luận bài viết của bạn",
                    };
                    console.log(data,88888)
                    await axios.post("http://localhost:5000/statusNotifications", data);
                    setStatus({});
                }

                const response = await axios.get(
                    `http://localhost:5000/statusNotifications/receiverId/${user.id}`
                );

                const notifications1 = response.data;
                const notificationCount = notifications1.length;

                setNotifications(notifications1);

                // Sử dụng biến newNotificationCount cho mục đích khác nếu cần thiết
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchData();
    }, [user.id, setUserRequest, setUserPost, userRequest, userPost, setStatus, status]);

    const handleUserRequest = (data) => {
        setUserRequest(data);
        setCount(count => count + 1)
    };

    const handleUserPost = (data) => {
        setUserPost(data);
        setCount(count => count + 1)

    };
    const handleStatus = (data) => {
        console.log(data,11111)
        setStatus(data);
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
            navigate(`/${user?.username}`);
            // setUserProfile(res)
            $('.profile-menu').hide();
        } else {
            $('.profile-menu').hide();
        }

    };

    const clearSearchResult = () => {
        setResults([]);
    }
    const showPost = async (statusId, notificationId) => {
        await axios.put(`http://localhost:5000/statusNotifications/update/${notificationId}`)
        setDown(false);
        navigate(`/status/${statusId}`)
    }
    const goProfileUser = async (username, id) => {
        await axios.put(`http://localhost:5000/friendNotifications/update/${id}`)
        setDown(false);
        navigate(`/${username}`);
    }
    // xu ly nut chua doc
    const showIsReadNotification = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/statusNotifications/receiverId/${user.id}`);
            const notifications = response.data.filter(item => item.isRead === false);
            setNotifications(notifications);
            setIsUnread(true);
        } catch (error) {
            console.error(error);
        }
    };


    const showAllNotification = async () => {
        const response = await axios.get(`http://localhost:5000/statusNotifications/receiverId/${user.id}`)
        setNotifications(response.data);
        setIsUnread(false);
    }


    return (
        <>
            {/*{!down && <Notification setUserRequest={setUserRequest} setUserPost={setUserPost}></Notification>}*/}
            <Notification setUserRequest={handleUserRequest} setUserPost={handleUserPost} setStatus={handleStatus} />
            <header>
                <div className="fb-nav">
                    <div className="title">
                        <Link to={"/"}>F4kebook</Link>
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
                                title="Thông báo"
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
                                                        {item.des ==="just like your post" &&  <div className="icon-avatar"
                                                                                                         style={{ background: "#4e59ff" }}>
                                                            <i className="fas fa-thumbs-up"></i>

                                                        </div> }

                                                        {item.des ==="just comment your post" &&
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
                                                                timeAgo = `${timeDiffInMinutes} minute ago`;
                                                            } else {
                                                                const hours = Math.floor(timeDiffInMinutes / 60);
                                                                const minutes = timeDiffInMinutes % 60;
                                                                if (hours >= 24) {
                                                                    timeAgo = "1 day ago";
                                                                } else if (minutes === 0) {
                                                                    timeAgo = `${hours} hour`;
                                                                } else {
                                                                    timeAgo = `${hours} hour ${minutes} minute ago`;
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
                                                     onClick={() => goProfileUser(item.sender.username, item.id)}>
                                                    <div style={{ position: "relative" }}>
                                                        <div className="item-image">
                                                            <img src={item.sender.avatar} alt="img" />
                                                        </div>
                                                        <div className="icon-avatar">
                                                            <i className="fas fa-user"></i>
                                                        </div>
                                                    </div>
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
                                                                timeAgo = `${timeDiffInMinutes} minute ago`;
                                                            } else {
                                                                const hours = Math.floor(timeDiffInMinutes / 60);
                                                                const minutes = timeDiffInMinutes % 60;
                                                                if (hours >= 24) {
                                                                    timeAgo = "1 day ago";
                                                                } else if (minutes === 0) {
                                                                    timeAgo = `${hours} hour`;
                                                                } else {
                                                                    timeAgo = `${hours} hour ${minutes} minute ago`;
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
