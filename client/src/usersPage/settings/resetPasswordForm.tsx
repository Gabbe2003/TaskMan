import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../style/passwordPage.scss';

function ResetPasswordForm() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState(''); // Added state for password
    const [isValidToken, setIsValidToken] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
  
  useEffect(() => {
    validateToken(token);
  }, [token]);
  
  async function validateToken(token: string | null) {
    if (!token) {
      toast.info('Token is missing.');
      setLoading(false);
      return;
    }
    
    try {
      // Note the endpoint change to match your provided URL
      const response = await axios.get(`http://localhost:8000/resetToken`, {
        params: { token }
      });
      console.log(token)
      console.log(response)
      
      // Assuming the response data has a property that indicates validity
      // Update according to the actual response structure from your backend
      setIsValidToken(response.data.isValid);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      toast.error(error.response.data.message);
      console.error('Error validating token:', error);
      setIsValidToken(false);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:8000/createNewPWD', {
        token,
        newPassword: password,
      });

      if (response.status === 200) {
        toast.success('Password updated successfully.');
        navigate('/')
      } else {
        toast.error('Failed to update the password. Please try again.');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isValidToken) {
    return (
        <div className="full-screen-centered">
          <div className="invalid-link-message">
            This link is either invalid or has expired.
          </div>
        </div>
      );
    }

  // Password reset form goes here
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto', paddingTop: '50px' }}>
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor="newPassword" style={{ marginBottom: '0.5rem' }}>
        New Password:
      </label>
      <input
        type="password"
        id="newPassword"
        name="newPassword"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: '1rem' }}
        className="form-control"
        required
      />
    </div>
    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Reset Password'}
    </button>
  </form>
      );
    }

export default ResetPasswordForm;

