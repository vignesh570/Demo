/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from "@mantine/core";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "tabler-icons-react";
import Protected from "../../../components/protected";
import CreateTask from "../task/add-task";
import CreateProject from "./add-project";
import {
  ProjectRootState,
  resetProjectState,
  setPage,
  setSearch,
} from "./project-slice";
import ProjectTable from "./project-table";

function ProjectPage() {
  const dispatch = useDispatch();
  const searchRef = useRef<HTMLInputElement>(null);
  const state = useSelector((state: ProjectRootState) => state.projectAll);

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
    dispatch(resetProjectState());
  }, []);

  return (
    <Protected>
      <div className="card px-6 pt-4 pb-6 space-y-4 mt-3">
        <div className="flex flex-row justify-between items-center space-x-4">
          <div className="text-xl font-bold text-black">Project</div>
          <div className="flex flex-row justify-between items-end space-x-4">
            {localStorage.getItem("role") === "Admin" ? (
              <div className="flex flex-row space-x-1">
                <CreateProject />
                <CreateTask />
              </div>
            ) : (
              <></>
            )}
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
        <ProjectTable />
      </div>
    </Protected>
  );
}

export default ProjectPage;
