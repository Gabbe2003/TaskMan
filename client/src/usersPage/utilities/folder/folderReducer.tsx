import React, { ReactNode, createContext, useReducer } from 'react';
import { IAction ,IFolderState } from '../../../interface/data';

// Reducer
const reducer = (state: IFolderState, action: IAction): IFolderState => {
    switch (action.type) {
      case 'ADD_FOLDER':
        return { ...state, folders: [...state.folders, action.payload] };
        case 'REMOVE_FOLDER':
        return { ...state, folders: state.folders.filter(folder => folder.id !== action.payload.id) };
        case 'TOGGLE_FAVORITE':
            return {
              ...state,
              folders: state.folders.map(folder =>
                folder.id === action.payload.folderId
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
        case 'SHOW_CREATE_FOLDER_MODAL':
          return { ...state, showCreateFolderModal: true };
        case 'HIDE_CREATE_FOLDER_MODAL':
          return { ...state, showCreateFolderModal: false };
        case 'UPDATE_NEW_FOLDER_FORM':
          return { ...state, newFolderForm: { ...state.newFolderForm, ...action.payload } };
        default:
          return state;
    }
  };
  
  const initialState: IFolderState = {
    folders: [],
    selectedFolder: null,
    search: '',
    showCreateFolderModal: false,
    newFolderForm: { name: '', favorite: false, dueDate: '', tasks:[] }
  };

interface FolderProviderProps {
    children: ReactNode;
  }

// Context
const FolderContext = createContext<{ state: IFolderState; dispatch: React.Dispatch<IAction> } | undefined>(undefined);

// Provider
 const FolderProvider: React.FC<FolderProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
      <FolderContext.Provider value={{ state, dispatch }}>
        {children}
      </FolderContext.Provider>
    );
  };
  
export { FolderContext, FolderProvider };
