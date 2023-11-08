/* eslint-disable @typescript-eslint/no-explicit-any */
import { cleanNotifications, showNotification } from "@mantine/notifications";
import axios from "axios";

const ApiClient = axios.create({
  baseURL: "http://192.168.16.134:4444/api/",
});

export const imageUrl = "http://192.168.16.134:4444/task/";

// Request interceptor for API calls
ApiClient.interceptors.request.use(
  async (config: any) => {
    const token = await localStorage.getItem("token");
    config.headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
ApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    if (error.response.status === 401 || error.response.status === 403) {
      localStorage.clear();
      cleanNotifications();
      const message =
        "Your current session expired. Login Again to start your new session.";
      showNotification({
        color: "red",
        title: "Session Expired",
        message,
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
    return Promise.reject(error);
  }
);
export default ApiClient;
