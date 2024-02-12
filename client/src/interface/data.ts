  export type IAlertProps = {
    message: string;
    type: string;
    dismissAlert: () => void;
  }


  export 
  type Action =
    | { type: 'ADD_FOLDER'; payload: IFolder }
    | { type: 'REMOVE_FOLDER'; payload: { id: string | number } }
    | { type: 'TOGGLE_FAVORITE'; payload: { folderId: string } }
    | { type: 'SET_FOLDERS'; payload: IFolder[] }
    | { type: 'SET_SELECTED_FOLDER'; payload: IFolder | null }
    | { type: 'SET_SEARCH'; payload: string }
    | { type: 'SHOW_CREATE_FOLDER_MODAL' }
    | { type: 'HIDE_CREATE_FOLDER_MODAL' }
    | { type: 'UPDATE_NEW_FOLDER_FORM'; payload: Partial<IFolderState['newFolderForm']> };

  export interface ITask  {
    id: string; 
    name: string;
    subTask: string;
    priority: 'low' | 'medium' | 'high';
    status: 'completed' | 'in progress' | 'pending';
    dueDate: string | Date; 
    createdTask: string | Date;
  }

  export interface IFolder {
    id: string;
    name: string;
    favorite?: boolean;
    tasks?: ITask[];
    owner: string;
  }
  
  export interface IFolderState {
    folders: IFolder[];
    selectedFolder: IFolder | null;
    search: string;
    showCreateFolderModal: boolean;
    newFolderForm: {
      name: string;
      favorite: boolean;
      dueDate: string;
    };
  }
  export interface IAlert {
    message: string;
    type: string;
  }

  export interface IErrorResponse {
    message: string;
  }
