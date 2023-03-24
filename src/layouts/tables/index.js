// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Link } from "react-router-dom";
// import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
// import auth from "firebase/firestore";
import { useEffect, useState } from "react";
// import { collection, getDoc } from "firebase/firestore/lite";
import { getDatabase, ref, onValue } from "firebase/database";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../../firebase";

// import projectsTableData from "layouts/tables/data/projectsTableData";
function Tables() {
  const [rows, setRows] = useState([]);
  const { columns } = authorsTableData();
  const onLogin = async () => {
    await signInWithEmailAndPassword(auth, "raj4hha4@gmail.com", "Hello123@")
      .then((userData) => {
        // setUser(userData.user);
        console.log("userData", userData.user);
      })
      .catch((er) => {
        console.log(er.message.toString());
      });
  };

  const getData = async () => {
    const db = getDatabase();
    const starCountRef = ref(db, "users/");
    const arr = [];
    onValue(starCountRef, (snapshot) => {
      snapshot.forEach((data) => {
        const item = data.val();
        console.log("user data >>>", item);
        arr.push({
          Name: item.userName,
          Email: item.userEmail,
          Image: (
            <img
              src={item.userImage}
              alt="react logo"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          ),
          Phone: item.userPhone,
          Gender: item.userGender,
          status: item.userEmail,
          employed: item.userImage,
          action: <Link to={`/locate/${item.key}`}> Track </Link>,
        });
      });
    });
    setRows(arr);
  };
  useEffect(async () => {
    await onLogin();
    getData();
  }, [rows]);

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
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Tables;
