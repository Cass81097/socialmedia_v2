import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../context/ProfileContext";
import "../../../styles/user/sidebarProfile.css"

export default function LeftContainerProfile() {
    const { userProfile, setUserProfile, fetchUserProfile } = useContext(ProfileContext);
    const [selectedTab, setSelectedTab] = useState("tongquan"); // State để theo dõi tab hiện tại

    const handleTabClick = (tabName) => {
        setSelectedTab(tabName);
    };

    const isTabSelected = (tabName) => {
        return selectedTab === tabName;
    };

    return (
        <>
            <div className="msb" id="msb">
                <div className="navbar-header">
                    <div className="brand-wrapper">
                        <div className="brand-name-wrapper">
                            <h1 style={{ margin: "20px", color: "black", fontSize: "25px" }}>
                                Giới thiệu
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="intro-profile">
                    <div
                        className={`border-text-intro ${isTabSelected("tongquan") ? 'focused' : ''}`}
                        onClick={() => handleTabClick("tongquan")}
                    >
                        <div className="text-intro">Tổng quan</div>
                    </div>

                    <div
                        className={`border-text-intro ${isTabSelected("congviec") ? 'focused' : ''}`}
                        onClick={() => handleTabClick("congviec")}
                    >
                        <div className="text-intro">Công việc và học vấn</div>
                    </div>

                    <div
                        className={`border-text-intro ${isTabSelected("noitungho") ? 'focused' : ''}`}
                        onClick={() => handleTabClick("noitungho")}>
                        <div className="text-intro">Nơi từng sống</div>
                    </div>



                    <div
                        className={`border-text-intro ${isTabSelected("thongtin") ? 'focused' : ''}`}
                        onClick={() => handleTabClick("thongtin")}>
                        <div className="text-intro">Thông tin liên hệ và cơ bản</div>
                    </div>

                    <div
                        className={`border-text-intro ${isTabSelected("giadinh") ? 'focused' : ''}`}
                        onClick={() => handleTabClick("giadinh")}>
                        <div className="text-intro">Gia đình và các mối quan hệ</div>
                    </div>

                    <div
                        className={`border-text-intro ${isTabSelected("chitiet") ? 'focused' : ''}`}
                        onClick={() => handleTabClick("chitiet")}>
                        <div className="text-intro">Chi tiết về bạn</div>
                    </div>

                    <div
                        className={`border-text-intro ${isTabSelected("sukien") ? 'focused' : ''}`}
                        onClick={() => handleTabClick("sukien")}>
                        <div className="text-intro">Sự kiện trong đời</div>
                    </div>



                </div>
            </div>
        </>
    );
}