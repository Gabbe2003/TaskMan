import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFolderUpdate } from '../utilities/folderUpdatecontext';
// import { Star } from '@phosphor-icons/react';


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
  dueDate:Date | string;
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
        console.log(response.data);
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

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Data</h2>
      <div className="row g-4">
        {userData.map(({ _id, name, favorite, tasks, dueDate }) => (
          <div key={_id} className="col-sm-6 col-md-3">
            <div className="card h-100" onClick={() => openModal(tasks)}>
              <div className="card-body">
                <h5 className="card-title">{name}</h5>
              {/* <li><button className="dropdown-item" title='Make favorit'  onClick={() => handleToggleFavorite(folder.id)}><Star/>Star</button></li> */}
                <p className="card-text">Favorite: {favorite ? 'Yes' : 'No'}</p>
                <p className="card-text">Done til: {new Date(dueDate).toLocaleDateString('en-GB')}</p>
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