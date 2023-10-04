import axios from "axios";
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { ProfileContext } from "../../../../context/ProfileContext";
import "../../../../styles/user/friend.css";
import { baseUrl, getRequest } from "../../../../utils/services";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function ListFriend() {
    const { userProfile, countFriend, checkFriendStatus } = useContext(ProfileContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [commonFriendNumber, setCommonFriendNumber] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [commonFriendList, setCommonFriendList] = useState([]);
    const [show, setShow] = useState(false);

    console.log(commonFriendList);

    const handleClose = () => {
        setShow(false);
    }

    const handleShow = (arr) => {
        setCommonFriendList(arr);
        setShow(true);
    };

    const goFriendProfile = (username) => {
        setShow(false);
        navigate(`/${username}`);
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchValue(value);

        const lowercaseValue = value.toLowerCase();
        const filtered = countFriend.filter(item => item.fullname.toLowerCase().includes(lowercaseValue));
        setFilteredData(filtered);
    };

    useEffect(() => {
        const findCommonFriendNumber = async (index) => {
            try {
                const response = await getRequest(`${baseUrl}/friendShips/commonFriend/username/${userProfile[0].username}/${countFriend[index].username}`);
                console.log(response);
                return response;
            } catch (error) {
                console.log(error);
                return null;
            }
        };

        const getCommonFriendNumbers = async () => {
            const commonFriendNumbers = [];
            for (let i = 0; i < countFriend.length; i++) {
                const commonFriendNumber = await findCommonFriendNumber(i);
                commonFriendNumbers.push(commonFriendNumber);
            }
            setCommonFriendNumber(commonFriendNumbers);
        };
        getCommonFriendNumbers();
    }, [userProfile, countFriend]);

    return (
        <>
            {checkFriendStatus?.status === "friend" || user?.id === userProfile[0]?.id ? (
                <div className="container-fluid">
                    <nav className="row navbar">
                        <div className="col-6">
                            <a className="navbar-brand" style={{ fontWeight: "700" }}>Bạn bè</a>
                        </div>
                        <div className="col-6 search-profile-friend">
                            <div className="form-inline" style={{ display: "flex" }}>
                                <div style={{
                                    display: "flex",
                                    outline: "none",
                                    borderRadius: "50px",
                                    fontSize: "16px",
                                    backgroundColor: "rgba(255, 255,255, 0.5)"
                                }}>
                                    <input value={searchValue} onChange={handleInputChange} className="form-control mr-sm-2"
                                        style={{
                                            outline: "none",
                                            border: "1px solid lightgrey",
                                        }} placeholder='Search friends...'
                                        aria-label="Search" />
                                </div>
                                {user.id === userProfile[0].id &&
                                    <Link to="/listPendFriend"><button type="button" className="btn btn-link"><span style={{ fontWeight: "500" }}>Friend request</span></button></Link>
                                }
                            </div>
                        </div>
                    </nav>

                    <div className="friend-container">
                        {searchValue === '' ? (
                            countFriend.map((listFriend, index) => (
                                <div className="friend-container-left" key={listFriend?.id}>
                                    <div>
                                        <div className="friend-container-avatar">
                                            <div className="friend-avatar" onClick={() => goFriendProfile(listFriend?.username)}>
                                                <img src={listFriend?.avatar} alt="Avatar" />
                                            </div>
                                            <div className="friend-detail">
                                                <h6 onClick={() => goFriendProfile(listFriend?.username)}>
                                                    {listFriend?.fullname}
                                                </h6>
                                                {commonFriendNumber?.[index]?.length && user?.id !== listFriend?.id ? (
                                                    <div>
                                                        <h6 onClick={() => handleShow(commonFriendNumber?.[index])}>
                                                            {commonFriendNumber?.[index]?.length} mutual friends
                                                        </h6>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            filteredData.map((listFriend, index) => (
                                <div className="friend-container-left" key={listFriend?.id}>
                                    <div>
                                        <div className="friend-container-avatar">
                                            <div className="friend-avatar">
                                                <img src={listFriend?.avatar} alt="Avatar" />
                                            </div>
                                            <div className="friend-detail">
                                                <h6 onClick={() => goFriendProfile(listFriend?.username)}>{listFriend?.fullname}</h6>
                                                {commonFriendNumber?.[countFriend.indexOf(listFriend)] && user?.id !== listFriend?.id ? (
                                                    <div>
                                                        {commonFriendNumber?.[countFriend.indexOf(listFriend)].length > 0 && (
                                                            <h6 onClick={() => handleShow(commonFriendNumber?.[countFriend.indexOf(listFriend)])}>
                                                                {commonFriendNumber?.[countFriend.indexOf(listFriend)].length} mutual friends
                                                            </h6>
                                                        )}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div >
            ) : null
            }


            {/* Modal Common Friend */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ transform: "translateX(145px)" }}>Mutual Friend list</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-commonFriend-container">
                        {commonFriendList && commonFriendList.length > 0 ? (
                            commonFriendList.map((commonFriend, index) => (
                                <div className="modal-commonFriend-main" key={commonFriend.id}>
                                    <div className="modal-commonFriend-user" onClick={() => goFriendProfile(commonFriend?.username)}>
                                        <div className="modal-commonFriend-avatar">
                                            <img src={commonFriend?.avatar} alt="" />
                                        </div>
                                        <p>{commonFriend?.fullname}</p>
                                    </div>

                                    <button type="button" className="btn btn-primary btn-add">
                                        <i className="fas fa-user">
                                            <span>Friend</span>
                                        </i>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className='none-block'>No user blocked</p>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}