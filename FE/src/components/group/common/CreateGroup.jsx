

import 'firebase/compat/auth';
import React, { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "react-toastify/dist/ReactToastify.css";
import { GroupContext } from '../../../context/GroupContext';
import { AuthContext } from '../../../context/AuthContext';
import "../../../styles/group/create-group.css"
import uploadImages from "../../../hooks/UploadMulti";
import LoadingNew from '../../common/LoadingNew';
import { baseUrl, deleteRequest, postRequest, putRequest } from "../../../utils/services";

const CreateGroup = (props) => {
    const { user } = useContext(AuthContext)
    const { showGroupCreate, setShowGroupCreate, setIsImageLoading, isImageLoading, setIsLoading, isLoading, fetchGroupList } = useContext(GroupContext);
    const [groupName, setGroupName] = useState('');
    const [imageSrcGroup, setImageSrcGroup] = useState(null);

    const handleClose = () => {
        setShowGroupCreate(false);
        setImageSrcGroup(null);
    };

    const handleCreateGroup = async () => {
        setIsLoading(true)

        const data = {
            groupName: groupName,
            image: imageSrcGroup,
        };

        const response = await postRequest(`${baseUrl}/userGroups/create-group/${user?.id}`, JSON.stringify(data));
        await fetchGroupList();
        setIsLoading(false)
        setImageSrcGroup(null);
        setShowGroupCreate(false);
        
    };

    const handleImageUpload = (e) => {
        uploadImages(e, (images) => {
            setIsImageLoading(false);
            setImageSrcGroup(images);
        }, setIsImageLoading);
    };

    const handleGroupNameChange = (e) => {
        setGroupName(e.target.value);
    };

    return (
        <>
            <Modal show={showGroupCreate} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-group-create">
                        <div className='name-group-create'>
                            <input type="text" placeholder='Please input group name' autoFocus value={groupName} onChange={handleGroupNameChange} />
                        </div>
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

            {isImageLoading || isLoading ? (
                <LoadingNew></LoadingNew>
            ) : null
            }
        </>
    );
}

export default CreateGroup;
