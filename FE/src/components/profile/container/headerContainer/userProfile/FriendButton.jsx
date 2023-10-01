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
import $ from 'jquery';
import { HomeContext } from '../../../../../context/HomeContext';

export default function FriendButton(props) {
  const { setIsProfile, setIsPost, setIsFriend } = props;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { setProfileId, fetchFriendUser } = useContext(HomeContext)
  const { userProfile, socket, setIsAddStatus } = useContext(ProfileContext);
  const { fetchPostUser } = useContext(PostContext)
  // const [showToast, setShowToast] = useState(false);
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
      await fetchFriendUser()

      // Comet UnFriend
      if (!userProfile[0]?.id || !user?.id) {
        return;
      }

      const cometChatAppId = process.env.REACT_APP_COMETCHAT_APP_ID;
      const cometChatAppRegion = process.env.REACT_APP_COMETCHAT_REGION;
      const cometChatApiKey = process.env.REACT_APP_COMETCHAT_API_KEY;
      const url = `https://${cometChatAppId}.api-${cometChatAppRegion}.cometchat.io/v3/users/${user?.id}/friends`;
      const options = {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          appId: cometChatAppId,
          apiKey: cometChatApiKey,
        },
        body: JSON.stringify({
          friends: [userProfile[0]?.id]
        }),
      };
      const responseCometUnfriend = await fetch(url, options);

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
      fetchFriendUser();

      if (socket) {
        socket.emit("acceptFriendRequest", {
          senderId: user.id,
          receiverId: userProfile[0]?.id,
        });
      }

      // Comet Add Friend
      if (!userProfile[0]?.id || !user?.id) {
        return;
      }

      const cometChatAppId = `${process.env.REACT_APP_COMETCHAT_APP_ID}`;
      const cometChatAppRegion = `${process.env.REACT_APP_COMETCHAT_REGION}`;
      const cometChatApiKey = `${process.env.REACT_APP_COMETCHAT_API_KEY}`;
      const url = `https://${cometChatAppId}.api-${cometChatAppRegion}.cometchat.io/v3/users/${user?.id}/friends`;
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          appId: cometChatAppId,
          apiKey: cometChatApiKey,
        },
        body: JSON.stringify({ accepted: [userProfile[0]?.id] }),
      };
      const responseCometAddFriend = await fetch(url, options);

    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  const messageUser = (userId) => {
    setProfileId(userId)
    navigate("/messages");
  }

  const showUnfriend = () => {
    $('.unfriend-button').toggle();
  };

  const goInfoUser = () => {
    setIsProfile(true);
    setIsPost(false);
    setIsFriend(false);
  }

  const setButtonStatus = () => {
    setIsAddStatus(true);
  }

  return (
    <>
      {friendStatus?.status === "pending" && friendStatus?.userSendReq === user.id ? (
        <div className="pd-right">
          <div className="add-button">
            <button type="button" className="btn btn-primary btn-add btn-add-friend" >
              <i className="fas fa-user-check">
                <span>Request sent</span>
              </i>
            </button>
          </div>
          <div className="edit-button" style={{ minWidth: "140px", marginLeft:"10px" }}>
            <button type="button" className="btn btn-secondary btn-edit btn-edit-friend" style={{ background: "#dbdbdc" }} onClick={handleUnfriend}>
              <i className="fas fa-user-times" style={{ color: "black" }}>
                <span>Delete Request</span>
              </i>
            </button>
          </div>
        </div>
      ) : friendStatus?.status === "pending" ? (
        <div className="pd-right">
          <div className="add-button">
            <button type="button" className="btn btn-primary btn-add btn-add-friend" onClick={handleAcceptFriend}>
              <i className="fas fa-user-plus">
                <span>Accepted</span>
              </i>
            </button>
          </div>
          <div className="edit-button" style={{ minWidth: "140px", marginLeft:"10px" }}>
            <button type="button" className="btn btn-secondary btn-edit btn-edit-friend" style={{ background: "#dbdbdc" }} onClick={handleCancelRequest}>
              <i className="fas fa-user-slash" style={{ color: "black" }}>
                <span>Decline</span>
              </i>
            </button>
          </div>
        </div>
      ) : friendStatus?.status === "friend" ? (
        <div className="pd-right" style={{ position: "relative" }}>
          <div className="add-button" onClick={showUnfriend}>
            <button type="button" className="btn btn-primary btn-add btn-add-friend">
              <i className="fas fa-user">
                <span>Friend</span>
              </i>
            </button>
            <div className="edit-button unfriend-button" style={{ display: "none" }} onClick={handleShowAlertUnfriend}>
              <div className='unfriend-icon'>
                <i className="fas fa-user-slash" style={{ color: "black" }}>
                  <span>Unfriend</span>
                </i>
              </div>
            </div>
          </div>
          <div className="edit-button" style={{ minWidth: "140px", marginLeft:"10px" }}>
            <button type="button" className="btn btn-secondary btn-edit btn-edit-friend" onClick={() => messageUser(userProfile[0]?.id)}>
              <i className="fab fa-facebook-messenger" style={{ color: "black" }}>
                <span>Messenger</span>
              </i>
            </button>
          </div>
        </div>
      ) : userProfile[0]?.username === user.username ? (
        <div className="pd-right">
          <div className="add-button">
            <button type="button" className="btn btn-primary btn-add btn-add-friend" onClick={setButtonStatus}>
              <i className="fas fa-plus fa-xa">
                <span>Add to post</span>
              </i>
            </button>
          </div>
          <div className="edit-button" style={{ minWidth: "140px", marginLeft:"10px" }}>
            <button type="button" className="btn btn-secondary btn-edit btn-edit-friend" onClick={goInfoUser}>
              <i className="fas fa-pen fa-xz">
                <span>Edit profile</span>
              </i>
            </button>
          </div>
        </div>
      ) : (
        <div className="pd-right">
          <div className="add-button">
            <button type="button" className="btn btn-primary btn-add btn-add-friend" onClick={handleAddFriend}>
              <i className="fas fa-user-plus">
                <span>Add friend</span>
              </i>
            </button>
          </div>
          <div className="edit-button" style={{ minWidth: "140px", marginLeft:"10px" }}>
            <button type="button" className="btn btn-secondary btn-edit btn-edit-friend" style={{ background: "#dbdbdc" }}>
              {/* <i className="fas fa-pen fa-xz"> */}
              <i className="fab fa-facebook-messenger" style={{ color: "black" }}>
                <span>Messenger</span>
              </i>
            </button>
          </div>
        </div>
      )}

      {/* Toast  */}
      {/* {showToast && (
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
      )} */}

      {/* Modal Block User  */}
      <Modal show={showAlertUnFriend} onHide={handleCloseAlertUnfriend} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ transform: "translateX(170px)" }}>Confirm :</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to Unfriend ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAlertUnfriend}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleUnfriend()}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

