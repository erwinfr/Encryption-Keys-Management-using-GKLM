import React, { useState } from "react";
import { TextField, Button, Input, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import KeysDropdown from "./KeysDropdown";

function DeleteKey() {
  const [keyAlias, setKeyAlias] = useState("");
  const [savedKeys, setSavedKeys] = useState(() => {
    if (localStorage.getItem("savedKeys") === null) {
      return [];
    } else {
      return JSON.parse(localStorage.getItem("savedKeys"));
    }
  });
  const [selectedKey, setSelectedKey] = useState("");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `SKLMAuth userAuthId=${Cookies.get("UserAuthId")}`,
  };

  const deleteKey = async () => {
    console.log(keyAlias);
    let key = selectedKey.length > 0 ? selectedKey : keyAlias;
    try {
      const response = await axios.delete(`api/SKLM/rest/v1/objects/${key}`, {
        headers: headers,
      });
      console.log(response.data, response.status);
      if (
        response.status == 200 ||
        response.status == 204 ||
        response.status == 201 ||
        response.status == 202 ||
        response.status == 203
      ) {
        alert("Key deleted successfully");
      }
      let savedKeys = JSON.parse(localStorage.getItem("savedKeys"));
      console.log(savedKeys, keyAlias);
      let updatedKeys = savedKeys.filter((item) => item !== keyAlias);
      localStorage.setItem("savedKeys", JSON.stringify(updatedKeys));
      console.log(updatedKeys);
    } catch (error) {
      console.error("There was an error!", error);
      alert("There was an error");
      // console.error("There was an error!", error);
      // if (error.response.status === 401) {
      //   alert("Session logged out. Please login again");
      //   window.location.href = "/";
      // }
      // if (error.response.status === 404) {
      //   alert("Key not found. Please enter a valid key");
      //   let savedKeys = JSON.parse(localStorage.getItem("savedKeys"));
      //   console.log(savedKeys, keyAlias);
      //   let updatedKeys = savedKeys.filter((item) => item !== keyAlias);
      //   localStorage.setItem("savedKeys", JSON.stringify(updatedKeys));
      //   console.log(updatedKeys);
      // }
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
          flexDirection: "column",
          alignItems: "center",
          width: "600px",
          margin: "10px",
        }}
      >
        <span
          style={{ paddingBottom: "20px", paddingLeft: "30px", width: "100px" }}
        >
          Key UUID
        </span>
        <Input
          type="text"
          style={{
            backgroundColor: "white",
            width: "500px",
          }}
          onChange={(e) => setKeyAlias(e.target.value)}
        />
        <span style={{ paddingBottom: "20px", paddingTop: "20px" }}>
          OR Select a key from dropdown below
        </span>
        <KeysDropdown keys={savedKeys} setSelectedKey={setSelectedKey} />
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
