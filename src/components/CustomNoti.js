import { Alert, Box, Modal } from '@mui/material'
import React from 'react'

const CustomNoti = React.memo(({ isOpen, onClose, notification, index  , type}) => {
    const modalTop = 1 + index * 18 + '%';

    console.log("vir item >>>>>>>>", notification);
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
                className="col-8"
                style={{
                    backgroundColor: "white",
                    borderRadius: 20,
                    alignSelf: "center",
                    marginTop: "10%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    height: 230,
                }}
            >
                <div className='row'>
                    <div className='col-6 ms-4 mt-4'>
                        <p>
                            Type : {type}
                            <br />
                            Date :   {notification.Date}
                            <br />
                            Time : {notification.Time}
                            <br />
                            Interal : {notification.Interval} Minutes
                            <br />
                            Location :   {notification.Place}
                        </p>

                    </div>

                    <div className='col mt-2'>
                        <img style={{ backgroundSize: "cover" }} alt="no image attaiched by user" height={200} width={200} src={notification.userSelfie} />

                    </div>
                </div>

            </Box>
        </Modal >
    )
});

export default CustomNoti;
