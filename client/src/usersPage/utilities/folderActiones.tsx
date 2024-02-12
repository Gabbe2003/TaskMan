import { Action, IFolder } from '../../interface/data';

export const addFolder = (folder: IFolder): Action => ({
    type: 'ADD_FOLDER',
    payload: folder,
  });
  
  export const removeFolder = (id: string | number): Action => ({
    type: 'REMOVE_FOLDER',
    payload: { id },
  });
  
  export const toggleFavorite = (folderId: string): Action => ({
    type: 'TOGGLE_FAVORITE',
    payload: { folderId },
  });
  
  export const setFolders = (folders: IFolder[]): Action => ({
    type: 'SET_FOLDERS',
    payload: folders,
  });
  
  export const setSelectedFolder = (folder: IFolder | null): Action => ({
    type: 'SET_SELECTED_FOLDER',
    payload: folder,
  });
  
  export const setSearch = (searchTerm: string): Action => ({
    type: 'SET_SEARCH',
    payload: searchTerm,
  });