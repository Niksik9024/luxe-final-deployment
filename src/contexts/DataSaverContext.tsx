'use client';
import { createContext, useState, useContext, ReactNode } from 'react';

type DataSaverContextType = {
  isDataSaver: boolean;
  toggleDataSaver: () => void;
};

const DataSaverContext = createContext<DataSaverContextType | undefined>(undefined);

export const DataSaverProvider = ({ children }: { children: ReactNode }) => {
  const [isDataSaver, setIsDataSaver] = useState(false);
  const toggleDataSaver = () => setIsDataSaver(prev => !prev);
  return (
    <DataSaverContext.Provider value={{ isDataSaver, toggleDataSaver }}>
      {children}
    </DataSaverContext.Provider>
  );
};

export const useDataSaver = () => {
  const context = useContext(DataSaverContext);
  if (context === undefined) {
    throw new Error('useDataSaver must be used within a DataSaverProvider');
  }
  return context;
};
