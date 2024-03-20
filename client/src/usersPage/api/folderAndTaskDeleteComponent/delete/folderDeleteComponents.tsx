import { toast } from "react-toastify";
import { deleteFolder } from "../../folderComponents/deleteFolder";

export const handleDeleteFolder = async (folderId: string) => {
    try {
      const result = await deleteFolder(folderId);
      toast.success(result.Message)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      toast.error("Error when trying to delete folder")
    }
  };
