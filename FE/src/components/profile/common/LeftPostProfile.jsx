import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ProfileContext } from "../../../context/ProfileContext";

export default function LeftPostProfile() {
    const { user } = useContext(AuthContext);
    const { userProfile } = useContext(ProfileContext)


    return (
        <>
            <div className="info-col" style={{ height: "220px" }}>
                <div className="about-info">
                    <h5>Intro</h5>
                </div>
                <div className="profile-about">

                    <div className="class-profile">
                        <i className="fas fa-address-card icon-profile" />
                        <span>{userProfile[0]?.fullname}</span>
                    </div>

                    <div className="class-profile">
                        <i className="fas fa-phone-alt icon-profile" style={{marginRight:"4px"}}/>
                        <span>{userProfile[0]?.phone}</span>
                    </div>

                    <div className="class-profile">
                        <i className="fas fa-map-marker-alt icon-profile" style={{ marginRight: "6px" }} />
                        <span>{userProfile[0]?.address}</span>
                    </div>
                    {/* <div className="picture-profile">
                        <div
                            className="picture-profile-1"
                            style={{
                                backgroundImage:
                                    "linear-gradient(transparent, rgba(0,0,0,0.5)), url(./img/avatar-main.jpg)"
                            }}
                        ></div>
                    </div> */}
                </div>
            </div>
        </>
    )
}