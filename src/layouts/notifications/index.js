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

import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';


// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
// import auth from "firebase/firestore";
import { useEffect, useState } from "react";
// import { collection, getDoc } from "firebase/firestore/lite";
import { getDatabase, ref, onValue, set, get, onChildAdded, child, update, onChildChanged } from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import { Box, Modal } from "@mui/material";
import { object } from "prop-types";

// import projectsTableData from "layouts/tables/data/projectsTableData";
function Notifications() {
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


  const { loggedIn } = controller;

  useEffect(() => {
    if (!loggedIn) {
      navigate("/authentication/sign-in");
    }

  },[])



  //   const { columns } = authorsTableData();
  const columns = [
    { Header: "SR", accessor: "sr", align: "left" },
    { Header: "Sender", accessor: "userName", align: "left" },
    // { Header: "Type", accessor: "Type", align: "left" },
    { Header: "Image", accessor: "userImage", align: "left" },
    { Header: "Time Stamp", accessor: "time", align: "center" },
    { Header: "Location", accessor: "Location", align: "center" },
  ];


  const getSos = () => {
    const db = getDatabase();
    const usersRef = ref(db, 'users');
  
    get(usersRef)
      .then((snapshot) => {
        setRows([]);
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersWithSOS = [];
          let i = 0;
  
          // Loop over the keys of the snapshot
          for (const userId in usersData) {
            if (Object.hasOwnProperty.call(usersData, userId)) {
              const user = usersData[userId];
              const { userImage, latitude, longitude } = user;
  
              // Check if the user has an SOS collection
              if (user.SOS) {
                const sosData = user.SOS;
  
                // Create an array to store the SOS items
                const sosItems = [];
  
                // Loop over the keys of the SOS data object
                for (const sosId in sosData) {
                  if (Object.hasOwnProperty.call(sosData, sosId)) {
                    const sosItem = sosData[sosId];
                    sosItems.push({
                      id: sosId,
                      data: sosItem
                    });
                  }
                }
  
                // Sort sosItems array based on date (assuming 'Date' field exists in sosItem)
              
  
                // Loop through sorted sosItems
                for (const sosItem of sosItems) {
                  i++;
  
                  // Create an SOS object and add it to the array
                  const sosObject = {
                    sr: i,
                    ker: i,
                    time: sosItem.data.Date,
                    userName: user.userName, // Retrieve userName from user object
                    userImage: (
                      <img
                        onClick={() => handleImageClick(userImage)}
                        src={userImage}
                        alt="react logo"
                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                      />
                    ),
                    latitude,
                    longitude,
                    Location: <Link to={`/locate/${userId}`}> Track </Link>,
                    sos: sosItem.data,
                  };
  
                  usersWithSOS.push(sosObject);
                }
              }
            }
          }

          // usersWithSOS.sort((a, b) => {
          //   const datePartsA = a.time.split(' - ')[1];
          //   const timePartsA = a.time.split(' - ')[0];
            
          //   const datePartsB = b.time.split(' - ')[1];
          //   const timePartsB = b.time.split(' - ')[0];
          
          //   const dateTimeA = new Date(datePartsA + ' ' + timePartsA);
          //   const dateTimeB = new Date(datePartsB + ' ' + timePartsB);
          
          //   return dateTimeB - dateTimeA;
          // });
  
          // Do something with usersWithSOS array (if needed)
          setRows(usersWithSOS);
          console.log(usersWithSOS);
        } else {
          console.log('No users found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };
  
  

  const listenForNewSosWithNotification = () => {
    const db = getDatabase();
    const usersRef = ref(db, 'users');
    
    onChildChanged(usersRef, (snapshot) => {
      const user = snapshot.val();
      const { userName } = user;
  
      if (user.SOS) {
        const sosData = user.SOS;
  
        for (const sosId in sosData) {
          const sosItem = sosData[sosId];
  
          if (!sosItem.isRead) {
            // Show a notification for the new SOS

            // toast(`${userName} needs helps`,{
            //   position: 'bottom-right', // Change position as needed
            //   autoClose: 3000, // Close after 3 seconds
            //   hideProgressBar: false  , // Show the progress bar
            //   closeButton: true, // Show the close button
            //   draggable: true, // Make it draggable
            //   progressClassName: 'mt-10', 
            // })
            // toast.warning(`${userName} Needs Emergency Help`, { autoClose: 3000 });
            
            // Update the isRead property to true
            const sosRef = child(ref(db, `users/${user.uid}/SOS`), sosId);
            update(sosRef, { isRead: true });
          }
        }
      }
    });
  };
  
  
  
  



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
          time:item.data,
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
    return;
    const querySnapshot = await getDocs(collection(db, "Users"));
    querySnapshot.forEach((doc) => {
      console.log("Users data ", doc);
    });
    const arr = [];
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      console.log("user data >>>", item);
      arr.push({
        Name: item.name,
        Email: item.email,
        Image: (
          <img
            src={item.userImage}
            alt="react logo"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        ),
        Phone: item.phoneNumber,
        Gender: item.gender,
        status: item.userEmail,
        employed: item.userImage,
        action: <Link to={`/locate/${item.key}`}> Track </Link>,
      });
    });
    setRows(arr);
  };
  const naivgate = useNavigate();
  let user = localStorage.getItem("user");
  // console.log("storage user >>>>>>>", user);
  // if (!user) {
  // naivgate("/authentication/sign-in");
  // }
  useEffect(() => {
    // getData();
    listenForNewSosWithNotification()
    getSos()
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
                  SOS
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
                className="col-md-9 col-sm-9 col-lg-6"
                style={{
                  backgroundColor: "white",
                  borderRadius: 20,
                  alignSelf: "center",
                  marginTop: "10%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  height: 450,
                }}
              >
                <img
                  src={onClickImageData}
                  alt="post image error"
                  id={"9"}
                  style={{ width: "100%", height: "100%", borderRadius: 20 }}
                />
              </Box>
            </Modal>
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Notifications;
