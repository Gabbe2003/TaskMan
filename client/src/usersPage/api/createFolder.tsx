import React, { useContext } from 'react';
import axios from 'axios';
import { FolderContext } from '../../folderReducer';
import { showCreateFolderModal, hideCreateFolderModal, updateNewFolderForm, addFolder, setSelectedFolder } from '../utilities/folderActions';
import { useFolderUpdate } from '../utilities/folderUpdatecontext';
import { IFolderState } from '../../interface/data';

const HandleCreateFolder = () => {
    const { state, dispatch } = useContext(FolderContext)!;
    const { triggerUpdate  } = useFolderUpdate();
    const [validationError, setValidationError] = React.useState('');

    const validateForm = () => {
      if (!state.newFolderForm.name.trim()) {
        setValidationError('Folder name is required.');
        return false;
      }
      setValidationError('');
      return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateForm()) return;

      const { name, favorite, dueDate } = state.newFolderForm;

      try {
        const folderData = {
          name,
          favorite,
          dueDate,
          tasks: [],
        };

        const response = await axios.post('http://localhost:8000/post', folderData, {
          withCredentials: true,
        });

        dispatch(addFolder(response.data));
        dispatch(setSelectedFolder(response.data));
        dispatch(hideCreateFolderModal());
        triggerUpdate (); // Make sure this is correctly defined and accessible
      } catch (error) {
        console.error('Failed to create folder:', error);
      }
    };


  const handleFormChange = (field: keyof IFolderState['newFolderForm'], value: string | boolean) => {
    dispatch(updateNewFolderForm({ [field]: value }));
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => dispatch(showCreateFolderModal())}>
        Create New Folder
      </button>

      <div className={`modal fade ${state.showCreateFolderModal ? 'show' : ''}`} style={{ display: state.showCreateFolderModal ? 'block' : 'none' }} tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">New Folder</h5>
              <button type="button" className="btn-close" onClick={() => dispatch(hideCreateFolderModal())}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {validationError && <div className="alert alert-danger">{validationError}</div>}
                <div className="mb-3">
                  <label htmlFor="folderName" className="form-label">Folder Name</label>
                  <input type="text" className="form-control" id="folderName" value={state.newFolderForm.name} onChange={(e) => handleFormChange('name', e.target.value)} required />
                </div>
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="favorite" checked={state.newFolderForm.favorite} onChange={(e) => handleFormChange('favorite', e.target.checked)} />
                  <label className="form-check-label" htmlFor="favorite">Favorite</label>
                </div>
                <div className="mb-3">
                  <label htmlFor="dueDate" className="form-label">Due Date</label>
                  <input type="date" className="form-control" id="dueDate" value={state.newFolderForm.dueDate} onChange={(e) => handleFormChange('dueDate', e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => dispatch(hideCreateFolderModal())}>Close</button>
                <button type="submit" className="btn btn-primary">Save Folder</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {state.showCreateFolderModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default HandleCreateFolder;
