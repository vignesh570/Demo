/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  LoadingOverlay,
  Modal,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import apiProvider from "../../../network/api-provider";
import { UserRootState, getAllUsers } from "./user-slice";

function EditUser({ users }: any) {
  const [opened, setOpened] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { page, search } = useSelector(
    (state: UserRootState) => state.usersAll
  );

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      phoneNumber: "",
    },
    // functions will be used to validate values at corresponding key
    validate: {
      firstName: (value) => (value.length < 2 ? "Enter name" : null),
      role: (value) => (value.length > 0 ? null : "Select role"),
      lastName: (value) => (value.length < 1 ? "Enter name" : null),

      email: (value) => {
        const isValidEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
          value
        );
        if (value.length < 1) {
          return "Enter email address";
        } else if (!isValidEmail) {
          return "Invalid email address";
        }
        return null;
      },
      phoneNumber: (value) => {
        if (value.length < 1) {
          return "Enter mobile number";
        } else if (value.length != 10) {
          return "Mobile number cannot be more or less than 10 characters";
        }
        return null;
      },
    },
  });

  const onSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    const data = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      role: values.role,
      phoneNumber: values.phoneNumber,
    };
    const result = await apiProvider.EditUser(users.id, data);
    if (result != null) {
      setOpened(false);
      dispatch(getAllUsers({ page: page, search: search }));
    }
    setIsLoading(false);
  };

  function setData() {
    form.setFieldValue("firstName", users.firstName ?? "");
    form.setFieldValue("lastName", users.lastName ?? "");
    form.setFieldValue("email", users.email ?? "");
    form.setFieldValue("role", users.role ?? "");
    form.setFieldValue("phoneNumber", users.phoneNumber ?? "");
  }

  function ClearForm() {
    form.reset();
  }
  useEffect(() => {
    if (opened) {
      setData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <div>
      <Modal
        size="xl"
        opened={opened}
        onClose={() => {
          ClearForm();
          setOpened(false);
        }}
        title={<div className="text-xl p-4 font-bold">Edit User </div>}
      >
        <LoadingOverlay
          visible={isLoading}
          loaderProps={{ color: "green", type: "dots" }}
        />
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="p-4 ">
            <div className="space-y-4 flex flex-col">
              <div className="flex space-x-4">
                <div className="w-1/2 ">
                  <TextInput
                    label={
                      <div className="font-bold">
                        First Name<span className="ml-1 text-red-500">*</span>
                      </div>
                    }
                    {...form.getInputProps("firstName")}
                    variant="filled"
                    placeholder="Enter First Name"
                  />
                </div>
                <div className="w-1/2">
                  <TextInput
                    label={
                      <div className="font-bold">
                        Last Name<span className="ml-1 text-red-500">*</span>
                      </div>
                    }
                    variant="filled"
                    {...form.getInputProps("lastName")}
                    placeholder="Enter Last Name"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-full">
                  <TextInput
                    label={
                      <div className="font-bold">
                        Email<span className="ml-1 text-red-500">*</span>
                      </div>
                    }
                    variant="filled"
                    placeholder="Enter Email"
                    {...form.getInputProps("email")}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2 ">
                  <Select
                    label={
                      <div className="font-bold">
                        Role<span className="ml-1 text-red-500">*</span>
                      </div>
                    }
                    variant="filled"
                    placeholder="Select Role"
                    {...form.getInputProps("role")}
                    data={[
                      { value: "Admin", label: "Admin" },
                      { value: "User", label: "User" },
                    ]}
                  />
                </div>
                <div className="w-1/2">
                  <TextInput
                    label={
                      <div className="font-bold">
                        Mobile Number
                        <span className="ml-1 text-red-500">*</span>
                      </div>
                    }
                    variant="filled"
                    placeholder="Enter Mobile Number"
                    {...form.getInputProps("phoneNumber")}
                  />
                </div>
              </div>
              <div></div>
              <div className="flex flex-row items-end space-x-2 justify-end">
                <Button
                  color="gray"
                  onClick={() => {
                    setOpened(false), ClearForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
      <Button
        onClick={() => setOpened(true)}
        leftSection={<FaUserEdit size={14} />}
        variant="light"
        color="blue"
        size="xs"
      >
        Edit
      </Button>
    </div>
  );
}
export default EditUser;
