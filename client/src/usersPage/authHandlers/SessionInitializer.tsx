import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './authContext';

const SessionInitializer = () => {
  const { user, verifySession } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const sessionIsValid = await verifySession();
        if (sessionIsValid) {
          // Redirect to the dashboard if the session verification is successful
          navigate('/dashboard');
        } else {
          // Optionally, redirect to login if session is not valid
          // navigate('/');
        }
      } catch (error) {
        console.log('Session verification failed:', error);
        // Handle failure, possibly redirecting to login page
        // navigate('/');
      }
    };

    // Run the session initializer only if the user state is not already set
    if (!user) {
      initializeAuth();
    }
  }, [user, verifySession, navigate]);

  return null; // This component does not render anything
};

export default SessionInitializer;
