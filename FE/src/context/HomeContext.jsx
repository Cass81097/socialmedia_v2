import React, { createContext, useCallback, useEffect, useState, useContext } from "react";
import { baseUrl, getRequest } from "../utils/services";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";

export const HomeContext = createContext();

export const HomeContextProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [friendUser, setFriendUser] = useState([]);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUser] = useState([]);
    const [profileId, setProfileId] = useState(null);
    
    const fetchFriendUser = async () => {
        try {
            const response = await getRequest(`${baseUrl}/friendShips/listFriend/username/${user?.username}`);
            setFriendUser(response);
        } catch (error) {
            console.error("Error fetching user profiles:", error);
        }
    };

    useEffect(() => {
        const fetchFriendUser = async () => {
            try {
                const response = await getRequest(`${baseUrl}/friendShips/listFriend/username/${user?.username}`);
                setFriendUser(response);
            } catch (error) {
                console.error("Error fetching user profiles:", error);
            }
        };
        fetchFriendUser();
    }, [user]);

    // Socket
    useEffect(() => {
        const newSocket = io("http://localhost:3000")
        setSocket(newSocket)

        return () => {
            newSocket.disconnect();
        }
    }, [user])

    // Add online user

    useEffect(() => {
        if (socket === null) return;
        socket.emit("addNewUser", user?.id)
        socket.on("getOnlineUsers", (res) => {
            setOnlineUser(res)
        })

        return () => {
            socket.off("getOnlineUsers");
        };
    }, [socket])

    return (
        <HomeContext.Provider value={{ friendUser, onlineUsers, profileId, setProfileId, fetchFriendUser }}>
            {children}
        </HomeContext.Provider>
    );
};