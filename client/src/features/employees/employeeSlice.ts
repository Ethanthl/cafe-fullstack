import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Employee {
  id: string;
  name: string;
  email_address: string;
  phone_number: number;
  gender: string;
  cafe_name: string;
  days_worked: number;
}

export interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}
//fetch employee
export const fetchEmployees = createAsyncThunk(
  "fetchEmployees",
  async (message: string | undefined, thunkAPI) => {
    const cafeId = message;
    const response = await axios.get(
      `http://localhost:5000/api/employee?cafe=${cafeId}`
    );

    return await response.data;
  }
);
//delete employee
export const deleteEmployee = createAsyncThunk(
  "fetchEmployees",
  async (message: string | undefined, thunkAPI) => {
    const employeeId = message;
    const response = await axios.get(
      `http://localhost:5000/api/employee/${employeeId}`
    );

    return await response.data;
  }
);


export const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    data: null as EmployeeState | null,
    loading: false,
    error: null as string | null,
  },
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default employeeSlice.reducer;
