/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiProvider from "../../../network/api-provider";
import {
  ProjectResponse,
  ProjectResponseData,
} from "../../../models/api-response/project-response";

export type ProjectRootState = {
  projectAll: ProjectResponse;
};

// Define the initial state interface
interface ProjectStateData {
  page: number;
  search: string;
  loading: boolean;
  data: ProjectResponseData[]; // Replace with your user data structure
}

export const initialState: ProjectStateData = {
  page: 1,
  search: "",
  loading: false,
  data: [],
};

export const getAllProject: any = createAsyncThunk(
  "project/getAllProject",
  async (params) => {
    const response = await apiProvider.fetchProjectData(params);
    if (response != null) {
      return response?.data?.data ?? [];
    }
  }
);

const projectDataSlice = createSlice({
  name: "projectAll",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    resetProjectState: (state) => {
      state.page = initialState.page;
      state.search = initialState.search;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllProject.pending, (state) => {
      state.loading = true; // Set loading to true during the API request
    });
    builder.addCase(getAllProject.fulfilled, (state: any, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getAllProject.rejected, (state) => {
      state.loading = false; // Set loading to false on request rejection or failure
    });
  },
});

export default projectDataSlice.reducer;
export const { setPage, setSearch, resetProjectState } =
  projectDataSlice.actions;
