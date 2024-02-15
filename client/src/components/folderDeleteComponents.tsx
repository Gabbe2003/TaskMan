import { deleteFolder, delteTaskInFolder } from "../usersPage/api/folderComponents/deleteFolder";

export const handleDeleteFolder = async (folderId: string) => {
    try {
      const result = await deleteFolder(folderId);
      console.log(result);
      console.log('Successfully deleted folder with ID:', folderId);
    } catch (error) {
      console.log(`Error from the function ${folderId}`)
      console.error("Error when trying to delete folder:", error);
    }
  };

  export const handleDeleteTaskInFolder = async (folderId: string, taskId: string ) => {
    try {
      const result = await delteTaskInFolder(folderId, taskId);
      console.log(result);
      console.log('Successfully deleted task with ID:', taskId);
      console.log(`folderId ${folderId}, taskId ${taskId}`);
    } catch (error) {
      console.log(`Error from the function ${folderId} and taskId ${taskId}`)
      console.error("Error when trying to delete task in the folder:", error);
    }
  }