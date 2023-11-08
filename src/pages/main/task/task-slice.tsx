/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiProvider from "../../../network/api-provider";
import {
  TaskResponse,
  TaskResponseData,
} from "../../../models/api-response/task-response";

export type TaskRootState = {
  task: TaskResponse;
};
// Define the initial state interface
interface TaskState {
  page: number;
  search: string;
  status: number;
  type: number;
  isFilterApplied: boolean;
  user: number;
  loading: boolean;
  data: TaskResponseData[]; // Replace with your user data structure
}

export const initialState: TaskState = {
  page: 1,
  search: "",
  loading: false,
  data: [],
  status: 0,
  type: 0,
  user: 0,
  isFilterApplied: false,
};

export const getAllTask: any = createAsyncThunk(
  "task",
  async ({ params, id }: any) => {
    const response = await apiProvider.fetchTask(params, id);
    if (response != null) {
      return response?.data;
    }
  }
);

const taskDataSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsFilterApplied: (state, action) => {
      state.isFilterApplied = action.payload;
    },
    resetTaskState: (state) => {
      state.page = initialState.page;
      state.search = initialState.search;
      state.status = initialState.status;
      state.type = initialState.type;
      state.user = initialState.user;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getAllTask.pending, (state) => {
      state.loading = true; // Set loading to true during the API request
    });
    builder.addCase(getAllTask.fulfilled, (state: any, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getAllTask.rejected, (state) => {
      state.loading = false; // Set loading to false on request rejection or failure
    });
  },
});

export default taskDataSlice.reducer;
export const {
  setPage,
  setSearch,
  setStatus,
  setType,
  setUser,
  setIsFilterApplied,
  resetTaskState,
} = taskDataSlice.actions;
