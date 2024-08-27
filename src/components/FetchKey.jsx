import React, { useState } from "react";
import { TextField, Button, Input, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { prettyPrintJson } from "pretty-print-json";

function FetchKey() {
  const [keyAlias, setKeyAlias] = useState("");
  const [keyDetails, setKeyDetails] = useState({});
  const headers = {
    "Content-Type": "application/json",
    Authorization: `SKLMAuth userAuthId=${Cookies.get("UserAuthId")}`,
  };

  const fetchKey = async () => {
    console.log(keyAlias);
    try {
      const response = await axios.get(
        `api/SKLM/rest/v1/objects/${keyAlias}`,
        // `api/SKLM/rest/v1/keys?alias=${keyAlias}`,
        { headers: headers }
      );
      console.log(response.data);
      setKeyDetails(response.data);
    } catch (error) {
      console.error("There was an error!", error);
      if (error.response.status === 401) {
        alert("Session logged out. Please login again");
        window.location.href = "/";
      }
      if (error.response.status === 404) {
        alert("Key not found. Please enter a valid key");
      }
      setKeyDetails({});
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
          width: "600px",
          margin: "10px",
        }}
      >
        <span style={{ marginRight: "30px", width: "100px" }}>Key UUID</span>
        <Input
          type="text"
          style={{ backgroundColor: "white", width: "500px" }}
          onChange={(e) => setKeyAlias(e.target.value)}
        />
      </div>
      <div style={{ marginTop: "30px" }}>
        <Button variant="contained" onClick={fetchKey}>
          Fetch Key Details
        </Button>
      </div>
      {keyDetails.managedObject && (
        <div style={{ marginTop: "30px" }}>
          <Typography variant="h6">
            Following are the details for the given key:
          </Typography>
          <div style={{ marginTop: "20px" }}>
            <div className="key-prop">
              <span>ALIAS: </span>
              <span>{keyDetails.managedObject.alias}</span>
            </div>
            <div className="key-prop">
              <span>UUID: </span>
              <span>{keyDetails.managedObject.uuid}</span>
            </div>
            <div className="key-prop">
              <span>KEY MATERIAL: </span>
              <span>{keyDetails.managedObject.KEY_BLOCK.KEY_MATERIAL}</span>
            </div>
            <div className="key-prop">
              <span>Activation date: </span>
              <span>{keyDetails.managedObject["creation date"]}</span>
            </div>
            <div className="key-prop">
              <span>Key Algorithm: </span>
              <span>{keyDetails.managedObject["key algorithm"]}</span>
            </div>
            <div className="key-prop">
              <span>Key Length: </span>
              <span>{keyDetails.managedObject["key length (in bits)"]}</span>
            </div>
            <div className="key-prop">
              <span>Key Type: </span>
              <span>{keyDetails.managedObject["key type"]}</span>
            </div>
            <div className="key-prop">
              <span>Key State: </span>
              <span>{keyDetails.managedObject["key state"]}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FetchKey;
