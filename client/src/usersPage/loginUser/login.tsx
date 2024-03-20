import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { IErrorResponse } from '../../interface/data';
import AuthContext from '../authHandlers/authContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ForgetPasswordModal from '../settings/forgetPassword';
import '../../style/loginPage.scss';

interface ILoginForm {
  identifier: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [passwordShown, setPasswordShown] = useState(false);
  const [loginForm, setLoginForm] = useState<ILoginForm>({ identifier: '', password: '' });
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
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
      toast.success('Welcome to your Tasker!');
      navigate('/dashboard');
      login(response.data);
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      const axiosError = error as AxiosError<IErrorResponse>;
      if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
        toast.error(axiosError.response.data.message);
      } else if (axiosError.request) {
        toast.error('No response from the server. Please try again later.');
      } else {
        console.log('Error', axiosError.message);
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  };
  return (
    <div className="background-image-container">
      <div className='mask gradient-custom-3'></div>
      {/* Adjust card margins for smaller screens */}
      <div className='card m-3 m-sm-5' style={{ maxWidth: '90%', width: 'auto' }}>
        <div className='card-body p-4 p-sm-5'>
          <p className="text-center mb-5" style={{ fontSize: '1rem', margin: '1rem 0' }}>Log in to your account</p>
          <form onSubmit={handleLoginSubmit} className="needs-validation" noValidate>
            <div className="mb-3 mb-sm-4">
              <label htmlFor="identifier" className="form-label">Username or Email</label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="identifier"
                name="identifier"
                required
                value={loginForm.identifier}
                onChange={handleLoginFormChange}
              />
            </div>
            <div className='mb-3 mb-sm-4'>
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type={passwordShown ? "text" : "password"}
                className="form-control form-control-sm"
                id="password"
                name="password"
                required
                value={loginForm.password}
                onChange={handleLoginFormChange}
              />
              <button className="btn btn-secondary btn-sm my-2" onClick={togglePasswordVisibility} type="button">
                {passwordShown ? <FaEyeSlash /> : <FaEye />}
              </button>
              <div><a href='/Register'>Not a member?</a></div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm w-100">Login</button>
          </form>
          <button
          type="button"
          className="btn btn-link"
          onClick={() => setIsModalOpen(true)}
          >
            Forget Password?
          </button>
          <ForgetPasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;