import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { plainHttp } from './AxiosInterceptor';

interface IUser {
  id: string;
  username: string;
}

export interface IAuthContextType {
  user: IUser | null;
  login: (userData: IUser) => void;
  logout: () => void;
  verifySession: () => Promise<boolean>;
  isSessionLoading: boolean;
  setUser: (userData: IUser | null) => void;
}

interface IAuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  verifySession: async () => false,
  isSessionLoading: true,
  setUser: () => {}
});

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const verifySession = useCallback(async (): Promise<boolean> => {
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

  const logout = () => {
    setUser(null);
  };

  const contextValue = { user, isSessionLoading, login: setUser, logout, verifySession, setUser };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
