import React, { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { baseUrl, deleteRequest, postRequest, putRequest, getRequest } from "../../../../utils/services"
import InputEmoji from "react-input-emoji";
import { AuthContext } from "../../../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../../../../styles/group/group-post.css"
import { GroupContext } from "../../../../context/GroupContext";
import LoadingNew from "../../../common/LoadingNew";
import uploadImages from "../../../../hooks/UploadMulti";

const GroupPost = (props) => {
    const { user } = useContext(AuthContext)
    const { isLoading, setIsLoading, showGroupInfo, fetchShowStatusGroup } = useContext(GroupContext)
    const [textStatusGroup, setTextStatusGroup] = useState("")
    const [imageSrcStatus, setImageSrcStatus] = useState(null);

    const handleInputChange = (value) => {
        setTextStatusGroup(value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendStatusGroup();
        }
    };

    const handleSendStatusGroup = async () => {
        setIsLoading(true);

        const data = {
            content: textStatusGroup,
            imageSrc: imageSrcStatus ? imageSrcStatus[0] : "",
            sender: {
                id: user?.id
            },
            group: {
                id: showGroupInfo?.id
            }
        }

        console.log(data);

        try {
            const response = await postRequest(`${baseUrl}/statusGroups`, JSON.stringify(data));
            setTextStatusGroup("");
            setImageSrcStatus(null);
            await fetchShowStatusGroup();
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching all users:", error);
        }
    };

    const handleImageUploadPost = (e) => {
        uploadImages(e, (images) => {
            setIsLoading(false);
            setImageSrcStatus(images);
        }, setIsLoading);
    };

    useEffect(() => {
        if (imageSrcStatus) {
            setIsLoading(false);
        }
    }, [imageSrcStatus]);

    const handleImageClose = () => {
        setImageSrcStatus(null);
    };

    return (
        <>
            <div className="home-content">
                <div className="write-post-container-group" >
                    <div className="user-profile">
                        <div className="user-avatar" >
                            <img src={user?.avatar} alt="" />
                        </div>
                        <div className="user-post-profile">
                            <p >{user?.fullname}</p>
                            <small>
                                <i className="fas fa-users" />
                            </small>
                        </div>
                    </div>
                    <div className="user-action-post">
                        <Button variant="light" style={{ width: "100%" }}>
                            <i className="fas fa-ellipsis-h"></i>
                        </Button>
                    </div>
                </div>
                <div className="post-input-container">
                    <InputEmoji
                        value={textStatusGroup}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                    <Button
                        variant="primary"
                        className={`post-button ${(!imageSrcStatus && !textStatusGroup) ? 'cursor-not-allowed' : ''}`}
                        onClick={handleSendStatusGroup}
                        disabled={!imageSrcStatus && !textStatusGroup}
                    >
                        Post
                    </Button>

                    {imageSrcStatus?.length > 0 ? (
                        <div style={{ position: "relative" }}>
                            <div className="post-image-container">
                                <img src={imageSrcStatus[0]} alt="Image Group" />
                            </div>
                            <div className="post-image-close">
                                <Button variant="light" onClick={handleImageClose} style={{ borderRadius: "50%" }}>
                                    X
                                </Button>
                            </div>
                        </div>
                    ) : null}

                    <div className="add-post-links">
                        <Link to="">
                            <img src="https://firebasestorage.googleapis.com/v0/b/users-8f542.appspot.com/o/images%2Fwatch.png?alt=media&token=bce1f6c9-ca78-43b2-9bfb-931805c8ac1d" /> Video
                        </Link>
                        <label htmlFor="image-upload-post" className="upload-label" style={{ cursor: "pointer", alignItems: "center", display: "flex", justifyContent: "center" }}>
                            <img src="https://firebasestorage.googleapis.com/v0/b/users-8f542.appspot.com/o/images%2Fphoto.png?alt=media&token=2a228d77-e95f-4d1f-9ffe-7448f839ed63" style={{ marginRight: "10px", width: "20px" }} />
                            <span style={{ fontSize: "14px", color: "#626262" }}>Picture</span>
                            <input
                                id="image-upload-post"
                                type="file"
                                style={{ display: "none" }}
                                onChange={handleImageUploadPost}
                            />
                        </label>
                        <Link to="">
                            <img src="https://firebasestorage.googleapis.com/v0/b/users-8f542.appspot.com/o/images%2Ffeeling.png?alt=media&token=c2f7dd13-1b22-4afc-b973-66ea3d5ed850" /> Emotion
                        </Link>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <LoadingNew></LoadingNew>
            ) : null
            }
        </>
    );
}

export default GroupPost;
