import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState } from "react";
import Toast from 'react-bootstrap/Toast';
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../../../context/AuthContext";
import { ProfileContext } from "../../../../../context/ProfileContext";
import "../../../../../styles/toast.css";  
import { baseUrl, getRequest, postRequest } from "../../../../../utils/services";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { PostContext } from '../../../../../context/PostContext';

export default function FriendButton() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { userProfile, socket } = useContext(ProfileContext);
  const { fetchPostUser } = useContext(PostContext)
  const [showToast, setShowToast] = useState(false);
  const [showToastAccepted, setShowToastAccepted] = useState(false);
  const [friendStatus, setFriendStatus] = useState(null);
  const [friendRequest, setFriendRequest] = useState([])
  const [userRequest, setUserRequest] = useState([])
  const [userAccepted, setUserAccepted] = useState(false)
  const [showAlertUnFriend, setShowAlertUnFriend] = useState(false);

  const handleCloseAlertUnfriend = () => {
    setShowAlertUnFriend(false);
  }

  const handleShowAlertUnfriend = () => {
    setShowAlertUnFriend(true);
  }
  
  const goProfileUser = (username) => {
    setShowToast(false)
    navigate(`/${username}`);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest(`${baseUrl}/users/find/id/${friendRequest?.senderId}`);
        setUserRequest(response);
      } catch (error) {
        console.error("Error checking friend status:", error);
      }
    };

    if (friendRequest.senderId && friendRequest.receiverId) {
      fetchData();
    }
  }, [friendRequest]);

  useEffect(() => {
    if (socket === null) return;

    socket.on("friendRequest", (res) => {
      console.log(res);
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
      setShowToast(true);
      return;
    }
    else {
      setShowToast(false);
      return;
    }
  }, [friendRequest]);

  useEffect(() => {
    const checkFriendStatus = async () => {
      try {
        const response = await getRequest(`${baseUrl}/friendships/checkStatusByUserId/${user.id}/${userProfile[0]?.id}`);
        setFriendStatus(response);
      } catch (error) {
        console.error("Error checking friend status:", error);
      }
    };

    if (userProfile.length > 0) {
      checkFriendStatus();
    }
  }, [user.id, userProfile]);

  const handleAddFriend = async () => {
    try {
      const response = await postRequest(`${baseUrl}/friendships/request/${user.id}/${userProfile[0]?.id}`)
      setFriendStatus({ status: "pending", userSendReq: user.id });

      if (socket) {
        console.log(user.id, userProfile[0]?.id);
        socket.emit("sendFriendRequest", {
          senderId: user.id,
          receiverId: userProfile[0]?.id,
        });
      }

    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleUnfriend = async () => {
    try {
      const response1 = await postRequest(`${baseUrl}/friendships/unfriend/${user.id}/${userProfile[0]?.id}`)
      const response2 = await postRequest(`${baseUrl}/friendships/unfriend/${userProfile[0]?.id}/${user.id}`)
      setFriendStatus();
      setShowAlertUnFriend(false);
      await fetchPostUser();
     
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  const handleCancelRequest = async () => {
    try {
      const response = await postRequest(`${baseUrl}/friendships/unfriend/${userProfile[0]?.id}/${user.id}/`)
      setFriendStatus();

     
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  const handleAcceptFriend = async () => {
    try {
      const response = await postRequest(`${baseUrl}/friendships/accept/${userProfile[0]?.id}/${user.id}`)
      setFriendStatus({ status: "friend" });
      fetchPostUser();

      if (socket) {
        console.log(user.id, userProfile[0]?.id);
        socket.emit("acceptFriendRequest", {
          senderId: user.id,
          receiverId: userProfile[0]?.id,
        });
      }

    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  return (
    <>
      {friendStatus?.status === "pending" && friendStatus?.userSendReq === user.id ? (
        <div className="pd-right">
          <div className="add-button" style={{ minWidth: "150px" }}>
            <button type="button" className="btn btn-primary btn-add btn-add-friend" >
              <i className="fas fa-user-check">
                <span>Đã gửi lời mời</span>
              </i>
            </button>
          </div>
          <div className="edit-button" style={{ minWidth: "160px" }}>
            <button type="button" className="btn btn-secondary btn-edit btn-edit-friend" style={{ background: "#dbdbdc" }} onClick={handleUnfriend}>
              <i className="fas fa-user-times" style={{ color: "black" }}>
                <span>Hủy lời mời</span>
              </i>
            </button>
          </div>
        </div>
      ) : friendStatus?.status === "pending" ? (
        <div className="pd-right">
          <div className="add-button">
            <button type="button" className="btn btn-primary btn-add btn-add-friend" onClick={handleAcceptFriend}>
              <i className="fas fa-user-plus">
                <span>Đồng ý kết bạn</span>
              </i>
            </button>
          </div>
          <div className="edit-button" style={{ minWidth: "185px" }}>
            <button type="button" className="btn btn-secondary btn-edit btn-edit-friend" style={{ background: "#dbdbdc" }} onClick={handleCancelRequest}>
              <i className="fas fa-user-slash" style={{ color: "black" }}>
                <span>Từ chối kết bạn</span>
              </i>
            </button>
          </div>
        </div>
      ) : friendStatus?.status === "friend" ? (
        <div className="pd-right">
          <div className="add-button" style={{ minWidth: "100px" }}>
            <button type="button" className="btn btn-primary btn-add btn-add-friend">
              <i className="fas fa-user">
                <span>Bạn bè</span>
              </i>
            </button>
          </div>
          <div className="edit-button" style={{ minWidth: "160px" }}>
            <button type="button" className="btn btn-secondary btn-edit btn-edit-friend" onClick={handleShowAlertUnfriend}>
              <i className="fas fa-user-slash" style={{ color: "black" }}>
                <span>Hủy kết bạn</span>
              </i>
            </button>
          </div>
        </div>
      ) : userProfile[0]?.username === user.username ? (
        <div className="pd-right">
          <div className="add-button" style={{ minWidth: "140px" }}>
            <button type="button" className="btn btn-primary btn-add btn-add-friend ">
              <i className="fas fa-plus fa-xa">
                <span>Thêm vào tin</span>
              </i>
            </button>
          </div>
          <div className="edit-button">
            <button type="button" className="btn btn-secondary btn-edit btn-edit-friend">
              <i className="fas fa-pen fa-xz">
                <span>Chỉnh sửa trang cá nhân</span>
              </i>
            </button>
          </div>
        </div>
      ) : (
        <div className="pd-right">
          <div className="add-button" style={{ minWidth: "110px" }}>
            <button type="button" className="btn btn-primary btn-add btn-add-friend" onClick={handleAddFriend}>
              <i className="fas fa-user-plus">
                <span>Kết bạn</span>
              </i>
            </button>
          </div>
          <div className="edit-button" style={{ minWidth: "135px" }}>
            <button type="button" className="btn btn-secondary btn-edit btn-edit-friend" style={{ background: "#dbdbdc" }}>
              {/* <i className="fas fa-pen fa-xz"> */}
              <i className="fab fa-facebook-messenger" style={{ color: "black" }}>
                <span>Nhắn tin</span>
              </i>
            </button>
          </div>
        </div>
      )}

      {/* Toast  */}
      {showToast && (
        <Toast onClose={() => setShowToast(false)}>
          <div className="toast-header">
            <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
            <strong className="me-auto">Thông báo mới</strong>
            <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
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

      {/* Modal Block User  */}
      <Modal show={showAlertUnFriend} onHide={handleCloseAlertUnfriend} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ transform: "translateX(170px)" }}>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn hủy kết bạn ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAlertUnfriend}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => handleUnfriend()}>
            Có
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

