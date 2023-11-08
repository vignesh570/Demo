/* eslint-disable @typescript-eslint/no-explicit-any */
// Import your actions here

import ApiClient from "../../../network/api-client";
import { setUsers } from "./user-slice";

export const fetchUsers = () => async (dispatch: any, getState: any) => {
  try {
    const { page, search } = getState().users;
    const response = await fetch(
      ApiClient + `/users?page=${page}&search=${search}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    dispatch(setUsers(data));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
