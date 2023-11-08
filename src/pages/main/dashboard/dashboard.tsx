/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Loader, SimpleGrid } from "@mantine/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Protected from "../../../components/protected";
import { StatsCard } from "../../../components/stats";
import DashboardFilter from "./dashboard-filter";
import { resetDashboardState } from "./dashboard-slice";

const DashboardCard = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state: any) => state.dashboard);

  useEffect(() => {
    dispatch(resetDashboardState());
  }, []);

  return (
    <div>
      <SimpleGrid cols={5}>
        <StatsCard
          title="Total Users"
          value={(data?.users ?? 0).toString()}
          color="primary"
          shape="diamond"
        />
        <StatsCard
          title="Total Projects"
          value={(data?.projects ?? 0).toString()}
          color="orange"
          shape="octagon"
        />
        <StatsCard
          title="Total Tasks"
          value={(data?.tasks ?? 0).toString()}
          color="violet"
          shape="star"
        />
        <StatsCard
          title="Total Bugs"
          value={(data?.bugs ?? 0).toString()}
          color="amber"
          shape="hexagon"
        />
        <StatsCard
          title="Total To Do Items"
          value={(data?.toDo ?? 0).toString()}
          color="gray"
          shape="squircle"
        />
        <StatsCard
          title="Total InProgress"
          value={(data?.inProgress ?? 0).toString()}
          color="pink"
          shape="star2"
        />
        <StatsCard
          title="Total Resolved"
          value={(data?.resolved ?? 0).toString()}
          color="red"
          shape="octagon"
        />
        <StatsCard
          title="Total Reopened"
          value={(data?.reopened ?? 0).toString()}
          color="cyan"
          shape="triangle"
        />
      </SimpleGrid>
    </div>
  );
};

function Dashboard() {
  return (
    <Protected>
      <div className="card px-6 py-4 flex flex-col space-y-4">
        <div className="flex flex-row justify-between items-center space-x-4">
          <div className="text-xl font-bold text-black">Dashboard</div>
          <DashboardFilter />
        </div>
        <React.Suspense fallback={<Loader />}>
          <DashboardCard />
        </React.Suspense>
      </div>
    </Protected>
  );
}

export default Dashboard;
