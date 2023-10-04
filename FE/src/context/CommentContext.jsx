import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { baseUrl, deleteRequest, getRequest, postRequest, putRequest } from '../utils/services';
import { AuthContext } from './AuthContext';
import { PostContext } from './PostContext';
import { HomeContext } from './HomeContext';
import { format } from 'date-fns';

import uploadImages from "../hooks/UploadMulti";

export const CommentContext = createContext();

export const CommentContextProvider = ({ children, postId, reloadHome }) => {
    const { socket } = useContext(HomeContext)
    const { user } = useContext(AuthContext);
    const { fetchPostUser, commentList, setCommentList } = useContext(PostContext);
    const [postStatusId, setPostStatusId] = useState(postId);
    const [checkTime, setCheckTime] = useState(false);
    const [textMessage, setTextMessage] = useState('');
    const [textComment, setTextComment] = useState('');

    const handleInputChange = useCallback((value) => {
        setTextMessage(value);
    }, []);
    
    const handleCommentChange = (event) => {
        const value = event.target.value;
        setTextComment(value);
    }

    useEffect(() => {
        if (postId && checkTime === false) {
            axios.get(`${baseUrl}/comments/statusId/${postId}`).then((r) => {
                console.log(r.data.commentRecords);
                setCommentList(r.data.commentRecords);
            });
        }
    }, [postId]);

    const handleSendMessage = useCallback(async () => {

        try {
            const data = {
                user: {
                    id: user.id,
                },
                content: textMessage,
                status: {
                    id: postStatusId,
                },
                time: new Date().toISOString(),
            };

            data.user.fullname = user.fullname;
            data.user.avatar = user.avatar;

            const newComment = await postRequest(`${baseUrl}/comments`, JSON.stringify(data));
            setCommentList((prevCommentList) => [...prevCommentList, newComment]);
            setTextMessage("");

            fetchPostUser();

            const statusReponse =  await getRequest(`${baseUrl}/status/statusId/${data.status.id}`);

            if (socket) {
                socket.emit("commentStatus", {     
                    senderId: user?.id,
                    receiverId: statusReponse[0]?.sender.id,
                    postId: postId,
                    commentId: newComment.id
                });
            }
            reloadHome();

        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }, [textMessage, postStatusId, user, fetchPostUser]);

    const handleDeleteMessage = useCallback((commentId) => {
        deleteRequest(`${baseUrl}/comments/commentId/${commentId}`)
            .then(() => {
                const updatedCommentList = commentList.filter((comment) => comment.id !== commentId);
                reloadHome();
                setCommentList(updatedCommentList);
                fetchPostUser();
            })
            .catch((error) => {
                console.error("Error deleting comment:", error);
            });
    }, [commentList, fetchPostUser]);

    const handleEditMessage = useCallback((commentId, context) => {
        console.log("edit");
        const time = new Date();
        const formattedTime = format(time, "h:mm a"); // Định dạng thời gian theo "7:10 PM"

        const data = {
            content: context,
            timeEdit: formattedTime,
        };
        console.log(data);

        putRequest(`${baseUrl}/comments/commentId/${commentId}`, JSON.stringify(data))
            .then(() => {
                const updatedCommentList = commentList.map((comment) => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            content: context,
                            timeEdit: time,
                        };
                    }
                    return comment;
                });

                setCommentList(updatedCommentList);
            })
            .catch((error) => {
                console.error("Error editing comment:", error);
            });
    }, [commentList]);

    return (
        <CommentContext.Provider
            value={{
                setCheckTime,
                checkTime,
                textMessage,
                handleInputChange,
                handleDeleteMessage,
                handleSendMessage,
                handleEditMessage,
                commentList,
                handleCommentChange,
                textComment,
            }}
        >
            {children}
        </CommentContext.Provider>
    );
};