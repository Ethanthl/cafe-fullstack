import { Container } from "@mui/material";
import { useAppDispatch } from "../../app/hooks";
import { addEmployee } from "../../features/employees/employeeSlice";
import EmployeeForm from "../EmployeeForm";
import { useNavigate } from "react-router-dom";
import { isFulfilled } from "@reduxjs/toolkit";

const EmployeeAdd = () => {
  const navigate = useNavigate();
  interface FormValues {
    id: string | null;
    name: string;
    email_address: string;
    phone_number: any;
    gender: string;
    cafe_name: string | null;
    cafe_id: string | null;
    days_worked: string | null;
  }

  const dispatch = useAppDispatch();
  const handleFormSubmit = async (values: FormValues) => {
    try {
      await dispatch(addEmployee(values)).then((response) => {
        console.log(response);
        if (response.type === "employees/add/fulfilled") {
          navigate("/employees");
        } else {
          if (response.payload.response.data.message === "ER_DUP_ENTRY")
            throw new Error("Email already registered");
          else {
            throw new Error("Database error");
          }
        }
      });
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };
  return (
    <Container>
      <div>
        <h1>New Employee</h1>
        <EmployeeForm onSubmit={handleFormSubmit}></EmployeeForm>
      </div>
    </Container>
  );
};

export default EmployeeAdd;
