/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Menu } from "@mantine/core";

import { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  Logout,
  Notebook,
  User,
} from "tabler-icons-react";
import { AuthContext } from "../context/auth-context";

export default function Navbar() {
  const authContext = useContext(AuthContext);

  function logout() {
    authContext?.logout();
  }

  const navLinkClass = ({ isActive }: any) =>
    isActive ? "nav-link-active" : "nav-link";

  return (
    <div className="flex space-x-2 shadow-sm w-full self-center items-center bg-gradient-to-b from-teal-400 to-teal-500 z-40 px-2 fixed top-0 left-0 right-0">
      <div className="w-full flex flex-col ">
        <div className="w-full flex justify-between items-center pl-2 py-1">
          <div className="flex flex-row items-center space-x-2">
            <div className="text-white text-lg font-medium tracking-wide pl-1.5">
              Sterna - Jira
            </div>
          </div>
          <Menu position="bottom-end" shadow="md" width={240}>
            <Menu.Target>
              <Button
                variant="subtle"
                className="text-white hover:bg-teal-500 text-sm+ font-normal"
                rightSection={<ChevronDown size={16} />}
              >
                {"Welcome - "}
                {localStorage.getItem("firstName")}{" "}
                {localStorage.getItem("lastName")}
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                className="font-normal"
                onClick={logout}
                color="red"
                leftSection={<Logout size={16} />}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>

        <div className="w-full h-full flex items-end justify-start pl-1 pt-0.5 space-x-3 shadow-soft">
          <NavLink to="/dashboard" className={navLinkClass}>
            <div className="flex  items-center space-x-1">
              <LayoutDashboard size={16} />
              <div className="font-normal">Dashboard</div>
            </div>
          </NavLink>
          <NavLink to="/" className={navLinkClass}>
            <div className="flex  items-center space-x-1">
              <User size={16} />
              <div className="font-normal">User</div>
            </div>
          </NavLink>
          <NavLink to="/project" className={navLinkClass}>
            <div className="flex items-center space-x-1">
              <Notebook size={16} />
              <div className="font-normal">Project</div>
            </div>
          </NavLink>
          {/* <NavLink to="/result" className={navLinkClass}>
            <div className="flex items-center space-x-1">
              <Report size={16} />
              <div className="font-normal">Result</div>
            </div>
          </NavLink> */}
        </div>
      </div>
    </div>
  );
}
