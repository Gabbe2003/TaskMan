import axios from 'axios';

const DELETE_URL = 'http://localhost:8000/delete/folder/';

export const deleteFolder = async (folderId: string) => {
  try {
    const deleteFolderUrl = `${DELETE_URL}${folderId}`;
    const response = await axios.delete(deleteFolderUrl, {
      withCredentials: true
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Error during the delete call:", error.response || error.message);
    throw error;
  }
};

export const delteTaskInFolder = async (folderId: string, taskId: string) => {
  try {
    const deleteTaskInFolderUrl = `${DELETE_URL}${folderId}/task/${taskId}`;
    const response = await axios.delete(deleteTaskInFolderUrl, {
      withCredentials: true
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Error during the deleteTask call:", error.response || error.message);
    throw error;
  }
}
