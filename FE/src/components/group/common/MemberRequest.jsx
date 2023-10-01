

import 'firebase/compat/auth';
import React, { useContext } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from '../../../context/AuthContext';
import { GroupContext } from '../../../context/GroupContext';
import { HomeContext } from '../../../context/HomeContext';
import "../../../styles/group/member-request.css";
import { baseUrl, deleteRequest, putRequest } from "../../../utils/services";

const MemberRequest = (props) => {
    const { showMemberRequest, setShowMemberRequest, userInfoGroupPending, fetchUserInfoGroupPending, fetchGroupInfo, showGroupInfo } = useContext(GroupContext);
    const { socket } = useContext(HomeContext);
    const { user } = useContext(AuthContext)
    const navigate = useNavigate();

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
            toast.success("You declined request.", toastOptions);
        } catch (error) {
            console.error("Error fetching all users:", error);
        }
    }

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    };

    const goProfile = (username) => {
        navigate(`/${username}`);
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
                                        <div className='request-avatar' onClick={() => goProfile(userPending?.user?.username)}>
                                            <img src={userPending?.user?.avatar} alt="" />
                                        </div>

                                        <div className='request-name'>
                                            <h6 onClick={() => goProfile(userPending?.user?.username)}>{userPending?.user?.fullname}</h6>
                                            {(() => {
                                                const timeString = userPending?.time;
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
                                                    <div>
                                                        <p>{timeAgo}</p>
                                                    </div>
                                                );
                                            })()}
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
