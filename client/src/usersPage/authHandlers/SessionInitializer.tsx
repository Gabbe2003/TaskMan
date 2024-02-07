// SessionInitializer.tsx
import { useContext, useEffect } from 'react';
import AuthContext from './authContext';

const SessionInitializer = () => {
  const { verifySession } = useContext(AuthContext);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        verifySession();
      } catch (error) {
        console.log('Session verification failed:', error);
      }
    };

    initializeAuth();
  }, [verifySession]);

  return null;
};

export default SessionInitializer;
