/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  LoadingOverlay,
  Modal,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Folder } from "tabler-icons-react";
import apiProvider from "../../../network/api-provider";
import { resetProjectState } from "./project-slice";

function CreateProject() {
  const [opened, setOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const form = useForm({
    validateInputOnChange: true,
    initialValues: { title: "", description: "" },
    // functions will be used to validate values at corresponding key
    validate: {
      title: (value) => (value.length < 2 ? "Enter Project name" : null),
      description: (value) => (value.length < 2 ? "Enter description" : null),
    },
  });

  const onSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    const data = {
      title: values.title,
      description: values.description,
      projectCreatorId: Number(userId),
    };
    const result = await apiProvider.createProject(data);
    if (result != null) {
      setOpened(false);
      dispatch(resetProjectState());
      clearForm();
    }
    setIsLoading(false);
  };

  const clearForm = () => {
    form.reset();
  };

  return (
    <div>
      <Modal
        size="xl"
        opened={opened}
        onClose={() => {
          clearForm();
          setOpened(false);
        }}
        title={<div className="text-xl p-4 font-bold">Create Project</div>}
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
                        Project Name<span className="ml-1 text-red-500">*</span>
                      </div>
                    }
                    {...form.getInputProps("title")}
                    variant="filled"
                    placeholder="Enter Project name"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-full">
                  <Textarea
                    label={
                      <div className="font-bold">
                        Description<span className="ml-1 text-red-500">*</span>
                      </div>
                    }
                    variant="filled"
                    placeholder="Enter description"
                    {...form.getInputProps("description")}
                  />
                </div>
              </div>

              <div className="flex flex-row items-end space-x-2 justify-end">
                <Button
                  color="gray"
                  onClick={() => {
                    setOpened(false), clearForm();
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
        leftSection={<Folder size={16} />}
        variant="light"
        color="teal"
        onClick={() => setOpened(true)}
        className={""}
      >
        <div>Create Project</div>
      </Button>
    </div>
  );
}
export default CreateProject;
