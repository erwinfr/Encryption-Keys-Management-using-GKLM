import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Dashboard from "./components/Dashboard";
import Homepage from "./components/ecom/Homepage";
import ProductPage from "./components/ecom/ProductPage";
import Cart from "./components/ecom/Cart";
import AdminLogin from "./components/ecom/AdminLogin";
import Login from "./components/Login";
import CheckoutPage from "./components/ecom/CheckoutPage";
import { CartProvider } from "./components/ecom/context/CartContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/ecom/Header";
import TransactionSuccessPage from "./components/ecom/TransactionSuccessPage";
import AdminPage from "./components/ecom/AdminPage";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="generateKey" element={<Dashboard />} />
            <Route path="deleteKey" element={<Dashboard />} />
            <Route path="fetchMasterKey" element={<Dashboard />} />
            <Route path="fetchKey" element={<Dashboard />} />
            <Route path="rotateMasterKey" element={<Dashboard />} />
            <Route
              path="store"
              element={
                <>
                  <Header />
                  <Homepage products={products} />
                </>
              }
            />
            <Route
              path="product/:id"
              element={
                <>
                  <Header />
                  <ProductPage />
                </>
              }
            />
            <Route
              path="cart"
              element={
                <>
                  <Header />
                  <Cart />
                </>
              }
            />
            <Route
              path="admin-login"
              element={
                <>
                  <Header />
                  <AdminLogin />
                </>
              }
            />
            <Route
              path="admin"
              element={
                <>
                  <Header />
                  <AdminPage />
                </>
              }
            />
            <Route
              path="checkout"
              element={
                <>
                  <Header />
                  <CheckoutPage />
                </>
              }
            />
            <Route
              path="transaction-success"
              element={
                <>
                  <Header />
                  <TransactionSuccessPage />
                </>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
