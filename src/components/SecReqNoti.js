import { Alert, Box, Modal } from '@mui/material'
import React from 'react'

const SecReqNoti = React.memo(({ isOpen, onClose, notification, index, type, name }) => {
    const modalTop = 1 + index * 18 + '%';

    console.log("vir travel guard >>>>>>>>", notification);
    return (
        <Modal
            open={isOpen}
            // className="position-relative"
            style={{ borderRadius: 5, marginTop: modalTop }}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                className="col-5"
                style={{
                    backgroundColor: "white",
                    borderRadius: 20,
                    alignSelf: "center",
                    marginTop: "10%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    height: 280,
                }}
            >
                <div className='row'>
                    <div className='col ms-4 mt-4'>
                        <p style={{ fontSize: 14 }}>
                            <span style={{ fontWeight: 'bold' }}>Name:</span> {notification.userName} <br />
                            <span style={{ fontWeight: 'bold' }}>Phone:</span> {notification.userPhone} <br />
                            <span style={{ fontWeight: 'bold' }}>Email:</span> {notification.userEmail} <br />
                            <span style={{ fontWeight: 'bold' }}>Car Rentail:</span> {notification.CarRental} <br />
                            <span style={{ fontWeight: 'bold' }}>Pick up:</span> {notification.PickUpLooc} <br />
                            <span style={{ fontWeight: 'bold' }}>Destination:</span> {notification.DesLoc} <br />
                            <span style={{ fontWeight: 'bold' }}>Request Days:</span> {notification.RequestedDays} <br />
                            <span style={{ fontWeight: 'bold' }}>Request Men:</span> {notification.RequstedMen} <br />
                            <span style={{ fontWeight: 'bold' }}>Security network:</span> {notification.SecurityNetwork} <br />
                            <span style={{ fontWeight: 'bold' }}>Total charges:</span> {notification.TotoalCharges} <br />
                        </p>


                    </div>
                </div>

            </Box>
        </Modal >
    )
})

export default SecReqNoti;
