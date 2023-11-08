export type Task = {
  id: number;
  typeId: number;
  title: string;
  description: string;
  statusId: number;
  createdAt: string;
  userOnTeams: UserOnTeams[] | null;
};

export type UserOnTeams = {
  assignees: Assignees | null;
};

export type Assignees = {
  firstName: string;
  lastName: string;
};
