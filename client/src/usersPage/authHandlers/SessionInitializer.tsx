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
          navigate('/dashboard');
        }
      } catch (error) {
        console.log('Session verification failed:', error);
      }
    };

    if (!user) {
      initializeAuth();
    }
  }, [user, verifySession, navigate]);

  return null;
};

export default SessionInitializer;
