import axios from "axios";

const DELETE_URL = 'http://localhost:8000/delete/task/'

export const delteTaskInFolder = async (folderId: string, taskId: string) => {
    try {
        const deleteTaskInFolderUrl = `${DELETE_URL}${folderId}/${taskId}`;
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
  
  