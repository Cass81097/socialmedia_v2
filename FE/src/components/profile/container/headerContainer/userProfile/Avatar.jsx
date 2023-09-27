import axios from "axios";
import React, { useContext, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../../../context/AuthContext";
import { ProfileContext } from "../../../../../context/ProfileContext";
import uploadImage from "../../../../../hooks/Upload";
import "../../../../../styles/modalAvatar.css";
import "../../../../../styles/upload.css";
import { baseUrl } from "../../../../../utils/services";
import { CometChatContext } from "../../../../../context/CometChatContext";

export default function Avatar() {
    const { cometChat } = useContext(CometChatContext)
    const { user, setUser } = useContext(AuthContext);
    const { userProfile, countFriend, fetchUserProfile } = useContext(ProfileContext);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [imageSrc, setImageSrc] = useState(null);

    const handleSubmit = async () => {
        const newData = {
            avatar: imageSrc,
        };

        try {
            const response = await axios.put(`${baseUrl}/users/avatar/${user.id}`, newData);
            setShow(false);
            const userData = JSON.parse(localStorage.getItem("User"));
            userData.avatar = newData.avatar;
            localStorage.setItem("User", JSON.stringify(userData));
            fetchUserProfile();
            setUser(JSON.parse(localStorage.getItem("User")));

            // Handle Change Avatar Cometchat
            const authKey = `${process.env.REACT_APP_COMETCHAT_AUTH_KEY}`;
            const cometId = new cometChat.User(user.id.toString());
            cometId.setAvatar(imageSrc);
            const responseComet = await cometChat.updateUser(cometId, authKey);
            console.log(responseComet);
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const handleImageUpload = (e) => {
        uploadImage(e, setImageSrc);
    };

    const getRandomFriends = () => {
        if (countFriend.length <= 3) {
            return countFriend;
        }

        const shuffledFriends = [...countFriend];

        for (let i = shuffledFriends.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledFriends[i], shuffledFriends[j]] = [shuffledFriends[j], shuffledFriends[i]];
        }
        return shuffledFriends.slice(0, 3);
    };

    const randomFriends = getRandomFriends();

    const goPageAvatar = (imageUrl) => {
        window.open(imageUrl, "_blank");
    };

    return (
        <div className="pd-left">
            <div className="pd-row">
                <div style={{ position: "relative" }}>
                    <div className="avatar-container" >
                        <img className="pd-image" src={userProfile[0]?.avatar} alt="avatar" style={{ cursor: "pointer" }} onClick={() => goPageAvatar(userProfile[0]?.avatar)} />
                        {userProfile[0]?.username && user.username && userProfile[0]?.username === user.username ? (
                            <div className="change-avatar" onClick={handleShow}>
                                <i className="fas fa-camera"></i>
                            </div>
                        ) : ""}
                    </div>
                </div>

                <div className="user-profile-status">
                    <h3>{userProfile[0]?.fullname}</h3>
                    <p>{countFriend.length} friends</p>
                    <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                        {randomFriends.map((friend) => (
                            <div className="profile-friend-avatar" key={friend.id}>
                                <Link to={`/${friend.username}`}>
                                    <img src={friend.avatar} alt={friend.fullname} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="modal-avatar-title">Update Avatar :</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group mb-avatar">
                        <label htmlFor="formFile" className="form-label inputCode"><span></span></label>
                        <input type="file" id="image-upload" onChange={handleImageUpload} hidden />
                        <label htmlFor="image-upload" className="file-upload-button"><span>+ Upload Avatar</span></label>
                        <span id="file-name" style={{ fontSize: '0px' }}></span>
                        <div className="info-progress">
                            <div className="progress">
                                <div id="upload-progress"
                                    className="progress-bar progress-bar-striped progress-bar-animated"
                                    role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                    style={{ width: '0' }} hidden="">0%
                                </div>
                            </div>
                            <div className="image-url" hidden>
                                <img src="" alt="" id="image-url"></img>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}