import React, { useContext } from 'react';
import axios from 'axios';
import AuthContext from '../authHandlers/authContext';
import { useNavigate } from 'react-router-dom';
import UserDataDisplay from './getUsersFolder';
import HandleCreateFolder from './createFolder';

const UserProfile: React.FC = () => {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Ensure that withCredentials is set correctly
      const response = await axios.post('http://localhost:8000/logout', {}, {
        withCredentials: true
      });
      console.log(response.data.message); 

      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }

    logout();
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <button onClick={handleLogout}>Logout</button>
      <UserDataDisplay />
      <HandleCreateFolder />

    </div>
  );
};

export default UserProfile;
