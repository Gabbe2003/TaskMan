import axios from 'axios';

const FORGET_PWD_URL = 'http://localhost:8000/reset-password';

export const forgetPWD = async (email: string) => {
  try {
    const response = await axios.post(FORGET_PWD_URL, { email }, {
      withCredentials: true
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Error during the forget call:", error.response || error.message);
    throw error;
  }
};
