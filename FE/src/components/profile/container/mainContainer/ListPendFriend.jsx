import {AuthContext} from "../../../../context/AuthContext";
import React, {useContext, useEffect, useState} from "react";
import {baseUrl, getRequest} from "../../../../utils/services";
import axios from "axios";
import Navbar from '../../../common/Navbar'
import Sidebar from "../../../home/common/Sidebar";
import RightSidebar from "../../../home/common/RightSidebar";
import {useNavigate} from "react-router-dom";
import {ProfileContext} from "../../../../context/ProfileContext";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


export default function ListPendFriend() {

    const [commonFriendList, setCommonFriendList] = useState([]);
    const [listPendFriend, setListPendFriend] = useState([]);
    const {user} = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const navigate=useNavigate()
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


    useEffect((listPendFriend) => {
        findPendFriend();
    }, [user]);


    const findPendFriend = async () => {
        try {
            const response = await axios.get(`${baseUrl}/friendShips/listPendingFriend/${user?.id}`);
            let list = [];

            for (let i = 0; i < response.data.length; i++) {
                const response1 = await axios.get(`${baseUrl}/users/find/id/${response.data[i].userSendReq}`);
                const commonFriendResponse = await getRequest(`${baseUrl}/friendShips/commonFriend/username/${user?.username}/${response1.data[0].username}`);
             let    data ={...response1.data[0], friendCommonCount : commonFriendResponse}

                list = [...list, data];


            }

            setListPendFriend(list);
        } catch (error) {
            console.log(error);
        }
    };
    const handleDelete = async (id)=>{
        await  axios.post(`${baseUrl}/friendShips/unfriend/${id}/${user?.id}`);

        findPendFriend();

    }
    const handleAccept = async (id)=>{
        await  axios.post(`${baseUrl}/friendShips/accept/${id}/${user?.id}`);

        findPendFriend();
        // navigate('/listPendFriend')
    }
    return (
        <>  
        
            <Navbar></Navbar>
            <div className='home-container'>
                <Sidebar></Sidebar>
                <div className="main-content" style={{
                    width: "71%",
                    height:" 100vh",
                    padding: "20px 20px",
                    position: "fixed",
                    right:0,backgroundColor: "#e0dede59"}}>
                    <div  className="col-12" style={{ marginLeft:"20px"}}>
                        <div  className="row" style={{height: "40px"}}>
                            <div className="col-6"><h4>Friend request</h4></div>
                            <div className="col-6">
                                <button style={{position: "absolute", right: "20px"}} className="btn btn-link"><h5>Xem tất cả</h5>
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            {listPendFriend.map(item => (
                                <div className="col-3" key={item.id}>
                                    <div className="card" style={{overflow:"hidden"}}>
                                        <img src={item?.avatar} style={{ width: "100%", height: "250px", objectFit:"cover" }} className="card-img-top" alt="..." />
                                        <div className="card-body">
                                            <h5  className="card-title" onClick={() => goFriendProfile(item?.username)}>{item?.fullname}</h5 >
                                            {item?.friendCommonCount.length!==0 &&
                                            <div style={{display:"flex", alignItems: "center"}}>
                                                <img style={{height:"20px", width:"20px", borderRadius: "50%"}} src={item?.friendCommonCount[0].avatar} alt=""/>
                                            <p   style={{
                                                textDecorationColor: 'black',
                                                cursor: 'pointer',
                                                marginLeft:"6px",
                                                fontSize:"18px"
                                            }} className="card-text" onClick={() => handleShow(item?.friendCommonCount)}>  {item?.friendCommonCount.length} mutual friends</p>

                                            </div>
                                            }
                                            <a onClick={() => handleAccept(item?.id)} className="btn btn-primary" style={{ width: "100%", marginTop: "5px" }}>Accept</a>
                                            <a onClick={() => handleDelete(item?.id)} className="btn btn-light" style={{ width: "100%", marginTop: "5px", background: "lightgrey" }}>Decline</a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
            </div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ transform: "translateX(92px)" }}>Mutual Friend list</Modal.Title>
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
            </div>
        </>
    )
}