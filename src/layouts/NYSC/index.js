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
import { getDatabase, ref, onValue } from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Modal } from "@mui/material";



// import projectsTableData from "layouts/tables/data/projectsTableData";
function NYSC () {
  const naivgate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const [searchTxt , setSearchText] = useState('');

  const [rows, setRows] = useState([]);
  const { columns } = authorsTableData();
  const { loggedIn } = controller;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onClickImageData, setOnClickImageData] = useState("");
  const handleImageClick = (url) => {
    setIsModalOpen(true);
    setOnClickImageData(url);
  };



  const getData = async () => {
    const dataBase = getDatabase();
    const userss = ref(dataBase, "/users");
    onValue(userss, (snapShot) => {
      console.log("users", snapShot);
      let index = 0;
      snapShot.forEach((doc ) => {
        index = index + 1;
        const item = doc.val();
        console.log(item);
        // const key = doc.key();
        console.log("itemss", item);
        const rowItem = {
          Sr : index,
          Name: item.userName,
          // Email: item.userEmail,
          Image: (
            <img
            onClick={() => handleImageClick(item.userImage)}
              src={item.userImage}
              alt="react logo"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          ),
          Phone: item.userPhone,
          Gender: item.userGender,
          Suspend: (<button className="btn btn-danger btn-sm">Suspend</button>),
          // status: item.userEmail,
          // employed: item.userImage,
          action: <Link to={`/locate/${item.key}`}> Track </Link>,
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
  useEffect(() => {
    if (!loggedIn) {
    naivgate("/authentication/sign-in");
    }
    getData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };


  useEffect(() => {

    if (searchTxt == '') {
      getData()

    }


    if (searchTxt) {
      const filteredRows = rows.filter((row) => {
        console.log("rows " ,row )
        const { Phone , Name  } = row; // Provide default values for destructuring
        const searchLowerCase = searchTxt.toLowerCase();
        return (
          Phone?.toLowerCase().startsWith(searchLowerCase) ||
          Name?.toLowerCase().startsWith(searchLowerCase) 
        );
      });

      setRows(filteredRows)
    }

  }, [searchTxt])

  return (
    <DashboardLayout>
      <DashboardNavbar value={searchTxt} onChange={handleSearchChange} />
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
                <ToastContainer/>
                <MDTypography variant="h6" color="white">
                  Users
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
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default NYSC;
