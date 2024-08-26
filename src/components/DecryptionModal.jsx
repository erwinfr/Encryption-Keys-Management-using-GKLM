import React from "react";
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
import KeysDropdown from "./KeysDropdown";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function DecryptionModal(props) {
  const handleClose = () => {
    setResponse("");
    props.handleClose();
  };

  const [response, setResponse] = useState("");

  const handleDecrypt = () => {
    console.log("decrypt", props.title, props.hashValue, props.decryptionKey);
    let decrypted = CryptoJS.AES.decrypt(props.hashValue, props.decryptionKey);
    if (decrypted.toString(CryptoJS.enc.Utf8).length > 0) {
      setResponse(`Decrypted Data - ${decrypted.toString(CryptoJS.enc.Utf8)}`);
    } else {
      setResponse("Decryption Failed, wrong key selected");
    }
    console.log("dec", decrypted);
    console.log(
      decrypted.toString(CryptoJS.enc.Utf8),
      typeof decrypted.toString(CryptoJS.enc.Utf8),
      decrypted.toString(CryptoJS.enc.Utf8).length
    );
    // alert(decrypted.toString(CryptoJS.enc.Utf8));
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
      maxWidth="md"
      fullWidth={true}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Decrypt Data
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
          Select a key to decrypt - {props.title}
        </Typography>
        <KeysDropdown keys={props.keys} setSelectedKey={props.setSelectedKey} />
        <Typography style={{ marginTop: "20px", marginLeft: "10px" }}>
          {response}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            handleDecrypt();
          }}
        >
          Decrypt
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
