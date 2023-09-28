

import 'firebase/compat/auth';
import React, { useContext, useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "../../../styles/group/member-request.css"
import { GroupContext } from '../../../context/GroupContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl, deleteRequest, postRequest, putRequest } from "../../../utils/services";
import { HomeContext } from '../../../context/HomeContext';
import { AuthContext } from '../../../context/AuthContext';

const MemberRequest = (props) => {
    const { showMemberRequest, setShowMemberRequest, userInfoGroupPending, fetchUserInfoGroupPending, fetchGroupInfo, showGroupInfo } = useContext(GroupContext);
    const { socket } = useContext(HomeContext);
    const { user } = useContext(AuthContext)

    const handleClose = () => {
        setShowMemberRequest(false)
    }

    const handleApproveRequest = async (userGroupId) => {
        try {
            const response = await putRequest(`${baseUrl}/userGroups/accept/${userGroupId}`);
            await fetchUserInfoGroupPending();
            await fetchGroupInfo();
            toast.success("You accepted request.", toastOptions);

            if (socket) {
                socket.emit("acceptGroupRequest", {
                    senderId: user?.id,
                    receiverId: response?.user?.id,
                    groupId: showGroupInfo?.id
                });
            }

        } catch (error) {
            console.error("Error fetching all users:", error);
        }
    }

    const handleDeclineRequest = async (userGroupId) => {
        try {
            const response = await deleteRequest(`${baseUrl}/userGroups/userId/${userGroupId}`);
            await fetchUserInfoGroupPending();
            await fetchGroupInfo();
            toast.error("You declined request.", toastOptions);
        } catch (error) {
            console.error("Error fetching all users:", error);
        }
    }

    const toastOptions = {
        position: "bottom-left",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    };

    return (
        <>
            <Modal show={showMemberRequest} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <div style={{ width: "100%", textAlign: "center" }}>
                        <Modal.Title>
                            Member requests - {userInfoGroupPending?.length}
                        </Modal.Title>
                    </div>
                </Modal.Header>
                <Modal.Body style={userInfoGroupPending?.length === 0 ? { textAlign: "center", fontSize: "20px", fontWeight: "600" } : {}}>
                    <div className="modal-group-request-container">
                        {userInfoGroupPending?.length === 0 ? (
                            <div className="no-request-message">No user requested</div>
                        ) : (
                            userInfoGroupPending?.map((userPending, index) => (
                                <div className="request-user" key={index}>
                                    <div className='request-username' >
                                        <div className='request-avatar'>
                                            <img src={userPending?.user?.avatar} alt="" />
                                        </div>

                                        <div className='request-name'>
                                            <h6>{userPending?.user?.fullname}</h6>
                                            <p>{userPending?.time}</p>
                                        </div>
                                    </div>

                                    <div className='button-request-group'>
                                        <button type="button" className="btn btn-primary btn-approve" onClick={() => handleApproveRequest(userPending?.id)}>Approve</button>
                                        <button type="button" className="btn btn-secondary btn-decline" onClick={() => handleDeclineRequest(userPending?.id)}>Decline</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MemberRequest;
