/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Drawer, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Filter } from "tabler-icons-react";
import apiProvider from "../../../network/api-provider";
import {
  TaskRootState,
  getAllTask,
  setIsFilterApplied,
  setStatus,
  setType,
  setUser,
} from "./task-slice";

function TaskFilter() {
  const [opened, setOpened] = useState(false);
  const [userData, setUserData] = useState<any>([]);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { page, search, type, user, status, isFilterApplied } = useSelector(
    (state: TaskRootState) => state.task
  );

  async function fetchUsers() {
    const params = {
      page: 0,
      searchRef: "",
    };
    const result = await apiProvider.fetchUserData(params);
    if (result != null) {
      setUserData(result?.data?.data?.data ?? []);
    }
    return null;
  }

  const changeType = (type: any) => {
    dispatch(setType(type));
  };

  const changeStatus = (status: any) => {
    dispatch(setStatus(status));
  };

  const changeUser = (user: any) => {
    dispatch(setUser(user));
  };

  const applyFilter = (isFilterApplied: any) => {
    dispatch(setIsFilterApplied(isFilterApplied));
    setOpened(false);
  };

  const clearFilter = () => {
    const defaultState = {
      search: "",
      page: 1,
      type: 0,
      status: 0,
      user: 0,
      isFilterApplied: false,
    };
    dispatch(setType(defaultState.type));
    dispatch(setStatus(defaultState.status));
    dispatch(setUser(defaultState.user));
    dispatch(setIsFilterApplied(defaultState.isFilterApplied));
    setOpened(false);
  };

  useEffect(() => {
    if (opened) {
      fetchUsers();
    }
  }, [opened]);

  useEffect(() => {
    const data = {
      page,
      search,
      type,
      user,
      status,
    };
    dispatch(getAllTask({ params: data, id: id }));
  }, [dispatch, isFilterApplied, page, search]);

  return (
    <div>
      <Drawer
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        title={<div className="text-xl font-bold">Task Filter</div>}
        padding="xl"
        size="26%"
        overlayProps={{ opacity: 0.5 }}
        position="right"
      >
        <div style={{ position: "relative" }}>
          <div className="flex flex-col space-y-4">
            <Select
              value={type}
              onChange={changeType}
              label="Task"
              variant="filled"
              searchable
              placeholder="Select filter"
              data={[
                { value: "1", label: "Task" },
                { value: "2", label: "Bug" },
              ]}
            />
            <Select
              value={status}
              onChange={changeStatus}
              label="Status"
              variant="filled"
              searchable
              placeholder="Select filter"
              data={[
                { value: "1", label: "To Do" },
                { value: "2", label: "InProgress" },
                { value: "3", label: "Reopen" },
                { value: "4", label: "Done" },
              ]}
            />
            <Select
              value={user}
              onChange={changeUser}
              label="Assignee"
              variant="filled"
              searchable
              placeholder="Select filter"
              data={userData?.map((item: any) => ({
                value: (item.id ?? 0).toString(),
                label: `${item.firstName} ${item.lastName}` ?? "",
              }))}
            />
            <div className="flex flex-row pt-4 space-x-4 w-full">
              <Button
                className="w-1/2 text-gray-500"
                color="gray.3"
                onClick={clearFilter}
              >
                Clear Filter
              </Button>
              <Button
                className="w-1/2"
                color="primary.5"
                onClick={(e: any) => applyFilter(e)}
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
      <Button
        onClick={() => {
          setOpened(true);
        }}
        leftSection={<Filter size={18} />}
        variant="light"
        color={isFilterApplied ? "orange" : "blue"}
      >
        {isFilterApplied ? "Clear Filters" : "Filters"}
      </Button>
    </div>
  );
}

export default TaskFilter;
