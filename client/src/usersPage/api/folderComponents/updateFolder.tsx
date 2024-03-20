import axios from 'axios';

const UPDATE_URL = 'http://localhost:8000/put/';

export const UpdateFolder = async (folderId: string, folderData: object) => {
  try {
    const UpdateFolderURL = `${UPDATE_URL}${folderId}`;
    const response = await axios.put(UpdateFolderURL, folderData, {
      withCredentials: true
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Error during the update call:", error.response || error.message);
    throw error;
  }
};
