import React, { useContext } from 'react';
import axios from 'axios';
import { FolderContext } from '../../utilities/folder/folderReducer';
import { showCreateFolderModal, hideCreateFolderModal, updateNewFolderForm, addFolder, setSelectedFolder } from '../../utilities/folder/folderActions';
import { useFolderUpdate } from '../../utilities/folder/folderUpdatecontext';
import { ITask } from '../../../interface/data';
import { toast } from 'react-toastify';

const HandleCreateFolder = () => {
    const { state, dispatch } = useContext(FolderContext)!;
    const { triggerUpdate  } = useFolderUpdate();
    const initialFolderFormState = {
      name: '',
      favorite: false,
      dueDate: '',
      tasks: [],
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const { name, favorite, dueDate, tasks } = state.newFolderForm;

      const updatedTasks = tasks.map(task => ({
        ...task,
        name: task.name.trim() ? task.name : name, 
      }));

      const folderData = {
        name,
        favorite,
        dueDate,
        tasks: updatedTasks,
      };

      try {
        const response = await axios.post('http://localhost:8000/post', folderData, {
          withCredentials: true,
        });
        
        triggerUpdate(); 
        dispatch(addFolder(response.data));
        dispatch(setSelectedFolder(response.data));
        dispatch(hideCreateFolderModal());
        dispatch(updateNewFolderForm(initialFolderFormState)); 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error:any) {
        console.error('Failed to create folder:', error);
        dispatch(hideCreateFolderModal());
        toast.error(error.response.data.Message)
      }
    };
    
    const handleFormChange = (field: string, value: string | boolean) => {
      const [key, subKey] = field.split('.');
      
      if (subKey) {
        // Assuming 'task' is the only nested structure for now
        dispatch(updateNewFolderForm({
          ...state.newFolderForm,
          tasks: {
            ...state.newFolderForm.tasks,
            [subKey]: value,
          },
        }));
      } else {
        dispatch(updateNewFolderForm({
          ...state.newFolderForm,
          [key]: value,
        }));
      }
    };
    
    const handleTaskChange = (index: number, field: keyof ITask, value: string | Date) => {
      const newTasks = [...state.newFolderForm.tasks];
      if (!newTasks[index]) {
        // Initialize a default task structure if it doesn't exist
        newTasks[index] = {
          name: '',
          subTask: '',
          priority: 'low', 
          status: 'pending',
          dueDate: '',
          createdTask: new Date().toISOString()
        };
      }
    
      // Special handling for fields with specific types or constraints
      let updatedValue: unknown = value;
      if (field === 'priority') {
        updatedValue = value as 'low' | 'medium' | 'high';
      } else if (field === 'status') {
        updatedValue = value as 'pending' | 'in progress' | 'completed';
      } else if (field === 'dueDate' || field === 'createdTask') {
        // Assuming value is properly formatted for date fields; convert to string if necessary
        updatedValue = (value instanceof Date) ? value.toISOString() : value;
      }
      // Apply the updated value to the task
      newTasks[index] = { ...newTasks[index], [field]: updatedValue };
    
      // Dispatch the updated task array to the state
      dispatch(updateNewFolderForm({ ...state.newFolderForm, tasks: newTasks }));
    };
    return (
      <>
        <button className="btn btn-primary" onClick={() => dispatch(showCreateFolderModal())}>
          Create New Folder
        </button>
    
  <div className={`modal fade ${state.showCreateFolderModal ? 'show' : ''}`} id="createFolderModal" tabIndex={-1} aria-labelledby="createFolderModalLabel" aria-hidden={!state.showCreateFolderModal} style={{ display: state.showCreateFolderModal ? 'block' : 'none' }}>
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="createFolderModalLabel">New Folder</h5>
        <button type="button" className="btn-close" onClick={() => dispatch(hideCreateFolderModal())} aria-label="Close"></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <fieldset>
            <legend>Folder Information</legend>
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
          </fieldset>
          <fieldset>
            <legend>Task Information (Optional)</legend>
            <div className="mb-3">
              <label htmlFor="taskName" className="form-label">Task Name</label>
              <input type="text" className="form-control" id="taskName" value={state.newFolderForm.tasks[0]?.name || ''} onChange={(e) => handleTaskChange(0, 'name', e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="taskSubTask" className="form-label">Sub Task</label>
              <input type="text" className="form-control" id="taskSubTask" value={state.newFolderForm.tasks[0]?.subTask || ''} onChange={(e) => handleTaskChange(0, 'subTask', e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="taskPriority" className="form-label">Priority</label>
              <select className="form-select" id="taskPriority" value={state.newFolderForm.tasks[0]?.priority || ''} onChange={(e) => handleTaskChange(0, 'priority', e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="taskStatus" className="form-label">Status</label>
              <select className="form-select" id="taskStatus" value={state.newFolderForm.tasks[0]?.status || ''} onChange={(e) => handleTaskChange(0, 'status', e.target.value)}>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="taskDueDate" className="form-label">Task Due Date</label>
              <input type="date" className="form-control" id="taskDueDate" value={state.newFolderForm.tasks[0]?.dueDate ? new Date(state.newFolderForm.tasks[0].dueDate).toISOString().split('T')[0] : ''} onChange={(e) => handleTaskChange(0, 'dueDate', e.target.value)} />
            </div>
          </fieldset>
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

{/* <div className="modal fade" id="deleteModal" tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true">
<div className="modal-dialog">
  <div className="modal-content">
    <div className="modal-header">
      <h5 className="modal-title" id="deleteModalLabel">Delete User</h5>
      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div className="modal-body">
      Are you sure you want to delete this user? The data will be removed and you will not be able to retrieve it back.
    </div>
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={deleteUser}>Delete User</button>
    </div>
  </div>
</div>
</div>

<li className="d-flex justify-content-center align-items-center bg-danger text-white rounded" style={{cursor: 'pointer'}} data-bs-toggle="modal" data-bs-target="#deleteModal">Delete User</li> */}
