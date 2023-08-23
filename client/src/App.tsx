import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cafe from "./features/cafe/Cafe";
import Employee from "./features/employees/Employee";
import CafeAdd from "./features/cafe/CafeAdd";
import CafeEdit from "./features/cafe/CafeEdit";
import CafeEmployee from "./features/employees/CafeEmployee";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cafe />} />
        <Route path="/cafe" element={<Cafe />} />
        <Route path="/cafe/:id/employees/" element={<CafeEmployee />}></Route>
        <Route path="/cafe/add/" element={<CafeAdd />}></Route>
        <Route path="/cafe/:id/" element={<CafeEdit />}></Route>
        <Route path="/employee" element={<CafeEdit />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
