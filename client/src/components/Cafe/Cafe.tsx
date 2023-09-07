import React, { useEffect } from "react";
import "./Cafe.scss";
import { useAppDispatch } from "../../app/hooks";
import { deleteCafes, fetchCafes } from "../../features/cafe/cafeSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

import Grid from "../Grid";
import { ColDef } from "ag-grid-community";
import Swal from "sweetalert2";

import { Container, Box, Button, Autocomplete, TextField } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
const Cafe = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cafeLocation = queryParams.get("location")
    ? queryParams.get("location")
    : "";
  // Fetch cafes on component mount
  useEffect(() => {
    dispatch(fetchCafes(cafeLocation));
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
                    dispatch(deleteCafes(id)).then(() => {
                      dispatch(fetchCafes(cafeLocation)); // Fetch cafes again after deletion
                    });
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
        <h1>Cafe Manager</h1>{" "}
        <Button variant="contained" href="/cafes/add">
          Add Cafe
        </Button>
      </Box>
      <form style={{ display: "flex", alignItems: "center"}}>
        <TextField
          id="location"
          name="location"
          label="Enter Location"
          variant="outlined"

        />
        <Button type="submit" variant="contained" color="primary" sx={{marginLeft: "1rem", height: "fit-content", padding: "1rem"}}>
          Search
        </Button>
      </form>
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
