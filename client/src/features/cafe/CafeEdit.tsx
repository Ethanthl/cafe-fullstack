import { Container } from "@mui/material";
import { useAppDispatch } from "../../app/hooks";
import CafeForm from "../../components/CafeForm";
import { editCafe } from "./cafeSlice";
import { useNavigate } from "react-router-dom";

const CafeEdit = () => {
  const navigate = useNavigate();
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
      await dispatch(editCafe(values)).then((response) => {
        if (response.type === "editCafe/fulfilled") {
          navigate("/");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <div>
        <h1>Edit Cafe</h1>
        <CafeForm onSubmit={handleFormSubmit}></CafeForm>
      </div>
    </Container>
  );
};

export default CafeEdit;
