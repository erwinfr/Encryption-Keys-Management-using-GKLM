import React, { useContext } from "react";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";
import { CartContext } from "./context/CartContext";
import { Link } from "react-router-dom";

function Cart() {
  const { cart, dispatch } = useContext(CartContext);

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            {cart.map((item) => (
              <Card key={item.id} sx={{ display: "flex", marginBottom: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 150 }}
                  image={item.image}
                  alt={item.title}
                />
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography>
                    ${item.price} x {item.quantity}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ padding: 2 }}>
              <Typography variant="h6">Order Summary</Typography>
              <Typography variant="body1">
                Total: ${calculateTotal()}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/checkout"
                sx={{ marginTop: 2 }}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default Cart;
