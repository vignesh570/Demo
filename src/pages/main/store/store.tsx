/* eslint-disable react-refresh/only-export-components */
import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../dashboard/dashboard-slice";
import projectReducer from "../project/project-slice";
import taskReducer from "../task/task-slice";
import usersReducer from "../user/user-slice";

export default configureStore({
  reducer: {
    usersAll: usersReducer,
    projectAll: projectReducer,
    dashboard: dashboardReducer,
    task: taskReducer,
  },
});
