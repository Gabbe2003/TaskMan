import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './src/usersPage/authHandlers/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AuthContext from './src/usersPage/authHandlers/authContext'; 
import LoginForm from './src/usersPage/loginUser/login';
import RegisterForm from './src/usersPage/registerUser/register';
import PrivateRoute from './src/usersPage/authHandlers/PrivateRoute';
import UserProfile from './src/usersPage/userMainPage';
import SessionInitializer from './src/usersPage/authHandlers/SessionInitializer';
import { setupInterceptors } from './src/usersPage/authHandlers/AxiosInterceptor';
import { FolderProvider } from './src/usersPage/utilities/folder/folderReducer';
import { FolderUpdateProvider } from './src/usersPage/utilities/folder/folderUpdatecontext';
import { TaskProvider } from './src/usersPage/utilities/tasks/taskReducer';
import { ToastContainer } from 'react-toastify'; 
import ResetPasswordForm from './src/usersPage/settings/resetPasswordForm';
import 'react-toastify/dist/ReactToastify.css'; 
import './src/style/mainPage.scss';

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
           <ToastContainer /> {/*Toast container here so that all the children has access to it */}
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <FolderProvider>
                  <FolderUpdateProvider>
                    <TaskProvider>
                      <UserProfile />
                    </TaskProvider>
                  </FolderUpdateProvider>
                </FolderProvider>
              </PrivateRoute>
            } />
            <Route path="/reset-password" element={<ResetPasswordForm />} />

          </Routes>
        </Router>
      </AuthProvider>
    </React.StrictMode>
  );
};

export default App;
