import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAppData } from '../hooks/useAppData';

type AppDataContextType = ReturnType<typeof useAppData> | null;

const appDataContext = createContext<AppDataContextType>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const appData = useAppData();
  return (
    <appDataContext.Provider value={appData}>
      {children}
    </appDataContext.Provider>
  );
}

export function useAppDataContext() {
  const context = useContext(appDataContext);
  if (!context) {
    throw new Error('useAppDataContext must be used within AppDataProvider');
  }
  return context;
}

export default AppDataProvider;
