// import { Card } from "@mui/material";
// import BasicLayout from "layouts/authentication/components/BasicLayout";
// import MDBox from "components/MDBox";
// import BasicLayout from "layouts/authentication/components/BasicLayout";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { GoogleMap, InfoBox, Marker, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import { MyPin } from "../../assets/MyPin.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarMenu, { SidebarMenuNav } from "react-bootstrap-sidebar-menu";

import "./map.css";
import { sendNotification } from "./notification";
import renderNoti from "layouts/NotificationAlert";
import { renderPoliceAlert } from "layouts/NotificationAlert";

function Locate() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyC0Bt5wwj03GVbGoBMwxVnhMvHllozt9fc",
  });
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [user, setUser] = useState(null);
  const [nearUsers, setNearUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [notiUsers, setNotiUsers] = useState([]);
  const [modalData, setModalData] = useState();

  const [Distanse, setDistance] = useState(1000);

  const openModal = useCallback(
    (data, type) => {
      // alert(type)
      let modalSetData = data;
      if (type == "user") {
        modalSetData.workerImage = modalSetData.userImage;
        modalSetData.workerName = modalSetData.userName;
        modalSetData.workerPhoneNumber = modalSetData.userPhone;
        modalSetData.workerType = "user";
      }
      setModalData(data);
      setIsOpen(true);
    },
    [isOpen, modalData]
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [isOpen]);

  const handleShowAlert = (name) => {
    toast.success(`Message Has been sent to ${name} `, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 3000,
      // hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress:true,
    });
  };

  const iconUrl =
  "https://firebasestorage.googleapis.com/v0/b/karzame-f00a9.appspot.com/o/Current%20location.png?alt=media&token=5bdadcc2-4c2e-4301-99da-6dfaeb8d7184";
  const params = useParams();
  const fetchData = useCallback(async () => {
    const db = getDatabase();
    const starCountRef = ref(db, `users/${params.id}`);
    onValue(starCountRef, (snapshot) => {
      console.log("fetch data by id", snapshot.val());

      setCenter({
        lat: snapshot.val().Latitude,
        lng: snapshot.val().Longitude,
      });
      setUser(snapshot.val());
      getOperators(snapshot.val()?.LiveLatitude, snapshot.val()?.LiveLongitude, 500);
    });
  }, [nearUsers, Distanse]);

  const getOperators = (lat1, long1, distance) => {
    setNearUsers([]);
    const db = getDatabase();
    const starCountRef = ref(db, `Operators/`);
    onValue(starCountRef, (snapshot) => {
      Object.values(snapshot.val()).map((item) => {
        const { latitude, longitude } = item;
        const dist = calculateDistance(lat1, long1, latitude, longitude);
        console.log(item.Latitude, item.Longitude, item.workerName, "distance", dist);
        if (dist <= Distanse && item.key !== params.id && item.verified) {
          const nearData = item;
          nearData.distance = dist;
          setNearUsers((prev) => [...prev, nearData]);
          console.log(item);
        }
      });
    });
    console.log("near user ", nearUsers);
  };

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  const handleSendNoti = () => {
    if (notiUsers.length == 0) {
      alert("please select a user first");
    } else {
      notiUsers.map((item) => {
        const data = nearUsers[item];
        console.log("notif mao", data);
        if (data?.workerTokenToken) {
          sendNotification(data?.workerTokenToken, data?.workerName, data, params.id);
        }
        handleShowAlert(data?.workerName);
      });
    }
  };

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

 

  const ImageOverlay = ({ position, imageUrl, item, type = null }) => {
    const imageStyle = {
      width: "50px",
      height: "50px",
      position: "absolute",
      transform: "translate(-50%, -50%)",
      top: 0,
      left: 0,
    };

    return (
      <OverlayView
        position={position}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={() => ({ x: -25, y: -25 })} // Adjust offset if needed
      >
        <div style={imageStyle} onClick={() => openModal(item, type)}>
          <img
            height={50}
            width={50}
            style={{ backgroundSize: "contain", marginLeft: 20 }}
            className="rounded-circle"
            src={imageUrl}
            alt="Marker Image"
          />
        </div>
      </OverlayView>
    );
  };

  const handleChange = (e) => {
    if (e.target.checked) {
      setNotiUsers((prev) => [...prev, e.target.value]);
      console.log("prev", notiUsers);
    } else {
      setNotiUsers([notiUsers.filter((item) => item !== e.target.value)]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [Distanse]);

  useEffect(() => {
    renderNoti();
  }, []);

  if (!isLoaded) {
    return <h1>Loading the map </h1>;
  }
  return (
    <>
      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{
          width: "100%",
          height: "1000px",
        }}
      >
        <div
          class="position-relative ms-auto float-right"
          style={{ left: window.innerWidth - 80, top: 60 }}
        >
          <button
            class="btn btn-dark d-flex"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#demo"
          >
            <img src={require("../../assets/menu.png")} />
          </button>
        </div>
        <ToastContainer />

        {user && (
          <Marker
            position={{ lat: user?.LiveLatitude, lng: user?.LiveLongitude }}
            title={user?.workerName}
          >
            <ImageOverlay
              position={{ lat: user.LiveLatitude, lng: user.LiveLongitude }}
              imageUrl={iconUrl}
              item={user}
              type={"user"}
            />
          </Marker>
        )}
        {nearUsers &&
          nearUsers.map((item) => {
            return (
              <>
                <Marker
                  position={{ lat: item?.Latitude, lng: item?.Longitude }}
                  title={item?.workerName}
                >
                  <ImageOverlay
                    position={{ lat: item?.Latitude, lng: item?.Longitude }}
                    imageUrl={item?.workerImage}
                    item={item}
                  />
                </Marker>
              </>
            );
          })}
      </GoogleMap>

      {isOpen && (
        <div className="">
          <div
            className="modal d-flex cont"
            style={{
              height: 250,
              width: 250,
              alignSelf: "center",
              marginLeft: (window.innerWidth * 40) / 100,
              marginRight: (window.innerWidth * 40) / 100,
              marginTop: 40,
            }}
          >
            <div className="modal-content">
              <div style={{ height: 40 }}>
                <h6
                  onClick={closeModal}
                  className="border"
                  style={{
                    textAlign: "center",
                    marginRight: 10,
                    marginTop: 10,
                    marginLeft: "auto",
                    width: 20,
                    borderRadius: 40 / 2,
                  }}
                >
                  X
                </h6>
              </div>
              <div>
                <div>
                  <div className="row col-12 justify-content-center align-item-center">
                    <div className="col-6">
                      <img
                        width={120}
                        height={80}
                        style={{ borderRadius: 10 }}
                        src={modalData?.workerImage}
                      />
                    </div>
                  </div>
                  <div
                    className="row   mx-2 align-items-baseline p-1 ms-auto me-auto"
                    style={{ width: "90%", marginBottom: 2 }}
                  >
                    <div className="">
                      <p className="text-dark text-left mt-2 ms-3" style={{ fontSize: 12 }}>
                        <span style={{ fontWeight: "bold", marginRight: 10 }}>Name :</span>
                        {modalData?.workerName}
                      </p>
                      <p
                        className="text-dark text-left ms-3"
                        style={{ fontSize: 12, marginTop: -10 }}
                      >
                        <span style={{ fontWeight: "bold", marginRight: 10 }}>Type:</span>
                        {modalData?.workerType}
                      </p>
                      <p
                        className="text-dark text-left ms-3"
                        style={{ fontSize: 12, marginTop: -10 }}
                      >
                        <span style={{ fontWeight: "bold", marginRight: 10 }}>Phone:</span>
                        {modalData?.workerPhoneNumber}
                      </p>
                    </div>
                    <div className="col" style={{ fontSize: 11 }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div class="offcanvas offcanvas-end" id="demo">
        <div class="offcanvas-header">
          <h1 class="offcanvas-title h3">Available Providers </h1>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="row col-11 me-auto ms-auto mb-3 mt-3">
          <input
            className="form-control"
            type="number"
            placeholder="Enter distance in Km"
            onChange={(e) => setDistance(e.target.value)}
          />
        </div>
        {nearUsers.length == 0 ? (
          <div>
            <p className="mt-3 text-center mx-2" style={{ fontSize: 13 }}>
              Provider not found near this user
            </p>
          </div>
        ) : (
          nearUsers.map((item, index) => {
            // console.log("map usern", item);
            return (
              <div key={index}>
                <div
                  className="row col-12 mx-2 align-item-baseline border ps-4   pt-3 ms-auto me-auto"
                  style={{ width: "90%", borderRadius: 10, marginBottom: 1 }}
                >
                  <div className="col-1 me-2">
                    <input
                      value={index}
                      className="form-check-input mt-2 me-4"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-2">
                    <img
                      width={40}
                      height={40}
                      style={{ borderRadius: 20 }}
                      src={item.workerImage}
                    />
                  </div>
                  <div className="col" style={{ fontSize: 11 }}>
                    <p style={{}}>
                      <span className="fw-bolder fs-6">{item?.workerName}</span>
                      <br />
                      {item?.distance.toFixed(1)} Km away from {user.userName}
                    </p>
                    {/* <p style={{ marginTop: -17 }}>
                      {item?.distance.toFixed(1)} Km away from {user.userName}
                    </p> */}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {nearUsers.length > 0 && (
          <button
            onClick={handleSendNoti}
            type="submit"
            className="text-center btn-lg btn-success mt-3 h5 btn border w-75 text-center ms-auto me-auto"
          >
            Send Location
          </button>
        )}
      </div>
    </>
  );
}

export default Locate;
