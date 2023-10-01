import React, { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PostContext } from "../../context/PostContext";
import { baseUrl, postRequest, putRequest, getRequest } from "../../utils/services"
import { BiLike } from 'react-icons/bi';
import { ProfileContext } from "../../context/ProfileContext";
import { AuthContext } from "../../context/AuthContext";

export default function LikeList(props) {
    const navigate = useNavigate();
    const { showLikeList, setShowLikeList, likeListIndex } = props;
    const { user } = useContext(AuthContext)
    const { postUser, postImageUser, fetchPostUser, fetchImagePostUser } = useContext(PostContext);
    const [checkFriendStatus, setCheckFriendStatus] = useState([]);

    useEffect(() => {
        const fetchFriendStatus = async (userLike) => {
            try {
                const userId = userLike.user.id;
                const response = await getRequest(`${baseUrl}/friendShips/checkStatusByUserId/${user?.id}/${userId}`);
                console.log(response);
                setCheckFriendStatus((prevStatus) => [...prevStatus, response]);
            } catch (error) {
                console.error("Error fetching user profiles:", error);
            }
        };

        postUser[likeListIndex]?.listUserLike.forEach((userLike) => {
            fetchFriendStatus(userLike);
        });
    }, [likeListIndex]);

    const handleLikeListClose = () => {
        setShowLikeList(false);
    }

    const goProfileUser = (username) => {
        setShowLikeList(false);
        navigate(`/${username}`);
    }

    return (
        <>
            <Modal show={showLikeList} onHide={handleLikeListClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Like list :</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-like-container">
                        {postUser[likeListIndex]?.listUserLike.map((userLike, index) => {
                            const friendStatus = checkFriendStatus[index]?.status;
                            return (
                                <div className="modal-like-main" key={userLike?.user.id}>
                                    <div className="modal-like-user">
                                        <div style={{ position: "relative" }}>
                                            <div className="modal-like-avatar">
                                                <img src={userLike?.user.avatar} alt="" onClick={() => goProfileUser(userLike?.user.username)} />
                                            </div>
                                            <div className="icon-avatar-like-list">
                                                <i className="fas fa-thumbs-up" style={{ color: "white", fontSize: "13px" }}></i>
                                            </div>
                                        </div>
                                        <p onClick={() => goProfileUser(userLike?.user.username)}>{userLike?.user.fullname}</p>
                                    </div>
                                    {friendStatus === "friend" ? (
                                        <button type="button" className="btn btn-secondary btn-edit like-edit">
                                            <i className="fas fa-user">
                                                <span>Friend</span>
                                            </i>
                                        </button>
                                    ) : friendStatus === "pending" ? (
                                        <button type="button" className="btn btn-secondary btn-edit like-edit">
                                            <i className="fas fa-user">
                                                <span>Pending</span>
                                            </i>
                                        </button>
                                    ) : user?.id === userLike?.user?.id ? (
                                        null
                                    ) : 
                                    <button type="button" className="btn btn-secondary btn-edit like-edit">
                                        <i className="fas fa-user-plus">
                                            <span>Add Friend</span>
                                        </i>
                                    </button>}
                                </div>
                            );
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleLikeListClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}