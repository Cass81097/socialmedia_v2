import "../../styles/search-bar/SearchPost.css"
import { baseUrl, getRequest } from "../../utils/services";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext, useSearch } from "../../context/AuthContext";
import axios from "axios";
import { BiSolidLike } from "react-icons/bi";
import Button from "react-bootstrap/Button";
import React, { useContext, useEffect, useState } from "react";
import { PostContext } from "../../context/PostContext";
import Home from "../../pages/Home";
import Like from "../common/Like";
import { SearchContext } from "../../context/SearchContext";
import { ProfileContext } from "../../context/ProfileContext";
import Navbar from "../common/Navbar";
import Sidebar from "../home/common/Sidebar";
import {CommentContext, CommentContextProvider} from "../../context/CommentContext";
import {HomeContext} from "../../context/HomeContext";
import Comment from "../common/Comment";

export default function SearchPostId() {
    const { id } = useParams()
    const { searchTerm } = useContext(SearchContext);
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [isCountLike, setIsCountLike] = useState([]);
    const { postUser, postImageUser, fetchPostUser, fetchImagePostUser } = useContext(PostContext);
    const [listStatus, setListStatus] = useState([])
    const [checkFriendStatus, setCheckFriendStatus] = useState(false);//sửa lai phan hiện postById


    useEffect(() => {
        axios.get(`${baseUrl}/status/statusId/${id}`).then((res) => {
            setListStatus(res.data)
        });
    }, [searchTerm])

    useEffect(() => {
        const fetchFriendStatus = async () => {
            try {
                if (user?.id === listStatus[0]?.sender.id) {
                    setCheckFriendStatus(true)
                }
                else {
                    const response = await getRequest(`${baseUrl}/friendShips/checkStatusByUserId/${user?.id}/${listStatus[0]?.sender.id}`);
                    if (response?.status === "friend") {
                        setCheckFriendStatus(true)
                    }
                }
            } catch (error) {
                console.error("Error fetching user profiles:", error);
            }
        };
        fetchFriendStatus();    
    }, [user, listStatus]);


    const handleLikeClick = async () => {
        axios.get(`${baseUrl}/status/statusId/${id}`).then((res) => {
            setListStatus(res.data);
        });
        fetchPostUser();
    };

    // const response =  getRequest(`${baseUrl}/status/content/7/${userId}`);
    const goProfile = (username) => {
        navigate(`/${username}`);
    };

    const publicPost = listStatus[0]?.visibility === "public";
    const friendPost = listStatus[0]?.visibility === "friend" && checkFriendStatus === true;


    // comment
    const {showComment, setShowComment} = useContext(HomeContext)

    const [visibleCommentIndex, setVisibleCommentIndex] = useState(-1);
    const handleToggleComment = (index) => {
        setShowComment(true)
        setVisibleCommentIndex(visibleCommentIndex === index ? -1 : index);
    };

    const load = () => {
        console.log("OK")
    }

    const reloadHome = () => {
        console.log("OK")
    }

    return (
        <>
            <Navbar></Navbar>
            {publicPost || friendPost ? (
                <div>
                    <div style={{ border: "1px solid" }}>
                        <p>1</p>
                        <p>1</p>
                    </div>
                    <div className="container-status">
                        <div className="sidebar-left-status" style={{ marginLeft: "10px" }}>

                            <Sidebar></Sidebar>

                        </div>
                        <div className="mid-status">
                            <div>
                                {listStatus.map((status, index) => (
                                    <div style={{ marginBottom: "30px" }} className="index-content-status" key={index}>
                                        <div className="post-container">
                                            <div className="user-profile" style={{ justifyContent: "unset" }}>
                                                <div className="user-avatar" onClick={() => goProfile(status.sender?.username)}>
                                                    <img src={status.sender?.avatar} alt="User Avatar" />
                                                </div>
                                                <div>
                                                    <div style={{ display: "flex" }}>
                                                        <div className="post-user-name">
                                                            <p>{status.sender.fullname}</p>
                                                        </div>
                                                        {status.receiver.id !== status.sender.id &&

                                                            <i className="fas fa-caret-right icon-post-user"></i>}
                                                        {status.receiver.id !== status.sender.id &&
                                                            <div className="post-user-name">
                                                                <p>{status.receiver.fullname}</p>
                                                            </div>}
                                                    </div>
                                                    <div className="time-status">
                                                        {(() => {
                                                            const timeString = status.time;
                                                            const date = new Date(timeString);
                                                            const now = new Date();
                                                            const timeDiffInMinutes = Math.floor((now - date) / (1000 * 60));
                                                            let timeAgo;

                                                            if (timeDiffInMinutes === 0) {
                                                                timeAgo = "Just now";
                                                            }
                                                            else if (timeDiffInMinutes < 60) {
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
                                                                <div className="post-privacy-change">
                                                                    <span>{timeAgo}</span>
                                                                    {status?.visibility === 'public' && (
                                                                        <i className="fas fa-globe-americas" style={{ color: '#65676B', cursor: 'pointer', padding: "5px", fontSize: "smaller" }} />
                                                                    )}
                                                                    {status?.visibility === 'friend' && (
                                                                        <i className="fas fa-user-friends" style={{ color: '#65676B', cursor: 'pointer', padding: "5px", fontSize: "smaller" }} />
                                                                    )}
                                                                    {status?.visibility === 'private' && (
                                                                        <i className="fas fa-lock" style={{ color: '#65676B', cursor: 'pointer', padding: "5px", fontSize: "smaller" }} />
                                                                    )}
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="post-user">
                                                <p className="post-text">{status.content}</p>
                                                {status.images?.length > 0 && (
                                                    <div className={`post-image ${status.images.length === 4 ? 'four' :
                                                        status.images.length === 5 ? 'five' :
                                                            status.images.length > 2 && status.images.length !== 4 ? 'three' : ''
                                                    }`}>
                                                        {status.images.map((image, imageIndex) => (
                                                            <img src={image.imageUrl} alt="Post Image" className="post-img" key={imageIndex} />
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="interact-status" style={{ display: "flex", justifyContent: "space-between" }}>
                                                    {status.accountLike === 0 ? (
                                                            <div>
                                                            </div>
                                                        ) :
                                                        (status.accountLike > 0 && status.accountLike < 3 ? (
                                                            <div className="activity-icons">
                                                                <BiSolidLike style={{ color: "rgb(27 97 255)" }} className="like-icon" />
                                                                <span style={{ marginLeft: "5px" }}>
                                                        {status.listUserLike.map((userLike) => {
                                                            if (user.username === userLike?.user?.username) {
                                                                return "You";
                                                            } else {
                                                                return userLike?.user?.fullname;
                                                            }
                                                        }).join(" and ")} liked
                                                    </span>
                                                            </div>
                                                        ) : (
                                                            status.accountLike > 2 && (
                                                                <div className="activity-icons">
                                                                    <BiSolidLike style={{ color: "rgb(27 97 255)" }} className="like-icon" />
                                                                    <span style={{ marginLeft: "5px" }}>{status?.accountLike} people liked</span>
                                                                </div>
                                                            )
                                                        ))}
                                                    {status.commentCount.commentCount < 1 ? (
                                                        <div></div>
                                                    ) : (
                                                        <div>
                                                            <span>{status?.commentCount?.commentCount} comment</span>
                                                        </div>
                                                    )
                                                    }

                                                </div>
                                            </div>

                                            <div className="post-action">
                                                <div className="post-like">
                                                    <Like
                                                        key={status.id}
                                                        postId={status.id}
                                                        countLike={status.acountLike}
                                                        checkStatusLike={status.isLiked}
                                                        isCountLike={isCountLike}
                                                        setIsCountLike={setIsCountLike}
                                                        onLikeClick={handleLikeClick}
                                                        load={load}
                                                    ></Like>
                                                </div>
                                                <div className="post-comment">
                                                    <Button variant="light" onClick={() => handleToggleComment(index)}>
                                                        <i className="far fa-comment-alt"></i>
                                                        <span>Comment</span>
                                                    </Button>
                                                </div>
                                            </div>
                                            {visibleCommentIndex === index && (
                                                <CommentContextProvider postId={status.id} reloadHome={reloadHome}>
                                                    <Comment post={status} postVisi={status.visibility} postSenderId={status.sender.id} postId={status.id} showComment={showComment} setShowComment={setShowComment} />
                                                </CommentContextProvider>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="sidebar-right-status"></div>
                    </div>
                </div>
            ) : null}

        </>
    )
}
