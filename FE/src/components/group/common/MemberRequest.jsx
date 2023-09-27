

import 'firebase/compat/auth';
import React, { useContext, useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "../../../styles/group/member-request.css"
import { GroupContext } from '../../../context/GroupContext';

const MemberRequest = (props) => {

    const {showMemberRequest, setShowMemberRequest} = useContext(GroupContext)

    const handleClose = () => {
        setShowMemberRequest(false)
    }

    return (
        <>
            <Modal show={showMemberRequest} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Member requests - 1</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-group-request-container">
                        <div className="request-user">
                            <div className='request-username'>
                                <div className='request-avatar'>
                                    <img src="https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-6/347268730_760943842147720_8513901123308679226_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a2f6c7&_nc_ohc=yfTUt1NFoDwAX-golwh&_nc_ht=scontent.fhan17-1.fna&oh=00_AfBmHmNQ6LnWisHjtMtgQ30O1LwKXVtOJ3qupcAgIgkUxw&oe=651794D6" alt="" />
                                </div>

                                <div className='request-name'>
                                    <h6>Như Quỳnh</h6>
                                    <p>Vài giây trước</p>
                                </div>
                            </div>

                            <div className='button-request-group'>
                                <button type="button" class="btn btn-primary btn-approve">Approve</button>
                                <button type="button" class="btn btn-secondary btn-decline">Decline</button>
                            </div>

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MemberRequest;
