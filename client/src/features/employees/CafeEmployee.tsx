import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { deleteEmployee, fetchEmployees } from "./employeeSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useParams } from "react-router-dom";
import { Button, Container } from "@mui/material";
import Grid from "../../components/Grid";
import { ColDef } from "ag-grid-community";

const CafeEmployee = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  //   Fetch cafes on component mount
  useEffect(() => {
    dispatch(fetchEmployees(id));
  }, [dispatch]);
  const employeeState = useSelector((state: RootState) => state.employees.data);
  const employees = employeeState?.employees;
  console.log(employees);
  const rowData = employees?.map((item) => {
    return {
      id: item.id,
      name: item.name,
      email_address: item.email_address,
      phone_number: item.phone_number,
      gender: item.gender,
      days_worked: item.days_worked,
      cafe_name: item.cafe_name,
    };
  });
  const defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    resizable: true,
    filter: true,
  };
  const columnDefs = [
    { headerName: "Name", field: "name" },
    { headerName: "Email", field: "email_address" },
    { headerName: "Phone Number", field: "phone_number" },
    { headerName: "Gender", field: "gender" },
    { headerName: "Days Worked", field: "days_worked" },
    { headerName: "Cafe Name", field: "cafe_name" },
    {
      field: "actions",
      cellRenderer: function (params: any) {
        const id = params.data.id; // Assuming the ID property exists in the row data
        return (
          <Button
            onClick={() => {
              dispatch(deleteEmployee(id));
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];
  return (
    <Container maxWidth={false}>
      <h1>Employees</h1>
      <div
        id="myGrid"
        style={{ position: "relative", height: "100%", width: "100%" }}
        className="ag-theme-alpine"
      >
        <Grid
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
        />
      </div>
    </Container>
  );
};

export default CafeEmployee;
