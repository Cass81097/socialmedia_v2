import React from "react";
import { Link } from "react-router-dom";
import "../styles/error_page.css"

const PageNotFound = () => {
    return (
        <div className="container">
            <div className="gif">
                <img src="https://i.postimg.cc/2yrFyxKv/giphy.gif" alt="gif_ing" />
            </div>
            <div className="content">
                <h1 className="main-heading">Trang bạn tìm kiếm không tồn tại.</h1>
                <p className="text-page">
                    ...có thể trang bạn đang tìm không được tìm thấy hoặc chưa từng tồn tại.
                </p>
                <Link to="/">
                    <button>Trở về trang chủ <i className="far fa-hand-point-right"></i></button>
                </Link>

            </div>
        </div>
    );
}

export default PageNotFound;
