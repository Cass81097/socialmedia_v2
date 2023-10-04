import "../../styles/user/post/editPost.css"
import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl, postRequest, getRequest, putRequest, deleteRequest } from "../../utils/services";
import { AuthContext } from "../../context/AuthContext";
import { PostContext } from "../../context/PostContext";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import LoadingNew from "./LoadingNew";
import uploadImages from "../../hooks/UploadMulti";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import {ProfileContext} from "../../context/ProfileContext";

export default function EditPost(props) {
    const { showPostEdit, setShowPostEdit, postEditIndex, setPostEditIndex, inforUser, reload } = props;
    const { user } = useContext(AuthContext)
    const { postUser, postImageUser, fetchPostUser, fetchImagePostUser } = useContext(PostContext);
    // const {setUserProfile} = useContext(ProfileContext)
    const [isPostEditLoading, setIsPostEditLoading] = useState(false);
    const [imageEdit, setImageEdit] = useState([]);
    const [imagePostEdit, setImagePostEdit] = useState([]);
    const [textMessage, setTextMessage] = useState('');
    const [showChangeImage, setShowChangeImage] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

   useEffect(()=>{
       if (postUser.length === 0) {

           const fetchData = async () => {
               try {
                   const response = await getRequest(`${baseUrl}/status/sender/${inforUser?.id}`);
                   setMyPost(response);
               } catch (error) {
                   console.error("Error fetching data:", error);
               }
           };
           fetchData()
       }else {
           setMyPost(postUser)
       }
   },[postUser])
    const [post, setMyPost] = useState(postUser);


    const handleCloseChangeImage = async () => {
        const postId = postUser[postEditIndex].id;

        const responseImage = await deleteRequest(`${baseUrl}/imageStatus/delete/${postId}`);

        const postRequests = imageEdit.map(async (image) => {
            const dataImage = {
                imageUrl: image.imageUrl,
                status: {
                    id: postId
                }
            };
            return postRequest(`${baseUrl}/imageStatus`, JSON.stringify(dataImage));
        });

        const responseImages = await Promise.all(postRequests);
        setImagePostEdit([]);
        setShowChangeImage(false);
    };

    const handleShowChangeImage = async () => {
        setShowChangeImage(true);
    };

    useEffect(() => {
        if (post && post[postEditIndex]?.image) {
            setImageEdit(post[postEditIndex]?.image);
        }
    }, [post, postEditIndex]);

    useEffect(() => {
        if (post[postEditIndex]?.content !== undefined) {
            setTextMessage(post[postEditIndex]?.content);
        }
    }, [post, postEditIndex]);
  
    const handleInputChange = (event) => {
        const value = event.target.value;
        setTextMessage(value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleEditPost();
        }
    };

    const handlePostEditClose = () => {
        setPostEditIndex([])
        setShowPostEdit(false);
    }



    const handleEditPost = async () => {
        setIsPostEditLoading(true);

        const postId = post[postEditIndex].id;
        console.log("id edit", postId)
        const data = {
            content: textMessage
        };

        const response = await putRequest(`${baseUrl}/status/content/${postId}`, JSON.stringify(data));
        console.log(response)

        if (imageEdit.length === 0) {
            const responseImage = await deleteRequest(`${baseUrl}/imageStatus/delete/${postId}`);
        } else {
            const postRequests = imagePostEdit.map(async (image) => {
                const dataImage = {
                    imageUrl: image.imageUrl,
                    status: {
                        id: postId
                    }
                };
                return postRequest(`${baseUrl}/imageStatus`, JSON.stringify(dataImage));
            });

            const responseImages = await Promise.all(postRequests);
            setImagePostEdit([])
        }

        setIsPostEditLoading(false);
        setShowPostEdit(false);
        await fetchPostUser();
        await fetchImagePostUser();
        await reload();
    };

    const handleImageDelete = async () => {
        setImageEdit([]);
    }

    const handleImageUploadMore = (e) => {
        uploadImages(e, (images) => {
            setIsPostEditLoading(false);
            const newImages = images.map((image) => ({ imageUrl: image }));
            setImageEdit((prevImages) => [...prevImages, ...newImages]);
            setImagePostEdit([...newImages])
        }, setIsPostEditLoading);
    };

    const handleDeleteImage = async (index) => {
        setImageEdit((prevImages) => {
            const newImages = [...prevImages];
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const onEmojiClick = (event, emojiObject) => {
        const emoji = emojiObject.emoji;
        setTextMessage((prevText) => prevText + emoji);
        setShowPicker(false);
    };

    return (
        <Modal show={showPostEdit} onHide={handlePostEditClose} centered>
            <div className="sao">
                <div className="body">
                    <div className="container">
                        <div className="wrapper">
                            <section className="post">
                                <header>Edit post</header>
                                <div className="post-form">
                                    <div className="content" style={{ margin: "82px 0 10px 0" }}>
                                        <div className="content-avatar">
                                            <img src={post[postEditIndex]?.sender.avatar} alt="logo" />
                                        </div>
                                        <div className="details">
                                            <p>{post[postEditIndex]?.sender.fullname}</p>
                                            <div className="privacy">
                                                {post[postEditIndex]?.visibility === "friend" && (
                                                    <>
                                                        <i className="fas fa-user-friends" style={{marginTop:"2px"}} />
                                                        <span>Friend</span>
                                                    </>
                                                )}
                                                {post[postEditIndex]?.visibility === "public" && (
                                                    <>
                                                        <i className="fas fa-globe-americas" style={{marginTop:"2px"}} />
                                                        <span>Public</span>
                                                    </>
                                                )}
                                                {post[postEditIndex]?.visibility === "private" && (
                                                    <>
                                                        <i className="fas fa-lock" style={{marginTop:"2px"}} />
                                                        <span>Private</span>
                                                    </>
                                                )}
                                                <i className="fas fa-caret-down" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`post-edit-container ${imageEdit.length > 0 ? 'edit-with-image' : ''}`}>
                                        <textarea
                                            placeholder={`What are you thinking?, ${post[postEditIndex]?.sender.fullname}`}
                                            spellCheck="false"
                                            value={textMessage}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                        />

                                        <div className="image-all-edit">
                                            {imageEdit && imageEdit.length > 0 && imageEdit.length < 3 ? (
                                                <div className="img-post">
                                                    {imageEdit.map((src, index) => (
                                                        <img key={index} src={src.imageUrl} alt={`Image ${index}`} />
                                                    ))}
                                                </div>
                                            ) : imageEdit && imageEdit.length === 3 ? (
                                                <div className="img-post three-image">
                                                    {imageEdit.map((src, index) => (
                                                        <img key={index} src={src.imageUrl} alt={`Image ${index}`} />
                                                    ))}
                                                </div>
                                            ) : imageEdit && imageEdit.length === 4 ? (
                                                <div className="img-post four-image">
                                                    {imageEdit.map((src, index) => (
                                                        <img key={index} src={src.imageUrl} alt={`Image ${index}`} />
                                                    ))}
                                                </div>
                                            ) : imageEdit && imageEdit.length > 4 ? (
                                                <div className="img-post five-image">
                                                    {imageEdit.map((src, index) => (
                                                        <img key={index} src={src.imageUrl} alt={`Image ${index}`} />
                                                    ))}
                                                </div>
                                            )
                                                :
                                                null}


                                            {imageEdit && imageEdit.length > 0 && (
                                                <>
                                                    <div className="postEdit-image-close">
                                                        <Button variant="light" onClick={handleImageDelete} style={{ borderRadius: "50%" }} >X</Button>
                                                    </div>
                                                    <label htmlFor="image-upload-add" className="postEdit-image-add" style={{ cursor: "pointer" }}>
                                                        <div className="btn btn-light">Add Image</div>

                                                        <input
                                                            id="image-upload-add"
                                                            type="file"
                                                            multiple
                                                            style={{ display: "none" }}
                                                            onChange={handleImageUploadMore}
                                                        />
                                                    </label>
                                                    <Button variant="light" className="postEdit-image-change" onClick={handleShowChangeImage} >Edit all</Button>
                                                </>
                                            )}
                                        </div>
                                    </div>



                                    {/* <div className="theme-emoji">
                                        <img src="https://www.facebook.com/images/composer/SATP_Aa_square-2x.png"
                                            alt="theme" />
                                        <img src="https://www.pngmart.com/files/19/Smile-Emoji-Transparent-PNG.png"
                                            alt="smile" />
                                    </div> */}
                                    <div className="options">
                                        <p>Add into Post</p>
                                        <ul style={{ marginTop: "16px" }} className="list">



                                            <li>
                                                <label htmlFor="image-upload-add-edit">
                                                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png" alt="gallery" />
                                                </label>
                                                <input
                                                    id="image-upload-add-edit"
                                                    type="file"
                                                    multiple
                                                    style={{ display: "none" }}
                                                    onChange={handleImageUploadMore}
                                                />
                                            </li>

                                            <li>
                                                <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/b37mHA1PjfK.png"
                                                    alt="gallery" />
                                            </li>
                                            <li>
                                                <img className="emoji-icon" src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png"
                                                    alt="gallery" onClick={() => setShowPicker((val) => !val)} />
                                                {showPicker && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: "300PX",
                                                            right: '-200px',
                                                            width: '500px',
                                                            height: '150px',
                                                            zIndex: '9999'

                                                        }}
                                                    >
                                                        <Picker onEmojiClick={onEmojiClick} />
                                                    </div>
                                                )}
                                            </li>
                                            <li>
                                                <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y1/r/8zlaieBcZ72.png"
                                                    alt="gallery" />
                                            </li>
                                            <li>
                                                <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yT/r/q7MiRkL7MLC.png"
                                                    alt="gallery" />
                                            </li>
                                        </ul>
                                    </div>
                                    {/* <button className="edit-post-confirm" onClick={handleEditPost}>Sửa</button> */}
                                    <Button
                                        variant="primary"
                                        className="post-button"
                                        onClick={handleEditPost}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Change Image */}
            <CustomModal show={showChangeImage} onHide={handleCloseChangeImage} centered className="custom-modal">
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    {imageEdit && imageEdit.length > 0 && (
                        <div className="modal-image-container">
                            {imageEdit.map((src, index) => (
                                <div className="modal-image-change" key={index} >
                                    <img src={src.imageUrl} alt={`Image ${index}`} />
                                    <Button variant="light" className="modal-image-delete" onClick={() => handleDeleteImage(index)}>
                                        X
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseChangeImage}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </CustomModal>

            {isPostEditLoading ? (
                <LoadingNew></LoadingNew>
            ) : null}
        </Modal>
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
