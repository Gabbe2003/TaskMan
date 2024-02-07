import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import Alert from '../errorHandler';
import { IAlert, IErrorResponse } from '../../interface/data';
import AuthContext  from '../authHandlers/authContext';

interface ILoginForm {
  identifier: string;
  password: string;
}


const LoginForm: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [passwordShown, setPasswordShown] = useState(false);
  const [loginForm, setLoginForm] = useState<ILoginForm>({ identifier: '', password: '' });
  const [alert, setAlert] = useState<IAlert>({ message: '', type: '' });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };


  const dismissAlert = () => {
    setAlert({ message: '', type: '' }); // Reset the alert
  };

  const handleLoginFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginForm({ ...loginForm, [name]: value });
  };


  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const loginURL = 'http://localhost:8000/auth';
      const response = await axios.post(loginURL, loginForm, {
        withCredentials: true
      });

        navigate('/dashboard'); // Navigate to dashboard upon successful session verification
        login(response.data); // Update user state with login data
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>;
      if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
        setAlert({ message: axiosError.response.data.message, type: 'error' });
      } else if (axiosError.request) {
        // Check if the request was made but no response was received
        setAlert({ message: 'No response from the server. Please try again later.', type: 'error' });
      } else {
        // Other errors
        console.log('Error', axiosError.message);
        setAlert({ message: 'An unexpected error occurred. Please try again later.', type: 'error' });
      }
    }
  };

  return (
    <div className='d-flex align-items-center justify-content-center' style={{ backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)', height: '100vh' }}>
      <div className='mask gradient-custom-3'></div>
      <div className='card m-5' style={{ maxWidth: '600px' }}>
        <div className='card-body px-5'>
          <p className="mt-3 text-center mb-5">Log in to your account</p>
          
          {/* Display alert message above the form */}
          {alert.message && (
            <Alert message={alert.message} type={alert.type} dismissAlert={dismissAlert} />
          )}

          <form onSubmit={handleLoginSubmit} className="needs-validation" noValidate>
            <div className="mb-4">
              <label htmlFor="identifier" className="form-label">Username or Email</label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="identifier"
                name="identifier"
                required
                value={loginForm.identifier}
                onChange={handleLoginFormChange}
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type={passwordShown ? "text" : "password"}
                className="form-control form-control-lg"
                id="password"
                name="password"
                required
                value={loginForm.password}
                onChange={handleLoginFormChange}
              />
              <button className="btn btn-secondary btn-sm" onClick={togglePasswordVisibility} type="button">
                {passwordShown ? 'Hide' : 'Show'}
              </button>
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100">Login</button>
            <a href='/Register'>Not a member? Sign up today!</a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
