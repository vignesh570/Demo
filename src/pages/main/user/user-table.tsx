/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@mantine/core";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import Table from "../../../components/table";
import EditUser from "./update-user";
import UserLoader from "./user-loader";
import { UserRootState, getAllUsers, setPage } from "./user-slice";
import { User } from "../../../models/user";

function UserTable() {
  const dispatch = useDispatch();

  const { page, search, data, loading } = useSelector(
    (state: UserRootState) => state.usersAll
  );

  const onPageChanged = (page: number) => {
    dispatch(setPage(page));
  };

  useEffect(() => {
    dispatch(getAllUsers({ page, search }));
  }, [dispatch, page, search]);

  return (
    <div className="space-y-8">
      {loading ? (
        <UserLoader /> // Display the loader when data is loading
      ) : (
        <Table
          columns={[
            "S.No",
            "Name",
            "Email",
            "Mobile",
            "Role",
            "Created Date & Time",
            "Action",
          ]}
          from={data?.from ?? 0}
          to={data?.to ?? 0}
          total={data?.totalCount ?? 0}
          totalPages={data?.totalPages ?? 0}
          currentPage={page}
          onPageChanged={onPageChanged}
        >
          {data?.data?.map((item: User, i: number) => (
            <tr
              className="border-y border-transparent border-b-slate-100 "
              key={i}
            >
              <td className="table-body">{i + data.from}</td>
              <td className="table-body">
                {item.firstName} {item.lastName}
              </td>
              <td className="table-body-active">{item.email ?? "None"}</td>
              <td className="table-body">{item.phoneNumber ?? "None"}</td>
              <td className="table-body">
                <Badge
                  variant="dot"
                  color={item?.role === "Admin" ? "blue" : "red"}
                >
                  {item.role ?? "None"}
                </Badge>
              </td>
              <td className="table-body">
                {moment(item.createdAt.toString()).format(
                  "DD MMM YYYY, h:mm a"
                )}
              </td>
              <td className="table-body">
                <EditUser users={item} />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
export default UserTable;
