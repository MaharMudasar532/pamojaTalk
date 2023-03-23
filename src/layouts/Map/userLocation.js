// import { Card } from "@mui/material";
// import BasicLayout from "layouts/authentication/components/BasicLayout";
// import MDBox from "components/MDBox";
// import BasicLayout from "layouts/authentication/components/BasicLayout";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

function Locate() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBrn9VIIVJKGkYLvMGToV7gz6VBq30LRzw",
  });
  const [center, setCenter] = useState(null);
  const params = useParams();
  const fetchData = async () => {
    const db = getDatabase();
    const starCountRef = ref(db, `users/${params.id}`);
    onValue(starCountRef, (snapshot) => {
      console.log("fetch data by id", snapshot.val());
      setCenter({
        lat: snapshot.val().LiveLatitude,
        lng: snapshot.val().LiveLongitude,
      });
    });
  };
  useEffect(() => {
    fetchData();
  }, [center]);

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
        <Marker position={center} />
      </GoogleMap>
      <p>hwlo</p>
    </>
  );
}

export default Locate;
