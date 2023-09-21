import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { object, string, ValidationError } from 'yup';
import { ProfileContext } from "../../../context/ProfileContext";
import "../../../styles/user/editTest.css"
import { CometChatContext } from "../../../context/CometChatContext";

export default function EditUser() {
    const { cometChat } = useContext(CometChatContext)
    const { fetchUserProfile } = useContext(ProfileContext);

    const validationSchema = object({
        confirmPassword: string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Please re-enter your password'),
    });

    const [isEditing, setIsEditing] = useState({
        username: false,
        fullname: false,
        email: false,
        password: false,
        address: false,
        phone: false,
    });
    const [isSaving, setIsSaving] = useState({
        username: false,
        fullname: false,
        email: false,
        password: false,
        address: false,
        phone: false,
    });

    const [user, setUser] = useState({
        username: "",
        password: "",
        email: "",
        avatar: "",
        fullname: "",
    });

    const [passwordFields, setPasswordFields] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleToggleEdit = (field) => {
        setIsEditing((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const userProfiles = JSON.parse(localStorage.getItem("User"));
    // console.log(userProfiles)
    const username = userProfiles.username;
    const id = userProfiles.id;

    useEffect(() => {
        axios.get(`http://localhost:5000/users/find/${username}`).then((res) => {
            setUser(res.data[0]);
        });
    }, [username]);


    const handleSaveClick = (field) => {
        setIsSaving({});
        setIsSaving((prevState) => ({
            ...prevState,
            [field]: true,
        }));
        const updatedUser = {
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            address: user.address,
            phone: user.phone,
        };

        axios
            .put(`http://localhost:5000/users/users/${id}`, updatedUser)
            .then((res) => {
                if (isEditing[field]) {
                    toast.success("Cập nhật thành công.", toastOptions);
                    setTimeout(() => {
                        toast.dismiss();
                    }, 1000);
                }
                setIsEditing({ ...isEditing, [field]: false });
                fetchUserProfile();

                // Handle Change Name Cometchat
                const authKey = `${process.env.REACT_APP_COMETCHAT_AUTH_KEY}`;
                const cometId = new cometChat.User(user.id.toString());
                cometId.setName(updatedUser.fullname);
                cometChat.updateUser(cometId, authKey).then(
                    responseComet => {
                        console.log(responseComet);
                    },
                    error => {
                        console.error("Lỗi khi cập nhật tên người dùng trong CometChat:", error);
                    }
                );
            })
            .catch((error) => {
                console.error("Lỗi khi cập nhật thông tin người dùng:", error);
            });
    };

    const handleSavePassword = () => {
        const updatedPassword = {
            oldPassword: passwordFields.oldPassword,
            newPassword: passwordFields.newPassword,
            confirmPassword: passwordFields.confirmPassword,
        };
        if (updatedPassword.oldPassword === "") {
            toast.error("Vui lòng nhập mật khẩu cũ", toastOptions)
            setTimeout(() => {
                toast.dismiss()
            }, 2000)
        } else {

            // Kiểm tra tính hợp lệ sử dụng Yup
            validationSchema.validate(updatedPassword, { abortEarly: false })
                .then(() => {
                    // Nếu không có lỗi, thực hiện axios request
                    axios.put(`http://localhost:5000/users/${id}`, updatedPassword)
                        .then((res) => {
                            // console.log(res)
                            console.log(res.data)

                            if (res.data === "Mật khẩu cũ của bạn không đúng.") {
                                toast.error("Mật khẩu cũ của bạn không đúng.", toastOptions);
                                setTimeout(() => {
                                    toast.dismiss()
                                }, 2000)
                            } else {
                                setIsEditing({ ...isEditing, password: false });
                                if (res.data === "mat khau da duoc cap nhat") {
                                    toast.success("Chỉnh sửa mật khẩu thành công.", toastOptions);
                                    setTimeout(() => {
                                        toast.dismiss();
                                    }, 1000);
                                    setPasswordFields({
                                        oldPassword: "",
                                        newPassword: "",
                                        confirmPassword: "",
                                    });
                                }
                            }
                        })

                })
                .catch((errors) => {
                    if (errors instanceof ValidationError) {
                        toast.error("Mật khẩu không trùng lặp", toastOptions);
                        setTimeout(() => {
                            toast.dismiss()
                        }, 2000)
                    } else {
                        toast.error("Có lỗi trong quá trình cập nhật mật khẩu.", toastOptions);
                        setTimeout(() => {
                            toast.dismiss()
                        }, 2000)
                        console.log('Có lỗi trong quá trình cập nhật mật khẩu.', errors);
                    }
                });
        }
    }




    // check pass
    const [checkPass, setCheckPass] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const check = ((info) => {
        setCheckPass((prevPass) => ({
            ...prevPass,
            ...info,
        }));
    }, []);

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setPasswordFields({ ...passwordFields, [name]: value });
    };

    const toastOptions = {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    };



    return (
        <>



            <div className="user-info">
                <div className="item-Left">
                    <div className="item-icon">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="item-text">
                        <p>{user.username}</p></div>
                </div>
                <div className="item-Right">
                    <div className="right-icons">
                        <div style={{ marginRight: "40px" }} className="item-icon">
                            <i className="fas fa-globe-asia"></i>
                        </div>
                        <div className="item-icon">
                            <div className="bg-icon">
                                <i></i>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="user-info">
                <div className="item-Left">
                    <div className="item-icon">
                        <i className="fas fa-envelope"></i>
                    </div>
                    <div className="item-text">
                        <p>{user.email}</p></div>
                </div>
                <div className="item-Right">
                    <div className="right-icons">
                        <div style={{ marginRight: "40px" }} className="item-icon">
                            <i className="fas fa-globe-asia"></i>
                        </div>
                        <div className="item-icon">
                            <div className="bg-icon">

                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {isEditing.fullname ? (
                <>
                    <div className="user-info">
                        <div className="item-Left">
                            <div className="item-icon">
                                <i className="fas fa-address-card"></i>
                            </div>
                            <div className="item-text">
                                <input
                                    style={{ marginRight: "10px" }}
                                    type="text"
                                    value={user.fullname}
                                    onChange={(e) =>
                                        setUser({ ...user, fullname: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="item-Right">
                            <div className="right-icons">
                                <div style={{ marginRight: "40px" }} className="item-icon">
                                    <i className="fas fa-globe-asia"></i>
                                </div>
                                <div className="item-icon">
                                    <div className="bg-icon">
                                        <i className="item-table fas fa-save fa-xs"
                                            onClick={() => handleSaveClick("fullname")}></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            ) : (
                <>
                    <div className="user-info">
                        <div className="item-Left">
                            <div className="item-icon">
                                <i className="fas fa-address-card"></i>
                            </div>
                            <div className="item-text">
                                <p>{user.fullname || "Chưa có"}</p>
                            </div>
                        </div>
                        <div className="item-Right">
                            <div className="right-icons">
                                <div style={{ marginRight: "40px" }} className="item-icon">
                                    <i className="fas fa-globe-asia"></i>
                                </div>
                                <div className="item-icon">
                                    <div className="bg-icon">
                                        <i className="fas fa-pen" onClick={() => handleToggleEdit("fullname")}></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </>
            )}



            <div className="user-info">

                {isEditing.address ? (
                    <>
                        <div className="item-Left">
                            <div className="item-icon">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <div className="item-text">
                                <input
                                    style={{ marginRight: "10px" }}
                                    className="itemtext"
                                    type="text"
                                    value={user.address}
                                    onChange={(e) =>
                                        setUser({ ...user, address: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="item-Right">
                            <div className="right-icons">
                                <div style={{ marginRight: "40px" }} className="item-icon">
                                    <i className="fas fa-globe-asia"></i>
                                </div>
                                <div className="item-icon">
                                    <div className="bg-icon">
                                        <i className="item-table fas fa-save fa-xs"
                                            onClick={() => handleSaveClick("address")}></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>
                ) : (
                    <>
                        <div className="item-Left">
                            <div className="item-icon">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <div className="item-text"
                                style={{ marginLeft: "7px" }}
                            >
                                <p> {user.address || "Chưa có"}</p></div>
                        </div>
                        <div className="item-Right">
                            <div className="right-icons">
                                <div style={{ marginRight: "40px" }} className="item-icon">
                                    <i className="fas fa-globe-asia"></i>
                                </div>
                                <div className="item-icon">
                                    <div className="bg-icon">
                                        <i className="fas fa-pen" onClick={() => handleToggleEdit("address")}></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>
                )}
            </div>
            <div className="user-info">

                {isEditing.phone ? (
                    <>
                        <div className="item-Left">
                            <div className="item-icon">
                                <i className="fas fa-phone-alt"></i>
                            </div>
                            <div className="item-text">
                                <input
                                    style={{ marginRight: "10px" }}
                                    className="itemtext"
                                    type="text"
                                    value={user.phone}
                                    onChange={(e) =>
                                        setUser({ ...user, phone: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="item-Right">
                            <div className="right-icons">
                                <div style={{ marginRight: "40px" }} className="item-icon">
                                    <i className="fas fa-globe-asia"></i>
                                </div>

                                <div className="item-icon">
                                    <div className="bg-icon">
                                        <i className="item-table fas fa-save fa-xs"
                                            onClick={() => handleSaveClick("phone")}></i>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </>
                ) : (
                    <>
                        <div className="item-Left">
                            <div className="item-icon">
                                <i className="fas fa-phone-alt"></i>
                            </div>
                            <div className="item-text">
                                <p>{user.phone || <p >Chưa có</p>}</p></div>
                        </div>
                        <div className="item-Right">
                            <div className="right-icons">
                                <div style={{ marginRight: "40px" }} className="item-icon">
                                    <i className="fas fa-globe-asia"></i>
                                </div>
                                <div className="item-icon">
                                    <div className="bg-icon">
                                        <i className="fas fa-pen" onClick={() => handleToggleEdit("phone")}></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>
                )}
            </div>

            {/*password*/}

            {!isEditing.password ? (
                <>
                    <div className="user-info">
                        <div className="item-Left">
                            <div className="item-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <div className="item-text">
                                <input
                                    className="itemtext"
                                    type="password"
                                    value={user.password}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="item-Right">
                            <div className="right-icons">
                                <div style={{ marginRight: "60px" }} className="item-icon">
                                    <i></i>
                                </div>
                                <div className="item-icon">
                                    <div className="bg-icon">
                                        <i className="fas fa-pen" onClick={() => handleToggleEdit("password")}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </>

            ) : (
                <>

                    <div className="user-info">
                        <div className="item-Left">
                            <div className="item-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <div className="item-text">
                                <input
                                    style={{ width: "350px" }}
                                    className="itemtext"
                                    type="password"
                                    name="oldPassword"
                                    value={passwordFields.oldPassword}
                                    onChange={handlePasswordChange}
                                    placeholder={"Vui lòng nhập mật khẩu cũ của bạn"}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="user-info">
                        <div className="item-Left">
                            <div className="item-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <div className="item-text">
                                <input
                                    style={{ width: "350px" }}
                                    className="itemtext"
                                    type="password"
                                    name="newPassword"
                                    value={passwordFields.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder={"Vui lòng nhập mật khẩu mới của bạn"}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="user-info">
                        <div className="item-Left">
                            <div className="item-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <div className="item-text">
                                <input
                                    style={{ width: "350px" }}
                                    className="itemtext"
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordFields.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder={"Vui lòng nhập lại mật khẩu mới"}
                                />
                                {/*{arePasswordsEntered && !isPasswordMatching && <span className="error-message">Mật khẩu không trùng khớp.</span>}*/}
                            </div>
                        </div>
                        <div className="item-Right">
                            <div className="right-icons">
                                <div style={{ marginRight: "60px" }} className="item-icon">
                                    <i></i>
                                </div>
                                <div className="item-icon">
                                    <div className="bg-icon">
                                        <i className="item-table fas fa-save fa-xs"
                                            onClick={handleSavePassword}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </>
            )}
            {/* Kết thúc phần mật khẩu */}
            {/*End Invoice*/}

            <ToastContainer />
        </>
    );
}
