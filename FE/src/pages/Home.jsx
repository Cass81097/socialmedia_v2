import 'firebase/compat/auth';
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from '../components/common/Navbar';
import { AuthContext } from "../context/AuthContext";
import { ProfileContext } from "../context/ProfileContext";
import "../index.css";
import "../styles/buttonGoogle.css";


const Home = (props) => {
    const navigate = useNavigate();
    const {userProfile} = useContext(ProfileContext)
    const { toggleModal } = props;
    const { user, loginFinish, setLoginFinish } = useContext(AuthContext)

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


    return (
        <>
            <Navbar></Navbar>
            <ToastContainer />         
        </>
    );
}

export default Home;
