import React, { ReactNode, createContext, useReducer } from 'react';
import { Action ,IFolderState } from './interface/data';


// Reducer
const reducer = (state: IFolderState, action: Action): IFolderState => {
    switch (action.type) {
      case 'ADD_FOLDER':
        return { ...state, folders: [...state.folders, action.payload] };
      case 'REMOVE_FOLDER':
        return { ...state, folders: state.folders.filter(folder => folder._id !== action.payload.id) };
        case 'TOGGLE_FAVORITE':
            return {
              ...state,
              folders: state.folders.map(folder =>
                folder._id === action.payload.folderId
                  ? { ...folder, favorite: !folder.favorite }
                  : folder
              ),
            };
      case 'SET_FOLDERS':
        return { ...state, folders: action.payload };
      case 'SET_SELECTED_FOLDER':
        return { ...state, selectedFolder: action.payload };
      case 'SET_SEARCH':
        return { ...state, search: action.payload };
      default:
        return state;
    }
  };
  

const initialState: IFolderState = {
  folders: [],
  selectedFolder: null,
  search: '',
};

interface FolderProviderProps {
    children: ReactNode;
  }

// Context
const FolderContext = createContext<{ state: IFolderState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

// Provider
export const FolderProvider: React.FC<FolderProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <FolderContext.Provider value={{ state, dispatch }}>{children}</FolderContext.Provider>;
};
