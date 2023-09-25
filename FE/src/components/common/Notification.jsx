import { useContext, useEffect, useState, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { PostContext } from "../../context/PostContext";
import { ProfileContext } from "../../context/ProfileContext";
import { baseUrl, deleteRequest, getRequest, postRequest } from "../../utils/services";

export default function Notification(props) {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [showToastFriend, setShowToastFriend] = useState(false);
    const [showToastComment, setShowToastComment] = useState(false);
    const [userPost, setUserPost] = useState(false);
    const { user } = useContext(AuthContext)
    const { socket } = useContext(ProfileContext)
    const [friendRequest, setFriendRequest] = useState([])
    const [userAccepted, setUserAccepted] = useState(false)
    const [userRequest, setUserRequest] = useState([])
    const [status, setStatus] = useState([])

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
        navigate(`/status/${id}`)
    }

    useEffect(() => {
        if (socket === null) return;

        const handleCommentStatus = async (response) => {
            if (response?.senderId !== response?.receiverId && user?.id !== response?.senderId) {
                try {
                    const userId = response.senderId;
                    const resUser = await getRequest(`${baseUrl}/users/find/id/${userId}`);
                    setStatus({ ...resUser[0], postId: response.postId });
                    setShowToastComment(true);
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

    return (
        <>
            {/* Toast Comment */}
            {showToastComment && (
                <Toast onClose={() => setShowToastComment(false)}>
                    <div className="toast-header">
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">Thông báo mới</strong>
                        <button type="button" className="btn-close" onClick={() => setShowToastComment(false)}></button>
                    </div>
                    <Toast.Body onClick={() => showPost(status?.postId)}>
                        <div className="toast-container">
                            <div className="toast-avatar">
                                <img src={status?.avatar} alt="" />
                            </div>
                            <div className="toast-content" style={{ color: "black", marginLeft: "5px" }}>
                                <p><span style={{ fontWeight: "600" }}>{status?.fullname}</span> vừa mới bình luận bài viết của bạn</p>
                                <span style={{ color: "#0D6EFD" }}>vài giây trước</span>
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
                        <strong className="me-auto">Thông báo mới</strong>
                        <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
                    </div>
                    <Toast.Body onClick={() => showPost(userPost?.postId)}>
                        <div className="toast-container">
                            <div className="toast-avatar">
                                <img src={userPost?.avatar} alt="" />
                            </div>
                            <div className="toast-content" style={{ color: "black", marginLeft: "5px" }}>
                                <p><span style={{ fontWeight: "600" }}>{userPost?.fullname}</span> vừa mới thích bài viết của bạn</p>
                                <span style={{ color: "#0D6EFD" }}>vài giây trước</span>
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
                        <strong className="me-auto">Thông báo mới</strong>
                        <button type="button" className="btn-close" onClick={() => setShowToastFriend(false)}></button>
                    </div>
                    <Toast.Body onClick={() => goProfileUser(userRequest[0]?.username)}>
                        <div className="toast-container">
                            <div className="toast-avatar">
                                <img src={userRequest[0]?.avatar} alt="" />
                            </div>
                            <div className="toast-content" style={{ color: "black", marginLeft: "5px" }}>
                                <p><span style={{ fontWeight: "600" }}>{userRequest[0]?.fullname}</span> {userAccepted ? "đã đồng ý" : "vừa mới gửi"} lời mời kết bạn</p>
                                <span style={{ color: "#0D6EFD" }}>vài giây trước</span>
                            </div>
                            <i className="fas fa-circle"></i>
                        </div>
                    </Toast.Body>
                </Toast>
            )}
        </>
    );
}