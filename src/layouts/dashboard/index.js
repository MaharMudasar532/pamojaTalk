
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';

import ReportIcon from '@mui/icons-material/Report';

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { getDatabase, ref, onValue , get  } from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useCallback, useEffect, useState } from "react";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HealingIcon from '@mui/icons-material/Healing';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import SecurityIcon from '@mui/icons-material/Security';

import BusinessIcon from '@mui/icons-material/Business';

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  const [totalUserCount, setTotalUserCount] = useState(0);
  const [newUserCountThisMonth, setNewUserCountThisMonth] = useState(0);
  const [totalSOSCount, setTotalSOSCount] = useState(0);
  const [newSOSCountThisMonth, setNewSOSCountThisMonth] = useState(0);
  const [totalWellBeingServicesCount, setTotalWellBeingServicesCount] = useState(0);
  const [newWellBeingServicesCountThisMonth, setNewWellBeingServicesCountThisMonth] = useState(0);
  const [totalVirtualHomeCheckCount, setTotalVirtualHomeCheckCount] = useState(0);
  const [newVirtualHomeCheckCountThisMonth, setNewVirtualHomeCheckCountThisMonth] = useState(0);

  const [totalVehicles, setTotalVehicles] = useState(0);
  const [newVehiclesThisMonth, setNewVehiclesThisMonth] = useState(0);

  const [totalOperators, setTotalOperators] = useState(0);
  const [newOperatorsThisMonth, setNewOperatorsThisMonth] = useState(0);
  const [totalWhistleBlowers, setTotalWhistleBlowers] = useState(0);
  const [newWhistleBlowersThisMonth, setNewWhistleBlowersThisMonth] = useState(0);


  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, 'users');

    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        let totalWhistleBlowerCount = 0;

        for (const userId in usersData) {
          const user = usersData[userId];
          if (user.Whistle_Blow) {
            totalWhistleBlowerCount += Object.keys(user.Whistle_Blow).length;
          }
        }

        setTotalWhistleBlowers(totalWhistleBlowerCount);
      } else {
        console.log('No users found.');
      }
    });
  }, []);


  const getOperatorsCounts  = () => {
    // Reference to the Firebase database
    const database = getDatabase();
    const operatorsRef = ref(database, '/Operators');

    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed, so add 1
    const currentYear = currentDate.getFullYear();

    let totalOperatorCount = 0;
    let newOperatorCountThisMonth = 0;

    // Attach an event listener to listen for changes to the "Operators" node
    onValue(operatorsRef, (snapshot) => {
      const operatorsData = snapshot.val();

      // Loop through each operator
      for (const operatorId in operatorsData) {
        if (operatorsData.hasOwnProperty(operatorId)) {
          const operator = operatorsData[operatorId];

          totalOperatorCount++;

          // Check if the operator was added this month and year
          const operatorDate = new Date(operator.dateAdded);
          const operatorMonth = operatorDate.getMonth() + 1; // Month is 0-indexed
          const operatorYear = operatorDate.getFullYear();

          if (operatorMonth === currentMonth && operatorYear === currentYear) {
            newOperatorCountThisMonth++;
          }
        }
      }

      // Set the state with the counts
      setTotalOperators(totalOperatorCount);
      setNewOperatorsThisMonth(newOperatorCountThisMonth);
    });
  };

  const getVirtualHomeCheckTotalCount = useCallback(() => {
    const db = getDatabase();
    const usersRef = ref(db, 'users');

    return get(usersRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const usersData = snapshot.val();
                let totalVirtualHomeCheckCount = 0;

                for (const userId in usersData) {
                    if (Object.hasOwnProperty.call(usersData, userId)) {
                        const user = usersData[userId];

                        if (user.VirtualHomeCheck) {
                            totalVirtualHomeCheckCount += Object.keys(user.VirtualHomeCheck).length;
                        }
                    }
                }
                setTotalVirtualHomeCheckCount(totalVirtualHomeCheckCount)
                return totalVirtualHomeCheckCount;
            } else {
                console.log('No users found.');
                return 0; // No users found, return 0
            }
        })
        .catch((error) => {
            console.error('Error fetching users:', error);
            return 0; // Handle error by returning 0
        });
}, []);


  const getREgisVehicle = () => {
    // Reference to the Firebase database
    const database = getDatabase();
    const usersRef = ref(database, '/users');

    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed, so add 1
    const currentYear = currentDate.getFullYear();

    let totalVehicleCount = 0;
    let newVehicleCountThisMonth = 0;

    // Attach an event listener to listen for changes to the "Users" node
    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();

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
                totalVehicleCount++;

                // Check if the vehicle was added this month and year
                const vehicleDate = new Date(vehicle.dateAdded);
                const vehicleMonth = vehicleDate.getMonth() + 1; // Month is 0-indexed
                const vehicleYear = vehicleDate.getFullYear();

                if (vehicleMonth === currentMonth && vehicleYear === currentYear) {
                  newVehicleCountThisMonth++;
                }
              }
            }
          }
        }
      }

      // Set the state with the counts
      setTotalVehicles(totalVehicleCount);
      setNewVehiclesThisMonth(newVehicleCountThisMonth);
    });
  };

  const getDashboardData = () => {
    const db = getDatabase();
    const usersRef = ref(db, 'users');

    let totalUserCount = 0;
    let newUserCountThisMonth = 0;
    let totalSOSCount = 0;
    let newSOSCountThisMonth = 0;
    let totalWellBeingServicesCount = 0;
    let newWellBeingServicesCountThisMonth = 0;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed, so we add 1

    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();

        for (const userId in usersData) {
          if (Object.hasOwnProperty.call(usersData, userId)) {
            const user = usersData[userId];

            // Increment total user count
            totalUserCount++;

            // Check if the user was added this month
            const userDate = new Date(user.createdDate);
            if (userDate.getMonth() + 1 === currentMonth) {
              newUserCountThisMonth++;
            }

            if (user.SOS) {
              const sosData = user.SOS;
              const sosItems = Object.values(sosData);

              for (const sosItem of sosItems) {
                // Check if the SOS item is within the current month
                const sosDate = new Date(sosItem.Date);

                if (sosDate.getMonth() + 1 === currentMonth) {
                  newSOSCountThisMonth++;
                }

                totalSOSCount++;
              }
            }

            if (user.wellBeingServicesData) {
              const wellBeingServicesData = user.wellBeingServicesData;
              const wellBeingServicesItems = Object.values(wellBeingServicesData);

              for (const wellBeingServicesItem of wellBeingServicesItems) {
                // Check if the wellBeingServicesItem is within the current month
                const wellBeingServicesDate = new Date(wellBeingServicesItem.Date);

                if (wellBeingServicesDate.getMonth() + 1 === currentMonth) {
                  newWellBeingServicesCountThisMonth++;
                }

                totalWellBeingServicesCount++;
              }
            }
          }
        }

        // alert (newWellBeingServicesCountThisMonth)

        // Update state with counts
        setTotalSOSCount(totalSOSCount);
        setNewSOSCountThisMonth(newSOSCountThisMonth);
        setTotalUserCount(totalUserCount);
        setNewUserCountThisMonth(newUserCountThisMonth);
        setTotalWellBeingServicesCount(totalWellBeingServicesCount);
        setNewWellBeingServicesCountThisMonth(newWellBeingServicesCountThisMonth);
      } else {
        console.log('No users found.');
      }
    });
  };

  useEffect(() => {
    // Call the getSos function when the component mounts
    getDashboardData();
    getVirtualHomeCheckTotalCount()
    getREgisVehicle()
    getOperatorsCounts()
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>

              <ComplexStatisticsCard
                icon="leaderboard"
                title="Today's Users"
                count={totalUserCount}
                percentage={{
                  color: "success",
                  // amount: `${newUserCountThisMonth}`,
                  // label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon={<ReportIcon  style={{marginBottom:20}}/>}
                title="WhistleBlower"
                count={totalWhistleBlowers}
                percentage={{
                  color: "success",
                  // amount: `${newWhistleBlowersThisMonth}`,
                  // label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="SOS"
                count={totalSOSCount}
                percentage={{
                  color: "success",
                  // amount: `${newSOSCountThisMonth}`,
                  // label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon={<HealingIcon style={{ marginBottom: 30 }} fontSize="medium" color="inherit" />}
                title="Virtual Home Check"
                count={totalVirtualHomeCheckCount}
                percentage={{
                  color: "success",
                  // amount: `${totalWellBeingServicesCount}`,
                  // label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon={<SecurityIcon fontSize="lg" style={{ marginBottom: 30 }} color="inherit" />}
                title="Virtul Travel Guard"
                count={totalWellBeingServicesCount}
                percentage={{
                  color: "success",
                  // amount: `${newVirtualHomeCheckCountThisMonth}`,
                  // label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
           <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="secondary"
                icon={<DirectionsCarIcon fontSize="lg" style={{ marginBottom: 30 }} color="inherit" />}
                title="Registered Vehicle"
                count={totalVehicles}
                percentage={{
                  color: "success",
                  // amount: `${newVehiclesThisMonth}`,
                  // // label: "Just updated",
                }}
              />
            </MDBox>
          </Grid> 
           <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon={<BusinessIcon fontSize="lg" style={{ marginBottom: 30 }} color="inherit" />}
                title="Provider"
                count={totalOperators}
                percentage={{
                  color: "success",
                  // amount: `${newOperatorsThisMonth}`,
                  // // label: "Just updated",
                }}
              />
            </MDBox>
          </Grid> 
        </Grid>
        {/* <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox> */}
        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Dashboard;
