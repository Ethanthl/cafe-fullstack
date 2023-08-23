import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cafe from "./features/cafe/Cafe";
import Employee from "./features/employees/Employee";
import CafeAdd from "./features/cafe/CafeAdd";
import CafeEdit from "./features/cafe/CafeEdit";
import EmployeeAdd from "./features/employees/EmployeeAdd";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cafe />} />
        <Route path="/cafes" element={<Cafe />} />
        <Route path="/cafes/add" element={<CafeAdd />}></Route>
        <Route path="/cafes/:id" element={<CafeEdit />}></Route>
        <Route path="/employees" element={<Employee />}></Route>
        <Route path="/employees/add" element={<EmployeeAdd />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
