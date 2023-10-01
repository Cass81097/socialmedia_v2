import 'firebase/compat/auth';
import React, { useContext } from "react";
import { useParams } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from '../components/common/Navbar';
import HeaderGroup from '../components/group/common/HeaderGroup';
import MemberGroup from '../components/group/common/MemberGroup';
import PrivateGroup from '../components/group/common/PrivateGroup';
import RightSideBarGroup from '../components/group/common/RightSideBarGroup';
import Sidebar from '../components/home/common/Sidebar';
import { GroupContext } from '../context/GroupContext';
import "../styles/group/style.css";
import GroupPost from '../components/group/container/mainContainer/GroupPost'
import GroupPostStatus from '../components/group/container/mainContainer/GroupPostStatus'

const Group = (props) => {
    const { groupId } = useParams();
    const { showMemberGroup, infoUserGroup } = useContext(GroupContext)

    return (
        <>
            <Navbar></Navbar>

            <div className='group-container'>
                <Sidebar></Sidebar>
                <div className="main-content">
                    <HeaderGroup></HeaderGroup>

                    <div className='group-main-container'>
                        {!showMemberGroup ? (
                            <>
                                <div className='group-left-container'>
                                    {infoUserGroup?.status === "accepted" ? (
                                        <>
                                            <GroupPost></GroupPost>
                                            <GroupPostStatus></GroupPostStatus>
                                        </>
                                    ) : <PrivateGroup></PrivateGroup>}
                                </div>
                                <div className='group-right-container'>
                                    <RightSideBarGroup></RightSideBarGroup>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='group-left-container'>
                                    <MemberGroup></MemberGroup>
                                </div>
                                <div className='group-right-container'>
                                    <RightSideBarGroup></RightSideBarGroup>
                                </div>
                            </>
                        )}
                    </div>

                </div>

            </div>

            <ToastContainer />
        </>
    );
}

export default Group;
