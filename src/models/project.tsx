export type Project = {
  id: number;
  title: string;
  description: string;
  user: ProjectUsers | null;
  createdAt: string;
};

export type ProjectUsers = {
  firstName: string;
  lastName: string;
};
