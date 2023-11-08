import { Loader } from "@mantine/core";
import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "../../components/layout";

function MainPage() {
  return (
    <React.Suspense fallback={<Loader />}>
      <Layout>
        <Outlet />
      </Layout>
    </React.Suspense>
  );
}
export default MainPage;
