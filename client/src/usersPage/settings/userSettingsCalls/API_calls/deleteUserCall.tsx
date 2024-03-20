import axios from 'axios';
const BASE_URL = 'http://localhost:8000/deleteUser';

export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${userId}`, {
        withCredentials:true
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Error during the delete call:", error.response || error.message);
    throw error;
  }
};
