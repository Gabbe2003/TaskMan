import React, { useContext } from 'react';
import AuthContext from './src/usersPage/authHandlers/authContext';
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const naivgate = useNavigate();
  const Handler = () => {
    naivgate('/dashboard')
  } 

  if (!user) {
    return <p>Please log in.</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <button onClick={logout}>Logout</button>
      <button onClick={Handler}>dashboard</button>
    </div>
  );
};

export default UserProfile;
