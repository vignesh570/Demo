import { Project } from "../project";

export type ProjectResponse = {
  statusCode: number;
  message: string;
  page: number;
  search: string;
  loading: boolean;
  data: ProjectResponseData | null;
};

export type ProjectResponseData = {
  from: number;
  to: number;
  totalCount: number;
  totalPages: number;
  data: Project[] | null;
};
