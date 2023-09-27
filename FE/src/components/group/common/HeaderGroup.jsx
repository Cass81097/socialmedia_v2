import 'firebase/compat/auth';
import React from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import GroupCover from '../container/headerContainer/GroupCover';
import Info from '../container/headerContainer/Info';
import NavbarGroup from '../container/headerContainer/NavbarGroup';
import "../../../styles/group/header-group.css"

const HeaderGroup = (props) => {

    return (
        <>
            <div className='header-group'>
                <GroupCover></GroupCover>
                <div className='info-navbar-group'>
                    <Info></Info>
                    <NavbarGroup></NavbarGroup>
                </div>
            </div>
        </>
    );
}

export default HeaderGroup;
