import React from "react";
import { Routes, Route } from "react-router-dom";
import Form from "./form";
import Otp from "./verifyOtp";
import Home from "./home";
import { ViewConfessions, AddConfession } from "./home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/home" element={<Home />}>
        <Route index element={<ViewConfessions />} />
        <Route path="add" element={<AddConfession />} />
      </Route>
    </Routes>
  );
}

export default App;
