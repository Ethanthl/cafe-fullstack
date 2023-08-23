import * as Yup from "yup";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { Button, TextField } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { fetchIndividualCafe } from "../features/cafe/cafeSlice";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

interface FormValues {
  id: string | null;
  name: string;
  description: string;
  logo: any;
  location: string;
  employees: number;
}

interface CafeFormProps {
  onSubmit: (values: FormValues) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(6, "Name must be at least 6 characters")
    .max(10, "Name must not exceed 10 characters"),
  description: Yup.string()
    .required("Description is required")
    .max(256, "Description must not exceed 256 characters"),
  logo: Yup.mixed().test(
    "fileSize",
    "File size is too large",
    function (value) {
      const originalValue = this.originalValue;

      if (!value || value === originalValue) {
        return true;
      }

      const file = value as File;
      return file.size <= 2 * 1024 * 1024; // 1 MB in bytes
    }
  ),
  location: Yup.string().required("Location is required"),
});

const CafeForm: React.FC<CafeFormProps> = ({ onSubmit }) => {
  const handleSubmit = async (values: FormValues) => {
    onSubmit(values); // Call the passed onSubmit function
  };

  const dispatch = useAppDispatch();
  const { id } = useParams();

  const cafeState = useSelector((state: RootState) => state.cafes);

  useEffect(() => {
    if (id) {
      dispatch(fetchIndividualCafe(id));
    }
  }, [id, dispatch]);

  if (cafeState.loading) {
    return <div>Loading...</div>;
  }

  if (!cafeState.data) {
    const initialValues: FormValues = {
      id: null,
      name: "",
      description: "",
      logo: null,
      location: "",
      employees: 0,
    };
  }

  const cafeData = cafeState?.data?.cafes;

  const initialValues: FormValues = {
    id: cafeData ? cafeData[0].id : null,
    name: cafeData ? cafeData[0].name : "",
    description: cafeData ? cafeData[0].description : "",
    logo: cafeData ? cafeData[0].logo : null,
    location: cafeData ? cafeData[0].location : "",
    employees: cafeData ? cafeData[0].employees : 0,
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, initialValues }) => (
        <FormikForm>
          <div
            className="logo-field"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div>
              <label
                htmlFor="logo"
                style={{ margin: "1rem 0", marginRight: "1rem" }}
              >
                Logo
              </label>
              <label htmlFor="logo">
                <Button variant="contained" component="span">
                  Upload Logo
                </Button>
              </label>
              <input
                style={{ display: "none" }}
                type="file"
                id="logo"
                name="logo"
                onChange={async (
                  event: React.ChangeEvent<HTMLInputElement>
                ) => {
                  const file =
                    event.currentTarget.files && event.currentTarget.files[0];
                  if (file) {
                    setFieldValue("logo", file);
                    initialValues.logo = null;
                  }
                }}
              />
            </div>
            {initialValues.logo !== null && (
              <img src={initialValues.logo} style={{ width: "100px", marginTop: "1rem" }} alt="logo" />
            )}
            {values.logo && typeof values.logo !== "string" ? (
              <>
                {console.log(values?.logo)}
                <img
                  style={{ width: "100px", marginTop: "1rem" }}
                  src={URL.createObjectURL(values.logo)}
                  alt="logo"
                />
              </>
            ) : (
              ""
            )}
            <ErrorMessage name="logo" component="div" className="error" />
          </div>
          <div>
            <Field
              as={TextField}
              type="text"
              id="name"
              name="name"
              label="Cafe Name"
              variant="outlined"
              required
            />
            <ErrorMessage name="name" component="div" className="error" />
          </div>
          <div>
            <Field
              as={TextField}
              label="Description"
              variant="outlined"
              id="description"
              name="description"
              required
            />
            <ErrorMessage
              name="description"
              component="div"
              className="error"
            />
          </div>

          <div>
            <Field
              as={TextField}
              type="text"
              id="location"
              name="location"
              label="Location"
              variant="outlined"
              required
            />
            <ErrorMessage name="location" component="div" className="error" />
          </div>
          <Button
            type="submit"
            style={{ margin: "1rem 0" }}
            variant="contained"
          >
            Submit
          </Button>
        </FormikForm>
      )}
    </Formik>
  );
};
export default CafeForm;
