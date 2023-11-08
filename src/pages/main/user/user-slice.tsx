/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiProvider from "../../../network/api-provider";
import {
  UserResponse,
  UserResponseData,
} from "../../../models/api-response/user-response";

export type UserRootState = {
  usersAll: UserResponse;
};

// Define the initial state interface
export type UsersState = {
  page: number;
  search: string;
  loading: boolean;
  data: UserResponseData[]; // Replace with your user data structure
};

export const initialState: UsersState = {
  page: 1,
  search: "",
  data: [],
  loading: false,
};

export const getAllUsers: any = createAsyncThunk(
  "users/getAllUsers",
  async (params) => {
    const response = await apiProvider.fetchUserData(params);
    if (response != null) {
      return response?.data?.data;
    }
  }
);

const usersDataSlice = createSlice({
  name: "usersAll",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    resetState: (state) => {
      state.page = initialState.page;
      state.search = initialState.search;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.pending, (state) => {
      state.loading = true; // Set loading to true during the API request
    });
    builder.addCase(getAllUsers.fulfilled, (state: any, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getAllUsers.rejected, (state) => {
      state.loading = false; // Set loading to false on request rejection or failure
    });
  },
});

export default usersDataSlice.reducer;
export const { setPage, setSearch, resetState } = usersDataSlice.actions;
