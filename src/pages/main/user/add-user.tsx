import {
  Button,
  LoadingOverlay,
  Modal,
  PasswordInput,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { useDispatch } from "react-redux";
import apiProvider from "../../../network/api-provider";
import { resetState } from "./user-slice";

function AddUser() {
  const [opened, setOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      mobile: "",
    },
    // functions will be used to validate values at corresponding key
    validate: {
      firstName: (value) => {
        const isSpecialCharacter = /[^a-zA-Z]/.test(value);
        if (value.length > 30) {
          return "First name cannot be more than 30 characters";
        } else if (value.length < 1) {
          return "Enter first name";
        } else if (isSpecialCharacter) {
          return "First name should not contain special characters and numeric value";
        }
        return null;
      },
      role: (value) => (value.length > 0 ? null : "Select role"),
      lastName: (value) => {
        const isSpecialCharacter = /[^a-zA-Z]/.test(value);
        if (value.length > 30) {
          return "Last name cannot be more than 30 characters";
        } else if (value.length < 1) {
          return "Enter last name";
        } else if (isSpecialCharacter) {
          return "Last name should not contain special characters and numeric value";
        }
        return null;
      },
      password: (value) => {
        const isNumber = /[0-9]/.test(value);
        const isLowerCase = /[a-z]/.test(value);
        const isUppercase = /[A-Z]/.test(value);
        const isSpecialCharacter = /[^a-zA-Z0-9]/.test(value);
        if (value.length > 20) {
          return "Password cannot be more than 25 characters";
        } else if (value.length < 1) {
          return "Enter password";
        } else if (!isLowerCase) {
          return "Password should contain atleast one lowercase";
        } else if (!isNumber) {
          return "Password should contain atleast one number";
        } else if (!isUppercase) {
          return "Password should contain atleast one uppercase";
        } else if (!isSpecialCharacter) {
          return "Password should contain atleast one special character";
        } else if (value.length < 8) {
          return "Password should contain atleast 8 characters";
        } else {
          return null;
        }
      },
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
      mobile: (value) => {
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
      phoneNumber: values.mobile,
      password: values.password,
    };
    const result = await apiProvider.addUser(data);
    if (result != null) {
      setOpened(false);
      dispatch(resetState());
      ClearForm();
    }
    setIsLoading(false);
  };

  function ClearForm() {
    form.reset();
  }

  return (
    <div>
      <Modal
        size="xl"
        opened={opened}
        onClose={() => {
          ClearForm();
          setOpened(false);
        }}
        title={<div className="text-xl p-4 font-bold">Add User </div>}
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
                <div className="w-full ">
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
                  <PasswordInput
                    label={
                      <div className="font-bold">
                        Password<span className="ml-1 text-red-500">*</span>
                      </div>
                    }
                    variant="filled"
                    placeholder="Enter password"
                    {...form.getInputProps("password")}
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
                    {...form.getInputProps("mobile")}
                  />
                </div>
              </div>
              <div>
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
              <div className="flex flex-row items-end space-x-2 justify-end">
                <Button
                  color="gray"
                  onClick={() => {
                    setOpened(false), ClearForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
      <Button
        onClick={() => setOpened(true)}
        leftSection={<BiPlus size={16} />}
        variant="light"
        color="blue"
      >
        Add User
      </Button>
    </div>
  );
}
export default AddUser;
