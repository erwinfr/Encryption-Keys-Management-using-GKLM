import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Carousel from "react-material-ui-carousel";
import { Link } from "react-router-dom";
import { CartContext } from "./context/CartContext";
import "./Homepage.css";

function Homepage() {
  const [products, setProducts] = useState([]);
  const { cart, dispatch } = useContext(CartContext);

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Carousel data
  const carouselItems = [
    {
      text: "Super Sale: Up to 50% Off!",
      gradient: "linear-gradient(135deg, #FF7E5F, #FEB47B)",
    },
    {
      text: "Buy One Get One Free!",
      gradient: "linear-gradient(135deg, #00C9FF, #92FE9D)",
    },
    {
      text: "New Arrivals: Exclusive Discounts!",
      gradient: "linear-gradient(135deg, #FF758C, #FF7EB3)",
    },
  ];

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: 1 } });
  };

  const updateQuantity = (product, amount) => {
    const currentItem = cart.find((item) => item.id === product.id);
    const newQuantity = currentItem.quantity + amount;

    if (newQuantity <= 0) {
      dispatch({ type: "REMOVE_FROM_CART", payload: product.id });
    } else {
      dispatch({
        type: "ADD_TO_CART",
        payload: { ...product, quantity: newQuantity },
      });
    }
  };

  const renderAddToCartButtonOrQuantityEditor = (product) => {
    const cartItem = cart.find((item) => item.id === product.id);

    if (cartItem) {
      return (
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => updateQuantity(product, -1)}>
            <RemoveIcon />
          </IconButton>
          <Typography>{cartItem.quantity}</Typography>
          <IconButton onClick={() => updateQuantity(product, 1)}>
            <AddIcon />
          </IconButton>
        </Box>
      );
    } else {
      return (
        <Button
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => addToCart(product)}
          sx={{ marginRight: 1 }}
        >
          Add to Cart
        </Button>
      );
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Carousel animation="slide" interval={3000} indicators={false}>
        {carouselItems.map((item, index) => (
          <Box
            key={index}
            className="carousel-item"
            style={{ background: item.gradient }}
          >
            <Typography variant="h3" className="carousel-text">
              {item.text}
            </Typography>
          </Box>
        ))}
      </Carousel>
      <Typography
        variant="h4"
        style={{ margin: "30px", marginLeft: "20px" }}
        color={"#f5f5f5"}
        gutterBottom
      >
        All Products on Sale
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card className="product-card">
              <CardMedia
                component="img"
                height="300"
                image={product.image}
                alt={product.title}
                sx={{ objectFit: "contain" }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.title}
                </Typography>
                <Typography variant="body1">${product.price}</Typography>
                <Box mt={2}>
                  {renderAddToCartButtonOrQuantityEditor(product)}
                  <Button
                    variant="outlined"
                    component={Link}
                    to={`/product/${product.id}`}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Homepage;

function ProductGrid() {
  return (
    <Box>
      {/* Carousel */}

      {/* Gradient under carousel */}

      {/* Product Grid Section */}
      <Box mt={5} px={3}>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card className="product-card" elevation={3}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.title}
                  className="product-image"
                />
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {product.category}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => handleViewProduct(product.id)}
                    className="view-product-btn"
                  >
                    View Product
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
