import React, { useState, useContext } from 'react';
import axios from 'axios';
import { TaskContext } from '../../utilities/tasks/taskReducer'; // Adjust the import path as needed
import { ITask } from '../../../interface/data'; // Ensure this path is correct
import { useFolderUpdate } from '../../utilities/folder/folderUpdatecontext';

interface ITaskFormProps {
  show: boolean;
  onClose: () => void;
  initialTask?: ITask; 
  folderId: string | null;
  onSubmit: (newTask: ITask) => void; 

}


const TaskForm: React.FC<ITaskFormProps> = ({ show, onClose, initialTask, folderId}) => {
  const { triggerUpdate } = useFolderUpdate();
    const [task, setTask] = useState<ITask>(initialTask || {
        id: '',
        name: '',
        subTask: '',
        dueDate: '',
        priority: 'low',
        status: 'pending',
        createdTask: new Date().toISOString(),
    });

    const { dispatch } = useContext(TaskContext)!;

    const handleChange = (field: keyof ITask, value: string) => {
        setTask(prevTask => ({ ...prevTask, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Perform the POST request to add the task to the backend
            const response = await axios.post(`http://localhost:8000/post/tasks/${folderId}`, task, {
                withCredentials: true,
            });
            console.log('Task submitted successfully', response.data); // Log or handle response as needed
            triggerUpdate();
            // Dispatch ADD_TASK action to update the global state with the new task
            dispatch({ type: 'ADD_TASK', payload: { task: response.data, folderId: response.data } });
            
            onClose(); // Close the form/modal
        } catch (error) {
            console.error('Failed to submit task', error);
        }
    };


  return (
    <div className={`modal ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Task</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit} className="modal-body">
        {/* Task Name */}
        <div className="mb-3">
            <label htmlFor="taskName" className="form-label">Task Name</label>
            <input type="text" className="form-control" id="taskName" value={task.name} onChange={(e) => handleChange('name', e.target.value)} required />
        </div>
      {/* Sub Task */}
      <div className="mb-3">
        <label htmlFor="taskSubTask" className="form-label">Sub Task</label>
        <input type="text" className="form-control" id="taskSubTask" value={task.subTask} onChange={(e) => handleChange('subTask', e.target.value)} />
      </div>

      {/* Priority */}
      <div className="mb-3">
        <label htmlFor="taskPriority" className="form-label">Priority</label>
        <select className="form-select" id="taskPriority" value={task.priority} onChange={(e) => handleChange('priority', e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Status */}
      <div className="mb-3">
        <label htmlFor="taskStatus" className="form-label">Status</label>
        <select className="form-select" id="taskStatus" value={task.status} onChange={(e) => handleChange('status', e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Due Date */}
      <div className="mb-3">
        <label htmlFor="taskDueDate" className="form-label">Due Date</label>
        <input type="date" className="form-control" id="taskDueDate" value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''} onChange={(e) => handleChange('dueDate', e.target.value)} />
      </div>

      <button type="submit" className="btn btn-primary">Save Task</button>
          </form>
        </div>
      </div>
    </div>
  );
};  
export default TaskForm;