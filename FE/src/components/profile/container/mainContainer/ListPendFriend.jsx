import {AuthContext} from "../../../../context/AuthContext";
import {useContext, useEffect, useState} from "react";
import {baseUrl} from "../../../../utils/services";
import axios from "axios";

export default function ListPendFriend() {
    const [listPendFriend, setListPendFriend] = useState([]);
    const {user} = useContext(AuthContext);

    useEffect((listPendFriend) => {

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
        findPendFriend();
    }, [user]);
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-3">
                        <div className="row">
                            <div className="col-12">
                                <div className="col-6"><h3>Bạn Bè</h3></div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12"><i className="fad fa-house-user"></i>Trang chủ</div>
                        </div>
                    </div>
                    <div className="col-9" style={{backgroundColor: "lightgrey"}}>
                        <div className="row" style={{height: "50px"}}>
                            <div className="col-6"><h5>Bạn bè</h5></div>
                            <div className="col-6">
                                <button style={{position: "absolute", right: 0}} className="btn btn-link">Xem tất cả
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            {listPendFriend?.map(item => <div className="card" style={{
                                marginLeft: "35px",
                                marginBottom: "20px",
                                width: "20rem",
                                borderRadius: "5px"
                            }} key={item[0].id}>
                                <img src={item[0].avatar} className="card-img-top" alt="..."/>
                                <div className="card-body">
                                    <h5 className="card-title">{item[0].fullname}</h5>
                                    <p className="card-text">3 bạn chung.</p>
                                    <button style={{width: "90%", marginLeft: "10px", marginBottom: "10px"}}
                                            type="button" className="btn btn-primary">Chấp nhận
                                    </button>
                                    <button style={{
                                        width: "90%",
                                        marginLeft: "10px",
                                        marginBottom: "10px",
                                        color: "lightgrey"
                                    }} type="button" className="btn btn-secondary"> Xoá
                                    </button>
                                </div>
                            </div>)}
                            {/*<div className="card"   style={{marginLeft:"35px", marginBottom:"20px",width: "20rem", borderRadius:"5px"}} >*/}
                            {/*    <img src="..." className="card-img-top" alt="..."/>*/}
                            {/*        <div className="card-body">*/}
                            {/*            <h5 className="card-title">Card title</h5>*/}
                            {/*            <p className="card-text">Some quick example text to build on the card title and*/}
                            {/*                make up the bulk of the card's content.</p>*/}
                            {/*            <button style={{width:"90%", marginLeft:"10px",marginBottom:"10px"}} type="button" className="btn btn-primary">Chấp nhận </button>*/}
                            {/*            <button style={{width:"90%" , marginLeft:"10px",marginBottom:"10px",color:"lightgrey"}} type="button" className="btn btn-secondary"> Xoá </button>*/}
                            {/*        </div>*/}
                            {/*</div>*/}
                            {/*<div className="card"   style={{marginLeft:"35px", marginBottom:"20px",width: "20rem"}} >*/}
                            {/*    <img src="..." className="card-img-top" alt="..."/>*/}
                            {/*    <div className="card-body">*/}
                            {/*        <h5 className="card-title">Card title</h5>*/}
                            {/*        <p className="card-text">Some quick example text to build on the card title and*/}
                            {/*            make up the bulk of the card's content.</p>*/}
                            {/*        <button style={{width:"90%", marginLeft:"10px",marginBottom:"10px"}} type="button" className="btn btn-primary">Chấp nhận </button>*/}
                            {/*        <button style={{width:"90%" , marginLeft:"10px",marginBottom:"10px",color:"lightgrey"}} type="button" className="btn btn-secondary"> Xoá </button>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            {/*<div className="card"   style={{marginLeft:"35px", marginBottom:"20px",width: "20rem"}} >*/}
                            {/*    <img src="..." className="card-img-top" alt="..."/>*/}
                            {/*    <div className="card-body">*/}
                            {/*        <h5 className="card-title">Card title</h5>*/}
                            {/*        <p className="card-text">Some quick example text to build on the card title and*/}
                            {/*            make up the bulk of the card's content.</p>*/}
                            {/*        <button style={{width:"90%", marginLeft:"10px",marginBottom:"10px"}} type="button" className="btn btn-primary">Chấp nhận </button>*/}
                            {/*        <button style={{width:"90%" , marginLeft:"10px",marginBottom:"10px",color:"lightgrey"}} type="button" className="btn btn-secondary"> Xoá </button>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            {/*<div className="card"   style={{marginLeft:"35px", marginBottom:"20px",width: "20rem"}} >*/}
                            {/*    <img src="..." className="card-img-top" alt="..."/>*/}
                            {/*    <div className="card-body">*/}
                            {/*        <h5 className="card-title">Card title</h5>*/}
                            {/*        <p className="card-text">Some quick example text to build on the card title and*/}
                            {/*            make up the bulk of the card's content.</p>*/}
                            {/*        <button style={{width:"90%", marginLeft:"10px",marginBottom:"10px"}} type="button" className="btn btn-primary">Chấp nhận </button>*/}
                            {/*        <button style={{width:"90%" , marginLeft:"10px",marginBottom:"10px",color:"lightgrey"}} type="button" className="btn btn-secondary"> Xoá </button>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}