import React, { useEffect, useState } from "react";
import { TextField, Button, Input, Typography } from "@mui/material";
import KeysDropdown from "./KeysDropdown";
import axios from "axios";
import Cookies from "js-cookie";
import TextModal from "./TextModal";
import DecryptionModal from "./DecryptionModal";

function GenerateKey() {
  const [noOfKeys, setNoOfKeys] = useState("");
  const [alias, setAlias] = useState("");
  const [keys, setKeys] = useState([]);
  const [generatedKeys, setGeneratedKeys] = useState(0);
  const [selectedKey, setSelectedKey] = useState("");
  const [decryptionKey, setDecryptionKey] = useState("");
  const [hashValue, setHashValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [decryptModalOpen, setDecryptModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [savedKeys, setSavedKeys] = useState(
    JSON.parse(localStorage.getItem("savedKeys"))
  );
  const [encryptedData, setEncryptedData] = useState(() => {
    if (localStorage.getItem("encryptedData") === null) {
      return {};
    } else {
      return JSON.parse(localStorage.getItem("encryptedData"));
    }
  });

  let keyList = [];
  const ALPHABETIC_REGEX = /^[a-zA-Z]+$/;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `SKLMAuth userAuthId=${Cookies.get("UserAuthId")}`,
  };

  const decryptModalClose = () => {
    setDecryptModalOpen(false);
  };

  const modalClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    console.log("updated");
  }, [encryptedData]);

  const generateKeys = () => {
    console.log(noOfKeys, alias);
    axios
      .post(
        "api/SKLM/rest/v1/objects/symmetrickey",
        // "api/SKLM/rest/v1/keys",
        {
          clientName: "KMI_DEMO",
          bitLength: "256",
          numberOfObjects: noOfKeys,
          prefixName: alias,
          cryptoUsageMask: "Encrypt_Decrypt",
          algorithm: "AES",
        },
        // {
        //   numOfKeys: noOfKeys,
        //   alias: alias,
        //   usage: "KMI_DEMO",
        // },
        { headers: headers }
      )
      .then((response) => {
        console.log(response.data);
        alert("Key generated successfully");
        if (response.data.id) {
          keyList = [];
          if (Array.isArray(response.data.id)) {
            keyList.push(...response.data.id);
            setGeneratedKeys(response.data.id.length);
            localStorage.setItem(
              "savedKeys",
              JSON.stringify([...savedKeys, ...response.data.id])
            );
            setSavedKeys([...savedKeys, ...response.data.id]);
          } else {
            keyList.push(response.data.id);
            setGeneratedKeys(1);
            localStorage.setItem(
              "savedKeys",
              JSON.stringify([...savedKeys, response.data.id])
            );
            setSavedKeys([...savedKeys, response.data.id]);
          }
        }
        setKeys(keyList);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        if (error.response.status === 401) {
          alert("Session logged out. Please login again");
          window.location.href = "/";
        }
      });
  };

  return (
    <div
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: "70px",
        height: "65vh",
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
            {generatedKeys} {generatedKeys > 1 ? "keys were" : "key was"}{" "}
            generated. Following are their respective key alias:
          </Typography>
          <div style={{ marginTop: "20px" }}>
            {keys.map((key, index) => (
              <Typography
                key={key}
                variant="body1"
                style={{ marginTop: "5px" }}
              >
                {index + 1}. &nbsp; {key}
              </Typography>
            ))}
          </div>
        </div>
      )}
      <div
        style={{
          marginTop: "70px",
          width: "85vw",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-start",
        }}
      >
        <div id="keyStore" style={{ marginTop: "30px", width: "50%" }}>
          <Typography
            style={{ marginBottom: "50px" }}
            variant="h6"
            textAlign={"center"}
          >
            Key Store
          </Typography>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Typography
              style={{ marginLeft: "10px", marginBottom: "10px" }}
              variant="body1"
            >
              Following keys have been generated and stored in the application
            </Typography>
            <KeysDropdown setSelectedKey={setSelectedKey} keys={savedKeys} />
          </div>
          {selectedKey.includes("KEY-") ? (
            <Button
              variant="contained"
              style={{ marginTop: "20px" }}
              onClick={() => setModalOpen(true)}
            >
              Encrypt data using this key
            </Button>
          ) : null}
          <TextModal
            open={modalOpen}
            handleClose={modalClose}
            selectedKey={selectedKey}
            setEncryptedData={setEncryptedData}
            encryptedData={encryptedData}
          />
        </div>
        <div
          id="divider"
          style={{
            width: "3px",
            minHeight: "400px",
            height: "100%",
            backgroundColor: "#ffffffa8",
          }}
        ></div>
        <div id="encrypt" style={{ marginTop: "30px", width: "50%" }}>
          <div>
            <Typography variant="h6" textAlign={"center"}>
              Encrypted Data:
            </Typography>
          </div>
          <div style={{ marginLeft: "70px", marginTop: "50px" }}>
            {Object.keys(encryptedData).length > 0 &&
              Object.keys(encryptedData).map((data, index) => {
                return (
                  <div
                    style={{
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "500px",
                    }}
                    key={index}
                  >
                    <span style={{ width: "200px" }}>
                      {index + 1}. &nbsp; {data}{" "}
                    </span>
                    <Button
                      onClick={() => {
                        setTitle(data);
                        setHashValue(encryptedData[data]);
                        setDecryptModalOpen(true);
                      }}
                    >
                      Decrypt
                    </Button>
                    <Button
                      onClick={() => {
                        console.log("in delete");
                        let obj = { ...encryptedData };
                        console.log(obj);
                        delete obj[data];
                        setEncryptedData(obj);
                        console.log(obj, encryptedData);
                        localStorage.setItem(
                          "encryptedData",
                          JSON.stringify(obj)
                        );
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                );
              })}
          </div>
          <DecryptionModal
            open={decryptModalOpen}
            handleClose={decryptModalClose}
            keys={savedKeys}
            setSelectedKey={setDecryptionKey}
            decryptionKey={decryptionKey}
            title={title}
            hashValue={hashValue}
          />
        </div>
      </div>
    </div>
  );
}

export default GenerateKey;
