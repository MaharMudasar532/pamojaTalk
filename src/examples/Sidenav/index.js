import { useCallback, useEffect, useState } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";
import AccessibilityIcon from '@mui/icons-material/Accessibility';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LensIcon from '@mui/icons-material/Lens';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';

import PersonIcon from '@mui/icons-material/Person';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AlarmIcon from '@mui/icons-material/Alarm';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";

import { useNavigate } from "react-router-dom";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

import SvgIcon from '@mui/material/SvgIcon';

import ListItemIcon from '@mui/material/ListItemIcon';

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setLoggedIn,
} from "context";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  const navigate = useNavigate();


  const [showOptions, setShowOptions] = useState(false);
  const [provider, setProvider] = useState(false);
  const [wellBeing, seWellBeing] = useState(false);

  const handleToggleOptions = useCallback(() => {
    setShowOptions(!showOptions);
  }, [showOptions])


  const handleWellBeing = useCallback(() => {
    seWellBeing(!wellBeing);
  }, [wellBeing])

  const handleProviders = () => {
    setProvider(!provider);
  };


  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  const handleLogout = useCallback(async () => {
    await localStorage.removeItem("user");
    setLoggedIn(dispatch, false)
    navigate("authentication/sign-in");
  }, [])

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(({ type, name, icon, title, noCollapse, key, href, route }) => {
    let returnValue;




    if (type === "collapse") {
      returnValue = href ? (
        <Link
          href={href}
          key={key}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavCollapse
            name={name}
            icon={icon}
            active={key === collapseName}
            noCollapse={noCollapse}
          />
        </Link>
      ) : (

        <NavLink key={key} to={route}>
          <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
        </NavLink>
      );
    } else if (type === "title") {
      returnValue = (
        <MDTypography
          key={key}
          color={textColor}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          {title}
        </MDTypography>
      );
    } else if (type === "divider") {
      returnValue = (
        <Divider
          key={key}
          light={
            (!darkMode && !whiteSidenav && !transparentSidenav) ||
            (darkMode && !transparentSidenav && whiteSidenav)
          }
        />
      );
    }



    return returnValue;
  });

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >



          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 10,
            color: 'white', // Set text color to white
            backgroundColor: 'transparent'

          }}
          onClick={handleToggleOptions}
          startIcon={<PersonIcon />} // Add the icon at the start
          endIcon={<ArrowDropDownIcon />} // Add the dropdown icon at the end
        >
          Users Managment
        </Button>
        {showOptions && (
          // <Paper elevation={1} style={{ marginTop: '1px', padding: '1px' }}>
          <>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
              <NavLink
                to={'/dashboard'}
                key={"key"}
              >
                <SidenavCollapse
                  name={"Standard User"}
                  icon={<SvgIcon fontSize="small">
                    <circle cx="12" cy="12" r="4" fill="white" />
                  </SvgIcon>}
                  // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
              <NavLink
                // key={key} 
                to={'/NYSC'}
                // href={"href"}
                key={"key"}
              // color={textColor}
              // target="_blank"
              // rel="noreferrer"
              // sx={{ textDecoratin: "none" }}
              >
                <SidenavCollapse
                  name={"NYSC Member"}
                  icon={<SvgIcon fontSize="small">
                    <circle cx="12" cy="12" r="4" fill="white" />
                  </SvgIcon>}                  // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
          </>
          // </Paper>
        )}
      </div>
      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 10,
            color: 'white', // Set text color to white
            backgroundColor: 'transparent',
            fontSize: 12,

          }}
          onClick={handleProviders}
          startIcon={<PersonIcon />} // Add the icon at the start
          endIcon={<ArrowDropDownIcon />} // Add the dropdown icon at the end
        >
          Provider Managment
        </Button>
        {provider && (
          // <Paper elevation={1} style={{ marginTop: '1px', padding: '1px' }}>
          <>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 0 }}>
              <NavLink
                to={'/provider'}
                key={"key"}
              >
                <SidenavCollapse
                  name={"Towing Service Provider"}
                  icon={<SvgIcon fontSize="small">
                    <circle cx="12" cy="12" r="4" fill="white" />
                  </SvgIcon>}
                  // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 0 }}>
              <NavLink
                // key={key} 
                to={'/AmbulamceProviders'}
                // href={"href"}
                key={"key"}
              // color={textColor}
              // target="_blank"
              // rel="noreferrer"
              // sx={{ textDecoratin: "none" }}
              >
                <SidenavCollapse
                  name={"Ambulance Service Provider"}
                  icon={<SvgIcon fontSize="small">
                    <circle cx="12" cy="12" r="4" fill="white" />
                  </SvgIcon>}                  // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
          </>
          // </Paper>
        )}
      </div>
      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 10,
            color: 'white', // Set text color to white
            backgroundColor: 'transparent',
            fontSize: 11,

          }}
          onClick={handleWellBeing}
          startIcon={<PersonIcon />} // Add the icon at the start
          endIcon={<ArrowDropDownIcon />} // Add the dropdown icon at the end
        >
          WellBeing Check
        </Button>
        {wellBeing && (
          // <Paper elevation={1} style={{ marginTop: '1px', padding: '1px' }}>
          <>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 0 }}>
              <NavLink
                to={'/VirtualHomeCheck'}
                key={"key"}
              >
                <SidenavCollapse
                  name={"Virtual Home Check"}
                  icon={<SvgIcon fontSize="small">
                    <circle cx="12" cy="12" r="4" fill="white" />
                  </SvgIcon>}
                  // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 0 }}>
              <NavLink
                // key={key} 
                to={'/WellbeingManagment'}
                // href={"href"}
                key={"key"}
              // color={textColor}
              // target="_blank"
              // rel="noreferrer"
              // sx={{ textDecoratin: "none" }}
              >
                <SidenavCollapse
                  name={"Virtual Travel Guard"}
                  icon={<SvgIcon fontSize="small">
                    <circle cx="12" cy="12" r="4" fill="white" />
                  </SvgIcon>}                  // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
          </>
          // </Paper>
        )}
      </div>

      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 10,
            color: 'white', // Set text color to white
            backgroundColor: 'transparent',
            fontSize: 11,

          }}
          onClick={() => navigate("/WellbeingManagment")}
          startIcon={<PersonIcon />} // Add the icon at the start
          endIcon={null} // Add the dropdown icon at the end
        >
          Virtual Travel Guard
        </Button>
      </div>

      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 10,
            color: 'white', // Set text color to white
            backgroundColor: 'transparent',
            fontSize: 11,

          }}
          onClick={() => navigate("/WhistleBlower")}
          startIcon={<PersonIcon />} // Add the icon at the start
          endIcon={null} // Add the dropdown icon at the end
        >
          WhistleBlower
        </Button>
      </div>
      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 10,
            color: 'white', // Set text color to white
            backgroundColor: 'transparent',
            fontSize: 11,

          }}
          onClick={() => navigate("/notifications")}
          startIcon={<PersonIcon />} // Add the icon at the start
          endIcon={null} // Add the dropdown icon at the end
        >
          SOS
        </Button>
      </div>
      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 10,
            marginBottom:10,
            color: 'white', // Set text color to white
            backgroundColor: 'transparent',
            fontSize: 11,

          }}
          onClick={() => navigate("/vehicle")}
          startIcon={<PersonIcon />} // Add the icon at the start
          endIcon={null} // Add the dropdown icon at the end
        >
          Vehicle
        </Button>
      </div>

      <List>{renderRoutes}</List>
      <button className="btn btn-danger btn-sm w-50 ms-auto me-auto" onClick={() => handleLogout()}>
        logout
      </button>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
