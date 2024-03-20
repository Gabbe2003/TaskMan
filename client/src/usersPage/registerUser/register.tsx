import React, { useState } from "react";
import axios, { AxiosError } from 'axios';
import useToast from "../../../hooks/useToastHook";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { MDBContainer, MDBCard, MDBCardBody, MDBInput, } from 'mdb-react-ui-kit';
import { IErrorResponse } from "../../interface/data";
import '../../style/loginPage.scss';

interface IRegisterUserForm {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

const Register = () => {
  const [registerForm, setRegisterForm] = useState<IRegisterUserForm>({ username: '', email: '', password: '', confirmPassword: '' });
  const [passwordShown, setPasswordShown] = useState(false);
  const showToast = useToast(); 
  const navigate = useNavigate();

  const handleRegisterFormChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [event.target.name]: event.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const registerURL = 'http://localhost:8000/register';
      const response = await axios.post(registerURL, registerForm);

      if (response.status === 201) {
        showToast(response.data.success, 'success');
        console.log(response)
        setRegisterForm({ username: '', email: '', password: '', confirmPassword: '' });
        navigate('/');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      const axiosError = error as AxiosError<IErrorResponse>;
      
      if (axiosError.response && axiosError.response.data) {
        const errorMessage = axiosError.response.data.message; 
        if (errorMessage) {
          showToast(errorMessage, 'error');
        } else {
          showToast('An error occurred, but no error message was provided.', 'error');
        }
      } else if (axiosError.request) {
        showToast('No response from the server. Please try again later.', 'error');
      } else {
        showToast('An unexpected error occurred. Please try again later.', 'error');
      }
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center background-image-container' style={{ minHeight: '100vh' }}>
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='my-3 my-sm-2 mx-2 mx-sm-3' style={{ maxWidth: '90%', width: 'auto' }}>
        <MDBCardBody className='p-4 p-sm-3'>
          <p className="text-center mb-5" style={{ fontSize: '1rem', margin: '1rem 0' }}>Create an account</p>

          <form onSubmit={handleRegisterSubmit} className="needs-validation">
            <MDBInput 
              wrapperClass={`mb-3 mb-sm-4 ${!registerForm.username && 'is-invalid'}`}
              label='Your Name' 
              size='sm' 
              id='form1' 
              type='text' 
              name='username' 
              required
              value={registerForm.username} 
              onChange={handleRegisterFormChanges} 
            />
            <MDBInput 
              wrapperClass={`mb-3 mb-sm-4 ${!registerForm.email && 'is-invalid'}`}
              label='Your Email' 
              size='sm' 
              id='form2' 
              type='email' 
              name='email' 
              value={registerForm.email} 
              onChange={handleRegisterFormChanges} 
              required
            />
            <div className='password-field mb-3 mb-sm-4'>
              <MDBInput 
                wrapperClass={`mb-3 mb-sm-4 ${!registerForm.password && 'is-invalid'}`}
                label='Password' 
                size='sm' 
                id='form3' 
                type={passwordShown ? "text" : "password"} 
                name='password' 
                value={registerForm.password} 
                onChange={handleRegisterFormChanges} 
                required
              />
              <button className="btn btn-secondary btn-sm" onClick={togglePasswordVisibility} type="button">
                {passwordShown ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <MDBInput 
              wrapperClass={`mb-3 mb-sm-4 ${!registerForm.confirmPassword && 'is-invalid'}`}
              label='Repeat your password' 
              size='sm' 
              id='form4' 
              type={passwordShown ? "text" : "password"} 
              name='confirmPassword' 
              value={registerForm.confirmPassword} 
              onChange={handleRegisterFormChanges} 
              required
            />
            <button type="submit" className="btn btn-primary w-100">Register</button>
            <a href="/" className="d-flex">Want to sign in?</a>
          </form>

        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Register;