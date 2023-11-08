// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";

import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Provider } from "react-redux";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import store from "./pages/main/store/store";

export default function App() {
  return (
    <div className="bg-sky-50">
      <Provider store={store}>
        <MantineProvider
          theme={{
            colors: {
              primary: [
                "#f0fdfa",
                "#ccfbf1",
                "#99f6e4",
                "#5eead4",
                "#2dd4bf",
                "#14b8a6",
                "#0d9488",
                "#0f766e",
                "#115e59",
                "#134e4a",
              ],
            },
            primaryColor: "primary",
            fontFamily: "Readex Pro, sans-serif",
            headings: {
              fontFamily: "Readex Pro, sans-serif",
            },
          }}
        >
          <ModalsProvider>
            <Notifications />
            <AuthProvider>
              <Outlet />
            </AuthProvider>
          </ModalsProvider>
        </MantineProvider>
      </Provider>
    </div>
  );
}
