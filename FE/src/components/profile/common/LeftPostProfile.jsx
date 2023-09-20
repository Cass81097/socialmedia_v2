import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ProfileContext } from "../../../context/ProfileContext";

export default function LeftPostProfile() {
    const { user } = useContext(AuthContext);
    const { userProfile } = useContext(ProfileContext)


    return (
        <>
            <div className="info-col">
                <div className="about-info">
                    <h5>Giới thiệu</h5>
                </div>
                <div className="profile-about">
                    <div className="class-profile">
                        <i className="fas fa-graduation-cap icon-profile" />
                        <span>Từng học tại Học Viện Ngân Hàng</span> 
                    </div>
                    <div className="address-profile">
                        <i className="fas fa-map-marker-alt icon-profile" style={{marginRight:"4px"}}/>
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