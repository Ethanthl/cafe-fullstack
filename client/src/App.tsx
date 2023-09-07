
import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cafe from "./components/Cafe/Cafe";
import Employee from "./components/Employees/Employee";
import CafeAdd from "./components/Cafe/CafeAdd";
import CafeEdit from "./components/Cafe/CafeEdit";
import EmployeeAdd from "./components/Employees/EmployeeAdd";
import EmployeeEdit from "./components/Employees/EmployeeEdit";
import Home from "./components/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cafes" element={<Cafe />} />
        <Route path="/cafes/add" element={<CafeAdd />}></Route>
        <Route path="/cafes/:id" element={<CafeEdit />}></Route>
        <Route path="/employees" element={<Employee />}></Route>
        <Route path="/employees/add" element={<EmployeeAdd />}></Route>
        <Route path="/employees/:id" element={<EmployeeEdit />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
