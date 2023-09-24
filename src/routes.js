/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Tables from "layouts/tables";
import Notifications from "layouts/notifications";
// import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import Locate from "layouts/Map/userLocation";
// @mui icons
import Icon from "@mui/material/Icon";
import AddPost from "layouts/AddPost";
import ProviderManagment from "layouts/Provider";
import PoliceAlerts from "layouts/Police alerts";
import UserProfile from "layouts/userProfile";
import Home from "layouts/Home";
import Setting from "layouts/Setting";
import ModeOfTransport from "layouts/ModeOfTrans";
import WellbeingManagment from "layouts/Wellbeing_Managment";
import Subcription from "layouts/Subscription";
import RegisteredVehicle from "layouts/RegisteredVehicle";
import Agents from "layouts/Agents";
import BrodCast from "layouts/Broadcast";
import Reports from "layouts/Reports";
import WhistleBlower from "layouts/WhistleBlower";
import WellBeingSingleUser from "layouts/WellBeingSingleUser";
import WhistleBlowSingleUser from "layouts/WhistleBlowSingleUser";
import VirtualHomeCheck from "layouts/VirtualHomeCheck";


var routes = [
  {
    type: "collapse",
    name: "User Managment",
    key: "dashboard1",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard/",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Provider Managment",
    key: "dashboard",
    icon: <Icon fontSize="small">worker</Icon>,
    route: "/provider",
    component: <ProviderManagment />,
  },
  {
    type: "collapse",
    name: "Virtual Travel Guard",
    key: "Reports",
    icon: <Icon fontSize="small">security</Icon>,
    route: "/WellbeingManagment/",
    component: <WellbeingManagment />,
  },
  {
    type: "collapse",
    name: "Virtual Home Check",
    key: "Reports",
    icon: <Icon fontSize="small">security</Icon>,
    route: "/VirtualHomeCheck/",
    component: <VirtualHomeCheck />,
  },
  {
    type: "collapse",
    name: "WhistleBlower",
    key: "WhistleBlower",
    icon: <Icon fontSize="small">security</Icon>,
    route: "/WhistleBlower/",
    component: <WhistleBlower />,
  },
  {
    type: "collapse",
    name: "Sos",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  // {
  //   type: "collapse",
  //   name: "Police Alerts",
  //   key: "dashboard2",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/policeAlerts",
  //   component: <PoliceAlerts />,
  // },
  {
    type: "collapse",
    name: "vehicle",
    key: "SUBSCRIPTION",
    icon: <Icon fontSize="small">VriveEta</Icon>,
    route: "/vehicle/",
    component: <RegisteredVehicle />,
  },
  // {
  //   type: "collapse",
  //   name: "MODE OF TRANSPORT",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">MirectionsTransitOutlined</Icon>,
  //   route: "/tranport",
  //   component: <ModeOfTransport />,
  // },
  {
    type: "collapse",
    name: "Agents",
    key: "Agents",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/Agents/",
    component: <ProviderManagment />,
  },
  // {
  //   type: "collapse",
  //   name: "SUBSCRIPTION",
  //   key: "SUBSCRIPTION",
  //   icon: <Icon fontSize="small">subscription</Icon>,
  //   route: "/subscription/",
  //   component: <Subcription />,
  // },
  // {
  //   type: "collapse",
  //   name: "Home",
  //   key: "home",
  //   icon: <Icon fontSize="small">home</Icon>,
  //   route: "/Home/",
  //   component: <Home />,
  // },

  // {
  //   type: "collapse",
  //   name: "Broadcast",
  //   key: "BrodCast",
  //   icon: <Icon fontSize="small">message</Icon>,
  //   route: "/Broadcast/",
  //   component: <BrodCast />,
  // },
  {
    type: "collapse",
    name: "Reports",
    key: "Reports",
    icon: <Icon fontSize="small">report</Icon>,
    route: "/report/",
    component: <Reports />,
  },

  {
    type: "",
    name: "UserProfile",
    key: "UserProfile",
    icon: <Icon fontSize="small">UserProfile</Icon>,
    route: "/UserProfile/:id",
    component: <UserProfile />,
  },
  {
    type: "",
    name: "WellBeingSingleUser",
    key: "WellBeingSingleUser",
    icon: <Icon fontSize="small">wellBeing </Icon>,
    route: "/WellBeingSingleUser/:userId/:wellBeingCheckId",
    component: <WellBeingSingleUser    />,
  },
  {
    type: "",
    name: "WhistleBlowSingleUser",
    key: "WhistleBlowSingleUser",
    icon: <Icon fontSize="small">WhistleBlowSingleUser </Icon>,
    route: "/WhistleBlowSingleUser/:userId/:whistleBlowId",
    component: <WhistleBlowSingleUser    />,
  },


  {
    type: "",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "transparent",
    name: "Setting",
    key: "setting",
    icon: <Icon fontSize="small">setting</Icon>,
    route: "/setting/",
    component: <Setting />,
  },
  {
    type: "",
    name: "Track",
    key: "track-user",
    icon: <Icon fontSize="small">Track</Icon>,
    route: "/locate/:id",
    component: <Locate />,
  },
];


export default routes;
