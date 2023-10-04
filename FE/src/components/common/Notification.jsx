import { useContext, useEffect, useState, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { PostContext } from "../../context/PostContext";
import { ProfileContext } from "../../context/ProfileContext";
import { baseUrl, deleteRequest, getRequest, postRequest } from "../../utils/services";
import { CommentContext } from "../../context/CommentContext";
import axios from 'axios';
import { GroupContext } from "../../context/GroupContext";

export default function Notification(props) {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [showToastFriend, setShowToastFriend] = useState(false);
    const [showToastGroup, setShowToastGroup] = useState(false);
    const [showToastComment, setShowToastComment] = useState(false);
    const [userPost, setUserPost] = useState(false);
    const { user } = useContext(AuthContext)
    const { socket } = useContext(ProfileContext)
    const [friendRequest, setFriendRequest] = useState([])
    const [userAccepted, setUserAccepted] = useState(false)
    const [userRequest, setUserRequest] = useState([])
    const [status, setStatus] = useState([])
    const { setCommentList } = useContext(PostContext);
    const { fetchGroupInfo, fetchGroupList, fetchInfoUserGroup } = useContext(GroupContext);
    const { fetchUserProfile,setUserProfile } = useContext(ProfileContext);
    const {fetchPostUser } =useContext(PostContext)

    // Group Request
    const [userGroupRequest, setUserGroupRequest] = useState([])
    const [userGroupAccepted, setUserGroupAccepted] = useState(false)
    const [groupRequest, setGroupRequest] = useState([])

    useEffect(() => {
        if (socket === null) return;

        const handleLikeStatus = async (response) => {
            if (response?.senderId !== response?.receiverId && user?.id !== response?.senderId) {
                try {
                    const userId = response.senderId;
                    const resUser = await getRequest(`${baseUrl}/users/find/id/${userId}`);
                    props.setUserPost({ ...resUser[0], postId: response.postId })
                    setUserPost({ ...resUser[0], postId: response.postId });
                    setShowToast(true);
                } catch (error) {
                    console.error("Error fetching user post:", error);
                }
            }
        };

        socket.on("status", handleLikeStatus);

        return () => {
            socket.off("status", handleLikeStatus);
        };
    }, [socket]);

    const goProfileUser = (username) => {
        setShowToastFriend(false)
        navigate(`/${username}`);
        fetchUserProfile()

    }

    useEffect(() => {
        if (socket === null) return;

        socket.on("friendRequest", (res) => {
            setFriendRequest(res);
        });
        socket.on("friendRequestAccepted", (res) => {
            setUserAccepted(true)
            setFriendRequest(res);
        });
        return () => {
            socket.off("friendRequest");
        };
    }, [socket]);

    useEffect(() => {
        if (friendRequest.senderId) {
            setShowToastFriend(true);
            return;
        }
        else {
            setShowToastFriend(false);
            return;
        }
    }, [friendRequest]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getRequest(`${baseUrl}/users/find/id/${friendRequest?.senderId}`);
                props.setUserRequest({ ...response[0], userAccepted: userAccepted })
                setUserRequest(response);
            } catch (error) {
                console.error("Error checking friend status:", error);
            }
        };

        if (friendRequest.senderId && friendRequest.receiverId) {
            fetchData();
        }
    }, [friendRequest]);

    const showPost = async (id) => {
        navigate(`/status/${id}`);
        fetchPostUser()
    }

    // Comment
    useEffect(() => {
        if (socket === null) return;

        const handleCommentStatus = async (response) => {
            const postId = response.postId;
            if (response?.senderId !== response?.receiverId && user?.id !== response?.senderId) {
                try {
                    const userId = response.senderId;
                    const resUser = await getRequest(`${baseUrl}/users/find/id/${userId}`);
                    props.setStatus({ ...resUser[0], postId: response.postId, commentId: response.commentId });
                    setStatus({ ...resUser[0], postId: response.postId, commentId: response.commentId });
                    setShowToastComment(true);

                    axios.get(`${baseUrl}/comments/statusId/${postId}`).then((r) => {
                        console.log(r.data.commentRecords);
                        setCommentList(r.data.commentRecords);
                    });

                } catch (error) {
                    console.error("Error fetching user post:", error);
                }
            }
        };

        socket.on("comment", handleCommentStatus);

        return () => {
            socket.off("comment", handleCommentStatus);
        };
    }, [socket]);

    // Group Request
    useEffect(() => {
        if (socket === null) return;

        socket.on("groupRequest", (res) => {
            // Lấy thông tin PostId ở đây
            setUserGroupRequest(res)
        });

        socket.on("groupRequestAccepeted", (res) => {
            setUserGroupAccepted(true)
            setUserGroupRequest(res);
        });

        return () => {
            socket.off("friendRequest");
            socket.off("groupRequestAccepeted");
        };
    }, [socket]);

    useEffect(() => {
        if (userGroupRequest.senderId) {
            setShowToastGroup(true);
            return;
        }
        else {
            setShowToastGroup(false);
            return;
        }
    }, [userGroupRequest]);

    useEffect(() => {
        const fetchDataGroup = async () => {
            try {
                const response = await getRequest(`${baseUrl}/users/find/id/${userGroupRequest?.senderId}`);
                const group = await getRequest(`${baseUrl}/groups/${userGroupRequest?.groupId}`)
                props.setGroupRequest({...response[0],groupName: group[0].groupName,groupId :userGroupRequest?.groupId, receiver:userGroupRequest?.receiverId  , userAccepted: userGroupAccepted })
                setGroupRequest({...response[0],groupName: group[0].groupName, avatarGroup: group[0].image});
            } catch (error) {
                console.error("Error checking friend status:", error);
            }
        };

        if (userGroupRequest.senderId && userGroupRequest.receiverId) {
            fetchDataGroup();
        }
    }, [userGroupRequest]);
    
    const showGroup = async (groupId) => {
        await fetchGroupList();
        await fetchInfoUserGroup();
        navigate(`/groups/${groupId}`);   
        await fetchGroupInfo(groupId);
        setShowToastGroup(false);
    }

    return (
        <>
            {/* Toast Comment */}
            {showToastComment && (
                <Toast onClose={() => setShowToastComment(false)}>
                    <div className="toast-header">
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">Notification</strong>
                        <button type="button" className="btn-close" onClick={() => setShowToastComment(false)}></button>
                    </div>
                    <Toast.Body onClick={() => showPost(status?.postId)}>
                        <div className="toast-container">
                            <div className="toast-avatar">
                                <img src={status?.avatar} alt="" />
                            </div>
                            <div className="toast-content" style={{ color: "black", marginLeft: "5px" }}>
                                <p><span style={{ fontWeight: "600" }}>{status?.fullname}</span> just comment your post</p>
                                <span style={{ color: "#0D6EFD" }}>a few second ago</span>
                            </div>
                            <i className="fas fa-circle"></i>
                        </div>
                    </Toast.Body>
                </Toast>
            )}

            {/* Toast Like */}
            {showToast && (
                <Toast onClose={() => setShowToast(false)}>
                    <div className="toast-header">
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">Notification</strong>
                        <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
                    </div>
                    <Toast.Body onClick={() => showPost(userPost?.postId)}>
                        <div className="toast-container">
                            <div className="toast-avatar">
                                <img src={userPost?.avatar} alt="" />
                            </div>
                            <div className="toast-content" style={{ color: "black", marginLeft: "5px" }}>
                                <p><span style={{ fontWeight: "600" }}>{userPost?.fullname}</span> just like your post</p>
                                <span style={{ color: "#0D6EFD" }}>a few second ago</span>
                            </div>
                            <i className="fas fa-circle"></i>
                        </div>
                    </Toast.Body>
                </Toast>
            )}

            {/* Toast  Friend*/}
            {showToastFriend && (
                <Toast onClose={() => setShowToastFriend(false)}>
                    <div className="toast-header">
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">Notification</strong>
                        <button type="button" className="btn-close" onClick={() => setShowToastFriend(false)}></button>
                    </div>
                    <Toast.Body onClick={() => goProfileUser(userRequest[0]?.username)}>
                        <div className="toast-container">
                            <div className="toast-avatar">
                                <img src={userRequest[0]?.avatar} alt="" />
                            </div>
                            <div className="toast-content" style={{ color: "black", marginLeft: "5px" }}>
                                <p><span style={{ fontWeight: "600" }}>{userRequest[0]?.fullname}</span> {userAccepted ? "accepted" : "just sent"} friend request</p>
                                <span style={{ color: "#0D6EFD" }}>a few second ago</span>
                            </div>
                            <i className="fas fa-circle"></i>
                        </div>
                    </Toast.Body>
                </Toast>
            )}

            {/* Toast Group*/}
            {showToastGroup && (
                <Toast onClose={() => setShowToastGroup(false)}>
                    <div className="toast-header">
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">Notification</strong>
                        <button type="button" className="btn-close" onClick={() => setShowToastGroup(false)}></button>
                    </div>
                    <Toast.Body onClick={() => showGroup(userGroupRequest?.groupId)}>
                        <div className="toast-container">
                            <div className="toast-avatar">
                                <img src={userGroupAccepted? groupRequest?.avatarGroup: groupRequest?.avatar} alt="" />
                            </div>
                            <div className="toast-content" style={{ color: "black", marginLeft: "5px" }}>
                                <p><span style={{ fontWeight: "600" }}>{userGroupAccepted ? groupRequest?.groupName: groupRequest?.fullName}</span> {userGroupAccepted ? "has accepted your request to join the group" : "just send join a request"} </p>
                                <span style={{ color: "#0D6EFD" }}>a few second ago</span>
                            </div>
                            <i className="fas fa-circle"></i>
                        </div>
                    </Toast.Body>
                </Toast>
            )}
        </>
    );
}