import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Badge } from "@mui/material";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { HomeOutlined } from "@mui/icons-material";
import { useContext } from "react";
import { CartContext } from "./context/CartContext";
import Cookies from "js-cookie";

function Header() {
  const { cart } = useContext(CartContext);

  return (
    <AppBar position="static">
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography
          variant="h6"
          component={Link}
          to="/store"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          My E-commerce Store
        </Typography>
        <IconButton
          style={{ marginRight: "15px" }}
          component={Link}
          to={"/dashboard"}
          color="inherit"
        >
          <HomeOutlined />
        </IconButton>
        <IconButton
          style={{ marginRight: "15px" }}
          component={Link}
          to={Cookies.get("adminLoggedIn") ? "/admin" : "/admin-login"}
          color="inherit"
        >
          <AdminPanelSettingsIcon />
        </IconButton>

        <IconButton
          style={{ marginRight: "15px" }}
          component={Link}
          to="/cart"
          color="inherit"
        >
          <Badge badgeContent={cart.length} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
