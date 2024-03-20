import { toast } from "react-toastify";
import { updateUser } from "../API_calls/updateUserCall";

export const handleUpdateUser = async (userId: string, newUsername: string | null, newEmail: string | null) => {
  try {
    // Now passing newUsername and newEmail to updateUser
    const result = await updateUser(userId, newUsername, newEmail);
    console.log(result);
    console.log('User data updated successfully');
    toast.success('Data updated successfully');
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error when trying to update user data:", error);
    toast.error(error.response?.data.message || 'An unexpected error occurred.');
  }
};
