import axios from 'axios';
import { toast } from 'react-toastify';

const DELETE_URL = 'http://localhost:8000/delete/';

export const deleteFolder = async (folderId: string) => {
  try {
    const deleteFolderUrl = `${DELETE_URL}${folderId}`;
    const response = await axios.delete(deleteFolderUrl, {
      withCredentials: true
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error('Error while deleting the folder');
  }
};
