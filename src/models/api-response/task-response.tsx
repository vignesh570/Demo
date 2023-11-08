import { Task } from "../task";

export type TaskResponse = {
  page: number;
  search: string;
  loading: boolean;
  statusCode: number;
  message: string;
  status: string;
  type: string;
  isFilterApplied: boolean;
  user: string;
  data: TaskResponseData | null;
};

export type TaskResponseData = {
  from: number;
  to: number;
  totalCount: number;
  totalPages: number;
  data: Task[] | null;
};
