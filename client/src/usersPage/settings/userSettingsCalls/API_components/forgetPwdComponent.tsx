import { toast } from "react-toastify";
import { forgetPWD } from "../API_calls/forgetPWD";

export const handleForgetPassword = async (email: string) => {
  try {
    const result = await forgetPWD(email);
    console.log(result);
    // Moved inside the try block to accurately reflect success
    console.log('Successfully sent the request to the user');
    toast.success('Successfully sent the request to the user')
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    console.error("Error when trying to send the request:", error);
    toast.error(error.response.data.message || 'An unexpected error occurred.')
  }
};
