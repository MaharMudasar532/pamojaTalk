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
import "react-toastify/dist/ReactToastify.css";


// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
// import auth from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
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
import { Box, ListItem, Modal } from "@mui/material";
import { object } from "prop-types";
import { listenForNewSosWithNotification } from "components/services/AllNotificationListener";


// import projectsTableData from "layouts/tables/data/projectsTableData";
function WhistleBlower() {
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



  //   const { columns } = authorsTableData();
  const columns = [
    { Header: "SR", accessor: "sr", align: "left" },
    { Header: "Type", accessor: "Type", align: "left" },
    { Header: "Detial", accessor: "Detail", align: "left" },
    { Header: "Sender", accessor: "userName", align: "left" },
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

                // Loop over the keys of the SOS data object in reverse order
                const sosIds = Object.keys(sosData).reverse(); // Get the keys in reverse order
                for (const sosId of sosIds) {
                  const sosItem = sosData[sosId];
                  i++;

                  // Create an SOS object and add it to the array
                  const sosObject = {
                    sr: i,
                    ker: i,
                    time: sosItem.Date,
           
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
                    sos: sosItem,
                  };

                  usersWithSOS.push(sosObject);
                }
              }
            }
          }

          // Do something with usersWithSOS array (if needed)
          setRows(usersWithSOS.reverse());
          console.log(usersWithSOS);
        } else {
          console.log('No users found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  const getWhistleBlow = useCallback(() => {
    const db = getDatabase();
    const usersRef = ref(db, 'users');

    get(usersRef)
      .then((snapshot) => {
        setRows([]);
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersWithWhistleBlow = [];

          // Loop over the keys of the snapshot
          for (const userId in usersData) {
            if (Object.hasOwnProperty.call(usersData, userId)) {
              const user = usersData[userId];
              const { userImage, latitude, longitude } = user;

              // Check if the user has a Whistle_Blow collection
              if (user.Whistle_Blow) {
                const whistleBlowData = user.Whistle_Blow;

                // Create an array to store the whistleBlowItems
                const whistleBlowItems = [];

                // Loop over the keys of the Whistle_Blow data object
                for (const whistleBlowId in whistleBlowData) {
                  if (Object.hasOwnProperty.call(whistleBlowData, whistleBlowId)) {
                    const whistleBlowItem = whistleBlowData[whistleBlowId];
                    whistleBlowItems.push({
                      id: whistleBlowId,
                      data: whistleBlowItem
                    });
                  }
                }

                // Sort whistleBlowItems array based on date (assuming 'Date' field exists in whistleBlowItem)
                // whistleBlowItems.sort((a, b) => {
                //   const partsA = a.data.Date.split(' - ');
                //   const partsB = b.data.Date.split(' - ');

                //   const timeA = partsA[0];
                //   const dateA = partsA[1];

                //   const timeB = partsB[0];
                //   const dateB = partsB[1];

                //   const dateTimeA = new Date(dateA + ' ' + timeA);
                //   const dateTimeB = new Date(dateB + ' ' + timeB);

                //   return dateTimeB - dateTimeA;
                // });
                const className = [
                  "btn-danger",
                  "btn-warning",
                  "btn-info",
                  "btn-secondary",
                ];

                // Loop through sorted whistleBlowItems
                let i = 0;
                for (const whistleBlowItem of whistleBlowItems) {
                  i++;

                  const randomIndex = Math.floor(Math.random() * className.length);

                  // Get the randomly selected class name
                  const randomClass = className[randomIndex];

                  // Create a Whistle_Blow object and add it to the array
                  const whistleBlowObject = {
                    sr: i,
                    ker: i,
                    Type: (<button className={` btn btn-sm ${randomClass} `}>{whistleBlowItem.data.Type}</button>),
                    time: whistleBlowItem.data.Date,
                    userName: user.userName,
                    Detail:whistleBlowItem.data.Report,
                    userImage: (
                      <img
                        onClick={() => handleImageClick(userImage)}
                        src={userImage}
                        alt="react logo"
                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                      />
                    ),
                    latitude,
                    longitude,
                    Location: <Link to={`/locate/${userId}`}> Track </Link>,
                    whistleBlow: whistleBlowItem.data,
                  };

                  usersWithWhistleBlow.push(whistleBlowObject);
                }
              }
            }
          }

          usersWithWhistleBlow.sort((a, b) => {
            const dateA = new Date(a.time.split(' - ')[1] + ' ' + a.time.split(' - ')[0]);
            const dateB = new Date(b.time.split(' - ')[1] + ' ' + b.time.split(' - ')[0]);
            return dateB - dateA;
          });



          // Do something with usersWithWhistleBlow array (if needed)
          setRows(usersWithWhistleBlow);
          console.log(usersWithWhistleBlow);
        } else {
          console.log('No users found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  },[]);




  // const listenForNewSosWithNotification = () => {
  //   const db = getDatabase();
  //   const usersRef = ref(db, 'users');

  //   onChildChanged(usersRef, (snapshot) => {
  //     const user = snapshot.val();
  //     const { userName } = user;

  //     if (user.SOS) {
  //       const sosData = user.SOS;

  //       for (const sosId in sosData) {
  //         const sosItem = sosData[sosId];

  //         if (!sosItem.isRead) {
  //           // Show a notification for the new SOS
  //           toast.warning(`${userName} Needs Emergency Help`, { autoClose: 3000 });

  //           // Update the isRead property to true
  //           const sosRef = child(ref(db, `users/${user.uid}/SOS`), sosId);
  //           // update(sosRef, { isRead: true });
  //         }
  //       }
  //     }
  //   });
  // };







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
    // listenForNewSosWithNotification()
    getWhistleBlow()
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
                  User
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

export default WhistleBlower;
