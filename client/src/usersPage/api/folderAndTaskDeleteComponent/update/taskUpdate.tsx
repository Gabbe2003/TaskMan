import { updateTaskInFolder } from "../../taskComponents/updateTaskInFolder";

export const handleUpdateTaskInFolder = async (folderId: string, taskId: string, taskData: object) => {
  try {
    const result = await updateTaskInFolder(folderId, taskId, taskData);
    console.log(result);
    console.log('Successfully Updated folder with ID:', folderId, 'and task with taskId:', taskId, 'with data:', taskData);
  } catch (error) {
    console.log(`Error from the folder ${folderId}, and task ${taskId}`)
    console.error("Error when trying to update folder:", error);
  }
};
