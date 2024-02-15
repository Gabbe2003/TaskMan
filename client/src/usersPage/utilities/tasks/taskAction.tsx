import { IAction, ITask } from '../../../interface/data';

// Action creators for tasks
export const addTask = (folderId: string, task: ITask): IAction => ({
    type: 'ADD_TASK',
    payload: { folderId, task }, 
});

export const removeTask = (folderId: string, taskId: string): IAction => ({
    type: 'REMOVE_TASK',
    payload: { folderId, taskId },
});

export const updateTask = (folderId: string, original: ITask, updated: ITask): IAction => ({
    type: 'UPDATE_TASK',
    payload: { folderId, original, updated },
});

export const setSelectedTask = (task: ITask | null): IAction => ({
    type: 'SET_SELECTED_TASK',
    payload: task,
});

export const setTaskPriority = (taskId: string, priority: 'low' | 'medium' | 'high'): IAction => ({
    type: 'SET_TASK_PRIORITY',
    payload: { taskId, priority },
});

export const setTaskStatus = (taskId: string, status: 'completed' | 'in progress' | 'pending'): IAction => ({
    type: 'SET_TASK_STATUS',
    payload: { taskId, status },
});

export const setTaskName = (taskId: string, name: string): IAction => ({
    type: 'SET_TASK_NAME',
    payload: { taskId, name },
});

export const setTaskDueDate = (taskId: string, dueDate: string): IAction => ({
    type: 'SET_TASK_DUE_DATE',
    payload: { taskId, dueDate },
});
