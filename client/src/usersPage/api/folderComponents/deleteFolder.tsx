import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/delete/folder/';

export const deleteFolder = async (folderId: string) => {
  try {
    const url = `${API_BASE_URL}${folderId}`;
    const response = await axios.delete(url, {
      withCredentials: true
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error during the API call:", error.response || error.message);
    throw error;
  }
};

export default deleteFolder;