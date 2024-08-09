import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generateKey" element={<Dashboard />} />
        <Route path="/deleteKey" element={<Dashboard />} />
        <Route path="/fetchMasterKey" element={<Dashboard />} />
        <Route path="/fetchKey" element={<Dashboard />} />
        <Route path="/rotateMasterKey" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
