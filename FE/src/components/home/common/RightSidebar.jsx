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
            <div className="right-sidebar-ads-home">
                <h4>Advertisement :</h4>
                <div className="sidebar-ads-home">
                    <div className="ads-one-home">
                        <Link to="">
                            {/* <i className="fas fa-times button-remove"></i> */}
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF8HJ5D0yaxHeIGb5i23Upkbp3YSai3ZlkOvy4AoO5sA&s" alt="" />
                            <div className="ads-title">
                                <h5>Meo meo</h5>
                                <span>meo.com</span>
                            </div>
                        </Link>
                    </div>

                    <div className="ads-two-home">
                        <Link to="https://shopee.vn/">
                            {/* <i className="fas fa-times button-remove"></i> */}
                            <img src="data:image/png;base64,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" alt="" />
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
                <h4>Contacts :</h4>
                <div className="rightbar-icon-home">
                    <Link to="">
                        <i
                            className="bx fas fa-video right-icon-home"
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Cuộc gọi mới"
                        ></i>
                    </Link>
                    <Link to="">
                        <i
                            className="bx fas fa-search right-icon-home"
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