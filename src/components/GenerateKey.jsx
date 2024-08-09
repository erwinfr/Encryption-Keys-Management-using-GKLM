import React, { useState } from "react";
import { TextField, Button, Input, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

function GenerateKey() {
  const [noOfKeys, setNoOfKeys] = useState("");
  const [alias, setAlias] = useState("");
  const [keys, setKeys] = useState([]);
  const ALPHABETIC_REGEX = /^[a-zA-Z]+$/;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `SKLMAuth userAuthId=${Cookies.get("UserAuthId")}`,
  };

  const generateKeys = () => {
    console.log(noOfKeys, alias);
    axios
      .post(
        "api/SKLM/rest/v1/keys",
        {
          numOfKeys: noOfKeys,
          alias: alias,
          usage: "KMI_DEMO",
        },
        { headers: headers }
      )
      .then((response) => {
        console.log(response.data);
        setKeys(response.data.CreatedKeys);
      });
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
        <span style={{ marginRight: "30px", width: "200px" }}>
          Number of Keys
        </span>
        <Input
          type="number"
          style={{ backgroundColor: "white" }}
          onChange={(e) => setNoOfKeys(e.target.value)}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "400px",
          margin: "10px",
        }}
      >
        <span style={{ marginRight: "30px", width: "200px" }}>
          Alias (3 characters)
        </span>
        <Input
          type="text"
          style={{ backgroundColor: "white" }}
          inputProps={{ maxLength: 3 }}
          onKeyDown={(event) => {
            if (!ALPHABETIC_REGEX.test(event.key)) {
              event.preventDefault();
            }
          }}
          onChange={(e) => setAlias(e.target.value)}
        />
      </div>
      <div style={{ marginTop: "30px" }}>
        <Button variant="contained" onClick={generateKeys}>
          Generate
        </Button>
      </div>
      {keys.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <Typography variant="h6">
            {noOfKeys} were generated. Following are their respective key alias:
          </Typography>
          <div style={{ marginTop: "20px" }}>
            {keys.map((key, index) => (
              <Typography
                key={key.KeyAlias}
                variant="body1"
                style={{ marginTop: "5px" }}
              >
                {index + 1}. &nbsp; {key.KeyAlias}
              </Typography>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerateKey;
