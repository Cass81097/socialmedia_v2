import React, { useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";

export default function Register(props) {
    const { toggleModal } = props;
    const { registerInfo, registerUser, updateRegisterInfo, isRegisterLoading } = useContext(AuthContext);

    const toastOptions = {
        position: "top-center",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    };

    const handleValidation = () => {
        const { fullname, email, password, passwordConfirm, id, username } = registerInfo;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // Biểu thức chính quy kiểm tra ký tự đặc biệt

        if (password === "" || fullname === "" || email === "" || passwordConfirm === "") {
            toast.error("Vui lòng nhập hết các trường.", toastOptions);
            return false;
        } else if (fullname.length < 3) {
            toast.error("Họ và tên không được dưới 3 kí tự.", toastOptions);
            return false;
        } else if (specialCharRegex.test(fullname)) {
            toast.error("Họ va tên không được chứa kí tự đựac biệt.", toastOptions);
            return false;
        } else if (!emailRegex.test(email)) { // Kiểm tra định dạng email hợp lệ
            toast.error("Vui lòng nhập địa chỉ Email.", toastOptions);
            return false;
        } else if (password.length < 6 || passwordConfirm < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 kí tự.", toastOptions);
            return false;
        } else if (password !== passwordConfirm) {
            toast.error("Mật khẩu nhập lại không đúng.", toastOptions);
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            await registerUser();
            toggleModal(false);
            // navigate('/login')
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="signup">
                    <div className="signup__content">
                        <div className="signup__container">
                            <div className="signup__title">Sign Up</div>
                            <div className="signup__close"
                                onClick={() => toggleModal(false)}>
                                <i className="far fa-times-circle" style={{ cursor: "pointer", fontSize: "20px" }}></i>
                            </div>
                        </div>
                        <div className="signup__subtitle"></div>
                        <div className="signup__form">
                            <input type="text" placeholder="Họ và tên" onChange={(e) => updateRegisterInfo({ fullname: e.target.value })} />
                            <input type="text" placeholder="Email" onChange={(e) => updateRegisterInfo({ email: e.target.value })} />
                            <input type="password" placeholder="Mật khẩu" onChange={(e) => updateRegisterInfo({ password: e.target.value })} />
                            {/* <input type="username" placeholder="username" onChange={(e) => updateRegisterInfo({ username: e.target.value })} /> */}
                            <input
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                onChange={(e) => updateRegisterInfo({ passwordConfirm: e.target.value })}
                            />
                            <button className="signup__btn">
                                {isRegisterLoading ? "Đang tạo tài khoản..." : "Đăng ký"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </>
    );
}

