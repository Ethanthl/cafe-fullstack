import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Cafe, CafeState } from "./cafeTypes";

const API_BASE_URL = "http://localhost:5000/api";
//Fetch cafes
export const fetchCafes = createAsyncThunk(
  "fetchCafes",
  async (data: string | null, thunkAPI) => {
    const location = data;
    const response = await axios.get(
      `${API_BASE_URL}/cafe?location=${location}`
    );

    return await response.data;
  }
);

//Fetch individual cafe
export const fetchIndividualCafe = createAsyncThunk(
  "fetchIndividualCafes",
  async (data: string, thunkAPI) => {
    const id = data;
    const response = await axios.get(`${API_BASE_URL}/cafe/${id}`);

    return await response.data;
  }
);
//Delete cafes
export const deleteCafes = createAsyncThunk(
  "deleteCafes",
  async (message: string | undefined, thunkAPI) => {
    const cafeId = message;
    const response = await axios.delete(
      `http://localhost:5000/api/cafe/${cafeId}/`
    );

    return await response.data;
  }
);

export const addCafe = createAsyncThunk(
  "addCafe",
  async (data: Cafe, thunkAPI) => {
    try {
      //remove id and employees from form data as it is not needed
      const propertiesToRemove = ["id", "employees"];
      const newData = Object.fromEntries(
        Object.entries(data).filter(
          ([key]) => !propertiesToRemove.includes(key)
        )
      );
      const response = await axios.post(`${API_BASE_URL}/cafe/`, newData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(await response);
      return await response.data.cafe;
    } catch (error) {
      console.log(error);
    }
  }
);

export const editCafe = createAsyncThunk(
  "editCafe",
  async (data: Cafe, thunkAPI) => {
    try {
      //remove id and employees from form data as it is not needed
      const id = data.id;
      const propertiesToRemove = ["id", "employees"];
      const newData = Object.fromEntries(
        Object.entries(data).filter(
          ([key]) => !propertiesToRemove.includes(key)
        )
      );
      console.log(newData);
      const response = await axios.put(`${API_BASE_URL}/cafe/${id}`, newData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(await response);
      return await response.data.cafe;
    } catch (error) {
      console.log(error);
    }
  }
);

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
      })
      .addCase(fetchIndividualCafe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndividualCafe.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchIndividualCafe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cafeSlice.reducer;
