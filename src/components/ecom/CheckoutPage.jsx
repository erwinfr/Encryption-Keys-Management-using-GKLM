import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from "@mui/material";
import { CartContext } from "./context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import CryptoJS from "crypto-js";

function CheckoutPage() {
  const { dispatch } = useContext(CartContext);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    paymentMethod: "card",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  function getWeekNumber(date) {
    // Copy date so don't modify original
    date = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
    // Return array of year and week number
    return weekNo;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate transaction processing
    setIsProcessing(true);

    setTimeout(() => {
      const transactionId = `TXN-${Math.floor(Math.random() * 1000000000)}`;
      const transactionTime = new Date().toLocaleString("en-US");
      console.log("transactionTime", transactionTime);
      const [datePart, timePart] = transactionTime.split(",");
      const [month, day, year] = datePart.split("/");
      const newDate = `${year}-${month}-${day} ${timePart}`;
      const week = getWeekNumber(new Date());
      console.log("week", week, newDate);
      // Save transaction to localStorage
      let key = localStorage.getItem("currentKey");
      let currentKey = CryptoJS.enc.Base64.parse(key).toString(
        CryptoJS.enc.Utf8
      );
      const transactions =
        JSON.parse(localStorage.getItem("transactions")) || {};
      if (!transactions[week]) transactions[week] = [];
      console.log("currentKey", currentKey, typeof currentKey, {
        id: transactionId,
        time: newDate,
      });
      let encJson = CryptoJS.AES.encrypt(
        JSON.stringify({
          id: transactionId,
          time: newDate,
        }),
        currentKey
      ).toString();
      let encData = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(encJson)
      );
      console.log("dec", encJson, encData);
      console.log("data", currentKey);
      transactions[week] = [...transactions[week], encData];
      localStorage.setItem("transactions", JSON.stringify(transactions));

      setIsProcessing(false);
      console.log("navigate", transactionId, newDate);
      localStorage.setItem("transaction", `${transactionId}_${newDate}`);
      dispatch({ type: "CLEAR_CART" });
      navigate("/transaction-success");
    }, 3000);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      {isProcessing ? (
        <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
          <CircularProgress />
          <Typography variant="h6" style={{ color: "#fff" }} mt={2}>
            Processing Transaction...
          </Typography>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={userDetails.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={userDetails.email}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Contact"
            name="contact"
            value={userDetails.contact}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={userDetails.address}
            onChange={handleInputChange}
            margin="normal"
            required
          />

          <Typography variant="h6" mt={2}>
            Payment Method
          </Typography>
          <RadioGroup
            name="paymentMethod"
            value={userDetails.paymentMethod}
            onChange={handleInputChange}
          >
            <FormControlLabel
              value="card"
              control={<Radio />}
              label="Credit/Debit Card"
            />
            <FormControlLabel
              value="cod"
              control={<Radio />}
              label="Cash on Delivery"
            />
          </RadioGroup>

          {userDetails.paymentMethod === "card" && (
            <Box mt={2}>
              <TextField
                fullWidth
                label="Card Number"
                name="cardNumber"
                value={userDetails.cardNumber}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Expiry Date (MM/YY)"
                name="expiry"
                value={userDetails.expiry}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="CVV"
                name="cvv"
                type="password"
                value={userDetails.cvv}
                onChange={handleInputChange}
                margin="normal"
                required
              />
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Place Order
          </Button>
        </form>
      )}
    </Box>
  );
}

export default CheckoutPage;
