import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFolderUpdate } from '../../utilities/folderUpdatecontext';
// Ensure FontAwesome is correctly imported
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faPencilAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import deleteFolder from './deleteFolder';

interface Task {
  name: string;
  subTask: string;
  priority: string;
  status: string;
  dueDate: Date | string;
  createdTask: Date;
}

interface UserData {
  _id: string;
  name: string;
  favorite: boolean;
  dueDate: Date | string;
  tasks: Task[];
  owner?: string;
  __v?: number;
}

const UserDataDisplay: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { updateSignal } = useFolderUpdate(); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/get', {
          withCredentials: true,
        });
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [updateSignal]); 

  const openModal = (tasks: Task[]) => {
    setSelectedTasks(tasks);
  };

  const closeModal = () => {
    setSelectedTasks(null);
  };

  // Placeholder function implementations
  // Assuming handleDeleteFolder is correctly importing deleteFolder
const handleDeleteFolder = async (folderId: string) => {
  try {
    const result = await deleteFolder(folderId);
    console.log(result);
    console.log('Successfully deleted folder with ID:', folderId);
    // After deletion, trigger UI update
    // updateSignal(); // Make sure to define or call updateSignal if you're updating UI or state
  } catch (error) {
    console.log(`Error from the function ${folderId}`)
    console.error("Error when trying to delete folder:", error);
    // Handle error appropriately
  }
};


  const handleToggleFavorite = async (_id: string) => {
    // Implement toggle favorite logic here
    console.log('Toggling favorite for folder with ID:', _id);
    // After toggling, trigger UI update
    // updateSignal();
  };

  const handleEditFolder = (_id: string) => {
    // Open modal or form for editing folder details
    console.log('Editing folder with ID:', _id);
    // You might set state here to open a modal or form
  };

  const handleChangeName = (_id: string) => {
    // Similar to handleEditFolder, but specifically for changing the name
    console.log('Changing name for folder with ID:', _id);
  };

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>{error}</div>;


  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Data</h2>
      <div className="row g-4">
        {userData.map(({ _id, name, favorite, tasks, dueDate }) => (
        <div key={_id} className="col-sm-6 col-md-3">
        <div className="card h-100 position-relative">
          <div className="dropdown">
            <button className="btn p-2 position-absolute top-0 end-0" type="button" id={`dropdownMenuButton-${_id}`} data-bs-toggle="dropdown" aria-expanded="  ">
              <FontAwesomeIcon icon={faBars} />
            </button>
            <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${_id}`}>
              <li><button className="dropdown-item" onClick={() => handleDeleteFolder(_id)}><FontAwesomeIcon icon={faXmark} /> Delete</button></li>
              <li><button className="dropdown-item" onClick={() => handleToggleFavorite(_id)}><FontAwesomeIcon icon={faStar} /> Toggle Favorite</button></li>
              <li><button className="dropdown-item" onClick={() => handleEditFolder(_id)}><FontAwesomeIcon icon={faPencilAlt} /> Edit Folder</button></li>
              <li><button className="dropdown-item" onClick={() => handleChangeName(_id)}>Change Name</button></li>
            </ul>
          </div>
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <p className="card-text">Favorite: {favorite ? 'Yes' : 'No'}</p>
            <p className="card-text">Due: {new Date(dueDate).toLocaleDateString('en-GB')}</p>
            <button className="btn btn-primary" onClick={() => openModal(tasks)}>View Tasks</button>
          </div>
        </div>
      </div>
        ))}
      </div>

      {selectedTasks && (
        <div className="modal fade show" id="taskModal" tabIndex= {-1} style={{ display: 'block' }} aria-labelledby="taskModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="taskModalLabel">Task Details</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {selectedTasks.map((task, index) => (
                  <div key={index} className="mb-2">
                    <p><strong>Task:</strong> {task.name}</p>
                    <p><strong>Subtask:</strong> {task.subTask}</p>
                    <p><strong>Priority:</strong> {task.priority}</p>
                    <p><strong>Status:</strong> {task.status}</p>
                    <p><strong>Due Date:</strong> {task.dueDate ? (typeof task.dueDate === 'string' ? task.dueDate : new Date(task.dueDate).toLocaleDateString( 'en-GB' )) : "No date"}</p>
                    <p><strong>Task created:</strong> {new Date(task.createdTask).toLocaleDateString()}</p>
                    <p><strong>-----</strong>--------</p>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDataDisplay;