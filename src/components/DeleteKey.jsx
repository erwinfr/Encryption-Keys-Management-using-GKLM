import React, { useState } from "react";
import { TextField, Button, Input, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
function DeleteKey() {
  const [keyAlias, setKeyAlias] = useState("");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `SKLMAuth userAuthId=${Cookies.get("UserAuthId")}`,
  };

  const deleteKey = async () => {
    console.log(keyAlias);
    try {
      const response = await axios.delete(
        `api/SKLM/rest/v1/keys?alias=${keyAlias}`,
        { headers: headers }
      );
      console.log(response.data);
      if (response.data.status === "Succeeded") {
        alert("Key deleted successfully");
      }
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "400px",
          margin: "10px",
        }}
      >
        <span style={{ marginRight: "30px", width: "100px" }}>Key Alias</span>
        <Input
          type="text"
          style={{ backgroundColor: "white", width: "300px" }}
          onChange={(e) => setKeyAlias(e.target.value)}
        />
      </div>
      <div style={{ marginTop: "30px" }}>
        <Button variant="contained" onClick={deleteKey}>
          Delete Key
        </Button>
      </div>
    </div>
  );
}

export default DeleteKey;
