import $ from 'jquery';
import React, { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { ProfileContext } from "../../../../context/ProfileContext";
import "../../../../styles/modalNavbar.css";
import { baseUrl, getRequest, postRequest } from "../../../../utils/services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function NavbarContainer(props) {
    const { isPost, setIsPost, isFriend, setIsFriend, setIsProfile, isProfile } = props
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { userProfile, checkFriendStatus } = useContext(ProfileContext);
    const [friendStatus, setFriendStatus] = useState(null);
    const [blocklist, setBlockList] = useState([])
    const [show, setShow] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertUser, setIsShowAlertUser] = useState(false);
    const [userIndex, setUserIndex] = useState(null);

    const toastOptions = {
        position: "top-center",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleClose = () => {
        setShow(false);
        setShowAlert(false);
    }

    const handleCloseAlert = () => {
        setShowAlert(false);
    }

    const handleCloseAlertUser = () => {
        setIsShowAlertUser(false);
    }

    const handleShowAlertUser = () => {
        setIsShowAlertUser(true);
        $('.profile-block').hide();
    }

    const handleShow = () => {
        setShow(true);
        $('.profile-block').hide();
    }

    const handleShowAlert = (index) => {
        setShowAlert(true);
        setUserIndex(index);
    }

    const handleFriendClick = () => {
        setIsFriend(true);
        setIsPost(false);
        setIsProfile(false)
    };

    const handlePostClick = () => {
        setIsFriend(false);
        setIsProfile(false)
        setIsPost(true);
    };

    const handleProfileClick = () => {
        setIsFriend(false);
        setIsPost(false);
        setIsProfile(true)
    };

    const fetchBlockList = async () => {
        try {
            const response = await getRequest(`${baseUrl}/friendShips/blocklist/${user?.id}`)
            setBlockList(response);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách người dùng bị chặn:', error);
        }
    };

    const showInfo = () => {
        $('.profile-block').toggle();
    };

    const handleBlockUser = async () => {
        try {
            const response = await postRequest(`${baseUrl}/friendShips/block/${user.id}/${userProfile[0]?.id}`)
            setFriendStatus({ status: "block" });
            navigate(`/${user.username}`);
            setIsShowAlertUser(false);
            toast.success("Chặn thành công", toastOptions);
            fetchBlockList();
        } catch (error) {
            console.error("Error canceling friend request:", error);
        }
    };

    const handleUnblockUser = async (userIndex) => {
        try {
            const response = await postRequest(`${baseUrl}/friendships/unfriend/${user.id}/${blocklist[userIndex]?.id}`)
            setFriendStatus();
            toast.success("Bỏ chặn thành công", toastOptions);
            handleClose();
            fetchBlockList();
            setBlockList()
            $('.profile-block').hide();
        } catch (error) {
            console.error("Error canceling friend request:", error);
        }
    };

    useEffect(() => {
        const fetchBlockList = async () => {
            try {
                const response = await getRequest(`${baseUrl}/friendShips/blocklist/${user?.id}`)
                setBlockList(response);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách người dùng bị chặn:', error);
            }
        };
        fetchBlockList();
    }, [user?.id]);

    return (
        <>
            <div className="all-task">
                <div className="left-all-task">
                    <div className="left-all-task">
                        <div className={`post-task ${isPost ? 'select1' : ''}`}>
                            <Link onClick={handlePostClick}>
                                <span style={isPost ? { color: 'rgb(24, 118, 242)' } : {}}>Bài viết</span>
                            </Link>
                        </div>
                        <div className={`profile-task ${isProfile ? 'select1' : ''}`}>
                            <Link onClick={handleProfileClick}>
                                <span style={isProfile ? { color: 'rgb(24, 118, 242)' } : {}}>Giới thiệu</span>
                            </Link>
                        </div>
                        <div className={`profile-task ${isFriend ? 'select1' : ''}`}>
                            <Link onClick={handleFriendClick}>
                                <span style={isFriend ? { color: 'rgb(24, 118, 242)' } : {}}>Bạn bè</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="icon-block">
                    <button
                        type="button"
                        className="btn btn-secondary btn-edit btn-edit-friend"
                        style={{ background: "#dbdbdc" }}
                        onClick={() => showInfo()}
                    >
                        <i className="fas fa-ellipsis-h" style={{ color: "black" }} />
                    </button>
                    <ol className="profile-block" style={{ display: "none" }}>
                        {user?.id !== userProfile[0]?.id ? (
                            <li onClick={handleShowAlertUser}>
                                <i className="fas fa-user-lock" />Chặn người dùng
                            </li>
                        ) : (
                            <li onClick={handleShow}>
                                <i className="fas fa-list" />Danh sách chặn
                            </li>
                        )}
                    </ol>
                </div>

                {/* Modal Block */}
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Danh sách chặn</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="modal-block-top">
                            <p>Sau khi bạn chặn ai đó, người đó sẽ không thể xem nội dung bạn đăng trên dòng thời gian, gắn thẻ bạn, mời bạn tham gia sự kiện hoặc nhóm, bắt đầu cuộc trò chuyện với bạn hoặc thêm bạn làm bạn bè nữa. Lưu ý: Không bao gồm các ứng dụng, trò chơi hoặc nhóm mà cả hai bạn cùng tham gia..</p>
                        </div>
                        <div className="modal-block-container">
                            {blocklist && blocklist.length > 0 ? (
                                blocklist.map((blockedUser, index) => (
                                    <div className="modal-block-main" key={blockedUser.id}>
                                        <div className="modal-block-user">
                                            <div className="modal-block-avatar">
                                                <img src={blockedUser?.avatar} alt="" />
                                            </div>
                                            <p>{blockedUser?.fullname}</p>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-edit btn-edit-friend block-edit"
                                            style={{ background: "#dbdbdc" }}
                                            onClick={() => handleShowAlert(index)}
                                        >
                                            <i className="fas fa-unlock-alt" style={{ color: "black" }}>
                                                <span style={{ fontWeight: "600", marginLeft: "5px" }}>
                                                    Bỏ chặn
                                                </span>
                                            </i>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className='none-block'>Không có tài khoản nào bị chặn</p>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleClose}>
                            Đóng
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal Confirm Block */}
                <Modal show={showAlert} onHide={handleCloseAlert} centered>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ transform: "translateX(170px)" }}>Xác nhận</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có chắc chắn muốn bỏ chặn ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAlert}>
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={() => handleUnblockUser(userIndex)}>
                            Có
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal Block User  */}

                <Modal show={showAlertUser} onHide={handleCloseAlertUser} centered>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ transform: "translateX(170px)" }}>Xác nhận</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có chắc chắn muốn chặn ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAlertUser}>
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={() => handleBlockUser()}>
                            Có
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
            <ToastContainer />

        </>
    )
}


