/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import {
  ActionIcon,
  Button,
  Drawer,
  FileButton,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  MultiSelect,
  ScrollArea,
  Select,
  SimpleGrid,
  TextInput,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { saveAs } from "file-saver";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { ImAttachment } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import {
  Download,
  Edit,
  Trash,
  ZoomIn,
  ZoomOut,
  ZoomReset,
} from "tabler-icons-react";
import { imageUrl } from "../../../network/api-client";
import apiProvider from "../../../network/api-provider";
import { TaskRootState, getAllTask } from "./task-slice";

function TaskEdit({ task }: any) {
  const { id } = useParams();
  const [opened, setOpened] = useState(false);
  const [imageUrls, setImageUrls] = useState<any>([]);
  const [modalsOpen, setModalsOpen] = useState(false);
  const [_, setZoomFactor] = useState(1);
  const [imageOpen, setImageOpen] = useState(false);
  const [assignedId, setAssignedId] = useState<any[]>([]);
  const [statusId, setStatusId] = useState<string | null>(null);
  const [taskFile, setTaskFile] = useState<any>([]);
  const [projectName, setProjectName] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [file, setFile] = useState<File[]>([]);
  const dispatch = useDispatch();
  const { page, search, type, user, status } = useSelector(
    (state: TaskRootState) => state.task
  );

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      description: "",
      taskAssigneeId: [],
      projectId: "",
      tasktitle: "",
      type: "",
      statusId: "",
      taskId: "",
      id: "",
    },
    validate: {},
  });

  async function fetchUsers() {
    const params = {
      page: 0,
      searchRef: "",
    };
    const result = await apiProvider.fetchUserData(params);
    if (result != null) {
      setAssignedId(result?.data?.data?.data ?? []);
      setStatusId(`${task.statusId ?? 0}`);
    }
    return null;
  }

  function changeStatus(val: string) {
    form.setFieldValue("statusId", val);
    setStatusId(val);
  }

  function projectTitle() {
    const projectName = task?.title;
    setProjectName(projectName);
  }

  function setImage() {
    setTaskFile((task.images?.length ?? 0) > 0 ? task.images : null);
  }

  const onSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const formData: any = new FormData();
    file.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("status", statusId === null ? task?.statusId : +statusId);
    formData.append("projectId", +task.projectId);
    formData.append("taskCreatorId", +task?.taskCreatorId);
    formData.append("title", values.tasktitle);
    formData.append("description", values.description);
    values?.taskAssigneeId.forEach((item, index) => {
      formData.append(`taskAssigneeId[${index}]`, item);
    });
    formData.append("typeId", +values.type);
    const result = await apiProvider.updateTask(formData, task?.id);
    if (result != null) {
      setOpened(false);
      const data = {
        page,
        search,
        type,
        user,
        status,
      };
      dispatch(getAllTask({ params: data, id: id }));
      setFile([]);
    }
    setLoading(false);
  };

  function setData() {
    let userName = task?.userOnTeams.map(
      (e: any) => `${e?.assignees?.id ?? []}`
    );
    form.setFieldValue("tasktitle", task.title);
    form.setFieldValue("description", task.description);
    form.setFieldValue("taskAssigneeId", userName);
    form.setFieldValue("status", task.statusId);
    console.log(String(task.statusId));
    form.setFieldValue("type", task.typeId === 1 ? "1" : "2");
    form.setFieldValue(
      "createdAt",
      moment(task.createdAt.toString()).format("DD MMMM YYYY, h:mm a")
    );
    form.setFieldValue(
      "updatedAt",
      moment(task.updatedAt.toString()).format("DD MMMM YYYY, h:mm a")
    );
  }

  async function deleteImage(index: number) {
    const result = await apiProvider.deleteImage(task.images[index].id);
    setTaskFile((images: any) => {
      return images.filter((_: any, i: any) => i !== index);
    });
    if (result != null) {
      setModalsOpen(false);
      const params = {
        page,
        search,
        type,
        user,
        status,
      };
      dispatch(getAllTask({ params: params, id: id }));
    }
  }

  const downloadImage = (index: any) => {
    saveAs(
      imageUrl + `${task.images[index].file}`,
      `${task.images[index].file}`
    );
  };

  const buttonDownload = () => {
    saveAs(
      imageUrl + `${task.images[selectedImage].file}`,
      `${task.images[selectedImage].file}`
    );
  };

  function deleteImages(e: any) {
    setFile((index: any) => {
      return index.filter((_: any, i: any) => i !== e);
    });
  }

  useEffect(() => {
    if (opened) {
      setData();
      fetchUsers();
      projectTitle();
      setImage();
    }
    const urls = file.map((img: any) => URL.createObjectURL(img));
    setImageUrls(urls);

    return () => {
      urls.forEach((url: any) => URL.revokeObjectURL(url));
    };
  }, [opened, file]);

  return (
    <div>
      <div>
        <Drawer
          position="right"
          opened={opened}
          onClose={() => {
            setOpened(false);
            setFile([]);
          }}
          title={<div className="font-bold text-black">{projectName}</div>}
          padding="xl"
          size="xl"
        >
          <LoadingOverlay
            visible={loading}
            loaderProps={{ color: "green", type: "dots" }}
          />
          <ScrollArea style={{ height: 500 }}>
            <form onSubmit={form.onSubmit(onSubmit)}>
              <div className="p-4 ">
                <div className="space-y-4  flex flex-col">
                  <div className="w-full ">
                    <TextInput
                      {...form.getInputProps("tasktitle")}
                      label={<div className="font-bold text-black">Title</div>}
                      variant="filled"
                    />
                  </div>
                  <div className="w-full">
                    <Select
                      label={
                        <div className="font-bold text-black">
                          Type<span className="ml-1 text-red-500">*</span>
                        </div>
                      }
                      searchable
                      variant="filled"
                      placeholder="Select Type"
                      {...form.getInputProps("type")}
                      data={[
                        { value: "1", label: "Task" },
                        { value: "2", label: "Bug" },
                      ]}
                    />
                  </div>

                  <div className="w-full ">
                    <MultiSelect
                      label={
                        <div className="font-bold text-black">Assignee</div>
                      }
                      {...form.getInputProps("taskAssigneeId")}
                      variant="filled"
                      placeholder="Select Name"
                      data={assignedId?.map((item: any) => ({
                        value: (item.id ?? 0).toString(),
                        label: `${item.firstName} ${item.lastName}`,
                      }))}
                    />
                  </div>
                  <div className="w-full">
                    <Select
                      label={<div className="font-bold text-black">Status</div>}
                      {...form.getInputProps("statusId")}
                      value={statusId}
                      onChange={changeStatus}
                      variant="filled"
                      placeholder="Select Name"
                      data={[
                        { value: "1", label: "To Do" },
                        { value: "2", label: "InProgress" },
                        { value: "3", label: "Reopen" },
                        { value: "4", label: "Done" },
                      ]}
                    />
                  </div>

                  <div>
                    <Textarea
                      variant="filled"
                      label={
                        <div className="font-bold text-black">Description</div>
                      }
                      {...form.getInputProps("description")}
                    />
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
                      onChange={(e: any) => {
                        setFile(e);
                      }}
                      accept="image/png,image/jpeg,image/avif"
                      multiple
                    >
                      {(props) => (
                        <Button
                          className=""
                          color="gray"
                          leftSection={<ImAttachment />}
                          {...form.getInputProps("files")}
                          {...props}
                        >
                          Attach Files
                        </Button>
                      )}
                    </FileButton>
                  </div>
                  <div className="flex flex-row space-x-2 justify-between">
                    <Drawer
                      opened={imageOpen}
                      onClose={() => {
                        setImageOpen(false), setZoomFactor(1);
                      }}
                      position="bottom"
                      title={
                        <div className="font-bold">
                          <Button onClick={buttonDownload}>
                            Download Image
                          </Button>
                        </div>
                      }
                      className="bg-black"
                      padding="sm"
                      size="100%"
                    >
                      <TransformWrapper
                        initialScale={1}
                        initialPositionX={1}
                        initialPositionY={1}
                      >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                          <Fragment>
                            <div
                              style={{
                                width: "70%",
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                              className="flex items-center  justify-center"
                            >
                              <TransformComponent>
                                <Image
                                  width={"100%"}
                                  height={500}
                                  src={
                                    imageUrl +
                                    `${`${task.images[selectedImage].file}`}`
                                  }
                                />
                              </TransformComponent>
                            </div>
                            <div className="w-full space-x-3 text-center fixed bottom-0 right-0">
                              <button onClick={() => zoomIn()}>
                                <ZoomIn
                                  className="bg-white  text-black"
                                  size={24}
                                />
                              </button>
                              <button onClick={() => zoomOut()}>
                                <ZoomOut
                                  className="bg-white  text-black"
                                  size={24}
                                />
                              </button>
                              <button onClick={() => resetTransform()}>
                                <ZoomReset
                                  className="bg-white  text-black"
                                  size={24}
                                />
                              </button>
                            </div>
                          </Fragment>
                        )}
                      </TransformWrapper>
                    </Drawer>
                    {taskFile === null ? (
                      <></>
                    ) : (
                      <div className=" flex flex-row space-x-4">
                        <SimpleGrid className="" cols={3}>
                          {" "}
                          {taskFile.map((item: any, index: number) => (
                            <div className={`flex  flex-col  p-2`}>
                              <div className="flex mb-2 flex-row space-x-2 justify-end">
                                <Tooltip label="Download">
                                  <ActionIcon
                                    size={20}
                                    onClick={() => downloadImage(index)}
                                    color="blue"
                                  >
                                    <Download />
                                  </ActionIcon>
                                </Tooltip>

                                <Tooltip label="Delete">
                                  <ActionIcon
                                    size={20}
                                    onClick={() => {
                                      setModalsOpen(true);
                                      setSelectedImage(index);
                                    }}
                                    color="red"
                                  >
                                    <Modal
                                      opened={modalsOpen}
                                      onClose={() => setModalsOpen(false)}
                                      title="Delete Image"
                                    >
                                      <div color="gray">
                                        Are you sure, Do you want to delete?
                                      </div>
                                      <Group className="flex justify-end">
                                        <Button
                                          variant="default"
                                          onClick={() => setModalsOpen(false)}
                                          mt="md"
                                        >
                                          No
                                        </Button>
                                        <Button
                                          onClick={() => {
                                            deleteImage(selectedImage),
                                              setModalsOpen(false);
                                          }}
                                          mt="md"
                                        >
                                          Yes
                                        </Button>
                                      </Group>
                                    </Modal>
                                    <Trash />
                                  </ActionIcon>
                                </Tooltip>
                              </div>
                              <div className="flex  space-x-2">
                                <Image
                                  width={"100%"}
                                  height={90}
                                  onClick={() => {
                                    setImageOpen(true), setSelectedImage(index);
                                  }}
                                  src={imageUrl + `${`${item.file}`}`}
                                />
                              </div>
                            </div>
                          ))}
                        </SimpleGrid>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end flex-row">
                    <Button className="w-full" type="submit">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </ScrollArea>
        </Drawer>
        <Button
          onClick={() => setOpened(true)}
          variant="light"
          size="xs"
          leftSection={<Edit size={16} />}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}

export default TaskEdit;
