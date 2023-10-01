import $ from 'jquery';
import React, { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { ProfileContext } from "../../../../context/ProfileContext";
import "../../../../styles/modalNavbar.css";
import { baseUrl, getRequest, postRequest } from "../../../../utils/services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function NavbarContainer(props) {
    const { isPost, setIsPost, isFriend, setIsFriend, setIsProfile, isProfile } = props
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { userProfile, checkFriendStatus } = useContext(ProfileContext);
    const [friendStatus, setFriendStatus] = useState(null);
    const [blocklist, setBlockList] = useState([])
    const [show, setShow] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertUser, setIsShowAlertUser] = useState(false);
    const [userIndex, setUserIndex] = useState(null);

    const toastOptions = {
        position: "top-center",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    };

    const handleClose = () => {
        setShow(false);
        setShowAlert(false);
    }

    const handleCloseAlert = () => {
        setShowAlert(false);
    }

    const handleCloseAlertUser = () => {
        setIsShowAlertUser(false);
    }

    const handleShowAlertUser = () => {
        setIsShowAlertUser(true);
        $('.profile-block').hide();
    }

    const handleShow = () => {
        setShow(true);
        $('.profile-block').hide();
    }

    const handleShowAlert = (index) => {
        setShowAlert(true);
        setUserIndex(index);
    }

    const handleFriendClick = () => {
        setIsFriend(true);
        setIsPost(false);
        setIsProfile(false)
    };

    const handlePostClick = () => {
        setIsFriend(false);
        setIsProfile(false)
        setIsPost(true);
    };

    const handleProfileClick = () => {
        setIsFriend(false);
        setIsPost(false);
        setIsProfile(true)
    };

    const fetchBlockList = async () => {
        try {
            const response = await getRequest(`${baseUrl}/friendShips/blocklist/${user?.id}`)
            setBlockList(response);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách người dùng bị chặn:', error);
        }
    };

    const showInfo = () => {
        $('.profile-block').toggle();
    };

    const handleBlockUser = async () => {
        try {
            const response = await postRequest(`${baseUrl}/friendShips/block/${user.id}/${userProfile[0]?.id}`)
            setFriendStatus({ status: "block" });
            navigate(`/${user.username}`);
            setIsShowAlertUser(false);
            toast.success("Block successful", toastOptions);
            fetchBlockList();

            // Comet UnFriend
            if (!userProfile[0]?.id || !user?.id) {
                return;
            }

            const cometChatAppId = process.env.REACT_APP_COMETCHAT_APP_ID;
            const cometChatAppRegion = process.env.REACT_APP_COMETCHAT_REGION;
            const cometChatApiKey = process.env.REACT_APP_COMETCHAT_API_KEY;
            const url = `https://${cometChatAppId}.api-${cometChatAppRegion}.cometchat.io/v3/users/${user?.id}/friends`;
            const options = {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    appId: cometChatAppId,
                    apiKey: cometChatApiKey,
                },
                body: JSON.stringify({
                    friends: [userProfile[0]?.id]
                }),
            };
            const responseCometUnfriend = await fetch(url, options);
        } catch (error) {
            console.error("Error canceling friend request:", error);
        }
    };

    const handleUnblockUser = async (userIndex) => {
        try {
            const response = await postRequest(`${baseUrl}/friendships/unfriend/${user.id}/${blocklist[userIndex]?.id}`)
            setFriendStatus();
            toast.success("Unblock successful", toastOptions);
            handleClose();
            fetchBlockList();
            setBlockList()
            $('.profile-block').hide();
        } catch (error) {
            console.error("Error canceling friend request:", error);
        }
    };

    useEffect(() => {
        const fetchBlockList = async () => {
            try {
                const response = await getRequest(`${baseUrl}/friendShips/blocklist/${user?.id}`)
                setBlockList(response);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách người dùng bị chặn:', error);
            }
        };
        fetchBlockList();
    }, [user?.id]);

    return (
        <>
            <div className="all-task">
                <div className="left-all-task">
                    <div className="left-all-task">
                        <div className={`post-task ${isPost ? 'select1' : ''}`}>
                            <Link onClick={handlePostClick}>
                                <span style={isPost ? { color: 'rgb(24, 118, 242)' } : {}}>Posts</span>
                            </Link>
                        </div>
                        <div className={`profile-task ${isProfile ? 'select1' : ''}`}>
                            <Link onClick={handleProfileClick}>
                                <span style={isProfile ? { color: 'rgb(24, 118, 242)' } : {}}>About</span>
                            </Link>
                        </div>
                        <div className={`profile-task ${isFriend ? 'select1' : ''}`}>
                            <Link onClick={handleFriendClick}>
                                <span style={isFriend ? { color: 'rgb(24, 118, 242)' } : {}}>Friends</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="icon-block">
                    <button
                        type="button"
                        className="btn btn-secondary btn-edit btn-edit-friend"
                        style={{ background: "#dbdbdc" }}
                        onClick={() => showInfo()}
                    >
                        <i className="fas fa-ellipsis-h" style={{ color: "black" }} />
                    </button>
                    <ol className="profile-block" style={{ display: "none" }}>
                        {user?.id !== userProfile[0]?.id ? (
                            <li onClick={handleShowAlertUser}>
                                <i className="fas fa-user-lock" />Block user
                            </li>
                        ) : (
                            <li onClick={handleShow}>
                                <i className="fas fa-list" />Block list
                            </li>
                        )}
                    </ol>
                </div>

                {/* Modal Block */}
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Block list</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="modal-block-top">
                            <p>Once you block someone, that person will no longer be able to see what you post on your timeline, tag you, invite you to events or groups, start conversations with you, or add you as a friend. Note: Does not include apps, games, or groups that you both belong to..</p>
                        </div>
                        <div className="modal-block-container">
                            {blocklist && blocklist.length > 0 ? (
                                blocklist.map((blockedUser, index) => (
                                    <div className="modal-block-main" key={blockedUser.id}>
                                        <div className="modal-block-user">
                                            <div className="modal-block-avatar">
                                                <img src={blockedUser?.avatar} alt="" />
                                            </div>
                                            <p>{blockedUser?.fullname}</p>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-edit btn-edit-friend block-edit"
                                            style={{ background: "#dbdbdc" }}
                                            onClick={() => handleShowAlert(index)}
                                        >
                                            <i className="fas fa-unlock-alt" style={{ color: "black" }}>
                                                <span style={{ fontWeight: "600", marginLeft: "5px" }}>
                                                    Unblock
                                                </span>
                                            </i>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className='none-block'>No user blocked</p>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal Confirm Block */}
                <Modal show={showAlert} onHide={handleCloseAlert} centered>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ transform: "translateX(185px)" }}>Confirm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body  style={{ textAlign: "center", fontSize: "20px", fontWeight: "600" }}>Are you sure to unblock ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAlert}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => handleUnblockUser(userIndex)}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal Block User  */}

                <Modal show={showAlertUser} onHide={handleCloseAlertUser} centered>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ transform: "translateX(185px)" }}>Confirm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body  style={{ textAlign: "center", fontSize: "20px", fontWeight: "600" }}>Are you sure to block ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAlertUser}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => handleBlockUser()}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
            <ToastContainer />

        </>
    )
}


