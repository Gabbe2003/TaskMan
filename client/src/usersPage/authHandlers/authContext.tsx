import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import axios from 'axios'; // Ensure axios is available
import { plainHttp } from './AxiosInterceptor';

interface User {
  id: string;
  username: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  verifySession: () => Promise<boolean>;
  isSessionLoading: boolean;
  setUser: (userData: User | null) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  verifySession: async () => false,
  isSessionLoading: true,
  setUser: () => {}
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [sessionVerified, setSessionVerified] = useState(false); // New state to track session verification

  const verifySession = useCallback(async (): Promise<boolean> => {
    setIsSessionLoading(true);
    try {
      const response = await plainHttp.get('http://localhost:8000/verifyUser');
      setUser(response.data.user);
      setIsSessionLoading(false);
      setSessionVerified(true); // Indicate session is verified
      return true;
    } catch (error) {
      console.error('Session verification failed:', error);
      setIsSessionLoading(false);
      logout();
      setSessionVerified(false); // Reset on failure
      return false;
    }
  }, []);

  useEffect(() => {
    if (sessionVerified) { // Fetch additional data after session is verified
      const fetchData = async () => {
        try {
          const getUserData = await axios.get('http://localhost:8000/get', {
            withCredentials: true
          });
          console.log(getUserData.data);
          // Here you could do something with the fetched data, like updating state
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      };
      fetchData();
    }
  }, [sessionVerified]); // Depend on sessionVerified state

  const logout = () => {
    console.log('User logged out');
    setUser(null);
    setSessionVerified(false); // Reset session verification state on logout
  };

  const contextValue = { user, isSessionLoading, login: setUser, logout, verifySession, setUser };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
