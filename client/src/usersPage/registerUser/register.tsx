import React, { useState } from "react";
import axios, { AxiosError } from 'axios';
import Alert from "../errorHandler";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { IAlert, IErrorResponse} from "../../interface/data";

import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from 'mdb-react-ui-kit';

interface IRegisterUserForm {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}


const Register = () => {
  const [registerForm, setRegisterForm] = useState<IRegisterUserForm>({ username: '', email: '', password: '', confirmPassword: '' });
  const [alert, setAlert] = useState<IAlert>({ message: '', type: '' });
  const [passwordShown, setPasswordShown] = useState(false);
  const navigate = useNavigate();

  const handleRegisterFormChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [event.target.name]: event.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const dismissAlert = () => {
    setAlert({ message: '', type: '' }); // Reset the alert
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const registerURL = 'http://localhost:8000/register';
      const response = await axios.post(registerURL, registerForm);

      if (response.status === 201) {
        setAlert({ message: 'Registration successful!', type: 'success' });
        setRegisterForm({ username: '', email: '', password: '', confirmPassword: '' });
        navigate('/');
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>;
      if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
        setAlert({ message: axiosError.response.data.message, type: 'error' });
      } else if (axiosError.request) {
        setAlert({ message: 'No response from the server. Please try again later.', type: 'error' });
      } else {
        console.log('Error', axiosError.message);
        setAlert({ message: 'An unexpected error occurred. Please try again later.', type: 'error' });
      }
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{ backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)' }}>
    <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-5' style={{maxWidth: '600px'}}>
        <MDBCardBody className='px-5'>
          <p className="mt-3 text-center mb-5">Create an account</p>
          
      {/* Display alert message above the form */}
        {alert.message && (
        <Alert message={alert.message} type={alert.type} dismissAlert={dismissAlert} />
      )}


<form onSubmit={handleRegisterSubmit} className="needs-validation">
  <MDBInput 
    wrapperClass={`mb-4 ${!registerForm.username && 'is-invalid'}`}
    label='Your Name' 
    size='lg' 
    id='form1' 
    type='text' 
    name='username' 
    required
    value={registerForm.username} 
    onChange={handleRegisterFormChanges} 
  />
  <MDBInput 
    wrapperClass={`mb-4 ${!registerForm.email && 'is-invalid'}`}
    label='Your Email' 
    size='lg' 
    id='form2' 
    type='email' 
    name='email' 
    value={registerForm.email} 
    onChange={handleRegisterFormChanges} 
    required
  />
  <div className='password-field mb-4'>
    <MDBInput 
      wrapperClass={`mb-4 ${!registerForm.password && 'is-invalid'}`}
      label='Password' 
      size='lg' 
      id='form3' 
      type={passwordShown ? "text" : "password"} 
      name='password' 
      value={registerForm.password} 
      onChange={handleRegisterFormChanges} 
      required
    />
    <button className='toggle-password' onClick={togglePasswordVisibility} type="button">
      {passwordShown ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>
  <MDBInput 
    wrapperClass={`mb-4 ${!registerForm.confirmPassword && 'is-invalid'}`}
    label='Repeat your password' 
    size='lg' 
    id='form4' 
    type={passwordShown ? "text" : "password"} 
    name='confirmPassword' 
    value={registerForm.confirmPassword} 
    onChange={handleRegisterFormChanges} 
    required
  />
  <div className='d-flex flex-row justify-content-center mb-4'>
  </div>
  <button type="submit" className="btn btn-primary w-100">Register</button>
  <a href="/">Want to sign in?</a>
</form>

        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Register;
