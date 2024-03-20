import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './authContext'; 

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, isSessionLoading, logout } = useContext(AuthContext);

  if (isSessionLoading) {
    return; 
  }

  if (!user) {
    console.error('Access denied. User not authenticated.');
    logout();
    return <Navigate to="/" />;
  }
  return children;
};

export default PrivateRoute;