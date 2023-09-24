// import React from 'react'

// export default function RegisteredVehicle() {
//   return (
//     <div>RegisteredVehicle</div>
//   )
// }

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

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
// import auth from "firebase/firestore";
import { useEffect, useState } from "react";
// import { collection, getDoc } from "firebase/firestore/lite";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

// import projectsTableData from "layouts/tables/data/projectsTableData";
function RegisteredVehicle() {
  const [rows, setRows] = useState([]);

  const [data , setData] = useState([]);



  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();



  //   const { columns } = authorsTableData();
  const columns = [
    { Header: "SR", accessor: "SR", align: "left" },
    { Header: "Name", accessor: "Name", align: "left" },
    { Header: "Number", accessor: "Number", align: "left" },
    { Header: "Image", accessor: "Image", align: "left" },
    // { Header: "Phone", accessor: "Phone", align: "center" },
    // { Header: "Status", accessor: "Status", align: "center" },
    // { Header: "verify", accessor: "verify", align: "center" },
    // { Header: "action", accessor: "action", align: "center" },
  ];



  // const getData = async () => {
  //   setRows([]);
  //   let index = 0
  //   const dataBase = getDatabase();
  //   const userss = ref(dataBase, "/Operators");
  //   onValue(userss, (snapShot) => {
  //     //   console.log("users", snapShot);
  //     snapShot.forEach((doc) => {
  //       index = index + 1;
  //       const item = doc.val();
  //       console.log(item);
  //       const key = doc.key;
  //       console.log("ket", key);
  //       const rowItem = {
  //         SR: index,
  //         Name: item.workerName,
  //         Type: item.workerType,
  //         Image: (
  //           <img
  //             src={item.workerImage}
  //             alt="react logo"
  //             style={{ width: "50px", height: "50px", borderRadius: "50%" }}
  //           />
  //         ),
  //         Phone: item.workerPhoneNumber,
  //         Status: item.verified == true ? "Accepted" : `pending`,
  //         verify:
  //           item.verified == false ? (
  //             <button
  //               type="button"
  //               key={item.workerPhoneNumber}
  //               onClick={(e) => {
  //                 acceptWorker(item, key);
  //               }}
  //               class="btn btn-sm text-light btn-secondary"
  //             >
  //               Accept
  //             </button>
  //           ) : (
  //             <button
  //               type="button"
  //               key={item.workerPhoneNumber}
  //               onClick={(e) => {
  //                 acceptWorker(item, key);
  //               }}
  //               class="btn btn-sm text-light btn-success"
  //             >
  //               verified
  //             </button>
  //           ),
  //         //   employed: item.userImage,
  //         action: <Link to={`/locate/${item.key}`}> Track </Link>,
  //       };
  //       setRows((curr) => [...curr, rowItem]);
  //     });
  //     // console.log("snapshot" , snapShot);
  //   });
  //   return;
  //   const querySnapshot = await getDocs(collection(db, "Users"));
  //   querySnapshot.forEach((doc) => {
  //     console.log("Users data ", doc);
  //   });
  //   const arr = [];
  //   querySnapshot.forEach((doc) => {
  //     const item = doc.data();
  //     console.log("user data >>>", item);
  //     arr.push({
  //       Name: item.name,
  //       Email: item.email,
  //       Image: (
  //         <img
  //           src={item.userImage}
  //           alt="react logo"
  //           style={{ width: "50px", height: "50px", borderRadius: "50%" }}
  //         />
  //       ),
  //       Phone: item.phoneNumber,
  //       Gender: item.gender,
  //       status: item.userEmail,
  //       employed: item.userImage,
  //       action: <Link to={`/locate/${item.key}`}> Track </Link>,
  //     });
  //   });
  //   setRows(arr);
  // };
  const naivgate = useNavigate();
  let user = localStorage.getItem("user");
  // console.log("storage user >>>>>>>", user);
  // if (!user) {
  // naivgate("/authentication/sign-in");
  // }
  useEffect(() => {
    // getData();
  }, []);

  
  useEffect(() => {
    // Reference to the Firebase database
    setRows([])
    const database = getDatabase();
    const usersRef = ref(database, "/users");

    // Attach an event listener to listen for changes to the "Operators" node
    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      const dataArray = [];
      let index = 0;


      // Loop through each user
      for (const userId in usersData) {
        if (usersData.hasOwnProperty(userId)) {
          const user = usersData[userId];

          // Check if the user has a "Registered_Vehicles" collection
          if (user.Registered_Vehicles) {
            // Loop through the vehicles in "Registered_Vehicles" collection
            for (const vehicleId in user.Registered_Vehicles) {
              if (user.Registered_Vehicles.hasOwnProperty(vehicleId)) {
                const vehicle = user.Registered_Vehicles[vehicleId];
                index = index + 1;
                // Create an object with the desired properties

                const rowItem = {
                  SR: index,
                  Name: vehicle.vehicleName,
                  Number: vehicle.vehicleNumber,
                  Image: (
                    <img
                      src={vehicle.imgVehicle}
                      alt="Not Available"
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    />
                  )
                }

                setRows((prev)=>[...prev, rowItem]);

                const vehicleObject = {
                  userId: userId,
                  vehicleName: vehicle.vehicleName,
                  vehicleNumber: vehicle.vehicleNumber,
                  imgVehicle: vehicle.imgVehicle,
                };

                console.log("vehicle object "  , vehicleObject)

                // Push the object to the dataArray
                // dataArray.push(vehicleObject);
              }
            }
          }
        }
      }

      // Set the state with the array of objects
      // setData(dataArray);
    });
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
                  Agents
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
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default RegisteredVehicle;

