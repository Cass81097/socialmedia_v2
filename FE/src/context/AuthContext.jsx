import React, { createContext, useCallback, useEffect, useState, useContext } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { CometChatContext } from "./CometChatContext";
import { Link, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    
    const [registerFinish, setRegisterFinish] = useState(false);
    const [loginFinish, setLoginFinish] = useState(false);
    const [allUser, setAllUser] = useState(null);
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
        cover: "https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2020/09/anh-bia-dep-11-696x435.jpg?fit=700%2C20000&quality=95&ssl=1"
    });

    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState(
        {
            email: "",
            password: ""
        });

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await getRequest(`${baseUrl}/users/username`);
                setAllUser(response); 
            } catch (error) {
                console.error("Error fetching all users:", error);
            }
        };
        fetchAllUsers();
    }, []);

    const { cometChat, setIsLoading } = useContext(CometChatContext);

    const generateAvatar = () => {
        const avatars = [
            'https://data-us.cometchat.io/assets/images/avatars/captainamerica.png',
            'https://data-us.cometchat.io/assets/images/avatars/cyclops.png',
            'https://data-us.cometchat.io/assets/images/avatars/ironman.png',
            'https://data-us.cometchat.io/assets/images/avatars/spiderman.png',
            'https://data-us.cometchat.io/assets/images/avatars/wolverine.png'
        ];
        const avatarPosition = Math.floor(Math.random() * avatars.length);
        return avatars[avatarPosition];
    };

    // const createCometChatAccount = ({ userUuid, fullname, userAvatar }) => {
    //     const authKey = `${process.env.REACT_APP_COMETCHAT_AUTH_KEY}`;
    //     const user = new cometChat.User(userUuid);
    //     console.log(user);
    //     user.setName(fullname);
    //     user.setAvatar(userAvatar);
    //     cometChat.createUser(user, authKey).then(
    //         user => {
    //             setIsLoading(false);
    //         }, error => {
    //             setIsLoading(false);
    //         }
    //     )
    // };


    useEffect(() => {
        const user = localStorage.getItem("User")
        setUser(JSON.parse(user));
    }, [])

    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo((prevInfo) => ({
            ...prevInfo,
            ...info,
        }));
    }, []);

    const updateLoginInfo = useCallback((info) => {
        setLoginInfo((prevInfo) => ({
            ...prevInfo,
            ...info,
        }));
    }, []);

    const registerUser = useCallback(async () => {
        console.log("Dang ky thanh cong");

        setIsRegisterLoading(true);
        setRegisterError(null)

        const avatar = generateAvatar(); // Generate the avatar synchronously
        const username = registerInfo.email.split("@")[0]; // Extract the username part before the @ symbol

        const registerInfoWithAvatar = { ...registerInfo, avatar, username: username };

        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfoWithAvatar))

        if (response.error) {
            return setRegisterError(response);
        }

        setIsRegisterLoading(false);

        // const userId = response.userId.toString(); // Convert userId to a string
        // createCometChatAccount({
        //     userUuid: userId,
        //     fullname: registerInfo.username,
        //     userAvatar: registerInfo.avatar,
        // });

        setRegisterFinish(true)
    }, [registerInfo])

    const loginUser = useCallback(async () => {

        setIsLoginLoading(true);
        setLoginError(null);

        const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo));

        if (response.error) {
            setLoginError(response.error);
            return;
        }

        if (response === "Invalid email or password") {
            setLoginError("Sai tài khoản hoặc mật khẩu");
            return;
        }

        if (response === "Email is not exist") {
            setLoginError("Sai tài khoản hoặc mật khẩu");
            return;
        }

        if (typeof response === "string") {
            setLoginError("Sai tài khoản hoặc mật khẩu");
            return;
        }

        setIsLoginLoading(false);
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
        setLoginFinish(true)
    }, [loginInfo]);

    const logOutUser = useCallback((info) => {
        localStorage.removeItem("User")
        setUser(null);
    }, [])

    return (
        <AuthContext.Provider value={{ user, registerInfo, registerUser, updateRegisterInfo, registerError, isRegisterLoading, logOutUser, loginUser, loginError, loginInfo, updateLoginInfo, isLoginLoading, allUser, setUser, registerFinish, loginFinish, setLoginFinish }}>
            {children}
        </AuthContext.Provider>
    );
};

