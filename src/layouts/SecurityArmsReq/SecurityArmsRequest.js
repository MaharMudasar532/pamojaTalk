// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Link, useNavigate } from "react-router-dom";
// import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import { ToastContainer, toast } from "react-toastify";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
// import auth from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
// import { collection, getDoc } from "firebase/firestore/lite";
import { getDatabase, ref, onValue, set, get, onChildAdded, child, update, onChildChanged } from "firebase/database";
import { collection, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
    useMaterialUIController,
    setMiniSidenav,
    setTransparentSidenav,
    setWhiteSidenav,
} from "context";
import { Box, Button, ListItem, Modal } from "@mui/material";
import { object } from "prop-types";
import { listenForNewSosWithNotification } from "components/services/AllNotificationListener";
import { showStyledToast } from "components/toastAlert";

import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "axios";
import { VIEWPORT } from "stylis";





// import projectsTableData from "layouts/tables/data/projectsTableData";
function SecurityArmsReq() {
    const [rows, setRows] = useState([]);

    const navigate = useNavigate();
    const [controller, dispatch] = useMaterialUIController();


    const [processedSosIds, setProcessedSosIds] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [onClickImageData, setOnClickImageData] = useState("");
    const handleImageClick = (url) => {
        setIsModalOpen(true);
        setOnClickImageData(url);
    };


    const [openWellBeingMod, setWellBeingMod] = useState(false);

    const [modData, setModData] = useState([]);


    const closeModal = useCallback((index) => {
        setWellBeingMod(false)
    }, [openWellBeingMod])

    const { loggedIn } = controller;

    useEffect(() => {
        if (!loggedIn) {
            navigate("/authentication/sign-in");
        }

    }, [])



    //   const { columns } = authorsTableData();
    const columns = [
        { Header: "Sr", accessor: "Sr", width: "5%", align: "left" },
        { Header: "Name", accessor: "Name", width: "10%", align: "left" },
        { Header: "Image", accessor: "userImage", width: "10%", align: "left" },
        // { Header: "Email", accessor: "Email", align: "left" },
        { Header: "Phone", accessor: "Phone", align: "center" },
        { Header: "Car Rental", accessor: "CarRental", align: "center" },
        { Header: "Destination", accessor: "DesLoc", align: "center" },
        { Header: "Pick Up Location", accessor: "PickUpLooc", align: "center" },
        { Header: "Requests Days", accessor: "RequestedDays", align: "center" },
        { Header: "Requests Men", accessor: "RequstedMen", align: "center" },
        { Header: "Security Network", accessor: "SecurityNetwork", align: "center" },
        { Header: "Total Charges", accessor: "TotoalCharges", align: "center" },

    ];


    const getUsersAndAttachScurity_agent_requests = useCallback(() => {
        const db = getDatabase();
        const usersRef = ref(db, 'users');
        let i = 0;

        get(usersRef)
            .then((snapshot) => {
                setRows([]);
                if (snapshot.exists()) {
                    const usersData = snapshot.val();
                    const usersWithScurity_agent_requests = [];

                    for (const userId in usersData) {
                        if (Object.hasOwnProperty.call(usersData, userId)) {
                            const user = usersData[userId];

                            // Check if the user has Scurity_agent_requests
                            if (user.Scurity_agent_requests) {
                                const Scurity_agent_requestsData = user.Scurity_agent_requests;

                                for (const Scurity_agent_requestId in Scurity_agent_requestsData) {
                                    if (Object.hasOwnProperty.call(Scurity_agent_requestsData, Scurity_agent_requestId)) {
                                        const Scurity_agent_requestItem = Scurity_agent_requestsData[Scurity_agent_requestId];
                                        // Attach user data and Scurity_agent_request properties to the same object
                                        i = i + 1
                                        const Scurity_agent_requestDataObject = {
                                            userId,
                                            Sr: i,
                                            Phone: user.userPhone,
                                            userImage: (
                                                <img
                                                    onClick={() => handleImageClick(user.userImage)}
                                                    src={user.userImage}
                                                    alt="Image not exist"
                                                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                                />
                                            ),
                                            Name: user.userName,
                                            latitude: user.latitude,
                                            longitude: user.longitude,
                                            Scurity_agent_requestId,
                                            // Include other Scurity_agent_request properties here
                                            ...Scurity_agent_requestItem,
                                        };
                                        usersWithScurity_agent_requests.push(Scurity_agent_requestDataObject);
                                    }
                                }
                            }
                        }
                    }

                    // Do something with usersWithScurity_agent_requests array (if needed)
                    setRows(usersWithScurity_agent_requests);
                    console.log(usersWithScurity_agent_requests);
                } else {
                    console.log('No users found.');
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);








    const acceptWorker = (item, key) => {
        // console.log("itemse", item);
        let data = item;
        data.verified = !data.verified;
        const db = getDatabase();
        set(ref(db, "Operators/" + key), {
            ...data,
        }).then(() => {
            alert("Worker has been approved");
        });
        const interval = setTimeout(() => {
            getData();
        }, 2000);
        return () => clearInterval(interval);
    };

    const getData = async () => {
        setRows([]);
        let index = 0
        const dataBase = getDatabase();
        const userss = ref(dataBase, "/Operators");
        onValue(userss, (snapShot) => {
            //   console.log("users", snapShot);
            snapShot.forEach((doc) => {
                index = index + 1;
                const item = doc.val();
                console.log(item);
                const key = doc.key;
                console.log("ket", key);
                const rowItem = {
                    SR: index,
                    Name: item.workerName,
                    time: item.data,
                    Type: item.workerType,
                    Image: (
                        <img
                            onClick={() => handleImageClick(item.userImage)}
                            src={item.workerImage}
                            alt="react logo"
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                        />
                    ),
                    Phone: item.workerPhoneNumber,
                    Status: item.verified == true ? "Accepted" : `pending`,
                    verify:
                        item.verified == false ? (
                            <button
                                type="button"
                                key={item.workerPhoneNumber}
                                onClick={(e) => {
                                    acceptWorker(item, key);
                                }}
                                class="btn btn-sm text-light btn-secondary"
                            >
                                Accept
                            </button>
                        ) : (
                            <button
                                type="button"
                                key={item.workerPhoneNumber}
                                onClick={(e) => {
                                    acceptWorker(item, key);
                                }}
                                class="btn btn-sm text-light btn-success"
                            >
                                verified
                            </button>
                        ),
                    //   employed: item.userImage,
                    Location: <Link to={`/locate/${item.key}`}> Track </Link>,
                };
                setRows((curr) => [...curr, rowItem]);
            });
            // console.log("snapshot" , snapShot);
        });

    };
    const naivgate = useNavigate();
    let user = localStorage.getItem("user");
    // console.log("storage user >>>>>>>", user);
    // if (!user) {
    // naivgate("/authentication/sign-in");
    // }
    useEffect(() => {
        // getData();
        // listenForNewSosWithNotification()
        getUsersAndAttachScurity_agent_requests()
    }, []);

    // const rows = [
    //   {
    //     Name: "test ",
    //     function: "test ",
    //     status: "test ",
    //     employed: "test ",
    //     action: "test ",
    //   },
    //   {
    //     Name: "test ",
    //     function: "test ",
    //     status: "test ",
    //     employed: "test ",
    //     action: "test ",
    //   },
    //   {
    //     Name: "test ",
    //     function: "test ",
    //     status: "test ",
    //     employed: "test ",
    //     action: "test ",
    //   },
    // ];
    // const { columns: pColumns, rows: pRows } = projectsTableData();

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ToastContainer />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white">
                                Armed Security Request
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                        <Modal
                            open={isModalOpen}
                            style={{ borderRadius: 20 }}
                            onClose={() => setIsModalOpen(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box
                                className="col-2"
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: 20,
                                    alignSelf: "center",
                                    marginTop: "10%",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            >
                                <div className="ms-auto" style={{ marginLeft: 'auto' }}>
                                    <img
                                        src={onClickImageData}
                                        alt="post image error"
                                        height={300}
                                        width={300}
                                        id={"9"}
                                        style={{ backgroundSize: "cover", borderRadius: 20 }}
                                    />
                                </div>
                            </Box>
                        </Modal>
                        <Modal
                            open={openWellBeingMod}
                            // className="position-relative"
                            style={{ borderRadius: 5, }}
                            onClose={() => setWellBeingMod(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box
                                className="col-md-9 col-sm-9 col-lg-6 pb-4"
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: 20,
                                    alignSelf: "center",
                                    marginTop: "10%",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    height: 320,
                                }}
                            >
                                <div className='row'>
                                    <div className='col-5 ms-4 mt-4'>
                                        <p style={{ fontSize: 14 }}>
                                            WellBeingCheck Type : Vitual Travel Guards <br />
                                            Name  :   {modData.Name}
                                            <br />
                                            {modData.currentLocTxt
                                                ?

                                                " Current Location :" + modData.currentLocTxt

                                                : null
                                            }
                                            {modData.destLocTxt ?
                                                "  Destination:" + modData.destLocTxt[0]
                                                : null
                                            }
                                            {modData.transportMode ?
                                                "  Tranport Mode :" + modData.transportMode
                                                : "Tranport Mode : Own Transport"
                                            }

                                            <br />
                                            Date  :   {modData.ArrivalDate || modData.TripDate}
                                            <br />
                                            Time : {modData.ArrivalTime || modData.TripTime}
                                            <br />
                                            partner Type : {modData.PartenerType}
                                            <br />
                                            partner Name  : {modData.Name}
                                            <br />
                                            partner Phone Number  : {modData.PhoneNumber}
                                            <br />
                                            Vehicle Number  : {modData.VehicleNumber
                                            }
                                            <br />
                                            {
                                                modData.currentLocTxt ?
                                                    "Arrival Station : " + modData.currentLocTxt
                                                    : null
                                            }
                                            <br />
                                            {
                                                modData.destLocTxt ?
                                                    "Destination : " + modData.destLocTxt[0]
                                                    : null
                                            }
                                        </p>

                                    </div>

                                    <div className='col mt-5 ms-4'>
                                        {
                                            modData.WellBeingTripPic ?
                                                <img
                                                    src={modData.WellBeingTripPic}
                                                    style={{ backgroundSize: "cover", borderRadius: 10 }}
                                                    alt="no image attaiched by user"
                                                    height={250} width={300}
                                                />
                                                : null
                                        }

                                    </div>
                                </div>

                            </Box>
                        </Modal >
                    </Grid>
                </Grid>
            </MDBox>
            {/* <Footer /> */}
        </DashboardLayout>
    );
}

export default SecurityArmsReq;
