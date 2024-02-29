import { delteTaskInFolder } from "../../taskComponents/deleteTaskInFolder";

export const handleDeleteTaskInFolder = async (folderId: string, taskId: string ) => {
    try {
      const result = await delteTaskInFolder(folderId, taskId);
      console.log(result);
      console.log('Successfully deleted task with ID:', taskId);
      console.log(`folderId ${folderId}, taskId ${taskId}`);
    } catch (error) {
      console.log(` ${folderId} and taskId ${taskId}`)
      console.error("Error when trying to delete task in the folder:", error);
    }
  }