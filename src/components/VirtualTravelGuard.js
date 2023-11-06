import { Alert, Box, Modal } from '@mui/material'
import React from 'react'

const VirtualTravelGuard = React.memo(({ isOpen, onClose, notification, index, type }) => {
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
                    <div className='col-5 ms-4 mt-4'>
                        <p style={{ fontSize: 14 }}>
                            Type : {type} <br />

                            {notification.Place ?
                                <br /> +
                                " Current Location :" + notification.Place
                                : null
                            }
                            {notification.ArrivalStation ?
                                " Arival Destination:" + notification.ArrivalStation
                                : null
                            }

                            <br />
                            Trip  Date  :   {notification.ArrivalDate || notification.TripDate}
                            <br />
                            Trip  Time : {notification.ArrivalTime || notification.TripTime}
                            <br />
                            Partner Type  : {notification.PartenerType}
                            <br />
                            Partner  Name  :   {notification.Name}
                            <br />
                            {notification.transportMode ?
                                "  Tranport Mode :" + notification.transportMode
                                : "Tranport Mode : Own Transport"
                            }
                                <br />

                            {
                                notification.currentLocTxt ?
                                    "Arrival Station : " + notification.currentLocTxt
                                    : null
                            }
                            <br />
                            {
                                notification.destLocTxt ?
                                    "Destination : " + notification.destLocTxt[0]
                                    : null
                            }
                        </p>

                    </div>

                    <div className='col mt-2'>
                        {
                            notification.WellBeingTripPic ?
                                <img
                                    src={notification.WellBeingTripPic}
                                    style={{ backgroundSize: "cover", borderRadius: 10 }}
                                    alt="no image attaiched by user"
                                    height={200} width={200}
                                />
                                : null
                        }

                    </div>
                </div>

            </Box>
        </Modal >
    )
})

export default VirtualTravelGuard;
