import React, { useContext, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "./context/CartContext";

function TransactionSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const transaction = localStorage.getItem("transaction");
  const { dispatch } = useContext(CartContext);
  const [transactionId, transactionTime] = transaction.split("_");
  console.log(transactionId, transactionTime);

  return (
    <Box
      p={3}
      style={{
        backgroundColor: "#f5f5f5",
        margin: "80px",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h4" gutterBottom>
        Transaction Successful!
      </Typography>
      <Typography variant="h6">Your Transaction ID:</Typography>
      <Typography variant="h5" color="primary">
        {transactionId}
      </Typography>
      <Typography variant="body1" mt={2}>
        Transaction Time: {transactionTime}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/store")}
        sx={{ marginTop: 3 }}
      >
        Continue Shopping
      </Button>
    </Box>
  );
}

export default TransactionSuccessPage;
