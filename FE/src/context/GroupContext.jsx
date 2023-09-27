import React, { createContext, useCallback, useEffect, useState, useContext } from "react";
import { baseUrl, getRequest } from "../utils/services";
import { AuthContext } from "./AuthContext";

export const GroupContext = createContext();

export const GroupContextProvider = ({ children }) => {
    const { user } = useContext(AuthContext)
    const [showMemberRequest, setShowMemberRequest] = useState(false);
    const [showMemberGroup, setShowMemberGroup] = useState(false);
    const [showGroupCreate, setShowGroupCreate] = useState(false);
    const [showGroupChange, setShowGroupChange] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showGroupList, setShowGroupList] = useState([]);
    const [showGroupInfo, setShowGroupInfo] = useState([]);
    const [infoUserGroup, setInfoUserGroup] = useState([]);

    const domain = window.location.pathname.split("/groups")[1];
    const groupId = domain || "";

    useEffect(() => {
        const fetchGroupList = async () => {
            try {
                const response = await getRequest(`${baseUrl}/userGroups/userId/${user?.id}`);
                setShowGroupList(response);
            } catch (error) {
                console.error("Error fetching all users:", error);
            }
        };
        fetchGroupList();
    }, [user]);

    useEffect(() => {
        const fetchGroupInfo = async () => {
            try {
                const response = await getRequest(`${baseUrl}/groups/${groupId}`);
                setShowGroupInfo(response[0]);
            } catch (error) {
                console.error("Error fetching all users:", error);
            }
        };
        fetchGroupInfo();
    }, [groupId]);

    useEffect(() => {
        const fetchInfoUserGroup = async () => {
            try {
                const response = await getRequest(`${baseUrl}/userGroups/${groupId}/${user?.id}`);
                setInfoUserGroup(response[0]);
            } catch (error) {
                console.error("Error fetching all users:", error);
            }
        };
        fetchInfoUserGroup();
    }, [groupId, user]);

    return (
        <GroupContext.Provider value={{ 
            showMemberRequest, 
            setShowMemberRequest,
            showMemberGroup,
            setShowMemberGroup,
            showGroupCreate,
            setShowGroupCreate,
            isImageLoading,
            setIsImageLoading,
            showGroupChange,
            setShowGroupChange,
            isLoading,
            setIsLoading,
            showGroupList,
            setShowGroupList,
            showGroupInfo,
            setShowGroupInfo,
            infoUserGroup,
            setInfoUserGroup,
            }}>
            {children}
        </GroupContext.Provider>
    );
};

