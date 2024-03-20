import { toast } from "react-toastify";
import { delteTaskInFolder } from "../../taskComponents/deleteTaskInFolder";

export const handleDeleteTaskInFolder = async (folderId: string, taskId: string ) => {
    try {
      const result = await delteTaskInFolder(folderId, taskId);
      toast.success(result.Message)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      toast.error('Error while trying to delete the task', error)
    }
  }