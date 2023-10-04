import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { BiSolidLike } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { CommentContextProvider } from "../../context/CommentContext";
import { PostContext } from "../../context/PostContext";
import { SearchContext } from "../../context/SearchContext";
import "../../styles/search-bar/SearchPost.css";
import Comment from "../common/Comment";
import Like from "../common/Like";
import Navbar from "../common/Navbar";
import $ from "jquery";
import { AuthContext } from "../../context/AuthContext";
import { baseUrl } from "../../utils/services";

export default function SearchPost() {
    const { searchTerm } = useContext(SearchContext);
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [isCountLike, setIsCountLike] = useState([]);

    const { postUser, postImageUser, fetchPostUser, fetchImagePostUser } = useContext(PostContext);
    const [listStatus, setListStatus] = useState([])

    console.log(listStatus);

    const handleLikeClick = async () => {
        axios.get(`${baseUrl}/status/content/${user.id}/?content=${searchTerm}`).then((res) => {
            setListStatus(res.data);   
        });
        fetchPostUser();
    };
    
    const goProfile = (username) => {
        navigate(`/${username}`);
    };

    //cmt
    const [showComment, setShowComment] = useState(false);

    const [visibleCommentIndex, setVisibleCommentIndex] = useState(-1);
    const handleToggleComment = (index) => {
        setShowComment(true)
        setVisibleCommentIndex(visibleCommentIndex === index ? -1 : index);
    };

    const handleAddComment = (postId, newComment) => {
        const updatedListStatus = listStatus.map((post) => {
            if (post.id === postId) {
                const updatedCommentCount = post.commentCount.commentCount + 1;
                console.log(updatedCommentCount)
                return {
                    ...post,
                    commentCount: updatedCommentCount,
                };
            }
            return post;
        });
        setListStatus(updatedListStatus);
    };

    useEffect(() => {
        axios.get(`${baseUrl}/status/content/${user.id}/?content=${searchTerm}`).then((res) => {
            setListStatus(res.data)
        });
    }, [searchTerm])

    return (
        <>
            <Navbar style={{ width: "200px" }}></Navbar>
            <div style={{ border: "1px solid" }}>
                <p>1</p>
                <p>1</p>
            </div>
            <div className="container-status">
                <div className="sidebar-left-status">
                    <h5 className="search-notification">Your posts by keywords : "{searchTerm}"</h5></div>
                <div className="mid-status">
                    <div>
                        {listStatus.map((item, index) => (
                            <div style={{ marginBottom: "30px" }} className="index-content-status" key={index}>
                                <div className="post-container">
                                    <div className="user-profile" style={{ justifyContent: "unset" }}>
                                        <div className="user-avatar" onClick={() => goProfile(item.sender?.username)}>
                                            <img src={item.sender?.avatar} alt="User Avatar" />
                                        </div>
                                        <div>

                                            <div className="post-user-name">
                                                <p>{item.sender.fullname}</p>
                                            </div>

                                            <div className="time-status">
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
                                                        <div className="post-privacy-change">
                                                            <span>{timeAgo}</span>

                                                            {item?.visibility === 'public' && (
                                                                <i className="fas fa-globe-americas" style={{ color: '#65676B', cursor: 'pointer', padding: "5px", fontSize: "smaller" }} />
                                                            )}
                                                            {item?.visibility === 'friend' && (
                                                                <i className="fas fa-user-friends" style={{ color: '#65676B', cursor: 'pointer', padding: "5px", fontSize: "smaller" }} />
                                                            )}
                                                            {item?.visibility === 'private' && (
                                                                <i className="fas fa-lock" style={{ color: '#65676B', cursor: 'pointer', padding: "5px", fontSize: "smaller" }} />
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="post-user">

                                        <p className="post-text">{item.content}</p>

                                            {item.images?.length > 0 && (
                                                <div className={`post-image ${item.images.length === 4 ? 'four' :
                                                    item.images.length === 5 ? 'five' :
                                                        item.images.length > 2 && item.images.length !== 4 ? 'three' : ''
                                                }`}>
                                                    {item.images.map((image, imageIndex) => (
                                                        <img src={image.imageUrl} alt="Post Image" className="post-img"
                                                             key={imageIndex}/>
                                                    ))}
                                                </div>
                                            )}

                                        <div className="interact-status"
                                             style={{display: "flex", justifyContent: "space-between"}}>
                                            {item.accountLike === 0 ? (
                                                    <div>
                                                    </div>
                                                ) :(item.accountLike > 0 && item.accountLike < 3 ? (
                                                <div className="activity-icons">
                                                    <BiSolidLike style={{color: "rgb(27 97 255)"}}
                                                                 className="like-icon"/>
                                                    <span style={{marginLeft: "5px"}}

                                                    >
                                                    {item.listUserLike.map((userLike) => {
                                                        if (item.receiver.username === userLike?.user?.username) {
                                                            return "You";
                                                        } else {
                                                            return userLike?.user?.fullname;
                                                        }
                                                    }).join(" and ")} liked
                                                </span>
                                                </div>
                                            ) : (
                                                item.accountLike > 2 && (
                                                    <div className="activity-icons">
                                                        <BiSolidLike style={{color: "rgb(27 97 255)"}}
                                                                     className="like-icon"/>
                                                        <span
                                                            onClick={() => handleLikeClick()}
                                                            style={{marginLeft: "5px"}}>{item?.accountLike} people liked</span>
                                                    </div>
                                                )
                                            ))}{ item.commentCount.commentCount < 1 ? (
                                            <div></div>
                                        ) : (
                                            <div>
                                                <span>{item?.commentCount?.commentCount} comment</span>
                                            </div>)}
                                        </div>

                                    </div>

                                    <div className="post-action">

                                        <div className="post-like">
                                            <Like key={item.id} postId={item.id} countLike={item.acountLike} checkStatusLike={item.isLiked}
                                                isCountLike={isCountLike} setIsCountLike={setIsCountLike}
                                                onLikeClick={handleLikeClick}>
                                            </Like>
                                        </div>

                                        <div className="post-comment">
                                            <Button  variant="light" onClick={() => handleToggleComment(index)}>
                                                <i className="far fa-comment"></i>
                                                <span>Comment</span>
                                            </Button>
                                        </div>

                                    </div>
                                    {visibleCommentIndex === index && (
                                        <CommentContextProvider postId={item.id} >
                                            <Comment cmt={handleAddComment} postSenderId ={item.sender.id} postId={item.id} showComment={showComment} setShowComment={setShowComment} />
                                        </CommentContextProvider>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sidebar-right-status"></div>
            </div>

        </>
    )
}
