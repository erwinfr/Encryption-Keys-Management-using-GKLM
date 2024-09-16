import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
} from "@mui/material";
import { CartContext } from "./context/CartContext";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const addToCart = () => {
    if (product) {
      dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity } });
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <Box display="flex" justifyContent="center" p={3}>
      <Card sx={{ maxWidth: 600 }}>
        <CardMedia
          component="img"
          height="400"
          image={product.image}
          alt={product.title}
          sx={{ objectFit: "contain" }}
        />
        <CardContent>
          <Typography variant="h5">{product.title}</Typography>
          <Typography variant="body2" color="textSecondary">
            {product.description}
          </Typography>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            ${product.price}
          </Typography>
          <Box mt={2} display="flex" alignItems="center">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              style={{
                marginRight: "10px",
                width: "50px",
                textAlign: "center",
              }}
            />
            <Button variant="contained" onClick={addToCart}>
              Add to Cart
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ProductPage;
