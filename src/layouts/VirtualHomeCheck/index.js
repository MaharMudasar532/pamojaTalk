// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import VisibilityIcon from '@mui/icons-material/Visibility';


// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Link, useNavigate } from "react-router-dom";
// import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import { ToastContainer, toast } from "react-toastify";
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
import CountdownRow from "components/CounDown";

// import projectsTableData from "layouts/tables/data/projectsTableData";
function VirtualHomeCheck() {
    const [rows, setRows] = useState([]);

    const navigate = useNavigate();
    const [controller, dispatch] = useMaterialUIController();

    const [openWellBeingMod, setWellBeingMod] = useState(false);

    const [modData, setModData] = useState([]);


    const closeModal = useCallback((index) => {
        setWellBeingMod(false)
    }, [openWellBeingMod])


    const [processedSosIds, setProcessedSosIds] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [onClickImageData, setOnClickImageData] = useState("");
    const handleImageClick = (url) => {
        setIsModalOpen(true);
        setOnClickImageData(url);
    };

    const { loggedIn } = controller;

    useEffect(() => {
        if (!loggedIn) {
            navigate("/authentication/sign-in");
        }

    }, [])


    function addMinutesToTime(inputTime, minutesToAdd) {
        // Step 1: Parse the input time
        const timeComponents = inputTime.match(/^(\d{1,2}):(\d{2})\s?([APap][Mm])$/);
        // if (!timeComponents) {
        //   throw new Error("Invalid time format. Please use 'hh:mm AM/PM' format.");
        // }
      
        let [, hours, minutes, amPm] = timeComponents;
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);
      
        if (amPm.toLowerCase() === "pm" && hours !== 12) {
          hours += 12;
        } else if (amPm.toLowerCase() === "am" && hours === 12) {
          hours = 0;
        }
      
        // Step 2: Create a Date object and add minutes
        const parsedTime = new Date();
        parsedTime.setHours(hours, minutes);
        parsedTime.setMinutes(parsedTime.getMinutes() + minutesToAdd);
      
        // Step 3: Format the result
        const formattedHours = parsedTime.getHours() % 12 || 12;
        const formattedMinutes = parsedTime.getMinutes();
        const formattedAmPm = parsedTime.getHours() >= 12 ? "PM" : "AM";
      
        return `${formattedHours}:${String(formattedMinutes).padStart(2, "0")} ${formattedAmPm}`;
      }
      
   
      



    //   const { columns } = authorsTableData();
    const columns = [
        { Header: "SR", accessor: "SR", align: "center" },
        // { Header: "Type", accessor: "Type", align: "center" },
        // { Header: "Sender", accessor: "userName", align: "center" },
        { Header: "Selfie", accessor: "userImage", align: "center" },
        { Header: "Date", accessor: "Date", align: "center" },
        { Header: "Interval", accessor: "interval", align: "center" },
        { Header: "Start Time", accessor: "time", align: "center" },
        { Header: "End Time", accessor: "endtime", align: "center" },
        { Header: "count Down ", accessor: "cd", align: "center" },
        { Header: "Location", accessor: "Location", align: "center" },
        { Header: "View", accessor: "Action", align: "center" },
        { Header: "Selfie/Location Id", accessor: "selVeh", align: "center" },
        { Header: "Map Location", accessor: "map", align: "center" },
    ];

    const getVirtualHomeCheck = useCallback(() => {
        const db = getDatabase();
        const usersRef = ref(db, 'users');

        get(usersRef)
            .then((snapshot) => {
                setRows([]);
                if (snapshot.exists()) {
                    const usersData = snapshot.val();
                    const allVirtualHomeCheckItems = [];
                    console.log("user data of wellbeing ", usersData);

                    // Loop over the keys of the snapshot (each user)
                    for (const userId in usersData) {
                        if (Object.hasOwnProperty.call(usersData, userId)) {
                            const user = usersData[userId];
                            const { userImage, latitude, longitude } = user;
                            let i = 0;

                            // Check if the user has a VirtualHomeCheck collection
                            if (user.VirtualHomeCheck) {
                                const virtualHomeCheckData = user.VirtualHomeCheck;

                                // Loop over the keys of the VirtualHomeCheckData object for this user
                                for (const virtualHomeCheckId in virtualHomeCheckData) {
                                    if (Object.hasOwnProperty.call(virtualHomeCheckData, virtualHomeCheckId)) {
                                        const virtualHomeCheckItem = virtualHomeCheckData[virtualHomeCheckId];
                                        i = i + 1;
                                        // Check if the virtualHomeCheckItem has child objects
                                        if (Object.keys(virtualHomeCheckItem).length > 0) {
                                            // Create a VirtualHomeCheckData object and add it to the array
                                            const virtualHomeCheckDataObject = {
                                                SR: i,
                                                Type: "Virtual Home Check",
                                                Date: virtualHomeCheckItem.Date,
                                                time: virtualHomeCheckItem.Time,
                                                cd:
                                                <CountdownRow key={i}
                                                 date={virtualHomeCheckItem.Date}
                                                 time ={virtualHomeCheckItem.Time}
                                                 interval={virtualHomeCheckItem.Interval}

                                                  />,
                                                endtime: addMinutesToTime(virtualHomeCheckItem.Time , virtualHomeCheckItem.Interval),
                                                selVeh: (
                                                    <>
                                                        <Button
                                                            onClick={() => {
                                                                handleImageClick(
                                                                    user.userSelfie

                                                                )
                                                            }}

                                                            style={{ padding: 0 }} className="btn btn-priamry btn-sm p-0 m-0 bg-primary text-light btn-sm  ">
                                                            Selfie
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                handleImageClick(
                                                                    user.userVehicle 

                                                                )
                                                            }}
                                                            style={{ padding: 0 }}
                                                            className=" ms-1 btn btn-secondary btn-sm px-1 p-0 m-0 bg-secondary  text-light btn-sm  ">
                                                             Location Id
                                                        </Button>
                                                    </>

                                                ),
                                                userName: virtualHomeCheckItem.Name,
                                                No: virtualHomeCheckItem.VehicleNumber,
                                                partner: virtualHomeCheckItem.PartenerType,
                                                Location: virtualHomeCheckItem.Place,
                                                interval: virtualHomeCheckItem.Interval + ' Minutes'
                                                ,
                                                Action: (<Button
                                                    onClick={() => {
                                                        setModData(virtualHomeCheckItem);
                                                        console.log("mod data ", virtualHomeCheckItem)
                                                        setWellBeingMod(true);
                                                    }}

                                                    style={{ padding: 7, backgroundColor: "#f2f2f2" }}>
                                                    <VisibilityIcon />
                                                </Button>),
                                                userImage: (
                                                    <img
                                                        onClick={() => handleImageClick(virtualHomeCheckItem.userSelfie)}
                                                        src={virtualHomeCheckItem.userSelfie
                                                        }
                                                        alt="No picture"
                                                        style={{ backgroundSize: "cover", width: '50px', height: '50px', borderRadius: '50%' }}
                                                    />
                                                ),
                                                latitude,
                                                longitude,
                                                map: <Link to={`/locate/${userId}`}> Track </Link>,
                                                virtualHomeCheck: virtualHomeCheckItem,

                                            };

                                            allVirtualHomeCheckItems.push(virtualHomeCheckDataObject);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Do something with allVirtualHomeCheckItems array (if needed)
                    setRows(allVirtualHomeCheckItems.reverse());
                    console.log(allVirtualHomeCheckItems);
                } else {
                    console.log('No users found.');
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);



    const naivgate = useNavigate();
    let user = localStorage.getItem("user");

    useEffect(() => {
        // getData();
        // listenForNewSosWithNotification()
        getVirtualHomeCheck()
    }, []);

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
                                    Virtual Home Check
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
                                className="col-2 bg-none"
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
                                            Type : {"Virrtual Home Check"}
                                            <br />
                                            Date :   {modData.Date}
                                            <br />
                                            Time : {modData.Time}
                                            <br />
                                            Interal : {modData.Interval} Minutes
                                            <br />
                                            Location :   {modData.Place}
                                        </p>

                                    </div>

                                    <div className='col mt-2'>
                                        <img style={{ backgroundSize: "cover" }} alt="no image attaiched by user" height={200} width={200} src={modData.userSelfie} />

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

export default VirtualHomeCheck;
