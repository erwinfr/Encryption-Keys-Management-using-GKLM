import React from "react";
import axios from "axios";
import {
  Container,
  CssBaseline,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Grid,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Login() {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const credentials = {
      userid: data.get("userId"),
      password: data.get("password"),
    };

    try {
      const response = await axios.post(
        "api/SKLM/rest/v1/ckms/accessToken",
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const userAuthId = response.data.UserAuthId;
        Cookies.set("UserAuthId", userAuthId, { expires: 1 / 24 });
        // localStorage.setItem("UserAuthId", userAuthId);
        console.log("Login successful!");
        navigate("/dashboard");
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      if (error.response.status.includes("40")) {
        console.log(response.data.message);
        alert(response.data.message);
      }
      console.error("There was an error!", error);
      alert(error.response.data.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="userId"
            label="User ID"
            name="userId"
            autoComplete="userId"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
