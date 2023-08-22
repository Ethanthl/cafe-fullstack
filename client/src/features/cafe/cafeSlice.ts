import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Cafe {
  id: string;
  name: string;
  description: string;
  logo: string;
  location: string;
  employees: number;
}

export interface CafeState {
  cafes: Cafe[];
  loading: boolean;
  error: string | null;
}

//API Call to fetch weather
export const fetchCafes = createAsyncThunk("fetchCafes", async (thunkAPI) => {
  const response = await axios.get("http://localhost:5000/api/cafe");

  return await response.data;
});
export const cafeSlice = createSlice({
  name: "cafes",
  initialState: {
    data: null as CafeState | null,
    loading: false,
    error: null as string | null,
  },
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCafes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCafes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCafes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cafeSlice.reducer;
