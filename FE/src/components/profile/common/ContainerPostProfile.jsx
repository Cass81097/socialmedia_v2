import $ from 'jquery';
import React, { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import { BiSolidLike, BiSolidLockAlt } from 'react-icons/bi';
import { FaUserFriends } from 'react-icons/fa';
import { FaEarthAmericas } from 'react-icons/fa6';
import InputEmoji from "react-input-emoji";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { PostContext } from "../../../context/PostContext";
import { ProfileContext } from "../../../context/ProfileContext";
import uploadImages from "../../../hooks/UploadMulti";
import "../../../styles/modalChangeImage.css";
import "../../../styles/user/post/inputEmoji.css";
import "../../../styles/user/post/postImage.css";
import "../../../styles/user/post/postUser.css";
import "../../../styles/user/post/privacy.css";
import { baseUrl, deleteRequest, getRequest, postRequest, putRequest } from "../../../utils/services";
import Like from "../../common/Like";
import LoadingNew from "../../common/LoadingNew";

export default function ContainerPostProfile(props) {
    const { user, userProfile, setShowLikeList, setLikeListIndex, setShowPostEdit, setPostEditIndex } = props;

    const navigate = useNavigate();
    const { checkFriendStatus, socket } = useContext(ProfileContext)
    const { postUser, postImageUser, fetchPostUser, fetchImagePostUser } = useContext(PostContext);
    const [imageSrcProfile, setImageSrcProfile] = useState(null);
    const [show, setShow] = useState(false);
    const [textMessage, setTextMessage] = useState("")
    const [isPostLoading, setIsPostLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);

    //Privacy
    const [privacyPost, setPrivacyPost] = useState('friend');
    const [privacyValue, setPrivacyValue] = useState('friend');

    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showPrivacyPost, setShowPrivacyPost] = useState(false);

    const [privacyIndex, setPrivacyIndex] = useState(null);
    const [postUserPrivacy, setPostUserPrivacy] = useState(null);

    //Like
    const [isCountLike, setIsCountLike] = useState([]);

    // Socket
    const [showToast, setShowToast] = useState(false);
    const [userPost, setUserPost] = useState(false);

    useEffect(() => {
        if (socket === null) return;

        const handleStatus = async (response) => {
            if (response?.senderId !== response?.receiverId && user?.id !== response?.senderId) {
                try {
                    const userId = response.senderId;
                    const res = await getRequest(`${baseUrl}/users/find/id/${userId}`);
                    setUserPost(res[0]);
                    setShowToast(true);
                } catch (error) {
                    console.error("Error fetching user post:", error);
                }
            }
        };

        socket.on("status", handleStatus);

        return () => {
            socket.off("status", handleStatus);
        };
    }, [socket]);

    const handleLikeListShow = async (index) => {
        setLikeListIndex(index)
        setShowLikeList(true);
    };

    //Edit
    const handlePostEditShow = async (index) => {
        setPostEditIndex(index)
        setShowPostEdit(true);
    };

    useEffect(() => {
        if (privacyIndex !== null) {
            setPostUserPrivacy(postUser[privacyIndex]?.visibility);
        }
    }, [privacyIndex, postUser]);

    const handlePrivacyChange = (event) => {
        setPostUserPrivacy(event.target.value);
    };

    const handlePrivacyPostChange = (event) => {
        setPrivacyValue(event.target.value);
    };

    const handleChangePostPrivacy = () => {
        setPrivacyPost(privacyValue)
        setShowPrivacyPost(false);
    }

    const handleDeleteImage = (index) => {
        setImageSrcProfile((prevImages) => {
            const newImages = [...prevImages];
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const handleClose = () => {
        setShow(false);
    }

    const handleShow = async () => {
        setShow(true);
    };

    const handlePrivacyClose = () => {
        setShowPrivacy(false);
        setPrivacyIndex(null);
    };

    const handlePrivacyShow = (index) => {
        setShowPrivacy(true);
        setPrivacyIndex(index)
    };

    const handlePrivacyPostShow = () => {
        setShowPrivacyPost(true);
    };

    const handlePrivacyPostClose = () => {
        setShowPrivacyPost(false);
    };

    const handleImageUploadMore = (e) => {
        uploadImages(e, (images) => {
            setIsImageLoading(false);
            setImageSrcProfile((prevImages) => [...prevImages, ...images]);
        }, setIsImageLoading);
    };

    const handleImageUploadPost = (e) => {
        uploadImages(e, (images) => {
            setIsImageLoading(false);
            setImageSrcProfile(images);
        }, setIsImageLoading);
    };

    useEffect(() => {
        if (imageSrcProfile) {
            setIsImageLoading(false);
        }
    }, [imageSrcProfile]);

    const handleImageClose = () => {
        setImageSrcProfile([]);
    };

    //Handle Post

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleInputChange = (value) => {
        setTextMessage(value);
    };

    const handleSendMessage = async () => {
        setIsPostLoading(true);

        const data = {
            content: textMessage,
            visibility: privacyPost,
            sender: {
                id: user.id
            },
            receiver: {
                id: userProfile[0].id
            }
        };

        const response = await postRequest(`${baseUrl}/status`, JSON.stringify(data));
        const statusId = response.id;

        if (imageSrcProfile) {
            for (let i = 0; i < imageSrcProfile.length; i++) {
                const dataImage = {
                    imageUrl: imageSrcProfile[i],
                    status: {
                        id: statusId
                    }
                };

                const responseImage = await postRequest(`${baseUrl}/imageStatus`, JSON.stringify(dataImage));
            }
        }

        setIsPostLoading(false);
        setTextMessage("");
        setImageSrcProfile(null);
        await fetchPostUser();
        await fetchImagePostUser();

        console.log("Đăng post thành công");
    };

    const handleChangePrivacy = async (postId, privacyValue) => {
        setIsPostLoading(true);

        const data = {
            visibility: privacyValue
        };

        const response = await putRequest(`${baseUrl}/status/visibility/${postId}`, JSON.stringify(data));

        setIsPostLoading(false);
        setShowPrivacy(false);
        await fetchPostUser();
        await fetchImagePostUser();
        console.log("Sửa Privacy thành công");
    };

    const goProfile = (username) => {
        setShow(false);
        navigate(`/${username}`);
    };

    const goImageUrl = (imageUrl) => {
        window.open(imageUrl, "_blank");
    };

    // Handle Menu Post
    let currentMenuIndex = null;
    const showPostMenu = (index) => {
        if (currentMenuIndex === index) {
            $(`.post-menu-${index}`).hide();
            currentMenuIndex = null;
            return;
        }
        if (currentMenuIndex !== null) {
            $(`.post-menu-${currentMenuIndex}`).hide();
        }
        $(`.post-menu-${index}`).show();
        currentMenuIndex = index;
    };

    // Delete Post

    const [showAlert, setIsShowAlert] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);

    const handleCloseAlert = () => {
        setIsShowAlert(false);
    }

    const handleShowAlert = (postId) => {
        setPostIdToDelete(postId)
        setIsShowAlert(true);
    }

    const handleDeleteStatus = (async (postId) => {
        setIsPostLoading(true);
        const response = await deleteRequest(`${baseUrl}/status/${postId}`);
        setIsPostLoading(false);
        setIsShowAlert(false);
        await fetchPostUser();
    })

    return (
        <>
            <div className="post-col">

                {user?.username === userProfile[0]?.username && (
                    <div className="home-content">
                        <div className="write-post-container">
                            <div className="user-profile">
                                <div className="user-avatar" onClick={() => goProfile(user?.username)}>
                                    <img src={user.avatar} />
                                </div>
                                <div className="user-post-profile">
                                    <p onClick={() => goProfile(user?.username)}>{user?.fullname}</p>

                                    {user?.username === userProfile[0]?.username ? (
                                        <small onClick={handlePrivacyPostShow} style={{ cursor: "pointer" }}>
                                            {privacyPost === "public" ? (
                                                <>
                                                    <FaEarthAmericas />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            ) : privacyPost === "friend" ? (
                                                <>
                                                    <FaUserFriends />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            ) : privacyPost === "private" ? (
                                                <>
                                                    <BiSolidLockAlt />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            ) : (
                                                <>
                                                    <FaEarthAmericas />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            )}
                                        </small>
                                    ) : (
                                        <small style={{ cursor: "pointer" }}>
                                            {privacyPost === "public" ? (
                                                <>
                                                    <FaEarthAmericas />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            ) : privacyPost === "friend" ? (
                                                <>
                                                    <FaUserFriends />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            ) : privacyPost === "private" ? (
                                                <>
                                                    <BiSolidLockAlt />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            ) : (
                                                <>
                                                    <FaEarthAmericas />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            )}
                                        </small>
                                    )}
                                </div>
                            </div>
                            <div className="user-action-post">
                                <Button variant="light">
                                    <i className="fas fa-ellipsis-h"></i>
                                </Button>
                            </div>
                        </div>
                        <div className="post-input-container">
                            <InputEmoji
                                value={textMessage}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                            />

                            <Button
                                variant="primary"
                                className={`post-button ${(!imageSrcProfile && !textMessage) ? 'cursor-not-allowed' : ''}`}
                                onClick={handleSendMessage}
                                disabled={!imageSrcProfile && !textMessage}
                            >
                                Đăng
                            </Button>

                            <div style={{ position: "relative" }}>

                                {imageSrcProfile && imageSrcProfile.length > 0 && imageSrcProfile.length < 3 ? (
                                    <div className="post-image-container">
                                        {imageSrcProfile.map((src, index) => (
                                            <img key={index} src={src} alt={`Image ${index}`} />
                                        ))}
                                    </div>
                                ) : imageSrcProfile && imageSrcProfile.length === 3 ? (
                                    <div className="post-image-container three-image">
                                        {imageSrcProfile.map((src, index) => (
                                            <img key={index} src={src} alt={`Image ${index}`} />
                                        ))}
                                    </div>
                                ) : imageSrcProfile && imageSrcProfile.length === 4 ? (
                                    <div className="post-image-container four-image">
                                        {imageSrcProfile.map((src, index) => (
                                            <img key={index} src={src} alt={`Image ${index}`} />
                                        ))}
                                    </div>
                                ) : imageSrcProfile && imageSrcProfile.length > 4 ? (
                                    <div className="post-image-container five-image">
                                        {imageSrcProfile.map((src, index) => (
                                            <img key={index} src={src} alt={`Image ${index}`} />
                                        ))}
                                    </div>
                                )
                                    :
                                    null}

                                {imageSrcProfile && imageSrcProfile.length > 0 && (
                                    <>
                                        <div className="post-image-close">
                                            <Button variant="light" onClick={handleImageClose} style={{ borderRadius: "50%" }} >X</Button>
                                        </div>
                                        <label htmlFor="image-upload-add" className="post-image-add" style={{ cursor: "pointer" }}>
                                            <div className="btn btn-light">Thêm ảnh</div>
                                            <input
                                                id="image-upload-add"
                                                type="file"
                                                multiple
                                                onChange={handleImageUploadMore}
                                                style={{ display: "none" }}
                                            />
                                        </label>
                                        <Button variant="light" className="post-image-change" onClick={handleShow}>Chỉnh sửa tất cả</Button>
                                    </>
                                )}
                            </div>

                            <div className="add-post-links">
                                <Link to="">
                                    <img src="./images/watch.png" /> Video trực tiếp
                                </Link>
                                <label htmlFor="image-upload-post" className="upload-label" style={{ cursor: "pointer", alignItems: "center", display: "flex", justifyContent: "center" }}>
                                    <img src="./images/photo.png" style={{ marginRight: "10px", width: "20px" }} /> Ảnh/video
                                    <input
                                        id="image-upload-post"
                                        type="file"
                                        multiple
                                        onChange={handleImageUploadPost}
                                        style={{ display: "none" }}
                                    />
                                </label>
                                <Link to="">
                                    <img src="./images/feeling.png" /> Cảm xúc/hoạt động
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {checkFriendStatus?.status === "friend" && (
                    <div className="home-content">
                        <div className="write-post-container">
                            <div className="user-profile">
                                <div className="user-avatar" onClick={() => goProfile(user?.username)}>
                                    <img src={user.avatar} />
                                </div>
                                <div className="user-post-profile">
                                    <p onClick={() => goProfile(user?.username)}>{user?.fullname}</p>

                                    {user?.username === userProfile[0]?.username ? (
                                        <small onClick={handlePrivacyPostShow} style={{ cursor: "pointer" }}>
                                            {privacyPost === "public" ? (
                                                <>
                                                    <FaEarthAmericas />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            ) : privacyPost === "friend" ? (
                                                <>
                                                    <FaUserFriends />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            ) : privacyPost === "private" ? (
                                                <>
                                                    <BiSolidLockAlt />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            ) : (
                                                <>
                                                    <FaEarthAmericas />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            )}
                                        </small>
                                    ) : (
                                        <small style={{ cursor: "pointer" }}>
                                            {privacyPost === "public" ? (
                                                <>
                                                    <FaEarthAmericas />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            ) : privacyPost === "friend" ? (
                                                <>
                                                    <FaUserFriends />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            ) : privacyPost === "private" ? (
                                                <>
                                                    <BiSolidLockAlt />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            ) : (
                                                <>
                                                    <FaEarthAmericas />
                                                    <i className="fas fa-caret-down" style={{ marginLeft: "5px" }} />
                                                </>
                                            )}
                                        </small>
                                    )}
                                </div>
                            </div>
                            <div className="user-action-post">
                                <Button variant="light">
                                    <i className="fas fa-ellipsis-h"></i>
                                </Button>
                            </div>
                        </div>
                        <div className="post-input-container">
                            <InputEmoji
                                value={textMessage}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                            />

                            <Button
                                variant="primary"
                                className={`post-button ${(!imageSrcProfile && !textMessage) ? 'cursor-not-allowed' : ''}`}
                                onClick={handleSendMessage}
                                disabled={!imageSrcProfile && !textMessage}
                            >
                                Đăng
                            </Button>

                            <div style={{ position: "relative" }}>

                                {imageSrcProfile && imageSrcProfile.length > 0 && imageSrcProfile.length < 3 ? (
                                    <div className="post-image-container">
                                        {imageSrcProfile.map((src, index) => (
                                            <img key={index} src={src} alt={`Image ${index}`} />
                                        ))}
                                    </div>
                                ) : imageSrcProfile && imageSrcProfile.length === 3 ? (
                                    <div className="post-image-container three-image">
                                        {imageSrcProfile.map((src, index) => (
                                            <img key={index} src={src} alt={`Image ${index}`} />
                                        ))}
                                    </div>
                                ) : imageSrcProfile && imageSrcProfile.length === 4 ? (
                                    <div className="post-image-container four-image">
                                        {imageSrcProfile.map((src, index) => (
                                            <img key={index} src={src} alt={`Image ${index}`} />
                                        ))}
                                    </div>
                                ) : imageSrcProfile && imageSrcProfile.length > 4 ? (
                                    <div className="post-image-container five-image">
                                        {imageSrcProfile.map((src, index) => (
                                            <img key={index} src={src} alt={`Image ${index}`} />
                                        ))}
                                    </div>
                                )
                                    :
                                    null}

                                {imageSrcProfile && imageSrcProfile.length > 0 && (
                                    <>
                                        <div className="post-image-close">
                                            <Button variant="light" onClick={handleImageClose} style={{ borderRadius: "50%" }} >X</Button>
                                        </div>
                                        <label htmlFor="image-upload-add" className="post-image-add" style={{ cursor: "pointer" }}>
                                            <div className="btn btn-light">Thêm ảnh</div>
                                            <input
                                                id="image-upload-add"
                                                type="file"
                                                multiple
                                                onChange={handleImageUploadMore}
                                                style={{ display: "none" }}
                                            />
                                        </label>
                                        <Button variant="light" className="post-image-change" onClick={handleShow}>Chỉnh sửa tất cả</Button>
                                    </>
                                )}
                            </div>

                            <div className="add-post-links">
                                <Link to="">
                                    <img src="./images/watch.png" /> Video trực tiếp
                                </Link>
                                <label htmlFor="image-upload-post" className="upload-label" style={{ cursor: "pointer", alignItems: "center", display: "flex", justifyContent: "center" }}>
                                    <img src="./images/photo.png" style={{ marginRight: "10px", width: "20px" }} /> Ảnh/video
                                    <input
                                        id="image-upload-post"
                                        type="file"
                                        multiple
                                        onChange={handleImageUploadPost}
                                        style={{ display: "none" }}
                                    />
                                </label>
                                <Link to="">
                                    <img src="./images/feeling.png" /> Cảm xúc/hoạt động
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    {postUser.map((post, index) => (
                        <div key={index} className="index-content">
                            <div className="post-container">
                                <div className="user-profile">
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <div className="user-avatar" onClick={() => goProfile(post.sender?.username)}>
                                            <img src={post.sender?.avatar} alt="User Avatar" />
                                        </div>
                                        <div>
                                            <div className="post-user-name">
                                                {post.sender?.id !== post.receiver?.id && (
                                                    <>
                                                        <p onClick={() => goProfile(post.sender?.username)}>{post.sender?.fullname}</p>
                                                        <i className="fas fa-caret-right icon-post-user"></i>
                                                    </>
                                                )}
                                                <p>{post.receiver?.fullname}</p>
                                            </div>

                                            <div className="time-status">
                                                {(() => {
                                                    const timeString = post.time;
                                                    const date = new Date(timeString);
                                                    const now = new Date();
                                                    const timeDiffInMinutes = Math.floor((now - date) / (1000 * 60));
                                                    let timeAgo;

                                                    if (timeDiffInMinutes === 0) {
                                                        timeAgo = "Vừa xong";
                                                    } else if (timeDiffInMinutes < 60) {
                                                        timeAgo = `${timeDiffInMinutes} phút trước`;
                                                    } else {
                                                        const hours = Math.floor(timeDiffInMinutes / 60);
                                                        const minutes = timeDiffInMinutes % 60;
                                                        if (hours >= 24) {
                                                            timeAgo = "1 ngày trước";
                                                        } else if (minutes === 0) {
                                                            timeAgo = `${hours} giờ`;
                                                        } else {
                                                            timeAgo = `${hours} giờ ${minutes} phút trước`;
                                                        }
                                                    }

                                                    return (
                                                        <div className="post-privacy-change">
                                                            <span>{timeAgo}</span>

                                                            {user?.username === userProfile[0]?.username && user?.username === post?.sender?.username && (
                                                                <>
                                                                    {postUser[index]?.visibility === 'public' && (
                                                                        <i className="fas fa-globe-americas" style={{ color: '#65676B', cursor: 'pointer', padding: "5px", fontSize: "smaller" }} onClick={() => handlePrivacyShow(index)} />
                                                                    )}
                                                                    {postUser[index]?.visibility === 'friend' && (
                                                                        <i className="fas fa-user-friends" style={{ color: '#65676B', cursor: 'pointer', padding: "5px", fontSize: "smaller" }} onClick={() => handlePrivacyShow(index)} />
                                                                    )}
                                                                    {postUser[index]?.visibility === 'private' && (
                                                                        <i className="fas fa-lock" style={{ color: '#65676B', cursor: 'pointer', padding: "5px", fontSize: "smaller" }} onClick={() => handlePrivacyShow(index)} />
                                                                    )}
                                                                </>
                                                            )}


                                                            {user?.username !== userProfile[0]?.username && user?.username === post?.sender?.username && (
                                                                <>
                                                                    {postUser[index]?.visibility === 'public' && (
                                                                        <i className="fas fa-globe-americas" style={{ color: '#65676B', cursor: 'pointer', padding: "5px", fontSize: "smaller" }} />
                                                                    )}
                                                                    {postUser[index]?.visibility === 'friend' && (
                                                                        <i className="fas fa-user-friends" style={{ color: '#65676B', cursor: 'pointer', padding: "5px", fontSize: "smaller" }} />
                                                                    )}
                                                                    {postUser[index]?.visibility === 'private' && (
                                                                        <i className="fas fa-lock" style={{ color: '#65676B', cursor: 'pointer', padding: "5px", fontSize: "smaller" }} />
                                                                    )}
                                                                </>
                                                            )}

                                                            {user?.username !== post?.sender?.username && user?.username !== userProfile[0]?.username && (
                                                                <>
                                                                    {postUser[index]?.visibility === 'public' && (
                                                                        <i className="fas fa-globe-americas" style={{ color: '#65676B', cursor: 'pointer', padding: "5px", fontSize: "smaller" }} />
                                                                    )}
                                                                    {postUser[index]?.visibility === 'friend' && (
                                                                        <i className="fas fa-user-friends" style={{ color: '#65676B', cursor: 'pointer', padding: "5px", fontSize: "smaller" }} />
                                                                    )}
                                                                    {postUser[index]?.visibility === 'private' && (
                                                                        <i className="fas fa-lock" style={{ color: '#65676B', cursor: 'pointer', padding: "5px", fontSize: "smaller" }} />
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>

                                    {user?.username === userProfile[0]?.username && (
                                        <div className="user-action-post" onClick={() => showPostMenu(index)}>
                                            <Button variant="light">
                                                <i className="fas fa-ellipsis-h"></i>
                                            </Button>
                                            <ol className={`post-menu-${index} show-post-menu`} style={{ display: "none" }}>

                                                {user?.username !== userProfile[0]?.username && user?.username !== post?.sender?.username && (
                                                    <li onClick={() => handlePostEditShow(index)} >
                                                        <i className="far fa-edit"></i>
                                                        <span>Sửa bài viết</span>
                                                    </li>
                                                )}

                                                {user?.username === userProfile[0]?.username && user?.username === post?.sender?.username && (
                                                    <li onClick={() => handlePostEditShow(index)} >
                                                        <i className="far fa-edit"></i>
                                                        <span>Sửa bài viết</span>
                                                    </li>
                                                )}

                                                <li onClick={() => { handleShowAlert(post.id) }}>
                                                    <i className="far fa-trash-alt"></i>
                                                    <span>Xóa bài viết</span>
                                                </li>
                                            </ol>
                                        </div>
                                    )}

                                    {user?.username !== userProfile[0]?.username && user?.username === post?.sender?.username && (
                                        <div className="user-action-post" onClick={() => showPostMenu(index)}>
                                            <Button variant="light">
                                                <i className="fas fa-ellipsis-h"></i>
                                            </Button>
                                            <ol className={`post-menu-${index} show-post-menu`} style={{ display: "none" }}>

                                                <li onClick={() => handlePostEditShow(index)} >
                                                    <i className="far fa-edit"></i>
                                                    <span>Sửa bài viết</span>
                                                </li>

                                                <li onClick={() => { handleShowAlert(post.id) }}>
                                                    <i className="far fa-trash-alt"></i>
                                                    <span>Xóa bài viết</span>
                                                </li>
                                            </ol>
                                        </div>
                                    )}

                                </div>

                                <div className="post-user">
                                    <p className="post-text">{post.content}</p>
                                    {postImageUser[index]?.length > 0 && postImageUser[index] && (
                                        <div className={`post-image ${postImageUser[index]?.length === 4 ? 'four' :
                                            postImageUser[index]?.length === 5 ? 'five' :
                                                postImageUser[index]?.length > 2 && postImageUser[index]?.length !== 4 ? 'three' : ''
                                            }`}>
                                            {postImageUser[index]?.map((image, imageIndex) => (
                                                <img src={image.imageUrl} alt="Post Image" className="post-img" key={imageIndex} />
                                            ))}
                                        </div>
                                    )}

                                    {post.accountLike > 0 && post.accountLike < 3 ? (
                                        <div className="activity-icons">
                                            <BiSolidLike style={{ color: "rgb(27 97 255)" }} className="like-icon" />
                                            <span style={{ marginLeft: "5px" }} onClick={() => handleLikeListShow(index)}>
                                                {post.listUserLike.map((userLike) => {
                                                    if (user.username === userLike?.user?.username) {
                                                        return "Bạn";
                                                    } else {
                                                        return userLike?.user?.fullname;
                                                    }
                                                }).join(" và ")} đã thích
                                            </span>
                                        </div>
                                    ) : (
                                        post.accountLike > 2 && (
                                            <div className="activity-icons">
                                                <BiSolidLike style={{ color: "rgb(27 97 255)" }} className="like-icon" />
                                                <span onClick={() => handleLikeListShow(index)} style={{ marginLeft: "5px" }}>{post?.accountLike} người đã thích</span>
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className="post-action">
                                    <div className="post-like">
                                        <Like key={post.id} postId={post.id} countLike={post.acountLike} checkStatusLike={post.isLiked}
                                            isCountLike={isCountLike} setIsCountLike={setIsCountLike}
                                        ></Like>
                                    </div>

                                    <div className="post-comment">
                                        <Button variant="light">
                                            <i className="far fa-comment-alt"></i>
                                            <span>Bình luận</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Privacy Post*/}
            <Modal show={showPrivacyPost} onHide={handlePrivacyPostClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chọn đối tượng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-privacy-container">
                        <div className="modal-privacy-select">
                            <div className="privacy-container">
                                <div className="privacy-select">
                                    <div className="privacy-icon">
                                        <FaEarthAmericas />
                                    </div>
                                </div>
                                <div className="privacy-name">
                                    <h5>Công khai</h5>
                                    <span>Bất kì ai ở trên hoặc ngoài Facebook</span>
                                </div>
                            </div>

                            <div className="input-radio">
                                <input type="radio" name="privacy" value="public" checked={privacyValue === 'public'} onChange={handlePrivacyPostChange} />
                            </div>
                        </div>

                        <div className="modal-privacy-select">
                            <div className="privacy-container">
                                <div className="privacy-select">
                                    <div className="privacy-icon">
                                        <FaUserFriends />
                                    </div>
                                </div>
                                <div className="privacy-name">
                                    <h5>Bạn bè</h5>
                                    <span>Bạn bè của bạn trên Facebook</span>
                                </div>
                            </div>
                            <div className="input-radio">
                                <input type="radio" name="privacy" value="friend" checked={privacyValue === 'friend'} onChange={handlePrivacyPostChange} />
                            </div>

                        </div>

                        <div className="modal-privacy-select">
                            <div className="privacy-container">
                                <div className="privacy-select">
                                    <div className="privacy-icon">
                                        <BiSolidLockAlt />
                                    </div>
                                </div>
                                <div className="privacy-name">
                                    <h5>Chỉ mình tôi</h5>
                                    <span>Chế độ riêng tư</span>
                                </div>
                            </div>

                            <div className="input-radio">
                                <input type="radio" name="privacy" value="private" checked={privacyValue === 'private'} onChange={handlePrivacyPostChange} />
                            </div>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handlePrivacyPostClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleChangePostPrivacy}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Privacy */}
            <Modal show={showPrivacy && privacyIndex !== null} onHide={handlePrivacyClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chọn đối tượng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-privacy-container">
                        <div className="modal-privacy-select">
                            <div className="privacy-container">
                                <div className="privacy-select">
                                    <div className="privacy-icon">
                                        <FaEarthAmericas />
                                    </div>
                                </div>
                                <div className="privacy-name">
                                    <h5>Công khai</h5>
                                    <span>Bất kì ai ở trên hoặc ngoài Facebook</span>
                                </div>
                            </div>

                            <div className="input-radio">
                                <input type="radio" name="privacy" checked={postUserPrivacy === 'public'} onChange={handlePrivacyChange} value="public" />
                            </div>
                        </div>

                        <div className="modal-privacy-select">
                            <div className="privacy-container">
                                <div className="privacy-select">
                                    <div className="privacy-icon">
                                        <FaUserFriends />
                                    </div>
                                </div>
                                <div className="privacy-name">
                                    <h5>Bạn bè</h5>
                                    <span>Bạn bè của bạn trên Facebook</span>
                                </div>
                            </div>

                            <div className="input-radio">
                                <input type="radio" name="privacy" checked={postUserPrivacy === 'friend'} onChange={handlePrivacyChange} value="friend" />
                            </div>

                        </div>

                        <div className="modal-privacy-select">
                            <div className="privacy-container">
                                <div className="privacy-select">
                                    <div className="privacy-icon">
                                        <BiSolidLockAlt />
                                    </div>
                                </div>
                                <div className="privacy-name">
                                    <h5>Chỉ mình tôi</h5>
                                    <span>Chế độ riêng tư</span>
                                </div>
                            </div>

                            <div className="input-radio">
                                <input type="radio" name="privacy" checked={postUserPrivacy === 'private'} onChange={handlePrivacyChange} value="private" />
                            </div>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handlePrivacyClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => handleChangePrivacy(postUser[privacyIndex]?.id, postUserPrivacy)}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Change Image */}
            <CustomModal show={show} onHide={handleClose} centered className="custom-modal">
                <Modal.Header closeButton>
                    {/* <Modal.Title style={{ transform: "translateX(600px)" }}>Xóa ảnh</Modal.Title> */}
                </Modal.Header>
                <Modal.Body>
                    {imageSrcProfile && imageSrcProfile.length > 0 && (
                        <div className="modal-image-container">
                            {imageSrcProfile.map((src, index) => (
                                <div className="modal-image-change" key={index} >
                                    <img src={src} alt={`Image ${index}`} />
                                    <Button variant="light" className="modal-image-delete" onClick={() => handleDeleteImage(index)}>
                                        X
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </CustomModal>

            {/* <CustomModal show={show} onHide={handleClose} centered className="custom-modal">
                <div className="modal-body-change-image">
                    {imageSrcProfile && imageSrcProfile.length === 1 && (
                        <div className="modal-body-image-change-container">
                            {imageSrcProfile.map((src, index) => (
                                <div className="image-change-container" key={index} style={{ position: "relative" }}>
                                    <img src={src} alt={`Image ${index}`} />
                                    <Button variant="light" className="modal-image-delete" onClick={() => handleDeleteImage(index)}>
                                        X
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {imageSrcProfile && imageSrcProfile.length === 2 && (
                        <div className="modal-body-image-change-container image-two">
                            <div className="image-change-container image-two" style={{ position: "relative" }}>
                                {imageSrcProfile.map((src, index) => (
                                    <>
                                        <img src={src} alt={`Image ${index}`} />
                                        <Button variant="light" className="modal-image-delete" onClick={() => handleDeleteImage(index)}>
                                        X
                                    </Button>
                                    </>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </CustomModal > */}

            {/* Modal Delete */}

            <Modal show={showAlert} onHide={handleCloseAlert} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ transform: "translateX(170px)" }}>Xác nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa bài viết ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAlert}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => handleDeleteStatus(postIdToDelete)}>
                        Có
                    </Button>
                </Modal.Footer>
            </Modal>

            {showToast && (
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
            )}

            {isPostLoading || isImageLoading ? (
                <LoadingNew></LoadingNew>
            ) : null
            }

        </>
    )
}

const CustomModal = styled(Modal)`
.custom-modal {
    max-width: 1000px; 
  }

  .modal-dialog-centered {
    max-width: fit-content;
  }

  .modal-body {
    overflow: auto;
    max-width: 999px;
    background: #E4E6EB;
  }
  
`;

