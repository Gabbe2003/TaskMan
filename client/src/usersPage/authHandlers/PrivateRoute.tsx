import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './authContext'; 

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, isSessionLoading } = useContext(AuthContext);

  if (isSessionLoading) {
    return <div className='d-flex align-items-center'>Loading...</div>; // Show loading indicator
  }

  if (!user) {
    console.error('Access denied. User not authenticated.');
    return <Navigate to="/" />;
  }
  return children;
};

export default PrivateRoute;