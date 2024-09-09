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
import TextField from "@mui/material/TextField";
import CryptoJS from "crypto-js";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function TextModal(props) {
  const handleClose = () => {
    setTextValue("");
    setTitleValue("");
    props.handleClose();
  };

  const [textValue, setTextValue] = useState("");
  const [titleValue, setTitleValue] = useState("");

  const handleTitleChange = (event) => {
    setTitleValue(event.target.value);
  };

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleEncrypt = () => {
    console.log(textValue, titleValue, props.selectedKey);
    if (titleValue === "") {
      return alert("Please enter a title");
    }
    if (textValue === "") {
      return alert("Please enter some text");
    }
    if (props.encryptedData.hasOwnProperty(titleValue)) {
      return alert(
        "Please enter a unique title. This title already has encrypted data"
      );
    }
    const encrypted = CryptoJS.AES.encrypt(
      textValue,
      props.selectedKey
    ).toString();
    props.updateEncryptedData({
      ...props.encryptedData,
      [titleValue]: encrypted,
    });
    console.log(encrypted.toString());
    // const decrypt = CryptoJS.AES.decrypt(encrypted, props.selectedKey).toString(
    //   CryptoJS.enc.Utf8
    // );
    // console.log(decrypt);
    handleClose();
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
        Encrypt Data
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
        <TextField
          required
          label="Enter Title"
          value={titleValue}
          onChange={handleTitleChange}
          variant="outlined"
        />

        <TextField
          required
          style={{ marginTop: "20px" }}
          label="Enter data to encrypt"
          value={textValue}
          onChange={handleTextChange}
          multiline
          rows={4}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            handleEncrypt();
          }}
        >
          Encrypt
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
