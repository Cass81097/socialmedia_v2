import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/home/right-sidebar-container.css";
import "../../../styles/home/style.css";
import { HomeContext } from "../../../context/HomeContext";
import { AuthContext } from "../../../context/AuthContext";

export default function RightSidebar() {
    const { user } = useContext(AuthContext)
    const { friendUser, onlineUsers, setProfileId } = useContext(HomeContext);
    const [onlineUserFriend, setOnlineUserFriend] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (onlineUsers && user) {
            const filteredOnlineUser = onlineUsers.filter(
                (userOnline) => userOnline.userId !== user.id
            );
            setOnlineUserFriend(filteredOnlineUser);
        }
    }, [onlineUsers, user]);

    // Sort friendUser based on onlineUsers order and "online-user" status
    const sortedFriendUser = friendUser.sort((a, b) => {
        const indexA = onlineUsers.findIndex((onlineUser) => onlineUser.userId === a.id);
        const indexB = onlineUsers.findIndex((onlineUser) => onlineUser.userId === b.id);
        if (indexA !== -1 && indexB !== -1) {
            if (indexA === indexB) {
                return 0;
            }
            return indexA - indexB;
        } else if (indexA !== -1) {
            return -1;
        } else if (indexB !== -1) {
            return 1;
        } else {
            return 0;
        }
    });

    const messageUser = (userId) => {
        setProfileId(userId)
        // navigate("/messages");
    }

    return (

        <div className="right-sidebar-container">
            <div className="right-sidebar-ads">
                <h4>Được tài trợ</h4>
                <div className="sidebar-ads">
                    <div className="ads-one">
                        <Link to="">
                            <i className="fas fa-times button-remove"></i>
                            <img src="" alt="" />
                            <div className="ads-title">
                                <h5>Meo meo</h5>
                                <span>meo.com</span>
                            </div>
                        </Link>
                    </div>

                    <div className="ads-two">
                        <Link to="">
                            <i className="fas fa-times button-remove"></i>
                            <img src="" alt="" />
                            <div className="ads-title">
                                <h5>Shopee</h5>
                                <span>shopee.vn</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* <div className="rightbar-birthday">
                <h4>Sinh nhật</h4>
                <div className="birthday-info">
                    <div className="birthday" style={{ position: "relative" }}></div>
                    <div className="birthday-content">
                        <p>Hôm nay là sinh nhật của </p>
                    </div>
                </div>
            </div> */}

            <div className="rightbar-contact-home">
                <h4>Người liên hệ</h4>
                <div className="rightbar-icon">
                    <Link to="">
                        <i
                            className="bx fas fa-video right-icon"
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Cuộc gọi mới"
                        ></i>
                    </Link>
                    <Link to="">
                        <i
                            className="bx fas fa-search right-icon"
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Tìm kiếm"
                        ></i>
                    </Link>
                    <Link to="">
                        <i
                            className="bx fas fa-ellipsis-h right-icon"
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Tùy chọn"
                        ></i>
                    </Link>
                </div>
            </div>

            {/* List of Contacts */}
            {sortedFriendUser.map((user) => {
                const onlineUserIndex = onlineUsers.findIndex(
                    (onlineUser) => onlineUser.userId === user.id
                );
                const isOnline = onlineUserIndex !== -1;

                return (
                    <div
                        className={`online-list-home ${isOnline ? "online-user" : ""}`}
                        key={user.id}
                        onClick={() => messageUser(user.id)}
                    >
                        <div className="online-list-container">
                            <div className="avatar-contact-container">
                                <img src={user.avatar} alt={user.fullname} />
                            </div>
                            <div className="name-contact">
                                <h5>{user.fullname}</h5>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}