import { Container } from "@mui/material";
import React, { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import CafeForm from "../../components/CafeForm";
import { editCafe, fetchIndividualCafe } from "./cafeSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const CafeEdit = () => {
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
      await dispatch(editCafe(values));
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <Container>
      <div>
        <h1>Edit Cafe</h1>
        <CafeForm
          onSubmit={handleFormSubmit}

        ></CafeForm>
      </div>
    </Container>
  );
};

export default CafeEdit;
