import { toast } from "react-toastify";
import { updateTaskInFolder } from "../../taskComponents/updateTaskInFolder";

export const handleUpdateTaskInFolder = async (folderId: string, taskId: string, taskData: object) => {
  try {
    const result = await updateTaskInFolder(folderId, taskId, taskData);
    console.log(result);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    toast.error(error.response.data.Message);
  }
};
