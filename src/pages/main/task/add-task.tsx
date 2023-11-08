/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prefer-const */
import {
  ActionIcon,
  Button,
  FileButton,
  Image,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Select,
  SimpleGrid,
  TextInput,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { ImAttachment } from "react-icons/im";
import { Plus, Trash } from "tabler-icons-react";
import apiProvider from "../../../network/api-provider";
import { useDispatch } from "react-redux";
import { resetProjectState } from "../project/project-slice";

function CreateTask() {
  const [opened, setOpened] = useState(false);
  const [imageUrls, setImageUrls] = useState<String[]>([]);
  const [file, setFile] = useState<File[]>([]);
  const userId: any = localStorage.getItem("userId");
  const [userData, setUserData] = useState<any[]>([]);
  const [projectData, setProjectData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      description: "",
      taskAssigneeId: [],
      projectId: "",
      tasktitle: "",
      typeId: "",
    },
    // functions will be used to validate values at corresponding key
    validate: {
      projectId: (value) =>
        value != null && value.length > 0 ? null : "Select Project Name",
      typeId: (value) =>
        value != null && value.length > 0 ? null : "Select Type",

      description: (value) => (value.length < 2 ? "Enter description" : null),
      taskAssigneeId: (value) =>
        value != null && value.length > 0 ? null : "Select Name",
      tasktitle: (value) => (value.length < 2 ? "Enter title" : null),
    },
  });

  const onSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const formData: any = new FormData();
    file.forEach((file) => {
      formData.append("files", file);
    });
    values?.taskAssigneeId.forEach((item, index) => {
      formData.append(`taskAssigneeId[${index}]`, item);
    });
    formData.append("title", values.tasktitle);
    formData.append("description", values.description);
    formData.append("projectId", +values.projectId);
    formData.append("taskCreatorId", +userId);
    formData.append("typeId", +values.typeId);
    const result = await apiProvider.createTask(formData);
    if (result != null) {
      setOpened(false);
      ClearForm();
      dispatch(resetProjectState());
    }
    setLoading(false);
  };

  function ClearForm() {
    form.reset();
    setFile([]);
    setImageUrls([]);
  }

  async function fetchUsers() {
    const params = {
      page: 0,
      searchRef: "",
    };
    const result = await apiProvider.fetchUserData(params);
    if (result != null) {
      setUserData(result?.data?.data?.data ?? []);
    }
    return null;
  }

  async function fetchProjects() {
    const params = {
      page: 0,
      searchRef: "",
    };
    const result = await apiProvider.fetchProjectData(params);
    if (result != null) {
      setProjectData(result?.data?.data?.data ?? []);
    }
    return null;
  }

  function deleteImages(e: any) {
    setFile((index: any) => {
      return index.filter((_: any, i: any) => i !== e);
    });
  }

  useEffect(() => {
    if (opened) {
      fetchUsers();
      fetchProjects();
    }
    const urls = file.map((img: any) => URL.createObjectURL(img));
    setImageUrls(urls);
    return () => {
      urls.forEach((url: any) => URL.revokeObjectURL(url));
    };
  }, [opened, file]);

  return (
    <div>
      <Modal
        size="xl"
        opened={opened}
        onClose={() => {
          ClearForm();
          setOpened(false);
          setImageUrls([]);
        }}
        title={<div className="text-xl p-4 font-bold">Create Issue </div>}
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <LoadingOverlay
            visible={loading}
            loaderProps={{ color: "green", type: "dots" }}
          />
          <div className="p-4 ">
            <div className="space-y-4 flex flex-col">
              <div className="flex space-x-4">
                <div className="w-full ">
                  <Select
                    label={
                      <div className="font-bold">
                        project Name<span className="ml-1 text-red-500">*</span>
                      </div>
                    }
                    searchable
                    variant="filled"
                    {...form.getInputProps("projectId")}
                    placeholder="Select Name"
                    data={projectData?.map((item: any) => ({
                      value: (item.id ?? 0).toString(),
                      label: item.title,
                    }))}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-full ">
                  <TextInput
                    label={
                      <div className="font-bold">
                        Title<span className="ml-1 text-red-500">*</span>
                      </div>
                    }
                    {...form.getInputProps("tasktitle")}
                    variant="filled"
                    placeholder="Enter title"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2 ">
                  <Select
                    label={
                      <div className="font-bold">
                        Type<span className="ml-1 text-red-500">*</span>
                      </div>
                    }
                    searchable
                    variant="filled"
                    placeholder="Select Type"
                    {...form.getInputProps("typeId")}
                    data={[
                      { value: "1", label: "Task" },
                      { value: "2", label: "Bug" },
                    ]}
                  />
                </div>
                <div className="w-1/2">
                  <MultiSelect
                    searchable
                    hidePickedOptions
                    label={
                      <div className="font-bold">
                        Assignee<span className="ml-1 text-red-500">*</span>
                      </div>
                    }
                    variant="filled"
                    placeholder="Select Name"
                    data={userData?.map((item: any) => ({
                      value: (item.id ?? 0).toString(),
                      label: `${item.firstName} ${item.lastName}`,
                    }))}
                    {...form.getInputProps("taskAssigneeId")}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-full ">
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
              <div>
                <div className=" flex flex-row space-x-4">
                  <SimpleGrid className="" cols={3}>
                    {" "}
                    {imageUrls.map((item: any, index: any) => (
                      <div className={`flex  flex-col  p-2`}>
                        <div className="flex mb-2 flex-row space-x-2 items-end justify-end">
                          <Tooltip label="Delete">
                            <ActionIcon
                              size={20}
                              color="red"
                              onClick={() => deleteImages(index)}
                            >
                              <Trash />
                            </ActionIcon>
                          </Tooltip>
                        </div>
                        <div className="flex  space-x-2">
                          <Image width={"100%"} height={90} src={item} />
                        </div>
                      </div>
                    ))}
                  </SimpleGrid>
                </div>
              </div>
              <div>
                <FileButton
                  onChange={(e: any) => setFile(e)}
                  accept="image/png,image/jpeg,image/avif"
                  multiple
                >
                  {(props) => (
                    <Button
                      className="w-full"
                      color="gray"
                      leftSection={<ImAttachment />}
                      {...props}
                    >
                      Attach Files
                    </Button>
                  )}
                </FileButton>
              </div>
              <div className="flex flex-row items-end space-x-2 justify-end">
                <Button
                  color="gray.6"
                  onClick={() => {
                    ClearForm();

                    setOpened(false);
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
        leftSection={<Plus size={18} />}
        onClick={() => setOpened(true)}
        variant="light"
        color="blue"
      >
        Create Issue
      </Button>
    </div>
  );
}
export default CreateTask;
