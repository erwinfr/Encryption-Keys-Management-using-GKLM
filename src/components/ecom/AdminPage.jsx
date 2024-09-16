import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import axios from "axios";
import DecryptModal from "./DecryptModal";

function AdminPage() {
  const [showKey, setShowKey] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [operation, setOperation] = useState("");
  const [selectedWeek, setSelectedWeek] = useState([]);
  const [decryptionKey, setDecryptionKey] = useState("");
  const [currentKey, setCurrentKey] = useState(() => {
    if (localStorage.getItem("currentKey") === null) {
      return "";
    } else {
      return localStorage.getItem("currentKey");
    }
  });
  const [savedKeys, setSavedKeys] = useState(() => {
    if (localStorage.getItem("savedKeys") === null) {
      return [];
    } else {
      return JSON.parse(localStorage.getItem("savedKeys"));
    }
  });
  const [transactions, setTransactions] = useState(() => {
    if (localStorage.getItem("transactions") === null) {
      return {};
    } else {
      return JSON.parse(localStorage.getItem("transactions"));
    }
  });
  let sortedKeys = Object.keys(transactions).sort((a, b) => b - a);

  const handleClose = () => {
    setModalOpen(false);
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `SKLMAuth userAuthId=${Cookies.get("UserAuthId")}`,
  };
  useEffect(() => {
    let session = Cookies.get("adminLoggedIn");
    if (!session) {
      window.location.href = "/admin-login";
    }
  }, [transactions, currentKey, savedKeys]);

  function getRandomLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  const updateTransactions = (data) => {
    setTransactions(data);
    // localStorage.setItem("transactions", JSON.stringify(data));
  };

  const generateKeys = async (noOfKeys, alias) => {
    let keyList = [];
    console.log(noOfKeys, alias);
    try {
      const response = await axios.post(
        "api/SKLM/rest/v1/objects/symmetrickey",
        {
          clientName: "KMI_DEMO",
          bitLength: "256",
          numberOfObjects: noOfKeys,
          prefixName: alias,
          cryptoUsageMask: "Encrypt_Decrypt",
          algorithm: "AES",
        },
        { headers: headers }
      );

      if (response.data.id) {
        console.log(response.data);
        alert("Key generated successfully with alias " + alias + "");
        keyList.push(response.data.id);
        localStorage.setItem(
          "savedKeys",
          JSON.stringify([...savedKeys, ...keyList])
        );
        setSavedKeys([...savedKeys, ...keyList]);
        console.log(keyList);
      }
      return keyList;
    } catch (error) {
      console.error("There was an error!", error);
      if (error.response.status === 401) {
        alert("Session logged out. Please login again");
        window.location.href = "/";
      }
    }
  };

  const generateAndSetKey = async () => {
    console.log("current key", currentKey);
    let key = currentKey;
    let newKey = await generateKeys(
      "1",
      getRandomLetter() + getRandomLetter() + getRandomLetter()
    );
    let ltsWeek = Math.max(...sortedKeys);
    console.log("lts week", ltsWeek, transactions[ltsWeek]);
    let data = transactions[ltsWeek].map((item) => {
      console.log(item, typeof item);
      let decData = CryptoJS.enc.Base64.parse(item).toString(CryptoJS.enc.Utf8);
      let decJson = CryptoJS.AES.decrypt(decData, key).toString(
        CryptoJS.enc.Utf8
      );
      return JSON.parse(decJson);
    });

    console.log("new key", newKey[0], data, ltsWeek);
    let encData = data.map((item) => {
      let encJson = CryptoJS.AES.encrypt(
        JSON.stringify(item),
        newKey[0]
      ).toString();
      let encData = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(encJson)
      );
      return encData;
    });
    setTransactions({ ...transactions, [ltsWeek]: encData });
    setCurrentKey(newKey[0]);
    localStorage.setItem("currentKey", newKey[0]);
  };

  const generateDummyData = async () => {
    let newKey = await generateKeys(
      "1",
      getRandomLetter() + getRandomLetter() + getRandomLetter()
    );
    console.log("new key", newKey[0]);
    setCurrentKey(newKey[0]);
    localStorage.setItem("currentKey", JSON.stringify(newKey[0]));
    const groupedTransactions = {
      34: [
        {
          id: "TXN537961",
          time: "2024-08-23 16:27:48",
        },
        {
          id: "TXN769496",
          time: "2024-08-23 16:27:48",
        },
        {
          id: "TXN811857",
          time: "2024-08-20 16:27:48",
        },
      ],
      35: [
        {
          id: "TXN955317",
          time: "2024-08-28 16:27:48",
        },
        {
          id: "TXN781563",
          time: "2024-08-27 16:27:48",
        },
        {
          id: "TXN111987",
          time: "2024-08-27 16:27:48",
        },
        {
          id: "TXN527729",
          time: "2024-08-25 16:27:48",
        },
      ],
      36: [
        {
          id: "TXN942684",
          time: "2024-09-01 16:27:48",
        },
      ],
      37: [
        {
          id: "TXN-732888437",
          time: "2024-09-10 16:33:21",
        },
        {
          id: "TXN781854",
          time: "2024-09-09 16:27:48",
        },
        {
          id: "TXN301374",
          time: "2024-09-08 16:27:48",
        },
      ],
    };
    let sortedKeys = Object.keys(groupedTransactions).sort((a, b) => b - a);
    console.log(sortedKeys, groupedTransactions);
    sortedKeys.map((week) => {
      let eachWeek = groupedTransactions[week].map((transaction) => {
        let encJson = CryptoJS.AES.encrypt(
          JSON.stringify(transaction),
          newKey[0]
        ).toString();
        let encData = CryptoJS.enc.Base64.stringify(
          CryptoJS.enc.Utf8.parse(encJson)
        );
        return encData;
      });
      groupedTransactions[week] = eachWeek;
    });
    console.log(groupedTransactions);
    localStorage.setItem("transactions", JSON.stringify(groupedTransactions));
    updateTransactions(groupedTransactions);
  };

  return (
    <Box display="flex">
      {/* Main Content */}
      <Box flexGrow={1} p={3}>
        <Typography
          variant="h4"
          style={{ color: "#f5f5f5", marginBottom: "20px" }}
          gutterBottom
        >
          Transaction History
        </Typography>
        <Typography style={{ color: "#f5f5f5", marginBottom: "20px" }}>
          Welcome, Administrator. You are viewing the transaction management
          interface. Here you can access transactions across multiple weeks.
          Security Notice: All individual transactions are securely encrypted
          using keys generated from{" "}
          <strong>Guardium Key Lifecycle Manager (GKLM)</strong>.
        </Typography>
        <Typography style={{ color: "#f5f5f5", marginBottom: "20px" }}>
          In this interface, you can view the current encryption key used for
          transaction data. You also have the ability to provision new GKLM keys
          as needed. These newly provisioned keys can be applied to encrypt both
          upcoming transactions and existing transactions from previous weeks.
        </Typography>
        <Typography style={{ color: "#f5f5f5", marginBottom: "20px" }}>
          To view transaction data for a specific week, use the decrypt button
          next to the dropdown menu. Select the key that was in use for that
          week to decrypt the data.
        </Typography>
        <Typography style={{ color: "#f5f5f5", marginBottom: "20px" }}>
          The Rekey button allows you to perform key rotation for any given
          week. This process re-encrypts that week's data with a newly generated
          key and retires the old key. The retired key will be deleted from both
          this store and the GKLM tool.
        </Typography>
        <Typography style={{ color: "#f5f5f5", marginBottom: "20px" }}>
          For a comprehensive audit of all keys used by the store, please visit
          the Guardium Key Lifecycle Management tool.
        </Typography>

        <Typography
          style={{ color: "#f5f5f5", paddingBottom: "20px", cursor: "pointer" }}
          gutterBottom
          onClick={() => {
            setShowKey(!showKey);
          }}
        >
          {showKey
            ? `Hide Currently Selected Key: ${currentKey}`
            : "Show Currently Selected Key *************"}
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography style={{ color: "#f5f5f5", paddingBottom: "20px" }}>
            To generate and set new key for upcoming transactions
            <Button
              onClick={async () => {
                await generateAndSetKey();
              }}
            >
              Click Here
            </Button>
          </Typography>
        </div>
        {Object.keys(transactions).length === 0 ? (
          <>
            <Typography style={{ color: "#f5f5f5", marginBottom: "20px" }}>
              No transactions found.
            </Typography>
            <Button
              onClick={async () => {
                await generateDummyData();
              }}
            >
              Generate Dummy Data
            </Button>
          </>
        ) : (
          sortedKeys.map((week) => (
            <div
              key={week}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                margin: "30px 5px",
              }}
            >
              <Accordion style={{ width: "80vw" }}>
                <AccordionSummary
                  sx={{
                    "& .MuiAccordionSummary-content": {
                      justifyContent: "space-between",
                    },
                  }}
                  style={{ display: "flex", justifyContent: "space-between" }}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography>Week {week}</Typography>

                  <Typography>
                    {Array.isArray(transactions[week])
                      ? transactions[week].length + " transactions"
                      : null}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {Array.isArray(transactions[week]) ? (
                    transactions[week].map((transaction, index) => (
                      <Box key={index} mb={2}>
                        <Typography>
                          {transaction.id ? (
                            `Transaction ID: ${transaction.id}`
                          ) : (
                            <span
                              style={{
                                overflowWrap: "break-word",
                              }}
                            >
                              {transaction}
                            </span>
                          )}
                        </Typography>
                        <Typography>
                          {transaction.time
                            ? `Transaction Time: ${transaction.time}`
                            : null}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <span
                      style={{
                        overflowWrap: "break-word",
                      }}
                    >
                      {transactions[week]}
                    </span>
                  )}
                </AccordionDetails>
              </Accordion>
              <Button
                style={{ marginLeft: "5px" }}
                onClick={() => {
                  if (transactions[week][0].id) {
                    window.location.reload();
                  } else {
                    setModalOpen(true);
                    setSelectedWeek(week);
                    setOperation("decrypt");
                  }
                }}
              >
                {transactions[week][0].id ? "Encrypt" : "Decrypt"}
              </Button>
              <Button
                style={{ marginLeft: "5px" }}
                onClick={() => {
                  setModalOpen(true);
                  setSelectedWeek(week);
                  setOperation("rekey");
                }}
              >
                ReKey
              </Button>
            </div>
          ))
        )}
        <DecryptModal
          operation={operation}
          generateKeys={generateKeys}
          modalOpen={modalOpen}
          handleClose={handleClose}
          decryptionKey={decryptionKey}
          setDecryptionKey={setDecryptionKey}
          selectedWeek={selectedWeek}
          savedKeys={savedKeys}
          transactions={
            JSON.parse(localStorage.getItem("transactions")) || transactions
          }
          updateTransactions={updateTransactions}
        />
      </Box>
    </Box>
  );
}

export default AdminPage;
