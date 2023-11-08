import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/login/login";
import DashboardPage from "./pages/main/dashboard/dashboard";
import MainPage from "./pages/main/main";
import ProjectPage from "./pages/main/project/project";
import TaskPage from "./pages/main/task/task";
import UserPage from "./pages/main/user/user";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<MainPage />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<UserPage />} />
        <Route path="project" element={<Outlet />}>
          <Route path="" element={<ProjectPage />} />
          <Route path=":id" element={<TaskPage />} />
        </Route>
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<RouterProvider router={router} />);
