import 'firebase/compat/auth';
import React, { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "react-toastify/dist/ReactToastify.css";
import { GroupContext } from '../../../../context/GroupContext';
import "../../../../styles/group/group-cover.css";
import uploadImages from "../../../../hooks/UploadMulti";
import LoadingNew from "../../../../components/common/LoadingNew"

const GroupCover = (props) => {
    const { setIsImageLoading, isImageLoading, showGroupChange, setShowGroupChange, showGroupInfo, infoUserGroup } = useContext(GroupContext)
    const [imageSrcGroup, setImageSrcGroup] = useState(null);

    const handleClose = () => {
        setShowGroupChange(false);
        setImageSrcGroup(null);
    }

    const showPhotoGroupChange = () => {
        setShowGroupChange(true);
    }

    const handleCreateGroup = () => {
        console.log("Create Group");
        setImageSrcGroup(null);
    }

    const handleImageUpload = (e) => {
        uploadImages(e, (images) => {
            setIsImageLoading(false);
            setImageSrcGroup(images);
        }, setIsImageLoading);
    };

    return (
        <>
            <div style={{ position: "relative" }}>
                <div className='group-cover-photo'>
                    <img src={showGroupInfo?.image} alt="" />
                </div>
                <div className="edit-profile-cover">
                    {infoUserGroup?.role === "admin" ? (
                        <button type="button" className="btn btn-light">
                            <i className="fas fa-camera-retro"></i>
                            <span
                                onClick={showPhotoGroupChange}
                                style={{ marginLeft: "5px" }}>Edit group photo</span>
                        </button>
                    ) : null}
                </div>
            </div>

            <Modal show={showGroupChange} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit group photo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-group-create">
                        <label htmlFor="image-upload" className="file-upload-button">
                            <span>+ Upload group photo</span>
                        </label>
                        <input type="file" id="image-upload" hidden onChange={handleImageUpload} />
                        {imageSrcGroup?.[0] ? (
                            <div className='photo-group-create'>
                                <img src={imageSrcGroup?.[0]} alt="" />
                            </div>
                        ) : null}

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateGroup}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>

            {isImageLoading ? (
                <LoadingNew></LoadingNew>
            ) : null
            }
        </>
    );
}

export default GroupCover;
