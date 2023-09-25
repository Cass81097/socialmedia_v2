import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {baseUrl, deleteRequest, postRequest, putRequest} from '../utils/services';
import { AuthContext } from './AuthContext';
import { PostContext } from './PostContext';
import uploadImages from "../hooks/UploadMulti";

export const CommentContext = createContext();

export const CommentContextProvider = ({ children ,postId}) => {
    const [postStatusId, setPostStatusId] = useState(postId); 
    const [commentList, setCommentList] = useState([]); 
    const [checkTime , setCheckTime] = useState(false)

    const { user } = useContext(AuthContext);
    const { fetchPostUser } = useContext(PostContext);

    const [textMessage, setTextMessage] = useState('');


    const handleInputChange = (value) => {
        setTextMessage(value);
    };

    useEffect(() => {
        if (postId && checkTime === false ) {
          
            axios.get(`http://localhost:5000/comments/statusId/${postId}`).then((r) => {
          
                setCommentList(r.data.commentRecords);
            });
        }
    }, [postId]);

    const handleSendMessage = async () => {
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
                data.user.avatar = user.avatar


               const  newComment = await postRequest(`${baseUrl}/comments`, JSON.stringify(data));

          
            setCommentList([...commentList,newComment]);

            setTextMessage("");
            fetchPostUser();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleDeleteMessage = async (commentId) =>{
        console.log("delete")
        await deleteRequest(`${baseUrl}/comments/commentId/${commentId}` );


        const updatedCommentList = commentList.filter((comment) => comment.id !== commentId);
        setCommentList(updatedCommentList);
        fetchPostUser();
    }

    const handleEditMessage = async (commentId,context) => {
        console.log("edit")
        const time = new Date()
        try {

     
            const data = {
                content: context,
                timeEdit : time
            };
            console.log(data)

            await putRequest(`${baseUrl}/comments/commentId/${commentId}`, JSON.stringify(data));

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


        } catch (error) {
            console.error('Error editing comment:', error);
        }
    }

    return (
        <CommentContext.Provider value={{setCheckTime , checkTime, textMessage, handleInputChange, handleDeleteMessage, handleSendMessage, handleEditMessage, commentList }}>
            {children}
        </CommentContext.Provider>
    );
};
