import { Container } from "@mui/material";
import { useAppDispatch } from "../../app/hooks";
import { addEmployee } from "./employeeSlice";
import EmployeeForm from "../../components/EmployeeForm";

const EmployeeAdd = () => {
  interface FormValues {
    name: string;
    email_address: string;
    phone_number: any;
    gender: string;
    cafe_id: string | null;
  }

  const dispatch = useAppDispatch();
  const handleFormSubmit = async (values: FormValues) => {
    try {
      await dispatch(addEmployee(values));
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

export default EmployeeAdd;
