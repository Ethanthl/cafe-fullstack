import * as Yup from "yup";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { fetchCafes } from "../features/cafe/cafeSlice";

interface FormValues {
  id: string | null;
  name: string;
  email_address: string;
  phone_number: string;
  gender: string;
  cafe_id: string | null;
}

interface CafeFormProps {
  onSubmit: (values: FormValues) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email_address: Yup.string()
    .email("Invalid email")
    .required("email is required"),
  phone_number: Yup.string()
    .min(8, "Phone must be 8 characters")
    .max(8, "Phone must be 8 characters"),
  gender: Yup.string().required(),
});

const EmployeeForm: React.FC<CafeFormProps> = ({ onSubmit }) => {
  const handleSubmit = async (values: FormValues) => {
    console.log(values);
    onSubmit(values); // Call the passed onSubmit function
  };

  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getSingleEmployee(id));
    }
    dispatch(fetchCafes());
  }, [id, dispatch]);

  const employeeState = useSelector((state: RootState) => state.employees);
  const cafeState = useSelector((state: RootState) => state.cafes);
  //used to render select
  const cafeData = cafeState?.data?.cafes;
  if (employeeState.loading) {
    return <div>Loading...</div>;
  }

  if (!employeeState.data) {
    const initialValues: FormValues = {
      id: null,
      name: "",
      email_address: "",
      phone_number: "",
      gender: "",
      cafe_id: "",
    };
  }

  const employeeData = employeeState?.data?.employees;

  const initialValues: FormValues = {
    id: employeeData ? employeeData[0].id : null,
    name: employeeData ? employeeData[0].name : "",
    email_address: employeeData ? employeeData[0].email_address : "",
    phone_number: employeeData ? employeeData[0].phone_number : "",
    gender: employeeData ? employeeData[0].gender : "",
    cafe_id: employeeData ? employeeData[0].cafe_name : "",
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, initialValues }) => (
        <FormikForm>
          <div>
            <Field
              as={TextField}
              type="text"
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              required
            />
            <ErrorMessage name="name" component="div" className="error" />
          </div>
          <div>
            <Field
              as={TextField}
              label="Email"
              variant="outlined"
              id="email_address"
              name="email_address"
              required
            />
            <ErrorMessage
              name="email_address"
              component="div"
              className="error"
            />
          </div>

          <div>
            <Field
              as={TextField}
              type="text"
              id="phone_number"
              name="phone_number"
              label="Phone Number"
              variant="outlined"
              required
            />
            <ErrorMessage
              name="phone_number"
              component="div"
              className="error"
            />
          </div>

          <div>
            <InputLabel>Gender</InputLabel>
            <Field
              as={Select}
              type="text"
              id="gender"
              name="gender"
              label="Phone Number"
              variant="outlined"
              required
              placeholder="Select an option"
              sx={{ width: "100%", margin: "1rem 0" }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Field>
            <ErrorMessage name="gender" component="div" className="error" />
          </div>

          <div>
            <Field
              as={Select}
              type="text"
              id="cafe_id"
              name="cafe_id"
              variant="outlined"
              label="Select a cafe"
              required
              sx={{ width: "100%", margin: "1rem 0" }}
            >
              <MenuItem value="">Select a cafe</MenuItem>
              {cafeData?.map((cafe) => (
                <MenuItem value={cafe.id?.toString()}>{cafe.name}</MenuItem>
              ))}
            </Field>
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
export default EmployeeForm;
function getSingleEmployee(id: string): any {
  throw new Error("Function not implemented.");
}
