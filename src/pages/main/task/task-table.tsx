/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */

import { Badge, Tooltip } from "@mantine/core";
import moment from "moment";
import Table from "../../../components/table";
import { useDispatch, useSelector } from "react-redux";
import { SquareCheck, SquareDot } from "tabler-icons-react";
import TaskLoader from "./task-loader";
import { setPage } from "./task-slice";
import TaskEdit from "./update-task";
import { Task, UserOnTeams } from "../../../models/task";

function TaskTable() {
  const dispatch = useDispatch();
  const { page, data, loading } = useSelector((state: any) => state.task);

  const onPageChanged = (page: any) => {
    dispatch(setPage(page));
  };

  function statusColor(item: Task) {
    if (item.statusId === 1) {
      return "violet";
    } else if (item.statusId === 2) {
      return "blue";
    } else if (item.statusId === 3) {
      return "red";
    }
    return "green";
  }

  function statusCode(item: Task) {
    if (item.statusId === 1) {
      return "To Do";
    } else if (item.statusId === 2) {
      return "Inprogress";
    } else if (item.statusId === 3) {
      return "Reopen";
    }
    return "Done";
  }

  return (
    <div className="space-y-8">
      {loading ? (
        <TaskLoader />
      ) : (
        <Table
          columns={[
            "S.No",
            "Task Type",
            "Title",
            "Assignee",
            "Description",
            "status",
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
          {data?.data?.map((item: Task, i: number) => (
            <tr
              className="border-y border-transparent border-b-slate-100 "
              key={i}
            >
              <td className="table-body">{i + data.from}</td>
              <td className="table-body">
                {item.typeId === 1 ? (
                  <Tooltip label="Task">
                    <div>
                      <SquareCheck size={20} color="blue" />
                    </div>
                  </Tooltip>
                ) : (
                  <Tooltip label="Bug">
                    <div>
                      <SquareDot size={20} color="red" />
                    </div>
                  </Tooltip>
                )}
              </td>
              <td className="table-body-active">{item.title ?? "None"}</td>

              <td className="table-body">
                {item.userOnTeams
                  ?.map(
                    (e: UserOnTeams) =>
                      `${e.assignees?.firstName ?? "None"} ${
                        e.assignees?.lastName ?? "None"
                      }`
                  )
                  .join(" , ")}
              </td>
              <td className="table-body-active">
                {item.description ?? "None"}
              </td>
              <td className="table-body">
                {" "}
                <Badge variant="dot" color={statusColor(item)}>
                  {statusCode(item)}
                </Badge>
              </td>
              <td className="table-body">
                {moment(item.createdAt.toString()).format(
                  "DD MMM YYYY, h:mm a"
                )}
              </td>
              <td className="table-body">
                <TaskEdit task={item} />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
export default TaskTable;
