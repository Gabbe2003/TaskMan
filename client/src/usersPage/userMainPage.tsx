import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from './authHandlers/authContext';
import { useNavigate } from 'react-router-dom';
import UserDataDisplay from './api/folderComponents/getUsersFolder';
import HandleCreateFolder from './api/folderComponents/createFolder';
import { toast } from 'react-toastify';
import { handleDeleteUser } from './settings/userSettingsCalls/API_components/deleteUserComponent';
import '../style/mainPage.scss';
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
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [updateModalShow, setUpdateModalShow] = useState<boolean>(false);
  const [updateFormData, setUpdateFormData] = useState({ email: '', username: '' });
  const { triggerUpdate, updateSignal } = useFolderUpdate();
  
  const requestDeleteUser = () => {
    setModalShow(true); 
  };
  
  
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
      } finally {
        setModalShow(false); 
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
        setUpdateModalShow(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Failed to update user data:', error);
        toast.error(error.response?.data?.message || 'An unexpected error occurred.');
      }
    } else {
      toast.error('Failed to update the data');
    }
  };
  
  const handleUpdateUserClick = () => {
    if (userData) {
      setUpdateFormData({ email: userData.email || '', username: userData.username || '' });
      setUpdateModalShow(true);
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
                  <li className="d-flex justify-content-center align-items-center bg-info text-white rounded" style={{cursor: 'pointer'}} onClick={handleUpdateUserClick}>Change User Info</li>
                  <br></br>
                  <li className="d-flex justify-content-center align-items-center bg-danger text-white rounded" style={{cursor: 'pointer'}} onClick={requestDeleteUser}>Delete User</li>
                  <br></br>
                  <li className="d-flex justify-content-center align-items-center bg-warning text-white rounded" style={{cursor: 'pointer'}} onClick={handleLogout}>Logout</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
     
  
      {/* Update User Info Modal */}
      <div 
        className={`modal fade ${updateModalShow ? 'show' : ''}`} id="updateUserModal" tabIndex={-1} aria-labelledby="updateUserModalLabel" aria-hidden={!updateModalShow} style={{ display: updateModalShow ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdrop">Update User Info</h5>
              <button type="button" className="btn-close" onClick={() => setUpdateModalShow(false)} aria-label="Close"></button>
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
                <button type="button" className="btn btn-secondary" onClick={() => setUpdateModalShow(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete User Confirmation Modal */}
      <div 
        className={`modal fade ${modalShow ? 'show' : ''}`} id="deleteConfirmationModal" tabIndex={-1} aria-labelledby="deleteConfirmationModalLabel" aria-hidden={!modalShow} style={{ display: modalShow ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteConfirmationModalLabel">Confirm Deletion</h5>
              <button type="button" className="btn-close" onClick={() => setModalShow(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this user? The data will be removed and you will not be able to retrieve it back.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setModalShow(false)}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={deleteUser}>Delete User</button>
            </div>
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

// <!-- Button trigger modal -->
// <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
//   Launch static backdrop modal
// </button>

// <!-- Modal -->
// <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
//   <div class="modal-dialog">
//     <div class="modal-content">
//       <div class="modal-header">
//         <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
//         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//       </div>
//       <div class="modal-body">
//         ...
//       </div>
//       <div class="modal-footer">
//         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//         <button type="button" class="btn btn-primary">Understood</button>
//       </div>
//     </div>
//   </div>
// </div>

//WORK WITH THEESE TO MAKE ALL THE MODALS WORK AS THE SHOULD