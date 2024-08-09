import React, { useState } from "react";
import { TextField, Button, Input, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

function RotateMasterKey() {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `SKLMAuth userAuthId=${Cookies.get("UserAuthId")}`,
  };

  const deleteKey = async () => {
    try {
      const response = await axios.post(
        "api/SKLM/rest/v1/ckms/deviceGroupMasterKey/KMI_DEMO/rotate",
        { force: "true" },
        { headers: headers }
      );
      console.log(response.data);
      alert(response.data.status);
    } catch (error) {
      console.error("There was an error!", error);
      if (error.response.status === 401) {
        alert("Session logged out. Please login again");
        window.location.href = "/";
      }
    }
  };

  return (
    <div
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "10vh",
        marginTop: "20vh",
      }}
    >
      <div style={{ marginTop: "30px" }}>
        <Button variant="contained" onClick={deleteKey}>
          Rotate Master Key
        </Button>
      </div>
    </div>
  );
}

export default RotateMasterKey;
