/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiProvider from "../../../network/api-provider";

// Define the initial state interface
interface DashboardStateData {
  type: string;
  date: undefined;
  isFilterApplied: boolean;
  data: any[]; // Replace with your user data structure
}

export const initialState: DashboardStateData = {
  type: "Today",
  date: undefined,
  data: [],
  isFilterApplied: false,
};

const dashboardDataSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setIsFilterApplied: (state, action) => {
      state.isFilterApplied = action.payload;
    },
    resetDashboardState: (state) => {
      state.type = initialState.type;
      state.date = initialState.date;
      state.isFilterApplied = initialState.isFilterApplied;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDashboard.fulfilled, (state: any, action) => {
      state.data = action.payload;
    });
  },
});

export const getDashboard: any = createAsyncThunk(
  "dashboard",
  async (params: any) => {
    const response = await apiProvider.getDashboard(params);
    if (response != null) {
      return response?.data?.data;
    }
  }
);

export default dashboardDataSlice.reducer;
export const { setDate, setType, setIsFilterApplied, resetDashboardState } =
  dashboardDataSlice.actions;
