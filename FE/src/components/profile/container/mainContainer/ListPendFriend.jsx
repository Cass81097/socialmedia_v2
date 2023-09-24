import {AuthContext} from "../../../../context/AuthContext";
import React, {useContext, useEffect, useState} from "react";
import {baseUrl} from "../../../../utils/services";
import axios from "axios";
import Navbar from '../../../common/Navbar'
import Sidebar from "../../../home/common/Sidebar";
import RightSidebar from "../../../home/common/RightSidebar";
import {useNavigate} from "react-router-dom";


export default function ListPendFriend() {
    const [listPendFriend, setListPendFriend] = useState([]);
    const {user} = useContext(AuthContext);
    const navigate=useNavigate()

    useEffect((listPendFriend) => {

        // const findPendFriend = async () => {
        //     try {
        //         const response = await axios.get(`${baseUrl}/friendShips/listPendingFriend/${user?.id}`);
        //         let list = []
        //         for (let i = 0; i < response.data.length; i++) {
        //             const response1 = await axios.get(`${baseUrl}/users/find/id/${response.data[i].userSendReq}`)
        //             list = [...list,response1.data]
        //         }
        //         setListPendFriend(list);
        //     } catch (error) {
        //         console.log(error);
        //     }
        // };
        findPendFriend();
    }, [user]);
    const findPendFriend = async () => {
        try {
            const response = await axios.get(`${baseUrl}/friendShips/listPendingFriend/${user?.id}`);
            let list = []
            for (let i = 0; i < response.data.length; i++) {
                const response1 = await axios.get(`${baseUrl}/users/find/id/${response.data[i].userSendReq}`)
                list = [...list,response1.data]
            }
            setListPendFriend(list);
        } catch (error) {
            console.log(error);
        }
    };
    const handleDelete = async (id)=>{
        await  axios.post(`http://localhost:5000/friendShips/unfriend/${id}/${user?.id}`);

        findPendFriend();
         // navigate('/listPendFriend')
    }
    const handleAccept = async (id)=>{
        await  axios.post(`http://localhost:5000/friendShips/accept/${id}/${user?.id}`);

        findPendFriend();
        // navigate('/listPendFriend')
    }
    return (
        <>
            <Navbar></Navbar>

                <Sidebar></Sidebar>
                <div className="main-content" style={{
                    width: "71%",
                    height:" 100vh",
                    padding: "20px 20px",
                    position: "fixed",
                    top: "71px",
                    right:0,backgroundColor: "lightgrey"}}>
                    <div  className="col-12" style={{backgroundColor: "lightgrey", paddingTop:"40px", marginLeft:"20px"}}>
                        <div  className="row" style={{height: "40px"}}>
                            <div className="col-6"><h4>Lời mời kết bạn</h4></div>
                            <div className="col-6">
                                <button style={{position: "absolute", right: "20px"}} className="btn btn-link"><h5>Xem tất cả</h5>
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            {listPendFriend[0]?.map(item => (
                                <div className="col-3">
                                <div className="card">
                                    <img src={item?.avatar} style={{width: "100%",height:"250px"}} className="card-img-top" alt="..." />
                                    <div className="card-body">
                                        <h5 className="card-title">{item?.fullname}</h5>
                                        <p className="card-text">3 bạn chung</p>
                                        <a onClick={()=> handleAccept (item?.id)} className="btn btn-primary" style={{width: "100%"}}>Chấp nhận</a>
                                        <a onClick={()=>handleDelete (item?.id)} className="btn btn-light" style={{width: "100%",marginTop:"10px",background:"lightgrey"}}>Xoá</a>

                                    </div>
                                </div>
                                </div>
                            ))}
                        </div>
                    </div>



</div>
            {/*<div className="container">*/}
            {/*    <div className="row">*/}
            {/*        <div className="col-3">            <Sidebar></Sidebar>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

        </>
    )
}