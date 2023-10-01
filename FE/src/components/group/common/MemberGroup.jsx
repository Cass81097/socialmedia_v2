import "../../../styles/group/member-group.css"
import React, { createContext, useCallback, useEffect, useState, useContext } from "react";
import { baseUrl, deleteRequest, postRequest, putRequest, getRequest } from "../../../utils/services"
import { GroupContext } from "../../../context/GroupContext";
import { AuthContext } from "../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";

const MemberGroup = (props) => {
    const { infoUserGroup, showGroupInfo, fetchGroupInfo } = useContext(GroupContext)
    const { user } = useContext(AuthContext)
    const [friendStatus, setFriendStatus] = useState(null);
    const [showModalRemoveUser, setShowModalRemoveUser] = useState(false);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriendStatus = async () => {
            try {
                if (showGroupInfo && showGroupInfo.userGroup) {
                    const promises = showGroupInfo.userGroup.map(async (userGroup) => {
                        const response = await getRequest(`${baseUrl}/friendShips/checkStatusByUserId/${user?.id}/${userGroup?.user.id}`);
                        return response;
                    });
                    const friendStatuses = await Promise.all(promises);
                    setFriendStatus(friendStatuses);
                }
            } catch (error) {
                console.error("Error fetching user profiles:", error);
            }
        };
        fetchFriendStatus();
    }, [user, showGroupInfo]);


    const handleShowModalRemoveUser = (userGroupId) => {
        setUserId(userGroupId);
        setShowModalRemoveUser(true);
    }

    const handleCloseModalRemoveUser = () => {
        setUserId(null);
        setShowModalRemoveUser(false);
    }

    const handleRemoveUser = async (userGroupId) => {
        try {
            const response = await deleteRequest(`${baseUrl}/userGroups/userId/${userGroupId}`);
            setShowModalRemoveUser(false);
            await fetchGroupInfo();
            toast.success("You have removed the user from the group.", toastOptions);
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

    const goProfile = (username) => {
        navigate(`/${username}`);
    };

    return (
        <>
            <div className="member-group">
                <div className="member-group-header">
                    <h6>Members - {showGroupInfo?.userGroupCount}</h6>
                    <p>New people and Pages who join this group will appear here</p>
                </div>

                <div className="member-group-admin">
                    <h6>Admin</h6>
                    <div className="admin-group">
                        <div className="admin-group-user">
                            <div className="admin-group-avatar" onClick={() => goProfile(showGroupInfo?.userGroup[0]?.user?.username)}>
                                <img src={showGroupInfo?.userGroup[0]?.user.avatar} alt="" />
                            </div>
                            <h6 onClick={() => goProfile(showGroupInfo?.userGroup[0]?.user?.username)}>{showGroupInfo?.userGroup[0]?.user.fullname}</h6>
                        </div>

                        <div className="group-button-user">
                            <button type="button" className="btn btn-secondary btn-edit btn-group-navbar">
                                <i className="fas fa-ellipsis-h" style={{ color: "black" }}></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="member-group-user">
                    <h6>Members</h6>
                    {showGroupInfo?.userGroup?.map((groupUser, index) => (
                        <div className="user-group" key={index}>
                            <div className="admin-group-user">
                                <div className="admin-group-avatar" onClick={() => goProfile(groupUser?.user?.username)}>
                                    <img src={groupUser?.user.avatar} alt="" />
                                </div>
                                <h6 onClick={() => goProfile(groupUser?.user?.username)} >{groupUser?.user.fullname}</h6>
                            </div>

                            <div className="button-member-group">

                                {user?.id !== groupUser?.user.id && friendStatus?.[index]?.status === "friend" ? (
                                    <div className="add-button">
                                        <button type="button" className="btn btn-primary btn-add btn-friend-group">
                                            <i className="fas fa-user">
                                                <span>Friend</span>
                                            </i>
                                        </button>
                                    </div>
                                ) : (user?.id !== groupUser?.user.id && friendStatus?.[index] === null) ? (
                                    <div className="add-button">
                                        <button type="button" className="btn btn-primary btn-add btn-add-friend">
                                            <i className="fas fa-user-plus">
                                                <span>Add friend</span>
                                            </i>
                                        </button>
                                    </div>
                                ) : (user?.id !== groupUser?.user.id && friendStatus?.[index]?.status === "pending") ? (
                                    <div className="add-button">
                                        <button type="button" className="btn btn-primary btn-add btn-add-friend">
                                            <i className="fas fa-user">
                                                <span>Pending</span>
                                            </i>
                                        </button>
                                    </div>
                                ) :
                                    null}

                                {user?.id !== groupUser?.user.id && infoUserGroup?.role === "admin" ? (
                                    <div className="group-button-user">
                                        <button type="button" className="btn btn-secondary btn-edit btn-group-navbar" onClick={() => handleShowModalRemoveUser(groupUser?.id)}>
                                            <i className="fas fa-users-slash fas-user">
                                                <span>Remove member</span>
                                            </i>
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Remove User  */}
            <Modal show={showModalRemoveUser} onHide={handleCloseModalRemoveUser} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ transform: "translateX(170px)" }}>Confirm :</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{ textAlign: "center", fontSize: "20px", fontWeight: "600" }}
                >Are you sure to remove user ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalRemoveUser}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleRemoveUser(userId)}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MemberGroup;
