import React, { useEffect } from "react";
import "./Cafe.scss";
import { useAppDispatch } from "../../app/hooks";
import { deleteCafes, fetchCafes } from "./cafeSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

import Grid from "../../components/Grid";
import { ColDef } from "ag-grid-community";

import { Container, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
const Cafe = () => {
  const dispatch = useAppDispatch();
  // Fetch cafes on component mount
  useEffect(() => {
    dispatch(fetchCafes());
  }, [dispatch]);
  const cafeState = useSelector((state: RootState) => state.cafes);
  const cafes = cafeState?.data?.cafes;

  const rowData = cafes?.map((item) => {
    return {
      id: item.id,
      cafe: item.name,
      description: item.description,
      location: item.location,
      logo: item.logo,
      employees: item.employees,
    };
  });
  const defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    resizable: true,
    filter: true,
  };
  const columnDefs = [
    { field: "cafe" },
    { field: "description" },
    { field: "location", flex: 3 },
    {
      field: "employees",
      cellRenderer: function (params: any) {
        const id = params.data.id; // Assuming the ID property exists in the row data
        const employeeCount = params.data.employees;
        return <Link to={`/employees?cafe=${id}`}>{employeeCount}</Link>;
      },
    },
    {
      field: "logo",
      cellRenderer: function (params: any) {
        const logo = params.data.logo; // Assuming the ID property exists in the row data
        return <img src={logo} width={"100px"} />;
      },
    },
    {
      field: "actions",
      cellRenderer: function (params: any) {
        const id = params.data.id; // Assuming the ID property exists in the row data
        return (
          <>
            <Button href={`/cafes/${id}`}>Edit</Button>
            <Button
              onClick={() => {
                dispatch(deleteCafes(id)).then(() => {
                  dispatch(fetchCafes()); // Fetch cafes again after deletion
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
        <h1>Cafe Manager</h1>{" "}
        <Button variant="contained" href="/cafes/add">
          Add Cafe
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

export default Cafe;
