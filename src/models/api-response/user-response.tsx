import { User } from "../user";

export type UserResponse = {
  statusCode: number;
  message: string;
  page: number;
  search: string;
  loading: boolean;
  data: UserResponseData | null;
};

export type UserResponseData = {
  from: number;
  to: number;
  totalCount: number;
  totalPages: number;
  data: User[] | null;
};
