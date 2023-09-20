import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import LeftPostProfile from "../../common/LeftPostProfile";
import ContainerPostProfile from "../../common/ContainerPostProfile";
import { ProfileContext } from "../../../../context/ProfileContext";
import LikeList from "../../../common/LikeList";
import { PostContext } from "../../../../context/PostContext";
import EditPost from "../../../common/EditPost";

export default function PostProfile() {
    const { user } = useContext(AuthContext);
    const { userProfile, checkFriendStatus } = useContext(ProfileContext);

    const [showLikeList, setShowLikeList] = useState(false);
    const [likeListIndex, setLikeListIndex] = useState([]);

    const [showPostEdit, setShowPostEdit] = useState(false);
    const [postEditIndex, setPostEditIndex] = useState([]);

    return (
        <>
            <LeftPostProfile></LeftPostProfile>
            <ContainerPostProfile 
            user={user} 
            userProfile={userProfile} 
            checkFriendStatus={checkFriendStatus} 
            setShowLikeList={setShowLikeList} 
            setLikeListIndex={setLikeListIndex}
            setShowPostEdit={setShowPostEdit}
            setPostEditIndex={setPostEditIndex}
            >
            </ContainerPostProfile>
            <LikeList showLikeList={showLikeList} setShowLikeList={setShowLikeList} likeListIndex={likeListIndex} ></LikeList>
            <EditPost showPostEdit={showPostEdit} setShowPostEdit={setShowPostEdit} postEditIndex={postEditIndex} setPostEditIndex={setPostEditIndex}></EditPost>
        </>
    )
}