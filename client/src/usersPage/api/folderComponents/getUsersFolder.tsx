import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { ITask } from '../../../interface/data';
import { handleDeleteFolder } from '../folderAndTaskDeleteComponent/delete/folderDeleteComponents';
import { handleDeleteTaskInFolder } from '../folderAndTaskDeleteComponent/delete/taskDeletion';
import TaskForm from '../taskComponents/createTaskInFolder';
import { useFolderUpdate } from '../../utilities/folder/folderUpdatecontext';
import { TaskContext } from '../../utilities/tasks/taskReducer';
import '../../../style/userDataDisplay.css';
import { handleUpdateTaskInFolder } from '../folderAndTaskDeleteComponent/update/taskUpdate';

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
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [userData, setUserData] = useState<IUserData[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<ITask[] | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { triggerUpdate, updateSignal } = useFolderUpdate(); 
  const [modalShow, setModalShow] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [subTask, setSubTask] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Consume TaskContext
  const { dispatch } = useContext(TaskContext)!;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/get', {
          withCredentials: true,
        });
        console.log(response.data);
        if (response.data.length > 0) {
          setUserData(response.data);
          setCurrentFolderId(response.data[0]._id);
        } else {
          console.error('No data received');
          setError('No data received');
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [updateSignal, triggerUpdate]);

  const onDeleteFolder = (folderId: string) => {
    handleDeleteFolder(folderId);
    triggerUpdate();
  };

  const onDeleteTaskInFolder = (folderId: string, taskId: string) => {
    handleDeleteTaskInFolder(folderId, taskId);
    triggerUpdate();
  };

  const openModal = (tasks: ITask[] | null, folderId?: string, addingTask = false) => {
    setSelectedTasks(tasks);
    setCurrentFolderId(folderId || '');
    setIsAddingTask(addingTask);
    setModalShow(true);
  };

  const closeModal = () => {
    resetForm();
    setSelectedTasks(null);
    setCurrentFolderId('');
    setModalShow(false);
  };

  const handleAddNewTask = (newTask: ITask) => {
    if (currentFolderId) {
      dispatch({
        type: 'ADD_TASK',
        payload: {
          folderId: currentFolderId,
          task: newTask,
        },
      });
      triggerUpdate();
    }
  };

  const handleSubmitTask = async (e: React.FormEvent, folderId: string, taskId: string) => {
    e.preventDefault();

    const taskData = {
      name: taskName,
      subTask: subTask,
      priority: priority,
      status: status,
      dueDate: dueDate,
    };

    try {
      await handleUpdateTaskInFolder(folderId, taskId, taskData);
      console.log('Update successful for folder ID:', folderId, 'and task ID:', taskId);
      triggerUpdate();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
    resetForm();
  };

  const resetForm = () => {
    setTaskName('');
    setSubTask('');
    setPriority('');
    setStatus('');
    setDueDate('');
    setModalShow(false);
    setEditingTaskId(null);
  };

  const openEditModal = (task: ITask) => {
    // Set the ID of the task being edited
    setEditingTaskId(task._id);
    
    // Set the state with the current values of the task
    setTaskName(task.name);
    setSubTask(task.subTask || '');
    setPriority(task.priority);
    setStatus(task.status);
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  
    // Open the modal
    setModalShow(true);
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
                </ul>
              </div>
              <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">Favorite: {favorite ? 'True' : 'false'}</p>
                <p className="card-text">Due: {new Date(dueDate).toLocaleDateString('en-GB')}</p>
                <button className="btn btn-primary m-2" onClick={() => openModal(tasks, _id, false)}>View Tasks</button>
                <button className="btn btn-primary m-2" onClick={() => openModal(null, _id, true)}>Add Task</button>
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
        <div className="modal fade show" id="taskModal" tabIndex={-1} style={{ display: 'block' }} aria-labelledby="taskModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="taskModalLabel">Task Details</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {selectedTasks.map((task, index) => (
                  <div key={index} className="mb-2">
                    <div>
                      {editingTaskId === task._id ? (
                        <div className="edit-mode">
                          <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            placeholder="Task name"
                          />
                          <textarea
                            value={subTask}
                            onChange={(e) => setSubTask(e.target.value)}
                            placeholder="Subtask"
                          ></textarea>
                          <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                          >
                            <option value="Low">Low</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                          </select>
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In progress">In progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            placeholder="Due Date"
                          />
                          <div className="edit-mode-buttons">
                            <button className="btn btn-primary btn-sm" onClick={(e) => handleSubmitTask(e, currentFolderId, task._id)}>Save changes</button>
                            <button className="btn btn-danger btn-sm" onClick={() => setEditingTaskId(null)}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p><strong>Task:</strong> {task.name}</p>
                          <p><strong>Subtask:</strong> {task.subTask}</p>
                          <p><strong>Priority:</strong> {task.priority}</p>
                          <p><strong>Status:</strong> {task.status}</p>
                          <p><strong>Due Date:</strong> {task.dueDate ? (typeof task.dueDate === 'string' ? task.dueDate : new Date(task.dueDate).toLocaleDateString('en-GB')) : "No date"}</p>
                          <p><strong>Task created:</strong> {new Date(task.createdTask).toLocaleDateString()}</p>
                          <button className="btn btn-primary btn-sm" onClick={() => openEditModal(task)}><FontAwesomeIcon icon={faPencilAlt} /> Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => onDeleteTaskInFolder(currentFolderId, task._id)}>Delete</button>
                        </div>
                      )}
                    </div>
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
