import React, { createContext, useState, type ReactNode } from 'react';
import { type AppState, type Threshold, type HeatingSeason } from './types';

interface AppContextProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  updateThreshold: (newThresholds:Threshold[]) => void;
  updateHeatingSeason: (season: HeatingSeason) => void;
}

const defaultState: AppState = {
  thresholds: [],
  heatingSeason: null,
};

export const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(defaultState);

  const updateThreshold = (newThresholds: Threshold[] ) => {
    setState(prev => ({
      ...prev,
      thresholds: newThresholds
    }));
  };

  const updateHeatingSeason = (season: HeatingSeason) => {
    setState(prev => ({
      ...prev,
      heatingSeason: season,
    }));
  };

  return (
    <AppContext.Provider value={{ state, setState, updateThreshold, updateHeatingSeason }}>
      {children}
    </AppContext.Provider>
  );
};
