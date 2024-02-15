// Import your IFolder interface
import { IAction, IFolder, IFolderState } from '../../../interface/data';
// Action creators
export const addFolder = (folder: IFolder): IAction => ({
    type: 'ADD_FOLDER',
    payload: folder,
});

export const removeFolder = (id: string | number): IAction => ({
    type: 'REMOVE_FOLDER',
    payload: { id },
});

export const toggleFavorite = (folderId: string): IAction => ({
    type: 'TOGGLE_FAVORITE',
    payload: { folderId },
});

export const setFolders = (folders: IFolder[]): IAction => ({
    type: 'SET_FOLDERS',
    payload: folders,
});

export const setSelectedFolder = (folder: IFolder | null): IAction => ({
    type: 'SET_SELECTED_FOLDER',
    payload: folder,
});

export const setSearch = (searchTerm: string): IAction => ({
    type: 'SET_SEARCH',
    payload: searchTerm,
});

// New IActions for managing modal state and form
export const showCreateFolderModal = (): IAction => ({
    type: 'SHOW_CREATE_FOLDER_MODAL',
});

export const hideCreateFolderModal = (): IAction => ({
    type: 'HIDE_CREATE_FOLDER_MODAL',
});

export const updateNewFolderForm = (formData: Partial<IFolderState['newFolderForm']>): IAction => ({
    type: 'UPDATE_NEW_FOLDER_FORM',
    payload: formData,
});

