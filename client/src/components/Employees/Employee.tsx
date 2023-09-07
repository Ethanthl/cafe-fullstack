import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { deleteEmployee, fetchEmployees } from "../../features/employees/employeeSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useLocation, useParams } from "react-router-dom";
import { Box, Button, Container } from "@mui/material";
import Grid from "../Grid";
import { ColDef } from "ag-grid-community";
import Swal from "sweetalert2";

const Employee = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("cafe");
  const dispatch = useAppDispatch();
  const employees = useSelector(
    (state: RootState) => state.employees.employees?.employees
  );

  //   Fetch employees on component mount
  useEffect(() => {
    dispatch(fetchEmployees(id));
  }, [id, dispatch]);
  //   console.log(employeeState)
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
          <>
            <Button href={`/employees/${id}`}>Edit</Button>
            <Button
              onClick={() => {
                Swal.fire({
                  title: "You are about to delete this entry",
                  icon: "question",
                  iconHtml: "?",
                  confirmButtonText: "Confirm",
                  cancelButtonText: "Cancel",
                  showCancelButton: true,
                  showCloseButton: true,
                }).then((result) => {
                  if (result.isConfirmed) {
                    dispatch(deleteEmployee(id));
                  }
                });
              }}
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "fit-content",
        }}
      >
        <h1>Empoyees</h1>{" "}
        <Button variant="contained" href="/employees/add">
          Add Employee
        </Button>
      </Box>
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

export default Employee;
