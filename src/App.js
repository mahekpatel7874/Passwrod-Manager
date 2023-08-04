import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/login";
import SignUp from "./Components/signUp";
import Dashboard from "./Components/dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
