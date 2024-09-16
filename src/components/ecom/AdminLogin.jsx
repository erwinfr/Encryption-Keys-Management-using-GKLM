import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function AdminLogin() {
  useEffect(() => {
    if (Cookies.get("adminLoggedIn")) {
      navigate("/admin");
    }
  }, []);
  const [adminDetails, setAdminDetails] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setAdminDetails({ ...adminDetails, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Admin credentials check (dummy logic)
    if (
      adminDetails.username === "admin" &&
      adminDetails.password === "admin123"
    ) {
      Cookies.set("adminLoggedIn", true, { expires: 1 / 24 });
      navigate("/admin");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <Box
      p={3}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper elevation={3} sx={{ padding: 4, width: "400px" }}>
        <Typography variant="h5" gutterBottom>
          Admin Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={adminDetails.username}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={adminDetails.password}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default AdminLogin;
