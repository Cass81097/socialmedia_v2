import { GroupContext } from "../../../../context/GroupContext";
import "../../../../styles/group/navbar-group.css"
import MemberRequest from "../../common/MemberRequest";
import React, { useContext, useEffect, useRef, useState } from "react";
import $ from 'jquery';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const NavbarGroup = (props) => {
    const { showMemberRequest, setShowMemberRequest, showMemberGroup, setShowMemberGroup, infoUserGroup } = useContext(GroupContext);
    const [showLeaveGroup, setShowLeaveGroup] = useState(false);

    const handleShowModalRequest = () => {
        setShowMemberRequest(true)
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

    const handleLeaveGroup = () => {
        console.log('ok')
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

                    {infoUserGroup ? (
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
                    <button type="button" class="btn btn-secondary btn-edit btn-group-navbar" onClick={showInfo}>
                        <i
                            style={{ color: "black" }}
                            class="fas fa-ellipsis-h">
                        </i>
                    </button>

                    {infoUserGroup?.role === "member" ? (
                        <ol className="group-leave" style={{ display: "none" }}>
                            <li onClick={handleShowLeaveGroup}>
                                <i className="fas fa-user-lock" />Leave group
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
