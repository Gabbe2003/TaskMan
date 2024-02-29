import { UpdateFolder } from "../../folderComponents/updateFolder";

export const handleUpdateFolder = async (folderId: string) => {
    try {
      const result = await UpdateFolder(folderId);
      console.log(result);
      console.log('Successfully Updated folder with ID:', folderId);
    } catch (error) {
      console.log(`Error from the function ${folderId}`)
      console.error("Error when trying to Updated folder:", error);
    }
  };

