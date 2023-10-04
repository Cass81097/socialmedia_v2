import axios from "axios";
import $ from "jquery";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap"; 
import Modal from "react-bootstrap/Modal";
import InputEmoji from "react-input-emoji";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CommentContext } from "../../context/CommentContext";
import { PostContext } from "../../context/PostContext";
import { ProfileContext } from "../../context/ProfileContext";
import "../../styles/user/post/comment-status.css";
import { baseUrl } from "../../utils/services";

export default function Comment({ cmt, postSenderId, showComment, postVisi, postId }) {
    const { user } = useContext(AuthContext)
    const lastCommentRef = useRef(null);
    const { postUser, fetchPostUser } = useContext(PostContext)
    const { checkFriendStatus } = useContext(ProfileContext)
    const navigate = useNavigate()

    const {
        textMessage,
        handleInputChange,
        handleEditMessage,
        commentList,
        handleSendMessage,
        handleDeleteMessage,
        handleCommentChange,
        textComment,
    } = useContext(CommentContext);

    const [showAllComments, setShowAllComments] = useState(false);
    const [showAlert, setIsShowAlert] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [showEditStatus, setShowEditStatus] = useState(false);

    const shouldDisplayCommentInput = postUser.some((user) => user.visibility === "friend" && user.id === postSenderId);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timeEdit, setTimeEdit] = useState(null)

    const handleCloseAlert = () => {
        setIsShowAlert(false);
    }
    const handleShowAlert = (postId) => {
        setPostIdToDelete(postId)
        setIsShowAlert(true);
    }

    const showModalTimeEdit = (time) => {
        setIsModalOpen(true)
        setTimeEdit(time)
    }
    const handleCloseTimeEdit = () => {
        setIsModalOpen(false);

    }

    let currentMenuIndex = null;
    const showMenu = (index) => {
        if (currentMenuIndex === index) {
            $(`.comment-menu-${index}`).hide();
            currentMenuIndex = null;
            return;
        }
        if (currentMenuIndex !== null) {
            $(`.comment-menu-${currentMenuIndex}`).hide();
        }
        $(`.comment-menu-${index}`).show();
        currentMenuIndex = index;
        console.log(currentMenuIndex);
    };

    const toggleShowAll = () => {
        setShowAllComments(true);
    };

    const closeShowAll = () => {
        setShowAllComments(false)
    }

    let latestComment = null;
    commentList.forEach((comment) => {
        const commentTime = new Date(comment.time);
        if (!latestComment || commentTime > new Date(latestComment.time)) {
            latestComment = comment;
        }
        // console.log(latestComment);
    });

    // Xoa comment
    const handleDelete = (id) => {
        handleDeleteMessage(id);
        setIsShowAlert(false);
        fetchPostUser();
    }


    const handlePost = async () => {
        await handleSendMessage()
        if (showAllComments === false) {
            setShowAllComments(true)
            await lastCommentRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        cmt()
    }

    // edit
    const handleStartEdit = (commentId, commentContent) => {
        console.log(commentId, "commentID");
        console.log(commentContent, "commentContent");
        setShowEditStatus(true);
        setEditingCommentId(commentId);
    };

    useEffect(() => {
        console.log(editingCommentId);
    }, [editingCommentId]);

    const handleSubmitEdit = () => {
        handleEditMessage(editingCommentId, textComment)
        // setIsShowAlert(false)
        // setIsEditing(false)
        setShowEditStatus(false)
    }

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && showEditStatus) {
                setShowEditStatus(false);
            }
        };

        window.addEventListener('keydown', handleEscKey);

        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, [showEditStatus]);


    // img

    // check friend
    const [checkFriend, setCheckFriend] = useState([])
    const userLogin = JSON.parse(localStorage.getItem("User"))

    useEffect(() => {
        axios.get(`${baseUrl}/friendShips/friendList/${userLogin.id}`).then((res) => {
            setCheckFriend(res.data)
        })
    }, [])

    const goProfile = (username) => {
        navigate(`/${username}`);
    }

    return (
        <>
            {showComment && (

                <div className="comment-section">
                    {showAllComments ?
                        (
                            <div className="display-comment">
                                {commentList.map((item, index) => (
                                    <div className="all-comments" key={item.id} ref={index === commentList.length - 1 ? lastCommentRef : null}>
                                        <div className="comments">
                                            <div className="avatar-comments" style={{ cursor: "pointer" }} onClick={() => goProfile(item?.user.username)}>
                                                <img className="avatar-comments"
                                                    src={item?.user.avatar}
                                                    alt="" />
                                            </div>
                                            <div className="detail-comments">
                                                {editingCommentId === item.id && showEditStatus ?
                                                    (
                                                        <div style={{ padding: "10px" }}>
                                                            <div
                                                                className="nameUser-comments">{item.user?.fullname}</div>
                                                            <div className="edit-comment-form">

                                                                <textarea
                                                                    className="textarea-comment"

                                                                    spellCheck="false"
                                                                    defaultValue={item?.content}
                                                                    onChange={handleCommentChange}
                                                                />
                                                                <i
                                                                    className="fas fa-paper-plane"
                                                                    onClick={handleSubmitEdit}></i>
                                                            </div>
                                                        </div>

                                                    ) : (
                                                        <div style={{ padding: "10px" }}>
                                                            <div
                                                                className="nameUser-comments">{item.user?.fullname}</div>
                                                            <p>{item.content}</p>
                                                        </div>)}
                                            </div>
                                            <div className="options-comments">
                                                {item.user.id !== user.id ? (
                                                    <></>
                                                ) : (<>
                                                    <div style={{ marginTop: "12px", marginLeft: "5px" }}
                                                        className="user-action-post" onClick={() => showMenu(index)}>

                                                        <Button variant="light">
                                                            <i className="fas fa-ellipsis-h"></i>
                                                        </Button>
                                                        <ol className={`comment-menu-${index} show-comment-menu`}
                                                            style={{ display: "none" }}>
                                                            <li onClick={() => {
                                                                handleStartEdit(item.id, item.content)
                                                            }}>

                                                                <i className="far fa-edit"></i>
                                                                <span>Edit</span>
                                                            </li>

                                                            <li onClick={() => {
                                                                handleShowAlert(item.id)
                                                            }}>
                                                                <i className="far fa-trash-alt"></i>
                                                                <span>Delete</span>
                                                            </li>
                                                        </ol>
                                                    </div>
                                                </>)
                                                }
                                            </div>
                                        </div>
                                        <div className="detail-comments-img">

                                        </div>
                                        <div className="actions-status">

                                            {(() => {
                                                const timeString = item.time;
                                                const date = new Date(timeString);
                                                const now = new Date();
                                                const timeDiffInMinutes = Math.floor((now - date) / (1000 * 60));
                                                let timeAgo;
                                                if (timeDiffInMinutes === 0) {
                                                    timeAgo = "Just now";
                                                } else if (timeDiffInMinutes === -1) {
                                                    timeAgo = "Just now"
                                                }
                                                else if (timeDiffInMinutes < 60) {
                                                    timeAgo = `${timeDiffInMinutes}m`;
                                                } else {
                                                    const hours = Math.floor(timeDiffInMinutes / 60);
                                                    const minutes = timeDiffInMinutes % 60;
                                                    if (hours >= 24) {
                                                        timeAgo = "1 day ago";
                                                    } else if (minutes === 0) {
                                                        timeAgo = `${hours} hours ago`;
                                                    } else {
                                                        timeAgo = `${hours} hours ago`;
                                                    }
                                                }

                                                return (
                                                    <div>
                                                        <span>{timeAgo}</span>
                                                    </div>
                                                );
                                            })()}
                                            {item.timeEdit !== null ? (
                                                <p style={{ marginLeft: "10px" }}
                                                    onClick={() => { showModalTimeEdit(item.timeEdit.toString()) }}>
                                                    Edited</p>
                                            ) : (<></>)}


                                        </div>
                                    </div>
                                ))}
                                {commentList.length === 1 ? (
                                    <div></div>) : (
                                    <div className="show-more-comments">
                                        <p onClick={closeShowAll}>Hide comment</p>
                                    </div>)}
                            </div>
                        ) : (
                            <div>

                                {commentList.length === 0 ? (
                                    <div></div>
                                ) : (

                                    // Handle comment
                                    <div>
                                        {commentList.length === 1 ? (<></>) : (
                                            <div className="show-more-comments">
                                                <p onClick={toggleShowAll}>View more comments</p>
                                            </div>)}
                                        <div className="all-comments">
                                            <div className="comments">
                                                <div className="avatar-comments" style={{ cursor: "pointer" }} onClick={() => goProfile(latestComment?.user.username)}>
                                                    <img src={latestComment?.user?.avatar} alt="" />
                                                </div>
                                                <div className="detail-comments">
                                                    {showEditStatus ?
                                                        (
                                                            <div style={{ padding: "10px" }}>
                                                                <div
                                                                    className="nameUser-comments">{latestComment.user?.fullname}</div>
                                                                <div className="edit-comment-form">
                                                                    {/* <InputEmoji
                                                                        value={latestComment?.content}
                                                                        onChange={(value) => {
                                                                            setEditingCommentContent({
                                                                                ...editingCommentContent,
                                                                                [editingCommentId]: value
                                                                            });
                                                                        }}
                                                                    /> */}
                                                                    <textarea
                                                                        className="textarea-comment"
                                                                        spellCheck="false"
                                                                        defaultValue={latestComment?.content}
                                                                        onChange={handleCommentChange}
                                                                    />
                                                                    {/* <Picker /> */}
                                                                    <i
                                                                        className="fas fa-paper-plane"
                                                                        onClick={handleSubmitEdit}></i>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div style={{ padding: "10px" }}>
                                                                <div
                                                                    className="nameUser-comments">{latestComment?.user?.fullname}</div>
                                                                <p>{latestComment?.content}</p>
                                                            </div>
                                                        )}
                                                </div>
                                                <div className="options-comments">
                                                    {latestComment.user.id !== user.id ? (
                                                        <div></div>
                                                    ) : (

                                                        <div style={{ marginTop: "5px" }} className="user-action-post"
                                                            onClick={() => showMenu(latestComment?.id)}>
                                                            <Button variant="light">
                                                                <i className="fas fa-ellipsis-h"></i>
                                                            </Button>
                                                            <ol className={`comment-menu-${latestComment?.id} show-comment-menu`}
                                                                style={{ display: "none" }}>

                                                                <li onClick={() => {
                                                                    handleStartEdit(latestComment?.id, latestComment?.content)
                                                                }}>
                                                                    <i className="far fa-edit"></i>
                                                                    <span>Edit</span>
                                                                </li>

                                                                <li onClick={() => {
                                                                    handleShowAlert(latestComment?.id)
                                                                }}>
                                                                    <i className="far fa-trash-alt"></i>
                                                                    <span>Delete</span>
                                                                </li>
                                                            </ol>
                                                        </div>)}
                                                </div>
                                            </div>

                                            <div className="actions-status">
                                                {/*<p>Thích</p>*/}
                                                {/*<p>Bình luận</p>*/}

                                                {(() => {
                                                    const timeString = latestComment?.time;
                                                    const date = new Date(timeString);
                                                    const now = new Date();
                                                    const timeDiffInMinutes = Math.floor((now - date) / (1000 * 60));
                                                    let timeAgo;
                                                    if (timeDiffInMinutes === 0) {
                                                        timeAgo = "Just now";
                                                    } else if (timeDiffInMinutes === -1) {
                                                        timeAgo = "Just now";
                                                    } else if (timeDiffInMinutes < 60) {
                                                        timeAgo = `${timeDiffInMinutes}m`;
                                                    } else {
                                                        const hours = Math.floor(timeDiffInMinutes / 60);
                                                        const minutes = timeDiffInMinutes % 60;
                                                        if (hours >= 24) {
                                                            timeAgo = "1 day ago";
                                                        } else if (minutes === 0) {
                                                            timeAgo = `${hours} hours ago`;
                                                        } else {
                                                            timeAgo = `${hours} hours ago`;
                                                        }
                                                    }

                                                    return (
                                                        <div>
                                                            <span>{timeAgo}</span>
                                                        </div>
                                                    );
                                                })()}
                                                {latestComment.timeEdit !== null ? (
                                                    <p style={{ marginLeft: "10px" }}
                                                        onClick={() => { showModalTimeEdit(latestComment?.timeEdit.toString()) }}>
                                                        Edited</p>
                                                ) : (<></>)}
                                            </div>
                                        </div>
                                    </div>)}

                            </div>


                        )}


                    {!checkFriend.some((c) => {
                        return (
                            c.user1.id === postSenderId || c.user2.id === postSenderId
                        )
                    }) && postUser[0]?.visibility !== "friend" && checkFriendStatus?.status !== "friend" && user.id !== postSenderId ? (
                        <div></div>
                    ) : (
                        <div className="enter-comment">
                            <div className="avt-comment" style={{ cursor: "pointer" }} onClick={() => goProfile(user?.username)}>
                                <img
                                    className="avatar-comments"
                                    src={user?.avatar}
                                    alt=""
                                />
                            </div>
                            <div className="text-comment">
                                <InputEmoji
                                    value={textMessage}
                                    onChange={handleInputChange}

                                />

                                {textMessage && (
                                    <div className="send-comments">
                                        <i style={{ fontSize: "23px" }} className="fas fa-paper-plane" onClick={(() => {
                                            handlePost()
                                        })}></i>
                                    </div>
                                )}
                            </div>
                        </div>)}

                    <Modal show={showAlert} onHide={handleCloseAlert} centered>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ transform: "translateX(170px)" }}>Confirm</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete this comment ?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseAlert}>
                                No
                            </Button>
                            <Button variant="primary" onClick={() => handleDelete(postIdToDelete)}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={isModalOpen} onHide={handleCloseTimeEdit} centered>
                        <Modal.Body>
                            Last edit time : {timeEdit}
                        </Modal.Body>
                    </Modal>

                </div>
            )}
        </>
    );
}