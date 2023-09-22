import 'firebase/compat/auth';
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/home/common/Sidebar';
import { AuthContext } from "../context/AuthContext";
import { ProfileContext } from "../context/ProfileContext";
import "../index.css";
import "../styles/buttonGoogle.css";
import "../styles/home/style.css"
import RightSidebar from '../components/home/common/RightSidebar';
import { CometChatMessages } from '../cometchat-chat-uikit-react-3/CometChatWorkspace/src';
import Button from 'react-bootstrap/Button';
import { HomeContext } from '../context/HomeContext';

const Home = (props) => {
    const navigate = useNavigate();
    const { userProfile } = useContext(ProfileContext)
    const { toggleModal } = props;
    const { user, loginFinish, setLoginFinish } = useContext(AuthContext)
    const { profileId, setProfileId } = useContext(HomeContext)

    const toastOptions = {
        position: "top-center",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    };

    useEffect(() => {
        if (loginFinish) {
            toast.success("Đăng nhập thành công !", toastOptions);
            setLoginFinish(false);
        }
    }, [loginFinish]);

    const closeChat = () => {
        setProfileId(null)
    }

    return (
        <>
            <Navbar></Navbar>

            <div className='home-container'>
                <Sidebar></Sidebar>
                <div className="main-content">

                </div>
                <RightSidebar></RightSidebar>
            </div>

            {profileId ? (
                <div className='chat-bottom-bar'>
                    <CometChatMessages chatWithUser={profileId.toString()} />
                    <i className="far fa-window-close chat-bar-close" onClick={closeChat}></i>
                </div>
            ) : null}

            <ToastContainer />
        </>
    );
}

export default Home;
