/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Modal, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditCircle } from "tabler-icons-react";
import apiProvider from "../../../network/api-provider";
import { getAllProject, ProjectRootState } from "./project-slice";

function UpdateProject({ project }: any) {
  const [opened, setOpened] = useState(false);
  const dispatch = useDispatch();
  const { page, search } = useSelector(
    (state: ProjectRootState) => state.projectAll
  );

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
    const data = {
      title: values.title,
      description: values.description,
    };
    const result = await apiProvider.updateProject(data, project?.id);
    if (result != null) {
      setOpened(false);
      clearForm();
      dispatch(getAllProject({ page, search }));
    }
  };

  const clearForm = () => {
    form.reset();
  };

  function setData() {
    form.setFieldValue("title", project?.title);
    form.setFieldValue("description", project?.description);
  }

  useEffect(() => {
    if (opened) {
      setData();
    }
  }, [opened]);

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
                <Button type="submit">Update</Button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
      <Button
        leftSection={<EditCircle size={16} />}
        variant="light"
        color="teal"
        size="xs"
        onClick={() => setOpened(true)}
        className={""}
      >
        <div>Edit</div>
      </Button>
    </div>
  );
}
export default UpdateProject;
