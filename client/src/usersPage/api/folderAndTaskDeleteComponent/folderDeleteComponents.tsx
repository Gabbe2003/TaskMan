import { deleteFolder } from "../folderComponents/deleteFolder";

export const handleDeleteFolder = async (folderId: string) => {
    try {
      const result = await deleteFolder(folderId);
      console.log(result);
      console.log('Successfully deleted folder with ID:', folderId);
    } catch (error) {
      console.log(`Error from the function ${folderId}`)
      console.error("Error when trying to delete folder:", error);
    }
  };
