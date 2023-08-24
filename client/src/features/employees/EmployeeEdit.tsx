import { Container } from "@mui/material";
import { useAppDispatch } from "../../app/hooks";
import { editEmployee } from "./employeeSlice";
import EmployeeForm from "../../components/EmployeeForm";
import { useNavigate } from "react-router-dom";

const EmployeeEdit = () => {
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
      await dispatch(editEmployee(values)).then((response) => {
        if (response) {
          console.log(response);
          navigate("/employees");
        }
      });
    } catch (error) {
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

export default EmployeeEdit;
