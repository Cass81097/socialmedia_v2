import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import $ from 'jquery';
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";
import { ProfileContext } from "../../context/ProfileContext";
import { SearchBar } from "../search/SearchBar";
import { SearchResultsList } from "../search/SearchResultsList";

export default function Navbar() {
    const { user } = useContext(AuthContext);
    const { setUserProfile } = useContext(ProfileContext);
    const [results, setResults] = useState([]);

    const navigate = useNavigate();

    const showInfo = () => {
        $('.profile-menu').toggle();
    };

    const logout = async () => {
        try {
            await firebase.auth().signOut();
            navigate("/")
            window.location.reload();
            localStorage.clear();
        } catch (error) {
            console.error("Error :", error);
        }
    };

    const goUserInfo = (res) => {
        const currentDomain = window.location.pathname.split("/")[1];
        if (`/${user?.username}` !== `/${currentDomain}`) {
            navigate(`/${user?.username}`);
            // setUserProfile(res)
            $('.profile-menu').hide();
        } else {
            $('.profile-menu').hide();
        };
    };

    const clearSearchResult = () => {
        setResults([]);
    }

    return (
        <>
            <header>
                <div className="fb-nav">
                    <div className="title">
                        <Link to={"/"}>F4kebook</Link>
                    </div>
                    <div className="search-box">
                        <SearchBar setResults={setResults} results={results} clearSearchResult={clearSearchResult} />
                        <SearchResultsList results={results} clearSearchResult={clearSearchResult} />
                    </div>
                    <div className="home-media">
                        <div className="social-media">
                            <Link
                                to=""
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Messenger"
                            style={{ transform: "translateY(7px)" }}
                            >
                                <i className="fab fa-facebook-messenger"></i>
                            </Link>
                            <Link
                                to=""
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Thông báo"
                            style={{ transform: "translateY(7px)" }}
                            >
                                <i className="fas fa-bell"></i>
                            </Link>

                            <div className="avatar-nav" style={{ transform: "translateY(-7px)" }}>
                                <div
                                    className="avatar-navbar"
                                    data-toggle="tooltip"
                                    data-placement="bottom"
                                    title="Avatar"
                                >
                                    <img src={user?.avatar}  alt="Avatar" onClick={() => showInfo()} />
                                </div>
                                <ol className="profile-menu" style={{ display: "none" }}>
                                    <li onClick={goUserInfo}>Thông tin</li>
                                    <li data-toggle="modal" data-target="#myModal" onClick={() => logout()}>Đăng xuất</li>
                                </ol>
                            </div>    
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
