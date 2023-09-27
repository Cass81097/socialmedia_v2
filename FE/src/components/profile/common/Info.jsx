import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { object, string } from 'yup';
import { ProfileContext } from "../../../context/ProfileContext";
import "../../../styles/user/editTest.css"
import {AuthContext} from "../../../context/AuthContext";

export default function Info() {
    const { userProfile } = useContext(ProfileContext);

    console.log(userProfile)
    const user = userProfile[0]

    return (
        <>
            <div className="user-info">
                <div className="item-Left">
                    <div className="item-icon">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="item-text">{user.username}</div>
                </div>
                <div className="item-Right">
                    <div className="right-icons">
                        <div style={{marginRight : "40px"}} className="item-icon">
                            <i className="fas fa-globe-asia"></i>
                        </div>
                        <div className="item-icon">
                            <div className="bg-icon">
                                <i></i>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="user-info">
                <div className="item-Left">
                    <div className="item-icon">
                        <i className="fas fa-envelope"></i>
                    </div>
                    <div className="item-text">{user.email}</div>
                </div>
                <div className="item-Right">
                    <div className="right-icons">
                        <div style={{marginRight : "40px"}} className="item-icon">
                            <i className="fas fa-globe-asia"></i>
                        </div>
                        <div className="item-icon">
                            <div className="bg-icon">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
                    <div className="user-info">
                        <div className="item-Left">
                            <div className="item-icon">
                                <i className="fas fa-address-card"></i>
                            </div>
                            <div className="item-text">
                                <input
                                    style={{marginRight: "10px"}}
                                    type="text"
                                    value={user.fullname  || " Please update    " }
                                    readOnly

                                />
                            </div>
                        </div>
                        <div className="item-Right">
                            <div className="right-icons">
                                <div style={{marginRight: "40px"}} className="item-icon">
                                    <i className="fas fa-globe-asia"></i>
                                </div>
                                <div className="item-icon">
                                    <div className="bg-icon">
                                        <i
                                         ></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>





            <div className="user-info">
                        <div className="item-Left">
                            <div className="item-icon">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <div className="item-text">
                                <input
                                    style={{ marginRight: "10px" }}
                                    className="itemtext"
                                    type="text"
                                    value={user.address  || " Please update"}
                                    readOnly

                                />
                            </div>
                        </div>
                        <div className="item-Right">
                            <div className="right-icons">
                                <div style={{marginRight: "40px"}} className="item-icon">
                                    <i className="fas fa-globe-asia"></i>
                                </div>
                                <div className="item-icon">
                                    <div className="bg-icon">
                                        <i ></i>
                                    </div>
                                </div>
                            </div>
                        </div>
            </div>
            <div className="user-info">
                        <div className="item-Left">
                            <div className="item-icon">
                                <i className="fas fa-phone-alt"></i>
                            </div>
                            <div className="item-text">
                                <input
                                    style={{ marginRight: "10px" }}
                                    className="itemtext"
                                    type="text"
                                    value={user.phone || " Please update"}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="item-Right">
                            <div className="right-icons">
                                <div style={{marginRight: "40px"}} className="item-icon">
                                    <i className="fas fa-globe-asia"></i>
                                </div>

                                <div className="item-icon">
                                    <div className="bg-icon">
                                        <i ></i>
                                    </div>
                                </div>
                            </div>
                        </div>
            </div>
            <ToastContainer />
        </>
    )
}
