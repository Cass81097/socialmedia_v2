// import React, { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";

// export default function Sidebar() {
//     const { user } = useContext(AuthContext);

//     return (
//         <>
//             <div className="left-sidebar">
//                 <div className="container-top-content">
//                     <li className="links">
//                         <a href="">
//                             <i
//                                 className="fas fa-home icon"
//                                 style={{ color: "black" }}
//                             />
//                         </a>
//                     </li>
//                     <li className="links link-avatar">
//                         <a href="" className="select" style={{position:"relative"}}>
//                             <div className="left-ava">
//                                 <img className="left-avatar"
//                                     src={user.avatar} alt="load" />
//                             </div>
//                         </a>
//                     </li>
//                 </div>
//                 <div className="mid-content">
//                     <li>
//                         <a href="">
//                             <i className="watch icon" />
//                         </a>
//                     </li>
//                     <li>
//                         <a href="">
//                             <i className="page icon" />
//                         </a>
//                     </li>
//                     <li>
//                         <a href="">
//                             <i className="market icon" />
//                         </a>
//                     </li>
//                     <li>
//                         <a href="">
//                             <i className="game icon" />
//                         </a>
//                     </li>
//                     <li>
//                         <a href="">
//                             <i className="all-list icon" />
//                         </a>
//                     </li>
//                 </div>
//                 <div className="bottom-content">
//                     <li>
//                         <a href="">
//                             <i className="bx bx-group icon" />
//                         </a>
//                     </li>
//                     <li>
//                         <a href="">
//                             <i className="shortcut icon" />
//                         </a>
//                     </li>
//                 </div>
//             </div>
//         </>
//     )
// }