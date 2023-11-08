/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@mantine/core";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Eye } from "tabler-icons-react";
import Table from "../../../components/table";
import ProjectLoader from "./project-loader";
import { ProjectRootState, getAllProject, setPage } from "./project-slice";
import UpdateProject from "./update-project";
import { Project } from "../../../models/project";

function ProjectTable() {
  const dispatch = useDispatch();

  const { page, search, data, loading } = useSelector(
    (state: ProjectRootState) => state.projectAll
  );

  function onPageChanged(page: any) {
    dispatch(setPage(page));
  }

  useEffect(() => {
    dispatch(getAllProject({ page, search }));
  }, [dispatch, page, search]);

  return (
    <div className="space-y-8">
      {loading ? (
        <ProjectLoader />
      ) : (
        <Table
          columns={[
            "S.No",
            "Title",
            "description",
            "created By",
            "created At",
            "Action",
          ]}
          from={data?.from ?? 0}
          to={data?.to ?? 0}
          total={data?.totalCount ?? 0}
          totalPages={data?.totalPages ?? 0}
          currentPage={page}
          onPageChanged={onPageChanged}
        >
          {data?.data?.map((item: Project, i: number) => (
            <tr
              className="border-y border-transparent border-b-slate-100 "
              key={i}
            >
              <td className="table-body">{i + data.from}</td>
              <td className="table-body">{item.title ?? "None"}</td>
              <td className="table-body-active">
                {" "}
                {item.description ?? "None"}
              </td>
              <td className="table-body">
                {item.user?.firstName} {item.user?.lastName ?? "None"}
              </td>
              <td className="table-body">
                {moment(item.createdAt.toString()).format(
                  "DD MMM YYYY, h:mm a"
                )}
              </td>
              <td className="table-body">
                <div className="flex flex-row space-x-3">
                  <Link to={"/project/" + item.id}>
                    <Button
                      variant="light"
                      leftSection={<Eye size={16} />}
                      color="blue"
                      size="xs"
                    >
                      View
                    </Button>
                  </Link>
                  <UpdateProject project={item} />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
export default ProjectTable;
