  export type IAlertProps = {
    message: string;
    type: string;
    dismissAlert: () => void;
  }

  export type IAction =
    | { type: 'ADD_FOLDER'; payload: IFolder }
    | { type: 'REMOVE_FOLDER'; payload: { id: string | number } }
    | { type: 'TOGGLE_FAVORITE'; payload: { folderId: string } }
    | { type: 'SET_FOLDERS'; payload: IFolder[] }
    | { type: 'SET_SELECTED_FOLDER'; payload: IFolder | null }
    | { type: 'SET_SEARCH'; payload: string }
    | { type: 'SHOW_CREATE_FOLDER_MODAL' }
    | { type: 'HIDE_CREATE_FOLDER_MODAL' }
    | { type: 'UPDATE_NEW_FOLDER_FORM'; payload: Partial<IFolderState['newFolderForm']> }
    | { type: 'EDIT_TASK', payload: { original: ITask, updated: ITask }}
    | { type: 'SET_SEARCH', payload: string }
    | { type: 'SET_SUBTASK', payload: string }
    | { type: 'ADD_TASK'; payload: { folderId: string; task: ITask } }
    | { type: 'REMOVE_TASK'; payload: { folderId: string; taskId: string } }
    | { type: 'UPDATE_TASK'; payload: { folderId: string; original: ITask; updated: ITask } }
    | { type: 'SET_SELECTED_TASK'; payload: ITask | null }
    | { type: 'SET_TASK_PRIORITY'; payload: { taskId: string; priority: 'low' | 'medium' | 'high' } }
    | { type: 'SET_TASK_STATUS'; payload: { taskId: string; status: 'completed' | 'in progress' | 'pending' } }
    | { type: 'SET_TASK_NAME'; payload: { taskId: string; name: string } }
    | { type: 'SET_TASK_DUE_DATE'; payload: { taskId: string; dueDate: string } }

  export interface ITask {
    _id?: string; 
    name: string;
    subTask: string;
    priority: string
    status: string
    dueDate: string | Date; 
    createdTask: string | Date;
  }

  export interface ITaskState {
    folders: IFolder[]; 
    selectedFolder: IFolder | null; 
    selectedTask: ITask | null; 
    searchTask: string; 
    showCreateTaskModal: boolean; 
    newTaskForm: { 
      name: string;
      subTask: string;
      priority: 'low' | 'medium' | 'high';
      status: 'completed' | 'in progress' | 'pending';
      dueDate: string | Date; 
      createdTask: string | Date;
    };
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
      tasks: ITask[];
    };
  }

 export interface IErrorResponse {
    message: string;
  }