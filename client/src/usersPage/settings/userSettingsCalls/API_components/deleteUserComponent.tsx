import { toast } from "react-toastify";
import { deleteUser } from "../API_calls/deleteUserCall";

export const handleDeleteUser = async (userId: string) => {
  try {
    const result = await deleteUser(userId);
    console.log(result);
    console.log('Successfully deleted the user.');
    toast.success('User successfully deleted.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error when trying to delete the user:", error.response || error.message);
    toast.error(error.message || 'An unexpected error occurred during user deletion.')
  }
};
