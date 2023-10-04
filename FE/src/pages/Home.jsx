import 'firebase/compat/auth';
import React, {useContext, useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/home/common/Sidebar';
import {AuthContext} from "../context/AuthContext";
import {ProfileContext} from "../context/ProfileContext";
import "../index.css";
import "../styles/buttonGoogle.css";
import "../styles/home/style.css"
import RightSidebar from '../components/home/common/RightSidebar';
import {CometChatMessages} from '../cometchat-chat-uikit-react-3/CometChatWorkspace/src';
import Button from 'react-bootstrap/Button';
import {HomeContext} from '../context/HomeContext';
import ContainerPostProfile from "../components/profile/common/ContainerPostProfile";
import {BiSolidLike, BiSolidLockAlt} from "react-icons/bi";
import Like from "../components/common/Like";
import {CommentContext, CommentContextProvider} from "../context/CommentContext";
import Comment from "../components/common/Comment";
import {PostContext} from "../context/PostContext";
import {baseUrl, deleteRequest, getRequest, postRequest, putRequest} from "../utils/services";
import axios from "axios";
import {FaEarthAmericas} from "react-icons/fa6";
import {FaUserFriends} from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';

import uploadImages from "../hooks/UploadMulti";
import InputEmoji from "react-input-emoji";
import LoadingNew from "../components/common/LoadingNew";
import $ from 'jquery';
import EditPost from "../components/common/EditPost";
import styled from "styled-components";


const Home = (props) => {
    const navigate = useNavigate();
    const {setUserProfile,userProfile, setIsAddStatus, isAddStatus} = useContext(ProfileContext)
    const {user, loginFinish, setLoginFinish} = useContext(AuthContext)
    const {profileId, setProfileId, setShowComment, showComment} = useContext(HomeContext)
    const {postUser, postImageUser, fetchPostUser, fetchImagePostUser} = useContext(PostContext);
    const [show, setShow] = useState(false)
    const [isCountLike, setIsCountLike] = useState([]);
    const [listPost, setListPost] = useState([])
    const userLogin = JSON.parse(localStorage.getItem("User"))

    const [visibleCommentIndex, setVisibleCommentIndex] = useState(-1);
    const containerRef = useRef(null);

    const handleToggleComment = (index) => {
        setShowComment(true)
        setVisibleCommentIndex(visibleCommentIndex === index ? -1 : index);
    };

    useEffect(() => {
        if (loginFinish) {
            toast.success("Login Sucessful !", toastOptions);
            setLoginFinish(false);
        }
    }, [loginFinish]);

    const closeChat = () => {
        setProfileId(null)
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getRequest(`${baseUrl}/status`);
                setListPost(response);
                setUserProfile([])
            } catch (error) {
                console.error("Error fetching data:", error);
                // Xử lý lỗi mạng hoặc lỗi khác ở đây nếu cần
            }
        };

        fetchData();
    }, []);


    const goProfile = (username) => {
        setShow(false);
        navigate(`/${username}`);
    };

    // check Friend
    const [checkFriend, setCheckFriend] = useState([])
    const [checkBlock, setCheckBlock] = useState([])
    useEffect(() => {
        const checkFriendByUser = async () => {
            try {
                console.log(1)
                const checkList = await getRequest(`${baseUrl}/friendShips/friendList/${userLogin.id}`)
                setCheckFriend(checkList)
                const checkBlockList = await getRequest(`${baseUrl}/friendShips/blockList`)
                setCheckBlock(checkBlockList)
            } catch (e) {
                console.error(e)
            }
        }
        const checkBlockByUser = async () => {

        }
        checkFriendByUser();
        checkBlockByUser();
    }, [])


    const handleReloadCount = (async () => {
        const list = await getRequest(`${baseUrl}/status`);
        setListPost(list)
    })

    const handleReloadCmt = (async () => {
        const list = await getRequest(`${baseUrl}/status`);
        setListPost(list)
    })

    useEffect(() => {
        if (isAddStatus && containerRef.current) {
            containerRef.current.scrollIntoView({behavior: 'smooth'});
            setIsAddStatus(false);
        }
    }, [isAddStatus]);
    const [privacyPost, setPrivacyPost] = useState('public');
    const [privacyValue, setPrivacyValue] = useState('public');
    const [isPostLoading, setIsPostLoading] = useState(false);
    const [textMessage, setTextMessage] = useState("")
    const [imageSrcProfile, setImageSrcProfile] = useState(null);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [showPrivacyPost, setShowPrivacyPost] = useState(false);


    const handlePrivacyPostShow = () => {
        console.log("da vao day ")
        setShowPrivacyPost(true);
    };


    const handleShow = async () => {
        setShow(true);
    };

    const handleImageUploadPost = (e) => {
        uploadImages(e, (images) => {
            setIsImageLoading(false);
            setImageSrcProfile(images);
        }, setIsImageLoading);
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
                id: user.id
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
        const listStatus = await getRequest(`${baseUrl}/status`);
        setListPost(listStatus)
        await fetchPostUser();
        await fetchImagePostUser();
    };


    const handleInputChange = (value) => {
        setTextMessage(value);
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleImageClose = () => {
        setImageSrcProfile(null);
    };

    const handleImageUploadMore = (e) => {
        uploadImages(e, (images) => {
            setIsImageLoading(false);
            setImageSrcProfile((prevImages) => [...prevImages, ...images]);
        }, setIsImageLoading);
    };
    const handlePrivacyPostChange = (event) => {
        setPrivacyValue(event.target.value);
    };
    const handlePrivacyPostClose = () => {
        setShowPrivacyPost(false);
    };
    const handleChangePostPrivacy = () => {
        setPrivacyPost(privacyValue)
        setShowPrivacyPost(false);
    }


    // sort to time
    const sortedListPost = listPost.slice().sort((a, b) => {
        const timeA = new Date(a.time);
        const timeB = new Date(b.time);
        return timeB - timeA;
    });


    //show options bai viet
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
    //edit
    const [showPostEdit, setShowPostEdit] = useState(false);
    const [postEditIndex, setPostEditIndex] = useState([]);
    const [privacyIndex, setPrivacyIndex] = useState(null);
    const [postUserPrivacy, setPostUserPrivacy] = useState(null);

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


    const handlePrivacyClose = () => {
        setShowPrivacy(false);
        setPrivacyIndex(null);
    };

    const handlePrivacyShow = (index) => {
        setShowPrivacy(true);
        setPrivacyIndex(index)
    };


    useEffect(() => {
        if (imageSrcProfile) {
            setIsImageLoading(false);
        }
    }, [imageSrcProfile]);

    //delete
    const [showDelete, setShowDelete] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);


    const handleCloseAlert = () => {
        setShowDelete(false);
    }

    const handleShowAlert = (postId) => {
        console.log("vao day", postId)
        setPostIdToDelete(postId)
        setShowDelete(true);
    }

    const handleDeleteStatus = (async (postId) => {
        setIsPostLoading(true);
        const response = await deleteRequest(`${baseUrl}/status/${postId}`);
        setIsPostLoading(false);
        const listStatus = await getRequest(`${baseUrl}/status`);
        setListPost(listStatus)
        setShowDelete(false);
        await fetchPostUser();

    })


    const toastOptions = {
        position: "top-center",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    };

    const onLikeClick = () => {
        console.log("OK");
    }

    return (
        <>
            <Navbar></Navbar>

            <div className='home-container'>
                <Sidebar></Sidebar>
                <div className="main-content">
                    <div className="home-content">
                        <div className="write-post-container" ref={containerRef}>
                            <div className="user-profile">
                                <div className="user-avatar" onClick={() => goProfile(user?.username)}>
                                    <img src={user.avatar}/>
                                </div>
                                <div className="user-post-profile">
                                    <p onClick={() => goProfile(user?.username)}>{user?.fullname}</p>

                                    {user?.username === userLogin.username ? (
                                        <small onClick={handlePrivacyPostShow} style={{cursor: "pointer"}}>
                                            {privacyPost === "public" ? (
                                                <>
                                                    <FaEarthAmericas/>
                                                    <i className="fas fa-caret-down" style={{marginLeft: "5px"}}/>
                                                </>
                                            ) : privacyPost === "friend" ? (
                                                <>
                                                    <FaUserFriends/>
                                                    <i className="fas fa-caret-down" style={{marginLeft: "5px"}}/>
                                                </>
                                            ) : privacyPost === "private" ? (
                                                <>
                                                    <BiSolidLockAlt/>
                                                    <i className="fas fa-caret-down" style={{marginLeft: "5px"}}/>
                                                </>
                                            ) : (
                                                <>
                                                    <FaEarthAmericas/>
                                                    <i className="fas fa-caret-down" style={{marginLeft: "5px"}}/>
                                                </>
                                            )}
                                        </small>
                                    ) : (
                                        <small style={{cursor: "pointer"}}>
                                            {privacyPost === "public" ? (
                                                <>
                                                    <FaEarthAmericas/>
                                                    <i className="fas fa-caret-down" style={{marginLeft: "5px"}}/>
                                                </>
                                            ) : privacyPost === "friend" ? (
                                                <>
                                                    <FaUserFriends/>
                                                    <i className="fas fa-caret-down" style={{marginLeft: "5px"}}/>
                                                </>
                                            ) : privacyPost === "private" ? (
                                                <>
                                                    <BiSolidLockAlt/>
                                                    <i className="fas fa-caret-down" style={{marginLeft: "5px"}}/>
                                                </>
                                            ) : (
                                                <>
                                                    <FaEarthAmericas/>
                                                    <i className="fas fa-caret-down" style={{marginLeft: "5px"}}/>
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
                                Post
                            </Button>

                            <div style={{position: "relative"}}>

                                {imageSrcProfile && imageSrcProfile.length > 0 && imageSrcProfile.length < 3 ? (
                                    <div className="post-image-container">
                                        {imageSrcProfile.map((src, index) => (
                                            <img key={index} src={src} alt={`Image ${index}`}/>
                                        ))}
                                    </div>
                                ) : imageSrcProfile && imageSrcProfile.length === 3 ? (
                                    <div className="post-image-container three-image">
                                        {imageSrcProfile.map((src, index) => (
                                            <img key={index} src={src} alt={`Image ${index}`}/>
                                        ))}
                                    </div>
                                ) : imageSrcProfile && imageSrcProfile.length === 4 ? (
                                    <div className="post-image-container four-image">
                                        {imageSrcProfile.map((src, index) => (
                                            <img key={index} src={src} alt={`Image ${index}`}/>
                                        ))}
                                    </div>
                                ) : imageSrcProfile && imageSrcProfile.length > 4 ? (
                                        <div className="post-image-container five-image">
                                            {imageSrcProfile.map((src, index) => (
                                                <img key={index} src={src} alt={`Image ${index}`}/>
                                            ))}
                                        </div>
                                    )
                                    :
                                    null}

                                {imageSrcProfile && imageSrcProfile.length > 0 && (
                                    <>
                                        <div className="post-image-close">
                                            <Button variant="light" onClick={handleImageClose}
                                                    style={{borderRadius: "50%"}}>X</Button>
                                        </div>
                                        <label htmlFor="image-upload-add" className="post-image-add"
                                               style={{cursor: "pointer"}}>
                                            <div className="btn btn-light">Add image</div>
                                            <input
                                                id="image-upload-add"
                                                type="file"
                                                multiple
                                                onChange={handleImageUploadMore}
                                                style={{display: "none"}}
                                            />
                                        </label>
                                        <Button variant="light" className="post-image-change" onClick={handleShow}>Edit
                                            all</Button>
                                    </>
                                )}
                            </div>

                            <div className="add-post-links">
                                <Link to="">
                                    <img src="./images/watch.png"/> Video
                                </Link>
                                <label htmlFor="image-upload-post" className="upload-label" style={{
                                    cursor: "pointer",
                                    alignItems: "center",
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <img src="./images/photo.png" style={{marginRight: "10px", width: "20px"}}/> Picture
                                    <input
                                        id="image-upload-post"
                                        type="file"
                                        multiple
                                        onChange={handleImageUploadPost}
                                        style={{display: "none"}}
                                    />
                                </label>
                                <Link to="">
                                    <img src="./images/feeling.png"/> Emotion
                                </Link>
                            </div>
                        </div>
                    </div>


                    {/*/!*listStatus*!/*/}
                    <div>
                        {sortedListPost.map((post, index) => (

                            <div key={index}>
                                {post.sender.id !== post.receiver.id ? (
                                    <div></div>
                                ) : (
                                    <div>
                                        {post.visibility !== "public" && post.visibility === "private" ? (
                                            <div>
                                            </div>
                                        ) : (
                                            <div>
                                                {checkBlock.some((item) =>
                                                    (item?.user1.id === post.sender.id || item.user2.id === post.sender.id) &&
                                                    (userLogin.id === item?.user1.id || userLogin.id === item?.user2.id)
                                                ) && userLogin.id !== post.sender.id ? (
                                                    // Nếu người gửi bài viết đã bị chặn, ẩn bài viết
                                                    <div></div>
                                                ) : (
                                                    <div>
                                                        {post.visibility === "friend" &&
                                                        (!checkFriend.length > 0 ||
                                                            !checkFriend.some(
                                                                (item) =>
                                                                    post.sender.id === item?.user1.id ||
                                                                    post.sender.id === item?.user2.id
                                                            ))  ? (<div></div>) : (
                                                            <div className="index-content">
                                                                <div className="post-container">
                                                                    <div className="user-profile">
                                                                        <div style={{
                                                                            display: "flex",
                                                                            alignItems: "center"
                                                                        }}>
                                                                            <div className="user-avatar"
                                                                                 onClick={() => goProfile(post.sender?.username)}>
                                                                                <img src={post.sender?.avatar}
                                                                                     alt="User Avatar"/>
                                                                            </div>
                                                                            <div>
                                                                                <div className="post-user-name" onClick={() => goProfile(post.sender?.username)}>
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
                                                                                            timeAgo = "Just now";
                                                                                        } else if (timeDiffInMinutes < 60) {
                                                                                            timeAgo = `${timeDiffInMinutes} minutes ago`;
                                                                                        } else {
                                                                                            const hours = Math.floor(timeDiffInMinutes / 60);
                                                                                            const minutes = timeDiffInMinutes % 60;
                                                                                            if (hours >= 24) {
                                                                                                timeAgo = "1 day ago";
                                                                                            } else if (minutes === 0) {
                                                                                                timeAgo = `${hours} hours`;
                                                                                            } else {
                                                                                                timeAgo = `${hours} hours ${minutes} minutes ago`;
                                                                                            }
                                                                                        }

                                                                                        return (
                                                                                            <div
                                                                                                className="post-privacy-change">
                                                                                                <span>{timeAgo}</span>


                                                                                                <>
                                                                                                    {post.visibility === 'public' && (
                                                                                                        <i className="fas fa-globe-americas"
                                                                                                           style={{
                                                                                                               color: '#65676B',
                                                                                                               cursor: 'pointer',
                                                                                                               padding: "5px",
                                                                                                               fontSize: "smaller"
                                                                                                           }}/>
                                                                                                    )}
                                                                                                    {post.visibility === 'friend' && (
                                                                                                        <i className="fas fa-user-friends"
                                                                                                           style={{
                                                                                                               color: '#65676B',
                                                                                                               cursor: 'pointer',
                                                                                                               padding: "5px",
                                                                                                               fontSize: "smaller"
                                                                                                           }}/>
                                                                                                    )}
                                                                                                    {post.visibility === 'private' && (
                                                                                                        <i className="fas fa-lock"
                                                                                                           style={{
                                                                                                               color: '#65676B',
                                                                                                               cursor: 'pointer',
                                                                                                               padding: "5px",
                                                                                                               fontSize: "smaller"
                                                                                                           }}/>
                                                                                                    )}
                                                                                                </>


                                                                                                {user?.username !== userProfile[0]?.username && user?.username === post?.sender?.username && (
                                                                                                    <>
                                                                                                        {postUser[index]?.visibility === 'public' && (
                                                                                                            <i className="fas fa-globe-americas"
                                                                                                               style={{
                                                                                                                   color: '#65676B',
                                                                                                                   cursor: 'pointer',
                                                                                                                   padding: "5px",
                                                                                                                   fontSize: "smaller"
                                                                                                               }}/>
                                                                                                        )}
                                                                                                        {postUser[index]?.visibility === 'friend' && (
                                                                                                            <i className="fas fa-user-friends"
                                                                                                               style={{
                                                                                                                   color: '#65676B',
                                                                                                                   cursor: 'pointer',
                                                                                                                   padding: "5px",
                                                                                                                   fontSize: "smaller"
                                                                                                               }}/>
                                                                                                        )}
                                                                                                        {postUser[index]?.visibility === 'private' && (
                                                                                                            <i className="fas fa-lock"
                                                                                                               style={{
                                                                                                                   color: '#65676B',
                                                                                                                   cursor: 'pointer',
                                                                                                                   padding: "5px",
                                                                                                                   fontSize: "smaller"
                                                                                                               }}/>
                                                                                                        )}
                                                                                                    </>
                                                                                                )}

                                                                                                {user?.username !== post?.sender?.username && user?.username !== userProfile[0]?.username && (
                                                                                                    <>
                                                                                                        {postUser[index]?.visibility === 'public' && (
                                                                                                            <i className="fas fa-globe-americas"
                                                                                                               style={{
                                                                                                                   color: '#65676B',
                                                                                                                   cursor: 'pointer',
                                                                                                                   padding: "5px",
                                                                                                                   fontSize: "smaller"
                                                                                                               }}/>
                                                                                                        )}
                                                                                                        {postUser[index]?.visibility === 'friend' && (
                                                                                                            <i className="fas fa-user-friends"
                                                                                                               style={{
                                                                                                                   color: '#65676B',
                                                                                                                   cursor: 'pointer',
                                                                                                                   padding: "5px",
                                                                                                                   fontSize: "smaller"
                                                                                                               }}/>
                                                                                                        )}
                                                                                                        {postUser[index]?.visibility === 'private' && (
                                                                                                            <i className="fas fa-lock"
                                                                                                               style={{
                                                                                                                   color: '#65676B',
                                                                                                                   cursor: 'pointer',
                                                                                                                   padding: "5px",
                                                                                                                   fontSize: "smaller"
                                                                                                               }}/>
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
                                                                            <div className="user-action-post"
                                                                                 onClick={() => showPostMenu(index)}>
                                                                                <Button variant="light">
                                                                                    <i className="fas fa-ellipsis-h"></i>
                                                                                </Button>
                                                                                <ol className={`post-menu-${index} show-post-menu`}
                                                                                    style={{display: "none"}}>

                                                                                    {user?.username !== userProfile[0]?.username && user?.username !== post?.sender?.username && (
                                                                                        <li onClick={() => handlePostEditShow(index)}>
                                                                                            <i className="far fa-edit"></i>
                                                                                            <span>Edit post</span>
                                                                                        </li>
                                                                                    )}

                                                                                    {user?.username === userProfile[0]?.username && user?.username === post?.sender?.username && (
                                                                                        <li onClick={() => handlePostEditShow(index)}>
                                                                                            <i className="far fa-edit"></i>
                                                                                            <span>Edit post</span>
                                                                                        </li>
                                                                                    )}

                                                                                    <li onClick={() => {
                                                                                        handleShowAlert(post.id)
                                                                                    }}>
                                                                                        <i className="far fa-trash-alt"></i>
                                                                                        <span>Delete post</span>
                                                                                    </li>
                                                                                </ol>
                                                                            </div>
                                                                        )}

                                                                        {user?.username !== userProfile[0]?.username && user?.username === post?.sender?.username && (
                                                                            <div className="user-action-post"
                                                                                 onClick={() => showPostMenu(index)}>
                                                                                <Button variant="light">
                                                                                    <i className="fas fa-ellipsis-h"></i>
                                                                                </Button>
                                                                                <ol className={`post-menu-${index} show-post-menu`}
                                                                                    style={{display: "none"}}>

                                                                                    <li onClick={() => handlePostEditShow(index)}>
                                                                                        <i className="far fa-edit"></i>
                                                                                        <span>Edit post</span>
                                                                                    </li>

                                                                                    <li onClick={() => {
                                                                                        handleShowAlert(post.id)
                                                                                    }}>
                                                                                        <i className="far fa-trash-alt"></i>
                                                                                        <span>Delete post</span>
                                                                                    </li>
                                                                                </ol>
                                                                            </div>
                                                                        )}

                                                                    </div>

                                                                    <div className="post-user">
                                                                        <p className="post-text">{post.content}</p>
                                                                        {post.image.length > 0 && (
                                                                            <div
                                                                                className={`post-image ${postImageUser[index]?.length === 4 ? 'four' :
                                                                                    postImageUser[index]?.length === 5 ? 'five' :
                                                                                        postImageUser[index]?.length > 2 && postImageUser[index]?.length !== 4 ? 'three' : ''
                                                                                }`}>
                                                                                {post.image.map((image, imageIndex) => (
                                                                                    <img src={image.imageUrl}
                                                                                         alt="Post Image"
                                                                                         className="post-img"
                                                                                         key={imageIndex}/>
                                                                                ))}
                                                                            </div>
                                                                        )}

                                                                        <div className="interact-status"
                                                                             style={{
                                                                                 display: "flex",
                                                                                 justifyContent: "space-between"
                                                                             }}>
                                                                            {post.accountLike === 0 ? (
                                                                                    <div>
                                                                                    </div>
                                                                                ) :
                                                                                (post.accountLike > 0 && post.accountLike < 3 ? (
                                                                                    <div className="activity-icons">
                                                                                        <BiSolidLike
                                                                                            style={{color: "rgb(27 97 255)"}}
                                                                                            className="like-icon"/>
                                                                                        <span
                                                                                            style={{marginLeft: "5px"}}>
                                                        {post.listUserLike.map((userLike) => {
                                                            if (user.username === userLike?.user?.username) {
                                                                return "You";
                                                            } else {
                                                                return userLike?.user?.fullname;
                                                            }
                                                        }).join(" and ")} liked
                                                    </span>
                                                                                    </div>
                                                                                ) : (
                                                                                    post.accountLike > 2 && (
                                                                                        <div className="activity-icons">
                                                                                            <BiSolidLike
                                                                                                style={{color: "rgb(27 97 255)"}}
                                                                                                className="like-icon"/>
                                                                                            <span
                                                                                                style={{marginLeft: "5px"}}>{post?.accountLike} </span>
                                                                                        </div>
                                                                                    )
                                                                                ))}
                                                                            {post.commentCount.commentCount < 1 ? (
                                                                                <div></div>
                                                                            ) : (
                                                                                <div>
                                                                                    <span>{post?.commentCount?.commentCount} comment</span>
                                                                                </div>
                                                                            )
                                                                            }

                                                                        </div>
                                                                    </div>

                                                                    <div className="post-action">

                                                                        <div className="post-like">
                                                                            <Like key={post.id} postId={post.id}
                                                                                  countLike={post.acountLike}
                                                                                  checkStatusLike={post.isLiked}
                                                                                  isCountLike={isCountLike}
                                                                                  setIsCountLike={setIsCountLike}
                                                                                  load={handleReloadCount}
                                                                                  receiver={post.receiver.id}
                                                                                  onLikeClick={onLikeClick}
                                                                            ></Like>
                                                                        </div>

                                                                        <div className="post-comment">
                                                                            <Button variant="light"
                                                                                    onClick={() => handleToggleComment(index)}>
                                                                                <i className="far fa-comment"></i>
                                                                                <span>Comment</span>
                                                                            </Button>
                                                                        </div>

                                                                    </div>
                                                                    {visibleCommentIndex === index && (
                                                                        <CommentContextProvider postId={post.id}
                                                                                                reloadHome={handleReloadCmt}>
                                                                            <Comment post={post}
                                                                                     postVisi={post.visibility}
                                                                                     postSenderId={post.sender.id}
                                                                                     postId={post.id}
                                                                                     showComment={showComment}
                                                                                     setShowComment={setShowComment}/>
                                                                        </CommentContextProvider>
                                                                    )}
                                                                </div>
                                                            </div>)
                                                    }</div>)}
                                            </div>
                                        )}
                                    </div>)}


                            </div>
                        ))}
                    </div>

                </div>
                <RightSidebar></RightSidebar>
            </div>

            {profileId ? (
                <div className='chat-bottom-bar'>
                    <CometChatMessages chatWithUser={profileId.toString()}/>
                    <i className="far fa-window-close chat-bar-close" onClick={closeChat}></i>
                </div>
            ) : null}

            <ToastContainer/>
            {isPostLoading || isImageLoading ? (
                <LoadingNew></LoadingNew>
            ) : null
            }

            <Modal show={showDelete} onHide={handleCloseAlert} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{transform: "translateX(170px)"}}>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure to delete this Post ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAlert}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleDeleteStatus(postIdToDelete)}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>


            <CustomModal show={show} onHide={handleClose} centered className="custom-modal">
                <Modal.Header closeButton>
                    {/* <Modal.Title style={{ transform: "translateX(600px)" }}>Xóa ảnh</Modal.Title> */}
                </Modal.Header>
                <Modal.Body>
                    {imageSrcProfile && imageSrcProfile.length > 0 && (
                        <div className="modal-image-container">
                            {imageSrcProfile.map((src, index) => (
                                <div className="modal-image-change" key={index}>
                                    <img src={src} alt={`Image ${index}`}/>
                                    <Button variant="light" className="modal-image-delete"
                                            onClick={() => handleDeleteImage(index)}>
                                        X
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </CustomModal>


            <Modal show={showPrivacyPost} onHide={handlePrivacyPostClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Select audience</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-privacy-container">
                        <div className="modal-privacy-select">
                            <div className="privacy-container">
                                <div className="privacy-select">
                                    <div className="privacy-icon">
                                        <FaEarthAmericas/>
                                    </div>
                                </div>
                                <div className="privacy-name">
                                    <h5>Public</h5>
                                    <span>Anyone on or off Facebook</span>
                                </div>
                            </div>

                            <div className="input-radio">
                                <input type="radio" name="privacy" value="public" checked={privacyValue === 'public'}
                                       onChange={handlePrivacyPostChange}/>
                            </div>
                        </div>

                        <div className="modal-privacy-select">
                            <div className="privacy-container">
                                <div className="privacy-select">
                                    <div className="privacy-icon">
                                        <FaUserFriends/>
                                    </div>
                                </div>
                                <div className="privacy-name">
                                    <h5>Friend</h5>
                                    <span>Your friends on facebook</span>
                                </div>
                            </div>
                            <div className="input-radio">
                                <input type="radio" name="privacy" value="friend" checked={privacyValue === 'friend'}
                                       onChange={handlePrivacyPostChange}/>
                            </div>

                        </div>

                        <div className="modal-privacy-select">
                            <div className="privacy-container">
                                <div className="privacy-select">
                                    <div className="privacy-icon">
                                        <BiSolidLockAlt/>
                                    </div>
                                </div>
                                <div className="privacy-name">
                                    <h5>Private</h5>
                                    <span>Only me</span>
                                </div>
                            </div>

                            <div className="input-radio">
                                <input type="radio" name="privacy" value="private" checked={privacyValue === 'private'}
                                       onChange={handlePrivacyPostChange}/>
                            </div>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handlePrivacyPostClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleChangePostPrivacy}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={showPrivacy && privacyIndex !== null} onHide={handlePrivacyClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Select audience</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-privacy-container">
                        <div className="modal-privacy-select">
                            <div className="privacy-container">
                                <div className="privacy-select">
                                    <div className="privacy-icon">
                                        <FaEarthAmericas/>
                                    </div>
                                </div>
                                <div className="privacy-name">
                                    <h5>Public</h5>
                                    <span>Anyone on or off Facebook</span>
                                </div>
                            </div>

                            <div className="input-radio">
                                <input type="radio" name="privacy" checked={postUserPrivacy === 'public'}
                                       onChange={handlePrivacyChange} value="public"/>
                            </div>
                        </div>

                        <div className="modal-privacy-select">
                            <div className="privacy-container">
                                <div className="privacy-select">
                                    <div className="privacy-icon">
                                        <FaUserFriends/>
                                    </div>
                                </div>
                                <div className="privacy-name">
                                    <h5>Friend</h5>
                                    <span>Your friends on facebook</span>
                                </div>
                            </div>

                            <div className="input-radio">
                                <input type="radio" name="privacy" checked={postUserPrivacy === 'friend'}
                                       onChange={handlePrivacyChange} value="friend"/>
                            </div>

                        </div>

                        <div className="modal-privacy-select">
                            <div className="privacy-container">
                                <div className="privacy-select">
                                    <div className="privacy-icon">
                                        <BiSolidLockAlt/>
                                    </div>
                                </div>
                                <div className="privacy-name">
                                    <h5>Private</h5>
                                    <span>Only me</span>
                                </div>
                            </div>

                            <div className="input-radio">
                                <input type="radio" name="privacy" checked={postUserPrivacy === 'private'}
                                       onChange={handlePrivacyChange} value="private"/>
                            </div>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handlePrivacyClose}>
                        Close
                    </Button>
                    <Button variant="primary"
                            onClick={() => handleChangePrivacy(postUser[privacyIndex]?.id, postUserPrivacy)}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            <EditPost reload={handleReloadCmt} inforUser={userLogin} showPostEdit={showPostEdit} setShowPostEdit={setShowPostEdit} postEditIndex={postEditIndex}
                      setPostEditIndex={setPostEditIndex}></EditPost>

        </>
    );
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


export default Home;
