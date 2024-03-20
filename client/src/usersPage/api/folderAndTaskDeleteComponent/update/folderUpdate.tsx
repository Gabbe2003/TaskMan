import { toast } from "react-toastify";
import { UpdateFolder } from "../../folderComponents/updateFolder";

export const handleUpdateFolder = async (folderId: string, folderData: object ) => {
    try {
      const result = await UpdateFolder(folderId, folderData);
      console.log(result);
      console.log('Successfully Updated folder with ID:', folderId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      toast.error(error.response.data.Message);
    }
  };

