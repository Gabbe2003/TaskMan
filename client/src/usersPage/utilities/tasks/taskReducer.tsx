import React, { ReactNode, createContext, useReducer } from 'react';
import { IAction, ITaskState } from '../../../interface/data';

// TaskReducer
const taskReducer = (state: ITaskState, action: IAction): ITaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        folders: state.folders.map(folder =>
          folder.id === action.payload.folderId ? { ...folder, tasks: [...(folder.tasks ?? []), action.payload.task] } : folder
        ),
      };
    case 'REMOVE_TASK':
      return {
        ...state,
        folders: state.folders.map(folder =>
          folder.id === action.payload.folderId ? { ...folder, tasks: folder.tasks?.filter(task => task._id !== action.payload.taskId) ?? [] } : folder
        ),
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        folders: state.folders.map(folder => {
          if (folder.id === action.payload.folderId) {
            return {
              ...folder,
              tasks: folder.tasks?.map(task =>
                task._id === action.payload.original._id ? action.payload.updated : task
              ) ?? [],
            };
          }
          return folder;
        }),
      };
    case 'SET_SELECTED_TASK':
      return {
        ...state,
        selectedTask: action.payload,
      };
    case 'SET_TASK_PRIORITY':
    case 'SET_TASK_STATUS':
    case 'SET_TASK_NAME':
    case 'SET_TASK_DUE_DATE':
      return {
        ...state,
        folders: state.folders.map(folder => ({
          ...folder,
          tasks: folder.tasks?.map(task => 
            task._id === action.payload.taskId ? { ...task, ...action.payload } : task
          ) ?? [],
        })),
      };
    default:
      return state;
  }
};

const initialTaskState: ITaskState = {
  folders: [],
  selectedFolder: null,
  selectedTask: null,
  searchTask: '', 
  showCreateTaskModal: false, 
  newTaskForm: { 
    name: '',
    subTask: '',
    priority: 'low', 
    status: 'pending',
    dueDate: '', 
    createdTask: '',
  },
};


interface TaskProviderProps {
  children: ReactNode;
}

// TaskContext
const TaskContext = createContext<{ state: ITaskState; dispatch: React.Dispatch<IAction> } | undefined>(undefined);

// TaskProvider
const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };
