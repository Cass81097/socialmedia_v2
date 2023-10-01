import $ from 'jquery';
import React, { useContext, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../../context/AuthContext";
import { GroupContext } from "../../../../context/GroupContext";
import "../../../../styles/group/group-post.css";
import { baseUrl, deleteRequest } from "../../../../utils/services";
import LoadingNew from "../../../common/LoadingNew";

const GroupPostStatus = (props) => {
    const { user } = useContext(AuthContext);
    const { showStatusGroup, setIsLoading, isLoading, fetchShowStatusGroup, infoUserGroup } = useContext(GroupContext)
    const [imageSrcStatus, setImageSrcStatus] = useState(null);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    };

    // Handle Menu Post
    let currentMenuIndex = null;
    const showPostMenu = (index) => {
        if (currentMenuIndex === index) {
            $(`.post-menu-${index}`).hide();
            currentMenuIndex = null;
            return;
        }
        if (currentMenuIndex !== null) {
            $(`.post-menu-${currentMenuIndex}`).hide();
        }
        $(`.post-menu-${index}`).show();
        currentMenuIndex = index;
    };

    // Delete Post

    const [showModalDeleteStatus, setShowModalDeleteStatus] = useState(false);
    const [statusId, setStatusId] = useState(null);

    const handleCloseModalDelete = () => {
        setShowModalDeleteStatus(false);
    }

    const handleShowModalDelete = (statusId) => {
        setStatusId(statusId)
        setShowModalDeleteStatus(true);
    }

    const handleDeleteStatus = (async (statusId) => {
        setIsLoading(true);
        const response = await deleteRequest(`${baseUrl}/statusGroups/${statusId}`);
        toast.success("You have deleted post.", toastOptions);
        setIsLoading(false);
        setShowModalDeleteStatus(false);    
        await fetchShowStatusGroup();
    })

    return (
        <>
            <div>
                {showStatusGroup.map((status, index) => (
                    <div key={index} className="index-content">
                        <div className="post-container">
                            <div className="user-profile">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div className="user-avatar">
                                        <img src={status.sender?.avatar} alt="User Avatar" />
                                    </div>
                                    <div>
                                        <div className="post-user-name">
                                            <p>{status.sender?.fullname}</p>
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
                                                        <small style={{ marginLeft: "5px" }}>
                                                            <i className="fas fa-users" />
                                                        </small>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>


                                <div className="user-action-post" onClick={() => showPostMenu(index)}>
                                    <Button variant="light">
                                        <i className="fas fa-ellipsis-h"></i>
                                    </Button>

                                    {infoUserGroup?.role === "admin" || user?.id === status?.sender?.id ? (
                                        <ol className={`post-menu-${index} show-post-menu`} style={{ display: "none" }}>
                                            <li onClick={() => handleShowModalDelete(status?.id)}>
                                                <i className="far fa-trash-alt"></i>
                                                <span>Delete post</span>
                                            </li>
                                        </ol>
                                    ) : null }
                                </div>
                            </div>

                            <div className="post-user">
                                <p className="post-text">{status?.content}</p>
                                {status?.imageSrc ? (
                                    <div className="post-image-group">
                                        <img src={status?.imageSrc} alt="Post Image" className="post-img" key={index} />
                                    </div>
                                ) : null}
                            </div>

                            <div className="post-action">

                                <div className="post-like">
                                    <Button className="buttonLike" variant="light" >
                                        <i className="far fa-thumbs-up" ></i>
                                        <span className="buttonLike-span">Like</span>
                                    </Button>
                                </div>

                                <div className="post-comment">
                                    <Button variant="light">
                                        <i className="far fa-comment"></i>
                                        <span>Comment</span>
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Delete */}

            <Modal show={showModalDeleteStatus} onHide={handleCloseModalDelete} centered>
                <Modal.Header closeButton>
                    <div style={{ width: "100%", textAlign: "center" }}>
                        <Modal.Title>
                            Confirm
                        </Modal.Title>
                    </div>
                </Modal.Header>
                <Modal.Body style={{ textAlign: "center", fontWeight: "500", fontSize: "18px" }}>Are you sure to delete this Post ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalDelete}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleDeleteStatus(statusId)}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

            {isLoading ? (
                <LoadingNew></LoadingNew>
            ) : null
            }
        </>
    );
}

export default GroupPostStatus;
