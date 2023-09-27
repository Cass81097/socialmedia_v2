

import 'firebase/compat/auth';
import React, { useContext, useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/group/private-group.css"

const PrivateGroup = (props) => {

    return (
        <>
            <div className="private-group">
                <div className="photo-private-group">
                    <img src="https://www.facebook.com/images/comet/empty_states_icons/permissions/permissions_gray_wash.svg" alt="" />
                </div>
                <div className="content-private-group">
                    <h4>This group is private</h4>
                    <p>Join this group to view or participate in discussions.</p>
                </div>
            </div>
        </>
    );
}

export default PrivateGroup;
