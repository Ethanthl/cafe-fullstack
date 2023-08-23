import { Container } from "@mui/material";
import CafeForm from "../../components/CafeForm";
import { useAppDispatch } from "../../app/hooks";
import { addCafe } from "./cafeSlice";

const CafeAdd = () => {
  interface FormValues {
    id: string | null;
    name: string;
    description: string;
    logo: File | null | string | Blob;
    location: string;
    employees: number;
  }

  const dispatch = useAppDispatch();
  const handleFormSubmit = async (values: FormValues) => {
    try {
      await dispatch(addCafe(values));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Container>
      <div>
        <h1>Create Cafe</h1>
        <CafeForm onSubmit={handleFormSubmit}></CafeForm>
      </div>
    </Container>
  );
};

export default CafeAdd;
