import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from './authHandlers/authContext';
import { useNavigate } from 'react-router-dom';
import UserDataDisplay from './api/folderComponents/getUsersFolder';
import HandleCreateFolder from './api/folderComponents/createFolder';
import { toast } from 'react-toastify';
import { handleDeleteUser } from './settings/userSettingsCalls/API_components/deleteUserComponent';
import { handleUpdateUser } from './settings/userSettingsCalls/API_components/updateUserComponent';
import { useFolderUpdate } from './utilities/folder/folderUpdatecontext';

export interface IUser {
  _id: string,
  username: string,
  email: string,
  password: string,
}
const UserProfile: React.FC = () => {
  const { logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<IUser | null>(null);
  const [updateFormData, setUpdateFormData] = useState({ email: '', username: '' });
  const { triggerUpdate, updateSignal } = useFolderUpdate();
  
  const deleteUser = async () => {
    if (userData && userData._id) {
      try {
        const userId = userData._id;
        const result = await handleDeleteUser(userId);
        console.log(result);
        setUser(null);
        navigate('/');
        toast.success('User successfully deleted.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error:any) {
        console.error(error);
        toast.error(error.response?.data?.message || 'An unexpected error occurred.');
      } 
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8000/logout', {}, {
        withCredentials: true
      });
      console.log(response.data.message); 
      toast.warning(response.data.message)
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    logout();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/getUserData', {
          withCredentials: true,
        });
          setUserData(response.data);
          console.log(response.data)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, [triggerUpdate, updateSignal]);
  
  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userData && userData._id && updateFormData.email && updateFormData.username) {
      try {
        await handleUpdateUser(userData._id, updateFormData.username, updateFormData.email);
        triggerUpdate();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Failed to update user data:', error);
        toast.error(error.response?.data?.message || 'An unexpected error occurred.');
      }
    } else {
      toast.error('Failed to update the data');
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Settings
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  
                  <li className="d-flex justify-content-center align-items-center bg-info text-white rounded" style={{cursor: 'pointer'}} data-bs-toggle="modal" data-bs-target="#updateModal">Update User</li>
                  <br></br>
                  
                  <li className="d-flex justify-content-center align-items-center bg-danger text-white rounded" style={{cursor: 'pointer'}} data-bs-toggle="modal" data-bs-target="#deleteModal">Delete User</li>
                  <br></br>

                  <li className="d-flex justify-content-center align-items-center bg-warning text-white rounded" style={{cursor: 'pointer'}} onClick={handleLogout}>Logout</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  
      <div className="modal fade" id="deleteModal" tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true">
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

      {/* Update User Info Modal */}
      <div className="modal fade" id="updateModal" tabIndex={-1} aria-labelledby="updateUserModal" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
            <h5 className="modal-title" id="updateUserModal">Update User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <form onSubmit={handleSubmitUpdate}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="updateEmail" className="form-label">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="updateEmail"
                    value={updateFormData.email}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, email: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="updateUsername" className="form-label">Username:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="updateUsername"
                    value={updateFormData.username}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, username: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" className="btn btn-primary"  data-bs-dismiss="modal" onClick={handleSubmitUpdate}>Save changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <br></br>
      <HandleCreateFolder />
      <br></br>
      <UserDataDisplay />
    </>
  );
};

export default UserProfile;