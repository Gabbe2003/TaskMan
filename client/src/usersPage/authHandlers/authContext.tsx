import React, { createContext, useState, ReactNode, useCallback } from 'react';
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
  

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    console.log('User logged out due to token expiration or manual logout');
    setUser(null);
  };

  const verifySession = useCallback( async (): Promise<boolean> => {
    setIsSessionLoading(true);
    try {
      const response = await plainHttp.get('http://localhost:8000/verifyUser');
      setUser(response.data.user);
      setIsSessionLoading(false);
      return true;
    } catch (error) {
      console.error('Session verification failed:', error);
      setIsSessionLoading(false);
      logout();
      return false;
    } 
  }, []);

  const contextValue = { user, isSessionLoading, login, logout, verifySession, setUser };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;