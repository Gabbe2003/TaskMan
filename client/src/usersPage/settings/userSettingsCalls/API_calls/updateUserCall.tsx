import axios from 'axios';
const BASE_URL = 'http://localhost:8000/changeUserData';

export const updateUser = async (userId: string, newUsername: string | null, newEmail: string | null) => {
  try {
    // The body now includes newUsername and newEmail
    const response = await axios.put(`${BASE_URL}/${userId}`, {
      newUsername,
      newEmail
    }, {
      withCredentials: true
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Error during the update call:", error.response?.data.message || error.message);
    throw error;
  }
};
