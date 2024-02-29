import axios from "axios";

const UPDATE_URL = 'http://localhost:8000/put/tasks/';

export const updateTaskInFolder = async (folderId: string, taskId: string, taskData: object) => {
  try {
    const updateTaskUrl = `${UPDATE_URL}${folderId}/${taskId}`;
    
    const response = await axios.put(updateTaskUrl, taskData,  {
      withCredentials: true
    });
    
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Error during the update call:", error.message);
    throw error;
  }
}
