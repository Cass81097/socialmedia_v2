import React, { useContext, useEffect, useRef, useState } from "react";
import "../../styles/user/post/comment-status.css";
import InputEmoji, { async } from "react-input-emoji";
import { Button } from "react-bootstrap"; // Nhập Button từ react-bootstrap
import axios from "axios";
import { baseUrl, postRequest } from "../../utils/services";
import { AuthContext } from "../../context/AuthContext";
import { PostContext } from "../../context/PostContext";
import { CommentContext } from "../../context/CommentContext";
import $ from "jquery";
import Modal from "react-bootstrap/Modal";
import { ProfileContext } from "../../context/ProfileContext";
import Picker from "emoji-picker-react";

export default function Comment({ postSenderId, showComment, postVisi, postId }) {
    const { user } = useContext(AuthContext)
    const lastCommentRef = useRef(null); 
    const { postUser } = useContext(PostContext)
    const { checkFriendStatus } = useContext(ProfileContext)

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
    }
    const handlePost = async () => {
        await handleSendMessage()
        if (showAllComments === false) {
            setShowAllComments(true)
            await lastCommentRef?.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // edit
    const handleStartEdit = (commentId, commentContent) => {
        setShowEditStatus(true);
        setEditingCommentId(commentId);
    };

    useEffect(() => {
    }, [editingCommentId]);

    const handleSubmitEdit = () => {
        handleEditMessage(editingCommentId, textComment)
        // setIsShowAlert(false)
        // setIsEditing(false)
        setShowEditStatus(false)
    }

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && isEditing) {
                setIsEditing(false);
            }
        };

        window.addEventListener('keydown', handleEscKey);

        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, [isEditing]);

    // img
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
                                            <div className="avatar-comments">
                                                <img className="avatar-comments"
                                                    src={item?.user.avatar}
                                                    alt="" />
                                            </div>
                                            <div className="detail-comments">
                                                {editingCommentId === item.id && isEditing ?
                                                    (
                                                        <div>
                                                            <div
                                                                className="nameUser-comments">{item.user?.fullname}</div>
                                                            <div className="edit-comment-form">
                                                                <InputEmoji
                                                                    value={"Abc"}
                                                                    onChange={(value) => {
                                                                        setEditingCommentContent({
                                                                            ...editingCommentContent,
                                                                            [editingCommentId]: value
                                                                        });
                                                                    }}
                                                                />
                                                                <i style={{ marginTop: "35px" }}
                                                                    className="fas fa-paper-plane"
                                                                    onClick={handleSubmitEdit}></i>
                                                            </div>
                                                        </div>

                                                    ) : (
                                                        <div>
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
                                                        <ol className={`comment-menu-${index} show-post-menu`}
                                                            style={{ display: "none" }}>
                                                            <li onClick={() => {
                                                                handleStartEdit(item.id, item.content)
                                                            }}>

                                                                <i className="far fa-edit"></i>
                                                                <span>Chỉnh sửa bình luận</span>
                                                            </li>

                                                            <li onClick={() => {
                                                                handleShowAlert(item.id)
                                                            }}>
                                                                <i className="far fa-trash-alt"></i>
                                                                <span>Xóa bình luận</span>
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
                                            <p>Thích</p>
                                            <p>Bình luận</p>

                                            {(() => {
                                                const timeString = item.time;
                                                const date = new Date(timeString);
                                                const now = new Date();
                                                const timeDiffInMinutes = Math.floor((now - date) / (1000 * 60));
                                                let timeAgo;
                                                if (timeDiffInMinutes === 0) {
                                                    timeAgo = "Vừa xong";
                                                } else if (timeDiffInMinutes < 60) {
                                                    timeAgo = `${timeDiffInMinutes} phút trước`;
                                                } else {
                                                    const hours = Math.floor(timeDiffInMinutes / 60);
                                                    const minutes = timeDiffInMinutes % 60;
                                                    if (hours >= 24) {
                                                        timeAgo = "1 ngày trước";
                                                    } else if (minutes === 0) {
                                                        timeAgo = `${hours} giờ`;
                                                    } else {
                                                        timeAgo = `${hours} giờ`;
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
                                                    Đã chỉnh sửa</p>
                                            ) : (<></>)}


                                        </div>
                                    </div>
                                ))}
                                <div className="show-more-comments">
                                    <p onClick={closeShowAll}>Ẩn bình luận</p>
                                </div>
                            </div>
                        ) : (
                            <div>

                                {commentList.length === 0 ? (
                                    <div>Chưa có bình luận</div>
                                ) : (

                                    // Handle comment
                                    <div>
                                        {commentList.length === 1 ? (<></>) : (
                                            <div className="show-more-comments">
                                                <p onClick={toggleShowAll}>Hiện bình luận</p>
                                            </div>)}
                                        <div className="all-comments">
                                            <div className="comments">
                                                <div className="avatar-comments">
                                                    <img src={latestComment?.user?.avatar} alt="" />
                                                </div>
                                                <div className="detail-comments">
                                                    {showEditStatus ?
                                                        (
                                                            <div>
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
                                                                        spellCheck="false"
                                                                        defaultValue={latestComment?.content}
                                                                        onChange={handleCommentChange}
                                                                    />
                                                                    {/* <Picker /> */}
                                                                    <i style={{ marginTop: "35px" }}
                                                                        className="fas fa-paper-plane"
                                                                        onClick={handleSubmitEdit}></i>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div
                                                                    className="nameUser-comments">{latestComment?.user?.fullname}</div>
                                                                <p>{latestComment?.content}</p>
                                                            </>
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
                                                            <ol className={`comment-menu-${latestComment?.id} show-post-menu`}
                                                                style={{ display: "none" }}>

                                                                <li onClick={() => {
                                                                    handleStartEdit(latestComment?.id, latestComment?.content)
                                                                }}>
                                                                    <i className="far fa-edit"></i>
                                                                    <span>Sửa bài viết</span>
                                                                </li>

                                                                <li onClick={() => {
                                                                    handleShowAlert(latestComment?.id)
                                                                }}>
                                                                    <i className="far fa-trash-alt"></i>
                                                                    <span>Xóa bài viết</span>
                                                                </li>
                                                            </ol>
                                                        </div>)}
                                                </div>
                                            </div>

                                            <div className="actions-status">
                                                <p>Thích</p>
                                                <p>Bình luận</p>

                                                {(() => {
                                                    const timeString = latestComment?.time;
                                                    const date = new Date(timeString);
                                                    const now = new Date();
                                                    const timeDiffInMinutes = Math.floor((now - date) / (1000 * 60));
                                                    let timeAgo;
                                                    if (timeDiffInMinutes === 0) {
                                                        timeAgo = "Vừa xong";
                                                    } else if (timeDiffInMinutes < 60) {
                                                        timeAgo = `${timeDiffInMinutes} phút trước`;
                                                    } else {
                                                        const hours = Math.floor(timeDiffInMinutes / 60);
                                                        const minutes = timeDiffInMinutes % 60;
                                                        if (hours >= 24) {
                                                            timeAgo = "1 ngày trước";
                                                        } else if (minutes === 0) {
                                                            timeAgo = `${hours} giờ`;
                                                        } else {
                                                            timeAgo = `${hours} giờ`;
                                                        }
                                                    }

                                                    return (
                                                        <div>
                                                            <span>{timeAgo}</span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>)}

                            </div>


                        )}


                    {postUser[0]?.visibility !== "friend" && checkFriendStatus?.status !== "friend" && user.id !== postSenderId ? (
                        <div></div>
                    ) : (
                        <div className="enter-comment">
                            <div className="avt-comment">
                                <img
                                    className="avatar-comments"
                                    src={user.avatar}
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
                            <Modal.Title style={{ transform: "translateX(170px)" }}>Xác nhận</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Bạn có chắc chắn muốn xóa bình luận ?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseAlert}>
                                Đóng
                            </Button>
                            <Button variant="primary" onClick={() => handleDelete(postIdToDelete)}>
                                Có
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={isModalOpen} onHide={handleCloseTimeEdit} centered>
                        <Modal.Body>
                            Thời gian chỉnh sửa gần nhất : {timeEdit}
                        </Modal.Body>
                    </Modal>

                </div>
            )}
        </>
    );
}
