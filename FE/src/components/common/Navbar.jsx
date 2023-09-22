import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import $ from 'jquery';
import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {AuthContext} from "../../context/AuthContext";
import {ProfileContext} from "../../context/ProfileContext";
import {SearchBar} from "../search/SearchBar";
import {SearchResultsList} from "../search/SearchResultsList";
import {CometChatUI} from '../../cometchat-chat-uikit-react-3/CometChatWorkspace/src';
import axios from "axios";
import Notification from "./Notification";

export default function Navbar() {
    const {user} = useContext(AuthContext);
    const {setUserProfile} = useContext(ProfileContext);
    const [results, setResults] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [userRequest, setUserRequest] = useState({})
    console.log(userRequest,22222)

    const navigate = useNavigate();
    const [down, setDown] = useState(false);

    const toggleNotifi = () => {
        if (down) {
            setDown(false);
        } else {
            setDown(true);
        }
    };
    const boxStyle = {
        height: down ? 'auto' : '0px',
        maxHeight: '650px',
        opacity: down ? 1 : 0
    };
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost:5000/statusNotifications/receiverId/${user.id}`);
    //             const notifications = response.data;
    //             setNotifications(notifications);
    //         } catch (error) {
    //             // Xử lý lỗi tại đây
    //         }
    //     };
    //
    //     fetchData();
    // }, [user.id, setNotifications]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userRequest && Object.keys(userRequest).length !== 0) {
                    const data = {
                        sender: userRequest.id,
                        receiver: user.id,
                        des: "đã gưi lời mời kết bạn 1111111"
                    }
                    const response = await axios.post(`http://localhost:5000/friendNotifications`, data)
                }
                const response = await axios.get(`http://localhost:5000/statusNotifications/receiverId/${user.id}`);
                const notifications = response.data;
                setNotifications(notifications);
            } catch (error) {
                // Xử lý lỗi tại đây
            }
        };
        fetchData()
    }, [user.id, setNotifications,userRequest]);
    console.log(notifications,22222)
    // useEffect( async () => {
    //     if (props.userRequest && Object.keys(props.userRequest).length !== 0) {
    //         console.log(222222)
    //         const data={
    //             sender:props.userRequest.senderId,
    //             receiver:props.userRequest.receiverId,
    //             des:"đã gưi lời mời kết bạn"
    //         }
    //
    //         const response = await axios.post(`http://localhost:5000/friendNotifications`,data)
    //
    //     }
    //     const response = await axios.get(`http://localhost:5000/statusNotifications/receiverId/${user.id}`);
    //     const notifications = response.data;
    //     setNotifications(notifications);
    //
    // }, [ setNotifications]);

    // hêt
    const showInfo = () => {
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


    return (
        <>
            <Notification setUserRequest={setUserRequest}></Notification>
            <header>
                <div className="fb-nav">
                    <div className="title">
                        <Link to={"/"}>F4kebook</Link>
                    </div>
                    <div className="search-box">
                        <SearchBar setResults={setResults} results={results} clearSearchResult={clearSearchResult}/>
                        <SearchResultsList results={results} clearSearchResult={clearSearchResult}/>
                    </div>
                    <div className="home-media">
                        <div className="social-media">
                            <Link
                                to="/messages"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Messenger"
                                style={{transform: "translateY(7px)"}}
                            >
                                <i className="fab fa-facebook-messenger"></i>
                            </Link>
                            <Link
                                to=""
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Thông báo"
                                style={{transform: "translateY(7px)"}}
                            >
                                <i className="fas fa-bell" onClick={toggleNotifi}></i>
                            </Link>
                            <div className="notifi-box" id="box" style={boxStyle}>
                                <div className="content11">
                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                        <h2>
                                            Thông Báo
                                        </h2>
                                        <button type="button" className="btn btn-light "
                                                style={{borderRadius: "50%", height: "40px", width: "40px"}}>
                                            <i className="fas fa-ellipsis-h"></i>
                                        </button>

                                    </div>
                                    <div style={{display: "flex"}}>
                                        <button type="button" className="btn btn-outline-primary"
                                                style={{
                                                    borderRadius: "20px",
                                                    marginLeft: "10px",
                                                    fontWeight: "bold"
                                                }}>Tất
                                            cả
                                        </button>
                                        <button type="button" className="btn btn-light "
                                                style={{borderRadius: "20px", marginLeft: "10px", fontWeight: "bold"}}>
                                            Chưa đọc
                                        </button>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginLeft: "10px",
                                        marginTop: "10px",
                                        alignItems: "end"
                                    }}>
                                        <h5> Trước đó </h5>
                                        <button type="button" className="btn btn-light "
                                                style={{color: "#1877F2", fontWeight: "bold"}}>Xem tất cả
                                        </button>

                                    </div>
                                    {notifications.length >= 0 ? (notifications.map((item, index) =>

                                            (
                                                <div className="notifi-item" key={index}>
                                                    <div>
                                                        <div className="item-image">
                                                            <img src={item.sender.avatar} alt="img"/>
                                                            <div className="icon-avatar">
                                                                <i className="fas fa-camera"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text">
                                                        <h4>
                                                            {item.sender.fullname}
                                                            <span>
                                                             {item.des}
                                                            </span>
                                                        </h4>
                                                        <p>{item.time}</p>
                                                    </div>
                                                    {!item.isRead && <div className="icon-read"></div>}

                                                </div>
                                            )))
                                        : (
                                            // Hiển thị khi mảng notifications rỗng
                                            <div>No notifications</div>
                                        )}

                                    <div className="notifi-item">
                                        <div>

                                            <div className="item-image">
                                                <img
                                                    src="https://kynguyenlamdep.com/wp-content/uploads/2022/06/anh-gai-xinh-cuc-dep.jpg"
                                                    alt="img"/>

                                                <div className="icon-avatar">
                                                    <i className="fas fa-camera"></i>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="text">

                                            <h4>Elias Abdurrahman<span>đã like ảnh của ban tu bốn ngày trước </span>
                                            </h4>
                                            <p>4 ngày trước</p>
                                        </div>
                                        <div className="icon-read"></div>
                                    </div>


                                    <div className="notifi-item">
                                        <div>

                                            <div className="item-image">
                                                <img
                                                    src="https://kynguyenlamdep.com/wp-content/uploads/2022/06/anh-gai-xinh-cuc-dep.jpg"
                                                    alt="img"/>

                                                <div className="icon-avatar">
                                                    <i className="fas fa-camera"></i>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="text">

                                            <h4>Elias Abdurrahman<span>đã like ảnh của ban tu bốn ngày trước </span>
                                            </h4>
                                            <p>4 ngày trước</p>
                                        </div>
                                        <div className="icon-read"></div>
                                    </div>
                                    <div className="notifi-item">
                                        <div>

                                            <div className="item-image">
                                                <img
                                                    src="https://kynguyenlamdep.com/wp-content/uploads/2022/06/anh-gai-xinh-cuc-dep.jpg"
                                                    alt="img"/>

                                                <div className="icon-avatar">
                                                    <i className="fas fa-camera"></i>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="text">

                                            <h4>Elias Abdurrahman<span>đã like ảnh của ban tu bốn ngày trước </span>
                                            </h4>
                                            <p>4 ngày trước</p>
                                        </div>
                                        <div className="icon-read"></div>
                                    </div>
                                </div>
                            </div>


                            <div className="avatar-nav" style={{transform: "translateY(-7px)"}}>
                                <div
                                    className="avatar-navbar"
                                    data-toggle="tooltip"
                                    data-placement="bottom"
                                    title="Avatar"
                                >
                                    <img src={user?.avatar} alt="Avatar" onClick={() => showInfo()}/>
                                </div>
                                <ol className="profile-menu" style={{display: "none"}}>
                                    <li onClick={goUserInfo}>Thông tin</li>
                                    <li data-toggle="modal" data-target="#myModal" onClick={() => logout()}>Đăng xuất
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
