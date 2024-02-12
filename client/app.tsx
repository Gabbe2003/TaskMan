import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './src/usersPage/authHandlers/authContext';
import AuthContext from './src/usersPage/authHandlers/authContext'; 
import LoginForm from './src/usersPage/loginUser/login';
import RegisterForm from './src/usersPage/registerUser/register';
import PrivateRoute from './src/usersPage/authHandlers/PrivateRoute';
import UserProfile from './src/usersPage/api/logout';
import SessionInitializer from './src/usersPage/authHandlers/SessionInitializer';
import { setupInterceptors } from './src/usersPage/authHandlers/AxiosInterceptor';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FolderProvider } from './src/folderReducer';
import { FolderUpdateProvider } from './src/usersPage/utilities/folderUpdatecontext';

const App: React.FC = () => {
  const { user, setUser, verifySession } = useContext(AuthContext);
  
  useEffect(() => {
    if (!user) {
      setupInterceptors(setUser);
    }
  }, [user, setUser]);

  useEffect(() => {
    verifySession();
  }, [verifySession]); 

  return (
    <React.StrictMode>
      <AuthProvider>
        <Router>
          <SessionInitializer />
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                  <FolderProvider>
                    <FolderUpdateProvider>
                      
                    <UserProfile />

                    </FolderUpdateProvider>
                 </FolderProvider>
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </React.StrictMode>
  );
};

export default App;
