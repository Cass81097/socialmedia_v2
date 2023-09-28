import "../../../../styles/group/info.css";
import React, { useContext } from "react";
import { GroupContext } from "../../../../context/GroupContext";
import { baseUrl, deleteRequest, postRequest, putRequest, getRequest } from "../../../../utils/services"
import { AuthContext } from "../../../../context/AuthContext";
import { HomeContext } from "../../../../context/HomeContext";

const Info = (props) => {
    const { showGroupInfo, infoUserGroup, fetchInfoUserGroup, fetchGroupInfo } = useContext(GroupContext);
    const { user } = useContext(AuthContext)
    const { socket } = useContext(HomeContext)

    const handelJoinGroup = async () => {
        const data = {
            user:
                { id: user?.id },
            group:
                { id: showGroupInfo?.id },
            role: "member"
        }

        try {
            const response = await postRequest(`${baseUrl}/userGroups`, JSON.stringify(data));
            await fetchInfoUserGroup();
            await fetchGroupInfo();

            if (socket) {
                socket.emit("sendGroupRequest", {     
                    senderId: user?.id,
                    receiverId: showGroupInfo?.userGroup?.[0]?.user?.id,
                    groupId: showGroupInfo?.id
                });
            }

        } catch (error) {
            console.error("Error fetching all users:", error);
        }
    }

    const handleCancelRequest = async() => {
        try {
            const response = await deleteRequest(`${baseUrl}/userGroups/userId/${infoUserGroup?.id}`);
            await fetchInfoUserGroup();
            await fetchGroupInfo();
        } catch (error) {
            console.error("Error fetching all users:", error);
        }
    }

    return (
        <>
            <div className="group-info">
                <div className="group-name">
                    <h2>{showGroupInfo?.groupName}</h2>
                </div>

                <div className="group-user-bar">
                    <div className="group-user-avatar">
                        {showGroupInfo?.userGroup?.map((user, index) => (
                            <div className="group-user" key={index}>
                                <img src={user?.user?.avatar} alt="" />
                            </div>
                        ))}
                    </div>

                    {infoUserGroup?.status === "accepted" ? (
                        <div className="group-button-invite">
                            <button type="button" className="btn btn-primary btn-add btn-invite">
                                <i className="fas fa-plus fa-xa">
                                    <span>Invite</span>
                                </i>
                            </button>
                        </div>
                    ) : null}

                    {!infoUserGroup ? (
                        <div className="group-button-invite">
                            <button type="button" className="btn btn-primary btn-add btn-invite" onClick={handelJoinGroup}>
                                <i className="fas fa-users">
                                    <span>Join group</span>
                                </i>
                            </button>
                        </div>
                    ) : null}

                    {infoUserGroup?.status === "pending" ? (
                        <div className="group-button-invite">
                            <button type="button" className="btn btn-primary btn-add btn-invite" onClick={handleCancelRequest}>
                                <i className="fas fa-user-times">
                                    <span>Cancel Request</span>
                                </i>
                            </button>
                        </div>
                    ) : null}

                </div>
            </div>
        </>
    );
};

export default Info;