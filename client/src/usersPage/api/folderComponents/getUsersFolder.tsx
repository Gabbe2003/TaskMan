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
import '../../../style/userDataDisplay.scss';
import { handleUpdateTaskInFolder } from '../folderAndTaskDeleteComponent/update/taskUpdate';
import { handleUpdateFolder } from '../folderAndTaskDeleteComponent/update/folderUpdate';
import { toast } from 'react-toastify';

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
  const [, setEditingFolderId] = useState<string | null>(null);
  const [userData, setUserData] = useState<IUserData[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<ITask[] | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { triggerUpdate, updateSignal } = useFolderUpdate();
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<IUserData | null>(null);
  const [folderName, setFolderName] = useState<string>('');
  const [isFolderFavorite, setIsFolderFavorite] = useState<string>('');
  const [folderDueDate, setFolderDueDate] = useState<string>('');
  const [taskName, setTaskName] = useState<string>('');
  const [subTask, setSubTask] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  // Consume TaskContext
  const { dispatch } = useContext(TaskContext)!;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/get', {
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log(response.data)
          setUserData(response.data);
        } else {
          console.error('No data received');
        }
        setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error:any) {
        toast.error('Failed to fetch user data:');
        setLoading(false);
      }
    };
    fetchUserData();
  }, [triggerUpdate, updateSignal ]);

  const onDeleteFolder = async (folderId: string) => {
    await handleDeleteFolder(folderId);
    closeModal();
  };

  const onDeleteTaskInFolder = async (folderId: string, taskId: string) => {
    await handleDeleteTaskInFolder(folderId, taskId);
    closeModal();
  };

  const openModalTasks = (tasks: ITask[] | null, folderId?: string, addingTask = false) => {
    setSelectedTasks(tasks);
    setCurrentFolderId(folderId || '');
    setIsAddingTask(addingTask);
    setModalShow(true);
  };

  const closeModal = () => {
    resetForm();
    setSelectedFolder(null);
    setSelectedTasks(null);
    setCurrentFolderId('');
    setModalShow(false);
    triggerUpdate();
  };

  const handleAddNewTask = async (newTask: ITask) => {
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

  const handleSubmitFolder = async (e: React.FormEvent, folderId: string) => {
    e.preventDefault();

    const folderData = {
      name: folderName,
      favorite: isFolderFavorite === "true",
      dueDate: folderDueDate,
    };
    
    try {
      await handleUpdateFolder(folderId, folderData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error('Failed to update the folder');
    }
    closeModal();
  }

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error('Failed to update task');
    }
    triggerUpdate();
    closeModal()
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
    setEditingTaskId(task._id!);
    setTaskName(task.name);
    setSubTask(task.subTask || '');
    setPriority(task.priority);
    setStatus(task.status);
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setModalShow(true);
  };

  const openFolderEditModal = (_id: string) => {
    const folderToEdit = userData.find(folder => folder._id === _id);
    if (folderToEdit) {
      setCurrentFolderId(_id)
      setSelectedFolder(folderToEdit);
      setEditingFolderId(_id);
      setFolderName(folderToEdit.name);
      setIsFolderFavorite(folderToEdit.favorite ? "true" : "false");
      setFolderDueDate(folderToEdit.dueDate instanceof Date ? folderToEdit.dueDate.toISOString().split('T')[0] : folderToEdit.dueDate);
      setModalShow(true);
    }
  };
  
  if (loading) return <div>Loading user data...</div>;

  return (
    <div className="container mt-5">
      <div className="row g-4">
        {userData.map(({ _id, name, favorite, tasks, dueDate }) => (
          <div key={_id} className="col-sm-6 col-md-3">
            <div className="card h-100 position-relative">
              <div className="dropdown">
                <button
                  className="btn p-2 position-absolute top-0 end-0"
                  type="button"
                  id={`dropdownMenuButton-${_id}`}
                  data-bs-toggle="dropdown"
                >
                  <FontAwesomeIcon icon={faBars} />
                </button>
                <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${_id}`}>
                  <li>
                    <button className="dropdown-item" onClick={() => onDeleteFolder(_id)}>
                      <FontAwesomeIcon icon={faXmark} /> Delete
                    </button>
                    <button className="dropdown-item" onClick={() => openFolderEditModal(_id)}>
                      <FontAwesomeIcon icon={faPencilAlt} /> Edit
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">Favorite: {favorite ? 'True' : 'False'}</p>
                <p className="card-text">Due: {new Date(dueDate).toLocaleDateString('en-GB')}</p>
                <button className="btn btn-primary m-2" onClick={() => openModalTasks(tasks, _id, false)}>View Tasks</button>
                <button className="btn btn-primary m-2" onClick={() => openModalTasks(null, _id, true)}>Add Task</button>
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

      {selectedFolder && (
        <div className="modal fade show" id="folderEditModal" tabIndex={-1} style={{ display: 'block' }} aria-labelledby="folderEditModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="folderEditModalLabel">Edit Folder</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="folderName" className="form-label">Folder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="folderName"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="Enter folder name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="folderFavorite" className="form-label">Mark as Favorite</label>
                  <select
                    className="form-select"
                    id="folderFavorite"
                    value={isFolderFavorite}
                    onChange={(e) => setIsFolderFavorite(e.target.value)}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="folderDueDate" className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="folderDueDate"
                    value={folderDueDate}
                    onChange={(e) => setFolderDueDate(e.target.value)}
                  />
                </div>
                <div className="edit-mode-buttons d-flex justify-content-between">
                  <button className="btn btn-primary btn-sm" onClick={(e) => handleSubmitFolder(e, currentFolderId)}>Save changes</button>
                  <button className="btn btn-danger btn-sm" onClick={closeModal}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
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
                          <button className="btn btn-primary btn-sm" onClick={(e) => handleSubmitTask(e, currentFolderId, task._id!)}>Save changes</button>
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
                        <button className="btn btn-primary btn-sm" onClick={() => openEditModal(task)}><FontAwesomeIcon icon={faPencilAlt} /> Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => onDeleteTaskInFolder(currentFolderId, task._id!)}>Delete</button>
                      </div>
                    )}
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
