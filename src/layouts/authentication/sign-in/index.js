

import { useCallback, useState } from "react";

// react-router-dom components
import { Link, Navigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import { useNavigate } from "react-router-dom";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { setLoggedIn, useMaterialUIController } from "context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Typography } from "@mui/material";


function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const [controller, dispatch] = useMaterialUIController();
  const [email, setEmail] = useState("karzametechnologies@gmail.com");
  const [pass, setPass] = useState("karzameTech");
  const navigate = useNavigate();

  const handleSignIn = useCallback(async () => {

    // const insertAdminLogin = (userName, password) => {
    //   const dataBase = getDatabase();
    //   const adminLoginRef = ref(dataBase, "adminLogin");

    //   // Push new data to the adminLogin node
    //   const newAdminLoginRef = push(adminLoginRef);
    //   set(newAdminLoginRef, {
    //     userName: userName,
    //     password: password
    //   }).then(() => {
    //     console.log("Data inserted successfully!");
    //   }).catch((error) => {
    //     console.error("Error inserting data:", error);
    //   });
    // };

    // insertAdminLogin(userName, password);

    // return;
    // <Navigate to="/AddPost"/>;
    const dataBase = getDatabase();
    const adminRef = ref(dataBase, "/adminLogin");
    onValue(adminRef, async (snapshot) => {
      // console.log("admin data from database>>>", snapshot.val());
      let loginAdminData = snapshot.val();
      loginAdminData = Object.values(loginAdminData)
      console.log(loginAdminData, loginAdminData[0]?.userName, loginAdminData[0]?.password)
      loginAdminData.forEach(async element => {
        if (element && element.userName === email && element.password === pass) {
          console.log("Login successful");
          setLoggedIn(dispatch, true);
          await localStorage.setItem("user", JSON.stringify(element));
          navigate("/dashboard");
          setTimeout(() => {
            toast.success(`login successfully`, {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
          }, 1400);
        } else {
          console.log("Invalid credentials");
          toast.warn(`username or password do not match`, {
            autoClose: 3000,

            position: toast.POSITION.TOP_CENTER,
          });
        }

      });



    });
    return;

    await signInWithEmailAndPassword(auth, email, pass)
      .then(async (userData) => {
        await localStorage.setItem("user", JSON.stringify(userData.user));
        navigate("/dashbord");
        console.log("userData", userData.user);
      })
      .catch((er) => {
        console.log(er.message.toString());
      });
  }, [pass, email]);

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={2}
          textAlign="center"
        >
          <ToastContainer />
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={0} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <MDTypography variant="h6" textAlign="center" fontWeight="medium" color="white" mt={1}>
              Karzame
            </MDTypography>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3} mt={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                onChange={(e) => setPass(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              {/* <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography> */}
            </MDBox>
            <MDBox mt={5} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={() => handleSignIn()}>
                sign in
              </MDButton>
            </MDBox>
            {/* <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox> */}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
