import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';


interface FolderUpdateContextType {
  triggerUpdate: () => void;
  updateSignal: number; 
}

const FolderUpdateContext = createContext<FolderUpdateContextType>({
  triggerUpdate: () => {},
  updateSignal: 0, 
});

interface AuthProviderProps {
    children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFolderUpdate = () => useContext(FolderUpdateContext);
export const FolderUpdateProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [updateSignal, setUpdateSignal] = useState(0);

  const triggerUpdate = useCallback(() => {
    setUpdateSignal(prevSignal => prevSignal + 1);
  }, []);

  // This value now matches FolderUpdateContextType
  const value = { triggerUpdate, updateSignal };

  return (
    <FolderUpdateContext.Provider value={value}>
      {children}
    </FolderUpdateContext.Provider>
  );
};
