import "../../../styles/group/member-group.css"
import React, { createContext, useCallback, useEffect, useState, useContext } from "react";
import { baseUrl, getRequest } from "../../../utils/services"
import { GroupContext } from "../../../context/GroupContext";
import { AuthContext } from "../../../context/AuthContext";

const MemberGroup = (props) => {
    const { infoUserGroup, showGroupInfo } = useContext(GroupContext)
    const { user } = useContext(AuthContext)
    const [friendStatus, setFriendStatus] = useState([]);

    console.log(friendStatus);

    useEffect(() => {
        const fetchFriendStatus = async () => {
            try {
                if (showGroupInfo && showGroupInfo.userGroup) {
                    const promises = showGroupInfo.userGroup.map(async (userGroup) => {
                        const response = await getRequest(`${baseUrl}/friendShips/checkStatusByUserId/${user?.id}/${userGroup?.user.id}`);
                        return response; // Sử dụng optional chaining ở đây
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

    return (
        <>
            <div className="member-group">
                <div className="member-group-header">
                    <h6>Members - <span>{showGroupInfo?.userGroupCount}</span></h6>
                    <p>New people and Pages who join this group will appear here</p>
                </div>

                <div className="member-group-admin">
                    <h6>Admin</h6>
                    <div className="admin-group">
                        <div className="admin-group-user">
                            <div className="admin-group-avatar">
                                <img src={showGroupInfo?.userGroup[0]?.user.avatar} alt="" />
                            </div>
                            <h6>{showGroupInfo?.userGroup[0]?.user.fullname}</h6>
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
                                <div className="admin-group-avatar">
                                    <img src={groupUser?.user.avatar} alt="" />
                                </div>
                                <h6>{groupUser?.user.fullname}</h6>
                            </div>

                            <div>
                                {user?.id !== groupUser?.user.id && infoUserGroup?.role === "admin" ? (
                                    <div className="group-button-user">
                                        <button type="button" className="btn btn-secondary btn-edit btn-group-navbar">
                                            <i className="fas fa-users-slash fas-user"></i>Remove member
                                        </button>
                                    </div>
                                ) : null}

                                <div className="add-button" >
                                    <button type="button" className="btn btn-primary btn-add btn-friend-group">
                                        <i className="fas fa-user">
                                            <span>Friend</span>
                                        </i>
                                    </button>
                                </div>

                            </div>

                            {/* <div className="add-button" >
                                <button type="button" className="btn btn-primary btn-add btn-add-friend" >
                                    <i className="fas fa-user-plus">
                                        <span>Add friend</span>
                                    </i>
                                </button>
                            </div> */}


                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default MemberGroup;
