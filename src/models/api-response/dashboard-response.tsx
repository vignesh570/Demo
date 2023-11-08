import { Dashboard } from "../dashboard";

export type DashboardResponse = {
  message: string;
  statusCode: number;
  data: Dashboard | null;
};
