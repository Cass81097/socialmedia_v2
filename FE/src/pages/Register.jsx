import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";

export default function Register(props) {
    const { toggleModal } = props;
    const { registerInfo, registerUser, updateRegisterInfo, isRegisterLoading } = useContext(AuthContext);
    const [isShowPassword, setIsShowPassword] = useState(false)

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
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; 

        if (password === "" || fullname === "" || email === "" || passwordConfirm === "") {
            toast.error("Please input all field.", toastOptions);
            return false;
        } else if (fullname.length < 3) {
            toast.error("Fullname is not under 3 character.", toastOptions);
            return false;
        } else if (specialCharRegex.test(fullname)) {
            toast.error("Fullname doesn't require special character.", toastOptions);
            return false;
        } else if (!emailRegex.test(email)) { 
            toast.error("Please input @Email.", toastOptions);
            return false;
        } else if (password.length < 6 || passwordConfirm < 6) {
            toast.error("Your password is not under 6 character.", toastOptions);
            return false;
        } else if (password !== passwordConfirm) {
            toast.error("Your password is not match.", toastOptions);
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
                            <input type="text" placeholder="Fullname" onChange={(e) => updateRegisterInfo({ fullname: e.target.value })} />
                            <input type="text" placeholder="Email" onChange={(e) => updateRegisterInfo({ email: e.target.value })} />
                            {/* <input type="password" placeholder="Password" onChange={(e) => updateRegisterInfo({ password: e.target.value })} />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                onChange={(e) => updateRegisterInfo({ passwordConfirm: e.target.value })}
                            /> */}
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={isShowPassword === true ? "text" : "password"}
                                    placeholder="Password" onChange={(e) => updateRegisterInfo({ password: e.target.value })}
                                />
                                <i
                                    className={isShowPassword === true ? 'fas fa-eye' : 'fas fa-eye-slash'}
                                    onClick={() => setIsShowPassword(!isShowPassword)}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: '10px',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                    }}
                                ></i>
                            </div>

                            <div style={{ position: 'relative' }}>
                                <input
                                    type={isShowPassword === true ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    onChange={(e) => updateRegisterInfo({ passwordConfirm: e.target.value })}
                                />
                                <i
                                    className={isShowPassword === true ? 'fas fa-eye' : 'fas fa-eye-slash'}
                                    onClick={() => setIsShowPassword(!isShowPassword)}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: '10px',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                    }}
                                ></i>
                            </div>
                            <button className="signup__btn">
                                {isRegisterLoading ? "Signin..." : "Signin"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {/* <ToastContainer /> */}
        </>
    );
}

