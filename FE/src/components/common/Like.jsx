import { useContext, useEffect, useState, useRef  } from "react";
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { PostContext } from "../../context/PostContext";
import { ProfileContext } from "../../context/ProfileContext";
import { baseUrl, deleteRequest, getRequest, postRequest } from "../../utils/services";

export default function Like(props) {
    const navigate = useNavigate();
    const handleStatusRef = useRef(null);
    const { load,postId, countLike, checkStatusLike, setIsCountLike, userLike, onLikeClick,receiver } = props
    const { user } = useContext(AuthContext)
    const { userProfile, socket } = useContext(ProfileContext)
    const { fetchPostUser } = useContext(PostContext)
    const [isLiked, setIsLiked] = useState(checkStatusLike);
    const [likeCount, setLikeCount] = useState(countLike);


    useEffect(() => {
        setIsCountLike(likeCount);
    }, [likeCount, setIsCountLike]);

    const handleAddLike = async () => {
        const userId = user.id;
        let data = {
            userId: userId
        }
        const response = await postRequest(`${baseUrl}/likes/add/${postId}`, JSON.stringify(data));
        setIsLiked(true);
        await fetchPostUser();
    
        if (socket) {
            const receiverId = userProfile[0]?.id !== undefined ? userProfile[0]?.id : receiver;
    
            socket.emit("likeStatus", {
                senderId: user?.id,
                receiverId: receiverId,
                postId: postId
            });
        }
    
        await Promise.all([onLikeClick(), load()]);
    };
    
    const handleRemoveLike = async () => {
        const data = user.id;
        const response = await deleteRequest(`${baseUrl}/likes/${postId}?userId=${data}`);
        setIsLiked(false);
        await fetchPostUser();
    
        await Promise.all([onLikeClick(), load()]);
    };

    // useEffect(() => {
    //     if (socket === null) return;
    //
    //     const handleStatus = async (response) => {
    //         console.log(response);
    //         try {
    //             const userId = response.senderId;
    //             const res = await getRequest(`${baseUrl}/users/find/id/${userId}`);
    //             setUserPost(res[0]);
    //             setShowToast(true);
    //         } catch (error) {
    //             console.error("Error fetching user post:", error);
    //         }
    //     };
    //
    //     socket.on("status", handleStatus);
    //
    //     return () => {
    //         socket.off("status", handleStatus);
    //     };
    // }, [socket]);

    useEffect(() => {
        async function checkLikedStatus() {
            const us = JSON.parse(localStorage.getItem("User"));
            try {
                const response = await getRequest(`${baseUrl}/likes/${postId}`);
                const hasLiked = response.likeRecords;
                let hasUserLiked = false;
                for (let i = 0; i < hasLiked?.length; i++) {
                    if (hasLiked[i].user.id === us.id) {
                        hasUserLiked = true;
                    }
                }
                setIsLiked(hasUserLiked);
            } catch (error) {
                console.error("Error checking like status:", error);
            }
        }

        checkLikedStatus();
    }, [postId, user.id]);

    return (
        <>
            {isLiked ? (
                <Button className="buttonLike" variant="light" onClick={handleRemoveLike} style={{ color: "rgb(27 97 255)" }}>
                    <i className="fas fa-thumbs-up"></i>
                    <span className="buttonLike-span">Like</span>
                </Button>
            ) : (
                <Button className="buttonLike" variant="light" onClick={handleAddLike}>
                    <i className="far fa-thumbs-up" ></i>
                    <span className="buttonLike-span">Like</span>
                </Button>
            )}

            {/* {showToast && (
                <Toast onClose={() => setShowToast(false)}>
                    <div className="toast-header">
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">Thông báo mới</strong>
                        <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
                    </div>
                    <Toast.Body>
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
            )} */}
        </>
    );
}