/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { showNotification } from "@mantine/notifications";
import { AxiosError } from "axios";
import ApiClient from "./api-client";
import { ProjectResponse } from "../models/api-response/project-response";
import { UserResponse } from "../models/api-response/user-response";
import { TaskResponse } from "../models/api-response/task-response";
import { AddUserRequest } from "../models/api-request/add-user-request";
import { GenericResponse } from "../models/api-response/generic-response";
import { UpdateUserRequest } from "../models/api-request/update-user-request";
import { TaskRequest } from "../models/api-request/add-task-request";
import { UpdateTaskRequest } from "../models/api-request/update-task-request";
import { UpdateProjectRequest } from "../models/api-request/update-project-request";
import { AddProjectRequest } from "../models/api-request/add-project-request";
import { DashboardResponse } from "../models/api-response/dashboard-response";

interface ErrorResponse {
  message: string;
}

class ApiProvider {
  showAlert(message: string, success: boolean) {
    showNotification({
      color: success ? "green" : "red",
      title: success ? "Success" : "Error",
      message,
    });
  }

  axiosError(error: AxiosError<ErrorResponse> | Error) {
    let message = "Something went wrong";
    if (error instanceof AxiosError && error.response) {
      message = error.response.data?.message ?? message;
    } else {
      message = error.toString();
    }
    this.showAlert(message, false);
  }

  async fetchUserData(params: any) {
    try {
      const result = await ApiClient.get<UserResponse | null>("user", {
        params: params,
      });
      const statusCode = result.status ?? 0;
      const message = "Something went wrong";
      if (statusCode === 200 || statusCode === 201) {
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async addUser(data: AddUserRequest) {
    try {
      const result = await ApiClient.post<GenericResponse | null>(
        "/user",
        data
      );
      let statusCode = result.status ?? 0;
      let message = result.data?.message ?? "something went Wrong";
      if (statusCode == 200 || statusCode == 201) {
        message = "User added successfully";
        this.showAlert(message, true);
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async EditUser(userId: number, data: UpdateUserRequest) {
    try {
      const result = await ApiClient.patch<GenericResponse | null>(
        `/user/${userId}`,
        data
      );
      let statusCode = result.status ?? 0;
      let message = result.data?.message ?? "something wennt wrong";
      if (statusCode == 200 || statusCode == 201) {
        message = "User details updated successfully";
        this.showAlert(message, true);
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async fetchProjectData(params: any) {
    try {
      const result = await ApiClient.get<ProjectResponse | null>("project", {
        params: params,
      });
      const statusCode = result.status ?? 0;
      const message = "Something went wrong";
      if (statusCode === 200 || statusCode === 201) {
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async createProject(data: AddProjectRequest) {
    try {
      const result = await ApiClient.post<GenericResponse | null>(
        "/project",
        data
      );
      let statusCode = result.status ?? 0;
      let message = result.data?.message ?? "something went Wrong";
      if (statusCode == 200 || statusCode == 201) {
        message = "Project added successfully";
        this.showAlert(message, true);
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async getDashboard(params: any) {
    try {
      const result = await ApiClient.get<DashboardResponse | null>(
        "dashBoard",
        {
          params: params,
        }
      );
      const statusCode = result.status ?? 0;
      const message = "Something went wrong";
      if (statusCode === 200 || statusCode === 201) {
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async fetchTask(params: any, taskId: number) {
    try {
      const result = await ApiClient.get<TaskResponse | null>(
        `task/all/${taskId}`,
        {
          params: params,
        }
      );
      const statusCode = result.status ?? 0;
      let message = result.data?.message ?? "Something went wrong";
      if (statusCode === 200 || statusCode === 201) {
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async createTask(data: TaskRequest) {
    try {
      const result = await ApiClient.post<GenericResponse | null>(
        "/task",
        data
      );
      let statusCode = result.status ?? 0;
      let message = result.data?.message ?? "something went Wrong";
      if (statusCode == 200 || statusCode == 201) {
        message = "Task added successfully";
        this.showAlert(message, true);
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async updateTask(data: UpdateTaskRequest, taskId: number) {
    try {
      const result = await ApiClient.patch<GenericResponse | null>(
        `task/${taskId}`,
        data
      );
      const statusCode = result.status ?? 0;
      let message = result.data?.message ?? "Something went wrong";
      if (statusCode === 200 || statusCode === 201) {
        message = "Task  updated successfully";
        this.showAlert(message, true);
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async updateProject(data: UpdateProjectRequest, projectId: number) {
    try {
      const result = await ApiClient.patch<GenericResponse | null>(
        `project/${projectId}`,
        data
      );
      const statusCode = result.status ?? 0;
      let message = result.data?.message ?? "Something went wrong";
      if (statusCode === 200 || statusCode === 201) {
        message = "Project updated successfully";
        this.showAlert(message, true);
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async deleteImage(index: number) {
    try {
      const result = await ApiClient.patch<GenericResponse | null>(
        `/task/image/${index}`
      );
      const statusCode = result.status ?? 0;
      let message = result.data?.message ?? "Something went wrong";
      if (statusCode === 200 || statusCode === 201) {
        message = "Project updated successfully";
        this.showAlert(message, true);
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }
}

const apiProvider = new ApiProvider();

export default apiProvider;
