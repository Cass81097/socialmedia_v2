import React, { createContext, useCallback, useEffect, useState, useContext } from "react";
import { baseUrl, getRequest } from "../utils/services";
import { ProfileContext } from "./ProfileContext";
import { AuthContext } from "./AuthContext";

export const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const { userProfile } = useContext(ProfileContext);
    const { socket } = useContext(ProfileContext);
    const [postUser, setPostUser] = useState([]);
    const [postImageUser, setPostImageUser] = useState([]); 
    const [commentList, setCommentList] = useState([]);
    const [commentNew, setCommentNew] = useState([]);
    const [listPostALl , setListPostAll] = useState([])


    const fetchPostUser = useCallback(async () => {
        try {
            const storedUser = localStorage.getItem('User');
            const userStorage = JSON.parse(storedUser).username;
            const userId = userProfile?.[0]?.id;
            let response;
            if (userStorage === userProfile[0]?.username) {
                response = await getRequest(`${baseUrl}/status/${userId}`);
         
            } 
            else {
                const friendshipCheckResponse = await getRequest(`${baseUrl}/friendShips/checkStatusByUserId/${userId}/${user?.id}`);

                if (friendshipCheckResponse?.status === 'friend') {
                    response = await getRequest(`${baseUrl}/status/visibility/${userId}`);
                } else {
                    response = await getRequest(`${baseUrl}/status/visibility/public/${userId}`);
                }
            } 
            setPostUser(response);
        } catch (error) {
            console.error("Error fetching user profiles:", error);
        }
    }, [user?.id, userProfile]);

    const fetchImagePostUser = useCallback(async () => {
        try {
            const imagePostPromises = postUser.map(async (post) => {
                const response = await getRequest(`${baseUrl}/imageStatus/${post.id}`);
                return response;
            });

            const imagePostResponses = await Promise.all(imagePostPromises);
            setPostImageUser(imagePostResponses);
        } catch (error) {
            console.error("Error fetchingảnh posts:", error);
        }
    }, [postUser]);
    // const findAllPost = useCallback( async ()=>{
    //     try {
    //         const listPost = await getRequest(`${baseUrl}/status`)
    //         setListPostAll(listPost)
    //
    //     }catch (e){
    //         console.error(e,"Cos loi")
    //     }
    // })

    useEffect(() => {
        const fetchPostUser = async () => {
            try {
                const storedUser = localStorage.getItem('User');
                const userStorage = JSON.parse(storedUser)?.username;
                const userId = userProfile?.[0]?.id;
    
                let response;
                if (userStorage === userProfile[0]?.username) {
                    response = await getRequest(`${baseUrl}/status/${userId}`);
                } else {
                    const friendshipCheckResponse = await getRequest(`${baseUrl}/friendShips/checkStatusByUserId/${userId}/${user?.id}`);
    
                    if (friendshipCheckResponse?.status === 'friend') {
                        response = await getRequest(`${baseUrl}/status/visibility/${userId}`);
                    } else {
                        response = await getRequest(`${baseUrl}/status/visibility/public/${userId}`);
                    }
                }
    
                setPostUser(response);
            } catch (error) {
                console.error("Error fetching user profiles:", error);
            }
        };
    
        fetchPostUser();
    }, [user?.id, userProfile, baseUrl]);

    useEffect(() => {
        const fetchImagePostUser = async () => {
            try {
                const imagePostPromises = postUser.map(async (post) => {
                    const response = await getRequest(`${baseUrl}/imageStatus/${post.id}`);
                    return response;
                });
    
                const imagePostResponses = await Promise.all(imagePostPromises);
                setPostImageUser(imagePostResponses);
            } catch (error) {
                console.error("Error fetching image posts:", error);
            }
        };
    
        fetchImagePostUser();
    }, [postUser, baseUrl]);




    return (
        <PostContext.Provider value={{ postUser, fetchPostUser, postImageUser, fetchImagePostUser, commentList, setCommentList}}>
            {children}
        </PostContext.Provider>
    );
};