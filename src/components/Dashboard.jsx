import React, { useEffect } from "react";
import Cards from "./Cards";
import GenerateKey from "./GenerateKey";
import FetchKey from "./FetchKey";
import RotateMasterKey from "./RotateMasterKey";
import DeleteKey from "./DeleteKey";
import Cookies from "js-cookie";

function Dashboard() {
  useEffect(() => {
    if (!Cookies.get("UserAuthId")) {
      window.location.href = "/";
    }
  }, []);

  if (!localStorage.getItem("savedKeys")) {
    localStorage.setItem("savedKeys", JSON.stringify([]));
  }

  return (
    <div style={{ margin: "auto" }}>
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          marginTop: "10vh",
          width: "100vw",
        }}
      >
        <Cards url="/generateKey" title="Generate Key" />
        <Cards url="/fetchKey" title="Fetch Keys" />
        <Cards url="/deleteKey" title="Delete Key" />
        {/* <Cards url="/fetchMasterKey" title="Fetch Master Key" /> */}
        <Cards url="/rotateMasterKey" title="Rotate Master Key" />
        <Cards url="/store" title="E Commerce Store" />
      </div>
      {window.location.pathname.includes("generateKey") ? (
        <GenerateKey />
      ) : null}
      {window.location.pathname.includes("fetchKey") ? <FetchKey /> : null}
      {window.location.pathname.includes("deleteKey") ? <DeleteKey /> : null}
      {window.location.pathname.includes("rotateMasterKey") ? (
        <RotateMasterKey />
      ) : null}
    </div>
  );
}

export default Dashboard;
