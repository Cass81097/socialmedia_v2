import { GroupContext } from "../../../../context/GroupContext";
import "../../../../styles/group/navbar-group.css"
import MemberRequest from "../../common/MemberRequest";
import React, { useContext, useEffect, useRef, useState } from "react";
import $ from 'jquery';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl, deleteRequest, postRequest, putRequest } from "../../../../utils/services";

const NavbarGroup = (props) => {
    const { setShowMemberRequest, showMemberGroup, setShowMemberGroup, infoUserGroup, fetchGroupInfo, fetchInfoUserGroup, fetchGroupList, fetchUserInfoGroupPending } = useContext(GroupContext);
    const [showLeaveGroup, setShowLeaveGroup] = useState(false);

    const toastOptions = {
        position: "bottom-left",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    };

    const handleShowModalRequest = async() => {
        setShowMemberRequest(true);
        await fetchUserInfoGroupPending();
    }

    const handleShowMemberGroup = () => {
        setShowMemberGroup(true)
    }

    const handleShowDiscussionGroup = () => {
        setShowMemberGroup(false)
    }

    const showInfo = () => {
        $('.group-leave').toggle();
    };

    const handleShowLeaveGroup = () => {
        setShowLeaveGroup(true);
        $('.group-leave').hide();
    }

    const handleCloseLeaveGroup = () => {
        setShowLeaveGroup(false);
    }

    const handleLeaveGroup = async () => {
        try {
            const response = await deleteRequest(`${baseUrl}/userGroups/userId/${infoUserGroup?.id}`);
            setShowLeaveGroup(false);
            await fetchGroupInfo();
            await fetchInfoUserGroup();
            await fetchGroupList();
            toast.success("You have leave group.", toastOptions);
        } catch (error) {
            console.error("Error fetching all users:", error);
        }
    }

    return (
        <>
            <div className="task-group">
                <div className="left-task-group">
                    <div className={`group-task ${!showMemberGroup ? 'select1' : ''}`}
                        onClick={handleShowDiscussionGroup}>
                        <p style={!showMemberGroup ? { color: 'rgb(24, 118, 242)' } : {}}>
                            Discussion
                        </p>
                    </div>

                    {infoUserGroup?.status === "accepted" ? (
                        <div className={`group-task ${showMemberGroup ? 'select1' : ''}`}
                            onClick={handleShowMemberGroup}>
                            <p style={showMemberGroup ? { color: 'rgb(24, 118, 242)' } : {}}>
                                Member
                            </p>
                        </div>
                    ) : null}

                    {infoUserGroup?.role === "admin" ? (
                        <div className="group-task" onClick={handleShowModalRequest}>
                            <p>
                                Request
                            </p>
                        </div>
                    ) : null}
                </div>

                <div className="group-button-invite">
                    <button type="button" className="btn btn-secondary btn-edit btn-group-navbar" onClick={showInfo}>
                        <i
                            style={{ color: "black" }}
                            className="fas fa-ellipsis-h">
                        </i>
                    </button>

                    {infoUserGroup?.role === "member" && infoUserGroup?.status === "accepted" ? (
                        <ol className="group-leave" style={{ display: "none" }}>
                            <li onClick={handleShowLeaveGroup}>
                                <i className="fas fa-user-times" /><span style={{marginLeft:"5px"}}>Leave group</span>
                            </li>
                        </ol>
                    ) : null}
                </div>
            </div>

            <MemberRequest></MemberRequest>

            {/* Modal Leave Group  */}

            <Modal show={showLeaveGroup} onHide={handleCloseLeaveGroup} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ transform: "translateX(170px)" }}>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{ textAlign: "center", fontSize: "20px", fontWeight: "600" }}
                >Are you sure to leave group ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLeaveGroup}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleLeaveGroup()}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NavbarGroup;
