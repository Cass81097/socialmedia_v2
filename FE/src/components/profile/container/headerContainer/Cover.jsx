import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { ProfileContext } from "../../../../context/ProfileContext";
import "../../../../styles/user/cover.css"
import "../../../../styles/upload.css"
import Button from 'react-bootstrap/Button';
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import uploadImage from "../../../../hooks/Upload";
import { baseUrl, getRequest } from "../../../../utils/services"

export default function Cover() {
    const { user, setUser } = useContext(AuthContext);
    const { userProfile, setUserProfile, fetchUserProfile } = useContext(ProfileContext);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [imageSrc, setImageSrc] = useState(null);

    const handleSubmit = async () => {
        const newData = {
            cover: imageSrc,
        };

        try {
            const response = await axios.put(`${baseUrl}/users/cover/${user.id}`, newData)
            setShow(false);
            const userData = JSON.parse(localStorage.getItem("User"));
            userData.cover = newData.cover;
            localStorage.setItem("User", JSON.stringify(userData));
            fetchUserProfile();
            setUser(JSON.parse(localStorage.getItem("User")))
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const handleImageUpload = (e) => {
        uploadImage(e, setImageSrc);
    };

    const goImageUrl = (imageUrl) => {
        window.open(imageUrl, "_blank");
    };

    return (
        <div style={{ position: "relative" }}>
            <div className="cover-image" onClick={() => goImageUrl(userProfile[0].cover)}>
                <img src={userProfile[0]?.cover} className="cover-img" />
            </div> 
            <div className="edit-profile-cover">
                {userProfile[0]?.username && user.username && userProfile[0]?.username === user.username ? (
                    <Button variant="light" onClick={handleShow}>
                        <i className="fas fa-camera-retro"></i> <span>Edit cover photo</span>
                    </Button>
                ) : ""}
            </div>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="modal-avatar-title" style={{transform:"translateX(140px)"}}>Update cover photo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group mb-avatar">
                        <label htmlFor="formFile" className="form-label inputCode"><span></span></label>
                        <input type="file" id="image-upload" onChange={handleImageUpload} hidden />
                        <label htmlFor="image-upload" className="file-upload-button"><span>+ Upload cover photo</span></label>
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