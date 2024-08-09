import React, { useState } from "react";
import { TextField, Button, Input, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { prettyPrintJson } from "pretty-print-json";

function FetchKey() {
  const [keyAlias, setKeyAlias] = useState("");
  const [keyDetails, setKeyDetails] = useState([]);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `SKLMAuth userAuthId=${Cookies.get("UserAuthId")}`,
  };

  const fetchKey = async () => {
    console.log(keyAlias);
    try {
      const response = await axios.get(
        `api/SKLM/rest/v1/keys?alias=${keyAlias}`,
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
        <Button variant="contained" onClick={fetchKey}>
          Fetch Key Details
        </Button>
      </div>
      {keyDetails.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <Typography variant="h6">
            Following are the details for the given key:
          </Typography>
          <div style={{ marginTop: "20px" }}>
            {keyDetails.map((key, index) => (
              <div key={key.uuid}>
                <div className="key-prop">
                  <span>UUID: </span>
                  <span>{key.uuid}</span>
                </div>
                <div className="key-prop">
                  <span>Usage: </span>
                  <span>{key.usage}</span>
                </div>
                <div className="key-prop">
                  <span>Activation date: </span>
                  <span>{key["activation date"]}</span>
                </div>
                <div className="key-prop">
                  <span>Key Algorithm: </span>
                  <span>{key["key algorithm"]}</span>
                </div>
                <div className="key-prop">
                  <span>Key State: </span>
                  <span>{key["key state"]}</span>
                </div>
                {/* <div>
                  <span>Key State: </span>
                  <span>{key["key state"]}</span>
                </div>
                <div>
                  <span>Activation date: </span>
                  <span>{key["activation date"]}</span>
                </div>
                <div>
                  <span>Deactivation Date: </span>
                  <span>{key["Deactivation Date"]}</span>
                </div> */}
                {/* <div>
                  <span>Usage: </span>
                  <span>{key.usage}</span>
                </div>
                <div>
                  <span>UUID: </span>
                  <span>{key}</span>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FetchKey;
