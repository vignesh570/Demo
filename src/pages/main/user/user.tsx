/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from "@mantine/core";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "tabler-icons-react";
import Protected from "../../../components/protected";
import AddUser from "./add-user";
import { UserRootState, resetState, setPage, setSearch } from "./user-slice";
import UserTable from "./user-table";

function UserPage() {
  const dispatch = useDispatch();
  const searchRef = useRef<HTMLInputElement>(null);
  const state = useSelector((state: UserRootState) => state.usersAll);

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
    dispatch(resetState());
  }, []);

  return (
    <Protected>
      <div className="card px-6 pt-4 pb-6 space-y-4 mt-3">
        <div className="flex flex-row justify-between items-center space-x-4">
          <div className="text-xl font-bold text-black">Users</div>
          <div className="flex flex-row justify-between items-end space-x-4">
            {localStorage.getItem("role") === "Admin" ? <AddUser /> : <></>}
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
        <UserTable />
      </div>
    </Protected>
  );
}

export default UserPage;
