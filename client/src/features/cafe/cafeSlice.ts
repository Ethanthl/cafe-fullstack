import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import dataUriToBuffer from "data-uri-to-buffer";

export interface Cafe {
  id: string | null;
  name: string;
  description: string;
  logo: any;
  location: string;
  employees: number;
}

export interface CafeState {
  cafes: Cafe[];
  loading: boolean;
  error: string | null;
}

//Fetch cafes
export const fetchCafes = createAsyncThunk("fetchCafes", async (thunkAPI) => {
  const response = await axios.get("http://localhost:5000/api/cafe/");

  return await response.data;
});

//Fetch individual cafe
export const fetchIndividualCafe = createAsyncThunk(
  "fetchIndividualCafes",
  async (data: string, thunkAPI) => {
    const id = data;
    const response = await axios.get(`http://localhost:5000/api/cafe/${id}`);

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
      const response = await axios.post(
        `http://localhost:5000/api/cafe/`,
        newData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(await response);
      return await response.data.cafe;
    } catch (error) {
      console.log(error);
    }
  }
);

export const editCafe = createAsyncThunk(
  "addCafe",
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
      const response = await axios.put(
        `http://localhost:5000/api/cafe/${id}`,
        newData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
  reducers: {

  },
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
