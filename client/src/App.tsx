import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cafe from "./features/cafe/Cafe";
import Employee from "./features/employees/Employee";
import CafeAdd from "./features/cafe/CafeAdd";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cafe />} />
        <Route path="/cafe/:id/employees" element={<Employee />}></Route>
        <Route path="/cafe/add/" element={<CafeAdd />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
