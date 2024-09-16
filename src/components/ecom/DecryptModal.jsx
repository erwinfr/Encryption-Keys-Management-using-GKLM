import { useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import CryptoJS from "crypto-js";
import KeysDropdown from "../KeysDropdown";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function DecryptModal(props) {
  const [response, setResponse] = useState("");

  const handleClose = () => {
    setResponse("");
    props.handleClose();
  };

  function getRandomLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  const reKey = async () => {
    let decrypted = handleDecrypt();
    if (decrypted === false) {
      return;
    }
    let newKey = await props.generateKeys("1", "rk" + getRandomLetter());
    console.log("new key", newKey[0], "decrypted", decrypted);
    let encrypted = decrypted.map((item) => {
      let encJson = CryptoJS.AES.encrypt(item, newKey[0]).toString();
      let encData = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(encJson)
      );
      return encData;
    });
    let updated = { ...props.transactions, [props.selectedWeek]: encrypted };
    props.updateTransactions(updated);
    localStorage.setItem("transactions", JSON.stringify(updated));
    setResponse("Decrypted Data - " + decrypted + " | New Key - " + newKey[0]);
  };

  const handleDecrypt = () => {
    console.log(
      "decrypt",
      props.selectedWeek,
      props.transactions[props.selectedWeek],
      props.decryptionKey
    );
    let decrypted = props.transactions[props.selectedWeek].map((item) => {
      console.log("item", item);
      let newExactString = item.replaceAll('"', "");
      let decData = CryptoJS.enc.Base64.parse(newExactString).toString(
        CryptoJS.enc.Utf8
      );

      console.log(
        "dec",
        CryptoJS.AES.decrypt(decData, props.decryptionKey).toString(
          CryptoJS.enc.Utf8
        )
      );
      if (props.operation === "rekey") {
        return CryptoJS.AES.decrypt(decData, props.decryptionKey).toString(
          CryptoJS.enc.Utf8
        );
      } else {
        return CryptoJS.AES.decrypt(decData, props.decryptionKey).toString(
          CryptoJS.enc.Utf8
        )
          ? JSON.parse(
              CryptoJS.AES.decrypt(decData, props.decryptionKey).toString(
                CryptoJS.enc.Utf8
              )
            )
          : null;
      }
    });
    console.log("decrypted", decrypted);

    if (decrypted[0].length > 0 || decrypted[0].id) {
      setResponse(
        `Decrypted ${
          props.operation === "rekey" ? "| Generating New Key..." : ""
        }`
      );
      console.log("decrypted", decrypted, typeof decrypted);
      props.updateTransactions({
        ...props.transactions,
        [props.selectedWeek]: decrypted,
      });
      return decrypted;
    } else {
      if (props.operation === "rekey") {
        setResponse(
          "Wrong decryption key selected, please select the correct key to complete the operation"
        );
      } else {
        setResponse("Decryption Failed, wrong key selected");
      }
      return false;
    }
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.modalOpen}
      maxWidth="md"
      fullWidth={true}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {props.operation === "rekey" ? "ReKey" : "Decrypt"} Data
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        dividers
        style={{ marginTop: "20px", display: "flex", flexDirection: "column" }}
      >
        <Typography style={{ marginBottom: "20px", marginLeft: "10px" }}>
          Select a key to decrypt - <strong>{props.title}</strong>.{" "}
          {props.operation === "rekey"
            ? "This will be used to rekey the data"
            : "This will be used to decrypt the data"}
        </Typography>
        <KeysDropdown
          keys={props.savedKeys}
          setSelectedKey={props.setDecryptionKey}
        />
        <Typography style={{ marginTop: "20px", marginLeft: "10px" }}>
          {response}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            if (props.operation === "rekey") {
              reKey();
            } else {
              handleDecrypt();
            }
          }}
        >
          {props.operation === "rekey" ? "ReKey" : "Decrypt"}
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
export default DecryptModal;
