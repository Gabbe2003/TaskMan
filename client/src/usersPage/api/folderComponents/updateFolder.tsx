import axios from 'axios';
import { toast } from 'react-toastify';

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
    toast.error('Error while updating the data of the folder');
  }
};
