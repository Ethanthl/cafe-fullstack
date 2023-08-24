import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
const API_BASE_URL = "http://localhost:5000/api";
export interface Employee {
  id: string | null;
  name: string;
  email_address: string;
  phone_number: string;
  gender: string;
  cafe_id: string | null;
  cafe_name: string | null;
  days_worked: string | null;
}

export interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

//fetch employee
export const fetchEmployees = createAsyncThunk(
  "fetchEmployees",
  async (data: string | null, thunkAPI) => {
    const cafeId = data ? data : "";

    const response = await axios.get(
      `${API_BASE_URL}/employees?cafe=${cafeId}`
    );
    return await response.data;
  }
);
//fetch Single employee
export const fetchSingleEmployee = createAsyncThunk(
  "fetchSingleEmployee",
  async (data: string, thunkAPI) => {
    const employeeId = data;
    const response = await axios.get(`${API_BASE_URL}/employee/${employeeId}`);

    return await response.data;
  }
);

export const addEmployee = createAsyncThunk(
  "employees/add",
  async (data: Employee, thunkAPI) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/employee`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const editEmployee = createAsyncThunk(
  "employees/edit",
  async (data: Employee, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/employee/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (employeeId: string, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE_URL}/employee/${employeeId}`);
      return employeeId; // Return the ID to remove it from the state
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    employees: null as EmployeeState | null,
    loading: false,
    error: "",
  },
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSingleEmployee.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchSingleEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchSingleEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.loading = false;

        state.employees?.employees.push(action.payload); // Corrected using Immer-friendly syntax
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editEmployee.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(editEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const updatedEmployee = action.payload;

        if (state.employees !== null) {
          const index = state.employees.employees.findIndex(
            (employee) => employee.id === updatedEmployee.id
          );
          console.log(updatedEmployee);
          if (index !== -1) {
            state.employees.employees[index] = updatedEmployee;
          }
        }
      })
      .addCase(editEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const employeeId = action.payload;

        if (state.employees !== null) {
          state.employees.employees = state.employees.employees.filter(
            (employee) => employee.id !== employeeId
          );
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default employeeSlice.reducer;
