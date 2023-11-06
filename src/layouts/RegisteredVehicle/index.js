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
import { Box, Modal } from "@mui/material";

// import projectsTableData from "layouts/tables/data/projectsTableData";
function RegisteredVehicle() {
  const [rows, setRows] = useState([]);

  const [data, setData] = useState([]);

  const [search, setSearchText] = useState('');



  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onClickImageData, setOnClickImageData] = useState("");
  const handleImageClick = (url) => {
    setIsModalOpen(true);
    setOnClickImageData(url);
  };



  //   const { columns } = authorsTableData();
  const columns = [
    { Header: "SR", accessor: "SR", align: "center" },
    { Header: "Name", accessor: "Name", align: "center" },
    { Header: "Number", accessor: "Number", align: "center" },
    { Header: "Pin No", accessor: "Pin", align: "center" },
    { Header: "Image", accessor: "Image", align: "center" },

  ];



  const naivgate = useNavigate();
  let user = localStorage.getItem("user");

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
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
                  Pin: vehicle.Pin,
                  Image: (
                    <img
                      onClick={() => handleImageClick(vehicle.imgVehicle)}
                      src={vehicle.imgVehicle}
                      alt="Not Available"
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    />
                  )
                }

                setRows((prev) => [...prev, rowItem]);

                const vehicleObject = {
                  userId: userId,
                  vehicleName: vehicle.vehicleName,
                  vehicleNumber: vehicle.vehicleNumber,
                  imgVehicle: vehicle.imgVehicle,
                };

                console.log("vehicle object ", vehicleObject)

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
  }



  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };


  useEffect(() => {

    if (search == '') {
      getData()

    }


    if (search) {
      const filteredRows = rows.filter((row) => {
        const { Number = '', Name = '' , Pin  } = row; // Provide default values for destructuring
        const searchLowerCase = search.toLowerCase();
        return (
          Number.toLowerCase().startsWith(searchLowerCase) ||
          Name.toLowerCase().startsWith(searchLowerCase) ||
          Pin.toLowerCase().startsWith(searchLowerCase) 
          
        );
      });

      setRows(filteredRows)
    }

  }, [search])


  return (
    <DashboardLayout>
      <DashboardNavbar value={search} onChange={handleSearchChange} />
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
                  Vehicles
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
            onClick={() => handleImageClick(onClickImageData)}
            alt="post image error"
            id={"9"}
            style={{ width: "100%", height: "100%", borderRadius: 20 }}
          />
        </Box>
      </Modal>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default RegisteredVehicle;

