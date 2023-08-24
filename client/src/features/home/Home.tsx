import { Button, Container } from "@mui/material";
import React from "react";

const Home = () => {
  return (
    <Container
      sx={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Button href="/cafes"
        variant="contained"
        color="primary"
        sx={{ width: "50%", margin: "1rem" }}
      >
        Cafes
      </Button>
      <Button href="/employees" variant="contained" color="primary" sx={{ width: "50%", margin: "1rem" }}>
        Employees
      </Button>
    </Container>
  );
};

export default Home;
