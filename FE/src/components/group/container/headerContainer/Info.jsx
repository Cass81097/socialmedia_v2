import "../../../../styles/group/info.css";
import React, { useContext } from "react";
import { GroupContext } from "../../../../context/GroupContext";

const Info = (props) => {
    const { showGroupInfo, infoUserGroup } = useContext(GroupContext);

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
                            <button type="button" className="btn btn-primary btn-add btn-invite">
                                <i className="fas fa-users">
                                    <span>Join group</span>
                                </i>
                            </button>
                        </div>
                    ) : null}

                    {infoUserGroup?.status === "pending" ? (
                        <div className="group-button-invite">
                            <button type="button" className="btn btn-primary btn-add btn-invite">
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