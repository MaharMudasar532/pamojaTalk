import { useState, useEffect, useMemo, useCallback } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

import { getDatabase, ref, onValue, set, get, onChildAdded, child, update, onChildChanged } from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"
import { showStyledToast } from "components/toastAlert";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import "react-toastify/dist/ReactToastify.css";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Link, useNavigate } from "react-router-dom";

// Material Dashboard 2 React routes
import routes from "routes";

import SignIn from "layouts/authentication/sign-in";

import signInOnlyRoutes from "SignInroutes";



// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import { listenForNewSosWithNotification } from "components/services/AllNotificationListener";
import { listenToNewWellBeingData } from "components/services/AllNotificationListener";
import CustomNoti from "components/CustomNoti";
import VirtualTravelGuard from "components/VirtualTravelGuard";




export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const navigate = useNavigate();

  const [modals, setModals] = useState([]);

  const [virtual, setVirtual] = useState([]);


  const openVirtualModal = useCallback((notification) => {
    setVirtual([...virtual, notification]);
  }, [virtual])


  const closeVirtualModal = useCallback((index) => {
    const updatedModals = [...virtual];
    updatedModals.splice(index, 1);
    setVirtual(updatedModals);
  }, [virtual])


  const openModal = useCallback((notification) => {
    setModals([...modals, notification]);
  }, [modals])


  // Function to close a modal
  const closeModal = useCallback((index) => {
    const updatedModals = [...modals];
    updatedModals.splice(index, 1);
    setModals(updatedModals);
  }, [modals])





  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
    loggedIn,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };


  function listenToNewSOSAlerts() {
    try {
      const db = getDatabase();
      const usersRef = ref(db, 'users');

      // Listen for changes in the 'users' reference
      onChildAdded(usersRef, (userSnapshot) => {
        const user = userSnapshot.val();
        const userId = userSnapshot.key;

        // Check if the user has 'SOS' data
        if (user.SOS) {
          const sosDataRef = ref(db, `users/${userId}/SOS`);

          // Listen for new child nodes added to 'SOS' for this user
          onChildAdded(sosDataRef, (dataSnapshot) => {
            const newData = dataSnapshot.val();
            // console.log("New SOS Alert Data:", newData);

            // Check if 'isRead' doesn't exist or is set to false
            if (!newData.isRead) {
              // Show a toast indicating that the data hasn't been read
              console.log(`New SOS Alert Data for User ${userId}:`, newData);
              const sosAlertId = dataSnapshot.key;
              showStyledToast(
                "info",
                "SOS Alert",
                `SOS Alert from ${user.userName}`,
                () => {
                  navigate(`/UserProfile/${userId}`);
                }
              );

              // Update the 'isRead' field to true using the 'set' method
              const dataPath = `users/${userId}/SOS/${dataSnapshot.key}/isRead`;
              const updates = {};
              updates[dataPath] = true;
              update(ref(db), updates);
            } else {
              // Data has already been read
              // console.log(`SOS Alert Data already read for User ${userId}:`, newData);
            }

            // You can take further action here with the new SOS alert data
          });
        }
      });
    } catch (error) {
      console.error('Error listening to new SOS alerts:', error);
    }
  }

  useEffect(() => {


    // showStyledToast(
    //   "info",
    //   "SOS Alert",
    //   `SOS Alert from test `,
    //   () => {
    //   }
    // );
  }, [])

  function listenToNewPoliceAlerts() {
    try {
      const db = getDatabase();
      const usersRef = ref(db, 'users');

      // Listen for changes in the 'users' reference
      onChildAdded(usersRef, (userSnapshot) => {
        const user = userSnapshot.val();
        const userId = userSnapshot.key;

        // Check if the user has 'Police_Alerts' data
        if (user.Police_Alerts) {
          const policeAlertsDataRef = ref(db, `users/${userId}/Police_Alerts`);

          // Listen for new child nodes added to 'Police_Alerts' for this user
          onChildAdded(policeAlertsDataRef, (dataSnapshot) => {
            const newData = dataSnapshot.val();
            // console.log("New Police Alert Data:", newData);

            // Check if 'isRead' doesn't exist or is set to false
            if (!newData.isRead) {
              // Show a toast indicating that the data hasn't been read
              // console.log(`New Police Alert Data for User ${userId}:`, newData);
              const policeAlertId = dataSnapshot.key;
              showStyledToast(
                "info",
                "Police Alert",
                `Police Alert from ${user.userName}`,
                () => {
                  navigate(`/UserProfile/${userId}`);
                }
              );

              // Update the 'isRead' field to true using the 'set' method
              const dataPath = `users/${userId}/Police_Alerts/${dataSnapshot.key}/isRead`;
              const updates = {};
              updates[dataPath] = true;
              update(ref(db), updates);
            } else {
              // Data has already been read
              // console.log(`Police Alert Data already read for User ${userId}:`, newData);
            }

            // You can take further action here with the new Police alert data
          });
        }
      });
    } catch (error) {
      console.error('Error listening to new Police alerts:', error);
    }
  }



  function listenToNewVirtualHomeCheckData() {
    try {
      const db = getDatabase();
      const usersRef = ref(db, 'users');

      // Listen for changes in the 'users' reference
      onChildAdded(usersRef, (userSnapshot) => {
        const user = userSnapshot.val();
        const userId = userSnapshot.key;
        // console.log("user at vietual", user)
        // Check if the user has 'VirtualHomeCheck' data
        if (user.VirtualHomeCheck) {
          const virtualHomeCheckDataRef = ref(db, `users/${userId}/VirtualHomeCheck`);

          // Listen for new child nodes added to 'VirtualHomeCheck' for this user
          onChildAdded(virtualHomeCheckDataRef, (dataSnapshot) => {
            const newData = dataSnapshot.val();

            // Check if 'isRead' doesn't exist or is set to false
            if (!newData.isRead) {
              const virtualHomeCheckId = dataSnapshot.key;

              // Check if the key is not one of the excluded values
              if (
                virtualHomeCheckId !== 'currentLiveLatVirtual' &&
                virtualHomeCheckId !== 'currentLiveLogVirtual'
              ) {
                setModals((prev) => [...prev, newData])


                // Show a toast indicating that the data hasn't been read
                // showStyledToast(
                //   "info",
                //   "Virtual Home Check",
                //   `${user.userName} asking for Virtual Home Check`,
                //   () => {
                //     navigate(`/UserProfile/${userId}`);
                //   }
                // );

                // Update the 'isRead' field to true using the 'set' method
                const dataPath = `users/${userId}/VirtualHomeCheck/${dataSnapshot.key}/isRead`;
                const updates = {};
                updates[dataPath] = true;
                update(ref(db), updates);
              }
            } else {
              // Data has already been read
            }

            // You can take further action here with the new VirtualHomeCheck data
          });
        }
      });
    } catch (error) {
      console.error('Error listening to new VirtualHomeCheck data:', error);
    }
  }






  function listenToNewWhistleBlowData() {
    try {
      const db = getDatabase();
      const usersRef = ref(db, 'users');

      // Listen for changes in the 'users' reference
      onChildAdded(usersRef, (userSnapshot) => {
        const user = userSnapshot.val();
        const userId = userSnapshot.key;

        // Check if the user has 'Whistle_Blow' data
        if (user.Whistle_Blow) {
          const whistleBlowDataRef = ref(db, `users/${userId}/Whistle_Blow`);

          // Listen for new child nodes added to 'Whistle_Blow' for this user
          onChildAdded(whistleBlowDataRef, (dataSnapshot) => {
            const newData = dataSnapshot.val();
            // console.log("New Whistle Blow Data:", newData);

            // Check if 'isRead' doesn't exist or is set to false
            if (!newData.isRead) {
              // Show a toast indicating that the data hasn't been read
              // console.log(`New Whistle Blow Data for User ${userId}:`, newData);
              const whistleBlowId = dataSnapshot.key;
              showStyledToast(
                "info",
                "Whistle Blow alert",
                `${newData.Type} alert from ${user.userName}`,
                () => {
                  navigate(`/WhistleBlowSingleUser/${userId}/${whistleBlowId}`);
                }
              );

              // Update the 'isRead' field to true using the 'set' method
              const dataPath = `users/${userId}/Whistle_Blow/${dataSnapshot.key}/isRead`;
              const updates = {};
              updates[dataPath] = true;
              update(ref(db), updates);
            } else {
              // Data has already been read
              // console.log(`Whistle Blow Data already read for User ${userId}:`, newData);
            }

            // You can take further action here with the new whistle-blow data
          });
        }
      });
    } catch (error) {
      console.error('Error listening to new whistle-blow data:', error);
    }
  }



  function listenToNewWellBeingData() {
    try {
      const db = getDatabase();
      const usersRef = ref(db, 'users');

      // Listen for changes in the 'users' reference
      onChildAdded(usersRef, (userSnapshot) => {
        const user = userSnapshot.val();
        const userId = userSnapshot.key;

        // Check if the user has 'wellBeingServicesData'
        if (user.wellBeingServicesData) {
          const wellBeingServicesDataRef = ref(db, `users/${userId}/wellBeingServicesData`);

          // Listen for new child nodes added to 'wellBeingServicesData' for this user
          onChildAdded(wellBeingServicesDataRef, (dataSnapshot) => {
            const newData = dataSnapshot.val();
            // console.log("new data ", newData);
            // Check if 'isRead' doesn't exist or is set to false
            if (!newData.isRead) {
              // Show a toast indicating that the data hasn't been read
              // console.log(`New Data Added for User ${userId}:`, newData);
              const wellBeingCheckId = dataSnapshot.key;
              setVirtual((prev) => [...prev, newData]);
              // showStyledToast(
              //   "info",
              //   `WellBeing Check alert`,
              //   `${newData.Name} asking for Wellbeing Check`,
              //   () => {
              //     navigate(`/WellBeingSingleUser/${userId}/${wellBeingCheckId}`);
              //   },
              // )

              // Update the 'isRead' field to true using the 'set' method
              const dataPath = `users/${userId}/wellBeingServicesData/${dataSnapshot.key}/isRead`;
              const updates = {};
              updates[dataPath] = true;
              update(ref(db), updates);
            } else {
              // Data has already been read
              // console.log(`Data already read for User ${userId}:`, newData);
            }

            // You can take further action here with the new data
          });
        }
      });
    } catch (error) {
      console.error('Error listening to new wellBeingServicesData:', error);
    }
  }




  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    if (!loggedIn) {
      return;
    }
    // listenToNewWhistleBlowData()
    // listenToNewWellBeingData()
    // listenToNewSOSAlerts()
    // listenToNewPoliceAlerts();
    listenToNewVirtualHomeCheckData();
  }, [loggedIn]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">

        settings
      </Icon>
    </MDBox>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ToastContainer />
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        <ToastContainer />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="Karzame"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(routes)}
          {!loggedIn ? (
            <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
          ) : (
            <Route path="*" element={<Navigate to="/dashbord" />} />
          )}
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Karzame"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutes(routes)}
        {!loggedIn ? (
          <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
        ) : (
          <Route path="*" element={<Navigate to="/dashbord" />} />
        )}

        {/* <Route path="*" element={<Navigate to="/authentication/sign-in" />} /> */}
      </Routes>
      <ToastContainer />

      {modals.map((notification, index) => (
        <div className="position-relative">
          <CustomNoti
            index={index}
            key={index}
            isOpen={true}
            onClose={() => closeModal(index)}
            notification={notification}
            type = {"Virtual Home Check "}
          />
        </div >
      ))}
      {virtual.map((notification, index) => (
        <div className="position-relative">
          <VirtualTravelGuard
            index={index}
            key={index}
            isOpen={true}
            onClose={() => closeVirtualModal(index)}
            notification={notification}
            type = {"Virtual travel Guard "}
          />
        </div >
      ))}

    </ThemeProvider>
  );
}
