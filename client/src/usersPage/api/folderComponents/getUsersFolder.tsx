import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
// faPencilAlt, faStar
import { ITask } from '../../../interface/data';
import { handleDeleteFolder } from '../folderAndTaskDeleteComponent/folderDeleteComponents';
import { handleDeleteTaskInFolder } from '../folderAndTaskDeleteComponent/taskDeletion';
import TaskForm from '../taskComponents/createTaskInFolder';
import { useFolderUpdate } from '../../utilities/folder/folderUpdatecontext';
// Adjust the import path as necessary
import { TaskContext } from '../../utilities/tasks/taskReducer';

interface IUserData {
  _id: string;
  name: string;
  favorite: boolean;
  dueDate: Date | string;
  tasks: ITask[];
  owner?: string;
  __v?: number;
}

const UserDataDisplay: React.FC = () => {
  const [userData, setUserData] = useState<IUserData[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<ITask[] | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { triggerUpdate, updateSignal } = useFolderUpdate(); 
  const [modalShow, setModalShow] = useState(false);

  // Consume TaskContext
  const { dispatch } = useContext(TaskContext)!;

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

  const onDeleteFolder = (folderId: string) => {
    handleDeleteFolder(folderId);
    triggerUpdate();
  };

  const onDeleteTaskInFolder = ( folderId:string, taskId: string ) => {
    handleDeleteTaskInFolder(folderId,taskId);
    triggerUpdate();
  }

  const openModal = (tasks: ITask[] | null, folderId?: string, addingTask = false) => {
    console.log("Opening modal for folderId:", folderId); // Debug log to ensure folderId is passed correctly
    setSelectedTasks(tasks);
    setCurrentFolderId(folderId || null); // Ensure folderId is being correctly set here
    setIsAddingTask(addingTask);
    setModalShow(true);
  };
  

  const closeModal = () => {
    setSelectedTasks(null);
    setCurrentFolderId(null);
    setIsAddingTask(false);
    setModalShow(false);
  };

  const handleAddNewTask = (newTask: ITask) => {
    if (currentFolderId) {
      // Dispatch ADD_TASK action to TaskContext
      dispatch({
        type: 'ADD_TASK',
        payload: {
          folderId: currentFolderId,
          task: newTask,
        },
      });
      triggerUpdate(); // Optional: Depends on your state management strategy
    }
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
            <button className="btn p-2 position-absolute top-0 end-0" type="button" id={`dropdownMenuButton-${_id}`} data-bs-toggle="dropdown">
              <FontAwesomeIcon icon={faBars} />
            </button>
            <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${_id}`}>
              <li><button className="dropdown-item" onClick={() => onDeleteFolder(_id)}><FontAwesomeIcon icon={faXmark} /> Delete</button></li>
              {/* <li><button className="dropdown-item" onClick={() => handleToggleFavorite(_id)}><FontAwesomeIcon icon={faStar} /> Toggle Favorite</button></li> */}
              {/* <li><button className="dropdown-item" onClick={() => handleEditFolder(_id)}><FontAwesomeIcon icon={faPencilAlt} /> Edit Folder</button></li> */}
              {/* <li><button className="dropdown-item" onClick={() => handleChangeName(_id)}>Change Name</button></li> */}
            </ul>
          </div>
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <p className="card-text">Favorite: {favorite ? 'Yes' : 'No'}</p>
            <p className="card-text">Due: {new Date(dueDate).toLocaleDateString('en-GB')}</p>
            <button className="btn btn-primary m-2" onClick={() => openModal(tasks)}>View Tasks</button>
            <button className="btn btn-primary m-2" onClick={() => openModal(null, _id, true )}>Add Task</button>
          </div>
        </div>
      </div>
        ))}
      </div>
      {isAddingTask && (
        <TaskForm
          show={modalShow}
          onClose={closeModal}
          onSubmit={(newTask) => {
            handleAddNewTask(newTask);
            closeModal();
          }}
          initialTask={undefined}
          folderId={currentFolderId}
        />
        )}

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
              <div className="d-flex justify-content-between">
                <p><strong>Task:</strong> {task.name}</p>
                <button className="btn btn-danger btn-sm" onClick={() => onDeleteTaskInFolder(currentFolderId, task._id)}>Delete</button>

              </div>
              <p><strong>Subtask:</strong> {task.subTask}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Due Date:</strong> {task.dueDate ? (typeof task.dueDate === 'string' ? task.dueDate : new Date(task.dueDate).toLocaleDateString( 'en-GB' )) : "No date"}</p>
              <p><strong>Task created:</strong> {new Date(task.createdTask).toLocaleDateString()}</p>
              <p><strong>-----</strong>--------</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default UserDataDisplay;