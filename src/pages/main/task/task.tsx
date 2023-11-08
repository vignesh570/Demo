/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionIcon, Button, Input } from "@mantine/core";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "tabler-icons-react";
import Protected from "../../../components/protected";
import TaskFilter from "./task-filter";
import {
  TaskRootState,
  resetTaskState,
  setPage,
  setSearch,
} from "./task-slice";
import TaskTable from "./task-table";

function TaskPage() {
  const dispatch = useDispatch();
  const searchRef = useRef<HTMLInputElement>(null);
  const state = useSelector((state: TaskRootState) => state.task);

  const handleSearchChange = () => {
    dispatch(setSearch(searchRef?.current?.value ?? ""));
    dispatch(setPage(1));
  };

  useEffect(() => {
    if (searchRef.current != null) {
      searchRef.current.value = state.search;
    }
  }, [state]);

  useEffect(() => {
    dispatch(resetTaskState());
  }, []);

  return (
    <Protected>
      <div className="card px-6 pt-4 pb-6 space-y-4 mt-3">
        <div className="flex flex-row justify-between items-center space-x-4">
          <div className="flex flex-row space-x-3">
            <div>
              <Link to={"/project"}>
                <ActionIcon variant="light" radius="xl">
                  <ArrowLeft />
                </ActionIcon>
              </Link>
            </div>
            <div className="text-xl font-bold text-black">Task</div>
          </div>
          <div className="flex flex-row justify-between items-end space-x-4">
            <TaskFilter />
            <Input
              ref={searchRef}
              variant="filled"
              placeholder="Search"
              leftSection={<Search size={16} />}
            />
            <Button onClick={handleSearchChange} size="sm">
              Search
            </Button>
          </div>
        </div>
        <TaskTable />
      </div>
    </Protected>
  );
}

export default TaskPage;
