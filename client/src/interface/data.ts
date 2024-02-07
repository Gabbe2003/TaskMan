export interface ITask {
    name: string;
    subTask: string;
    priority: 'low' | 'medium' | 'high';
    status: "completed" | "in progress" | "pending";
    dueDate: Date;
  }
  
  export interface IFolder {
    name: string;
    favorite?: boolean;
    tasks: ITask[];
    user: string;
  }

  export type IAlertProps = {
    message: string;
    type: string;
    dismissAlert: () => void;
  };

  
  export interface IState {
    name: string;
    editTask: ITask[];
    tasks: ITask[];
    folders: ITask[];
    subTask: string;
    selectedFolder: IFolder | null;
    editingFolder: IFolder | null;
    folderName: string;
    taskName: string;
    taskPriority: 'low' | 'medium' | 'high';
    taskStatus: "completed" | "in progress" | "pending";
    taskDueDate: string;
    search: string;
    selectedTask: ITask | string | null;
  }
  
  export const initialState: IState = {
  name:'',
  editTask: [],
  tasks: [],
  folders: [],
  subTask: '',
  selectedFolder: null,
  editingFolder: null,
  folderName: '',
  taskName: '',
  taskPriority: 'low',
  taskStatus: "pending",
  taskDueDate: '',
  search: '',
  selectedTask: '',
  }
  
export interface IAlert {
  message: string;
  type: string;
}

export interface IErrorResponse {
  message: string;
}
