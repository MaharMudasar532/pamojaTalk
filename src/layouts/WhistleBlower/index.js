// @mui material components
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Link, useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
// import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import WarningIcon from '@mui/icons-material/Warning';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PlaceIcon from '@mui/icons-material/Place';

import ErrorIcon from '@mui/icons-material/Error';

import PersonIcon from '@mui/icons-material/Person'; // Import the user icon



import DriveEtaIcon from '@mui/icons-material/DriveEta'; // Import the car icon


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
import { Box, Button, ListItem, Modal } from "@mui/material";
import { object } from "prop-types";
import { listenForNewSosWithNotification } from "components/services/AllNotificationListener";
import SosSection from "components/SosSection";


// import projectsTableData from "layouts/tables/data/projectsTableData";
function WhistleBlower() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();

  const [search, setSearch] = useState('');

  const [processedSosIds, setProcessedSosIds] = useState([]);

  const [counts, setCounts] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onClickImageData, setOnClickImageData] = useState("");
  const handleImageClick = (url) => {
    setIsModalOpen(true);
    setOnClickImageData(url);
  };

  const [searchTxt , setSearchText] = useState('');



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
                    Detail: whistleBlowItem.data.Report,
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

          const typeInfo = {}; // Object to store count and percentage by Type

          for (const whistleBlowObject of usersWithWhistleBlow) {
            const type = whistleBlowObject.Type.props.children; // Assuming Type is a string
            if (typeInfo[type]) {
              typeInfo[type].count++;
            } else {
              typeInfo[type] = { count: 1, percentage: 0 };
            }
          }

          // Calculate percentages
          const totalCount = usersWithWhistleBlow.length;
          for (const type in typeInfo) {
            const count = typeInfo[type].count;
            const percentage = (count / totalCount) * 100;
            typeInfo[type].percentage = Math.floor(percentage);
          }

          setCounts(typeInfo)


          // Do something with typeInfo object (contains count and percentage by Type)
          console.log(typeInfo);


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
  }, []);





  useEffect(() => {
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
                    Detail: whistleBlowItem.data.Report,
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

          if (search !== 'All') {
            const filteredUsersWithWhistleBlow = usersWithWhistleBlow.filter((item) =>
              item.whistleBlow.Type === search
            );
            setRows(filteredUsersWithWhistleBlow);
          } else {
            setRows(usersWithWhistleBlow)
          }



          // Do something with usersWithWhistleBlow array (if needed)
          console.log(usersWithWhistleBlow);
        } else {
          console.log('No users found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });

  }, [search])







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

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };


  useEffect(() => {

    if (searchTxt == '') {
      getWhistleBlow()

    }


    if (searchTxt) {
      const filteredRows = rows.filter((row) => {
        console.log("rows " ,row )
        const { userName  } = row; // Provide default values for destructuring
        const searchLowerCase = searchTxt.toLowerCase();
        return (
          userName.toLowerCase().startsWith(searchLowerCase) 
        );
      });

      setRows(filteredRows)
    }

  }, [searchTxt])




  return (
    <DashboardLayout>
   <DashboardNavbar value={searchTxt} onChange={handleSearchChange} />
      <ToastContainer />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <div className="container row ms-4 mb-1">
            <div className="col-sm col-lg col-xl mt-2">
              <SosSection
                OnPress={() => setSearch('Snatched Car')}
                count={counts["Snatched Car"] ? counts["Snatched Car"].count : 0}
                per={counts["Snatched Car"] ? counts["Snatched Car"].percentage : 0}
                color="#e65555"
                icon={<DriveEtaIcon style={{ color: "white" }}
                />}
                title="Snatched Car"
              />
            </div>

            <div className="col-sm col-lg col-xl mt-2 ">
              <SosSection
                OnPress={() => setSearch('Report kidnapping')}
                count={counts["Report kidnapping"] ? counts["Report kidnapping"].count : 0}
                per={counts["Report kidnapping"] ? counts["Report kidnapping"].percentage : 0}
                color="#279858"
                icon={<PersonIcon style={{ color: "white" }}
                />}
                title="Kidnapping"
              />
            </div>

            <div className="col-sm col-lg col-xl mt-2 ">
              <SosSection
                OnPress={() => setSearch('Search a house')}
                count={counts["Search a house"] ? counts["Search a house"].count : 0}
                per={counts["Search a house"] ? counts["Search a house"].percentage : 0}
                color="#9D56E0"
                icon={<HomeIcon style={{ color: "white" }}
                />}
                title="Search a House"
              />
            </div>

            <div className="col-sm col-lg col-xl mt-2 ">
              <SosSection
                OnPress={() => setSearch('Stop ritual killing')}
                count={counts["Stop ritual killing"] ? counts["Stop ritual killing"].count : 0}
                per={counts["Stop ritual killing"] ? counts["Stop ritual killing"].percentage : 0}
                color="#9D56E0"
                icon={<ErrorIcon style={{ color: "white" }}
                />}
                title=" Ritual Killing"
              />
            </div>

            <div className="col-sm col-lg col-xl mt-2 ">
              <SosSection
                OnPress={() => setSearch('Report a criminal in your area')}
                count={counts["Report a criminal in your area"] ? counts["Report a criminal in your area"].count : 0}
                per={counts["Report a criminal in your area"] ? counts["Report a criminal in your area"].percentage : 0}
                color="#B9472C"
                icon={<PlaceIcon style={{ color: "white" }}
                />}
                title="Criminal In Area"
              />
            </div>
            <div className="col-sm col-lg col-xl mt-2 ">
              <SosSection
                OnPress={() => setSearch('Others')}
                count={counts["Others"] ? counts["Others"].count : 0}
                per={counts["Others"] ? counts["Others"].percentage : 0}
                color="#3583ED"
                icon={<HelpOutlineIcon style={{ color: "white" }}
                />}
                title="Others"
              />
            </div>
            <div className="col-sm col-lg col-xl mt-2 ">
              <SosSection
                OnPress={() => setSearch('All')}
                count={rows ? rows.length : 0}
                color="#CA1DAE"
                icon={<WarningIcon style={{ color: "white" }}
                />}
                title="All"
              />
            </div>
            <div className="col-sm col-lg col-xl mt-2 ">
              {/* <SosSection
                OnPress={() => setSearch('All')}
                count={rows ? rows.length : 0}
                color="#CA1DAE"
                icon={<WarningIcon style={{ color: "white" }}
                />}
                title="All"
              /> */}
            </div>

          </div>
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
                  

                  Dashboard
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
