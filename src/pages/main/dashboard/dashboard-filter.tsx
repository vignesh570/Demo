/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Drawer, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Filter } from "tabler-icons-react";
import apiProvider from "../../../network/api-provider";
import {
  getDashboard,
  setDate,
  setIsFilterApplied,
  setType,
} from "./dashboard-slice";

function DashboardFilter() {
  const dispatch = useDispatch();
  const types = ["Today", "Yesterday", "Month Till Date", "Date Range"];
  const { type, date, isFilterApplied } = useSelector(
    (state: any) => state.dashboard
  );
  useEffect(() => {
    const data = {
      startDate: date == null ? null : moment(date[0]).format("YYYY-MM-DD"),
      endDate: date == null ? null : moment(date[1]).format("YYYY-MM-DD"),
      dateFilter: type.replaceAll(" ", ""),
    };
    dispatch(getDashboard(data));
  }, [dispatch, isFilterApplied]);

  const [opened, setOpened] = useState(false);

  const changeType = (type: any) => {
    dispatch(setType(type));
    dispatch(setDate(undefined));
  };

  const changeDate = (val: any) => {
    const date = val == null || val[0] == null ? undefined : val;
    dispatch(setDate(date));
  };

  const applyFilter = (isFilterApplied: boolean) => {
    let message = "";
    if (type == "Date Range" && date == undefined) {
      message = "Select date";
      apiProvider.showAlert(message, false);
    } else {
      dispatch(setIsFilterApplied(isFilterApplied));
      setOpened(false);
    }
  };

  const clearFilter = () => {
    const defaultState = {
      type: "Today",
      date: undefined,
      isFilterApplied: false,
    };
    dispatch(setType(defaultState.type));
    dispatch(setDate(defaultState.date));
    dispatch(setIsFilterApplied(defaultState.isFilterApplied));
    setOpened(false);
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        title={<div className="text-xl font-bold">Dashboard Filter</div>}
        padding="xl"
        size="30%"
        overlayProps={{ opacity: 0.5 }}
        position="right"
      >
        <div className="flex flex-col h-screen">
          <div className="flex flex-col space-y-4">
            <Select
              value={type}
              onChange={changeType}
              label="Date Filter"
              variant="filled"
              searchable
              placeholder="Select filter"
              data={types.map((item: any) => ({
                value: item,
                label: item,
              }))}
            />
            {type == "Date Range" ? (
              <DatePickerInput
                variant="filled"
                value={date}
                maxDate={new Date()}
                onChange={changeDate}
                type="range"
                radius="xs"
                label="Pick dates"
                placeholder="Pick dates"
                withAsterisk
              />
            ) : (
              <></>
            )}
            <div className="flex flex-row pt-4 space-x-4 w-full">
              <Button
                className="w-1/2 text-gray-500 font-medium"
                color="gray.3"
                onClick={clearFilter}
              >
                Clear Filter
              </Button>
              <Button
                className="w-1/2 font-medium"
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
        className="font-bold"
        onClick={() => {
          setOpened(true);
        }}
        leftSection={<Filter size={18} />}
        variant="light"
        color={isFilterApplied ? "orange" : "blue"}
      >
        {isFilterApplied ? "Clear Filters" : "Filters"}
      </Button>
    </>
  );
}

export default DashboardFilter;
