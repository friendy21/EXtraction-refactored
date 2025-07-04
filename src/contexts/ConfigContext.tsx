'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Connection } from '../types/connections';

// Configuration types
export interface AppConfig {
  // Connection settings
  connections: {
    autoSync: boolean;
    defaultSyncFrequency: 'hourly' | 'daily' | 'weekly';
    dataRetentionDays: number;
    enabledConnections: string[];
  };
  
  // Dashboard settings
  dashboard: {
    theme: 'light' | 'dark' | 'system';
    defaultView: 'overview' | 'analytics' | 'data';
    refreshInterval: number;
    showNotifications: boolean;
  };
  
  // Organization settings
  organization: {
    name: string;
    industry: string;
    size: 'small' | 'medium' | 'large' | 'enterprise';
    timezone: string;
    locale: string;
  };
  
  // Setup state
  setup: {
    isCompleted: boolean;
    currentStep: number;
    completedSteps: string[];
    skippedSteps: string[];
  };
  
  // User preferences
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    dataExportFormat: 'csv' | 'json' | 'xlsx';
  };
}

// Default configuration
const DEFAULT_CONFIG: AppConfig = {
  connections: {
    autoSync: true,
    defaultSyncFrequency: 'daily',
    dataRetentionDays: 90,
    enabledConnections: [],
  },
  dashboard: {
    theme: 'system',
    defaultView: 'overview',
    refreshInterval: 300000, // 5 minutes
    showNotifications: true,
  },
  organization: {
    name: '',
    industry: '',
    size: 'medium',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: 'en-US',
  },
  setup: {
    isCompleted: false,
    currentStep: 1,
    completedSteps: [],
    skippedSteps: [],
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    dataExportFormat: 'csv',
  },
};

// Action types
type ConfigAction =
  | { type: 'LOAD_CONFIG'; payload: Partial<AppConfig> }
  | { type: 'UPDATE_CONNECTIONS'; payload: Partial<AppConfig['connections']> }
  | { type: 'UPDATE_DASHBOARD'; payload: Partial<AppConfig['dashboard']> }
  | { type: 'UPDATE_ORGANIZATION'; payload: Partial<AppConfig['organization']> }
  | { type: 'UPDATE_SETUP'; payload: Partial<AppConfig['setup']> }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<AppConfig['preferences']> }
  | { type: 'COMPLETE_SETUP_STEP'; payload: string }
  | { type: 'SKIP_SETUP_STEP'; payload: string }
  | { type: 'RESET_CONFIG' }
  | { type: 'SYNC_CONNECTIONS'; payload: Connection[] };

// Reducer
function configReducer(state: AppConfig, action: ConfigAction): AppConfig {
  switch (action.type) {
    case 'LOAD_CONFIG':
      return { ...state, ...action.payload };
      
    case 'UPDATE_CONNECTIONS':
      return {
        ...state,
        connections: { ...state.connections, ...action.payload },
      };
      
    case 'UPDATE_DASHBOARD':
      return {
        ...state,
        dashboard: { ...state.dashboard, ...action.payload },
      };
      
    case 'UPDATE_ORGANIZATION':
      return {
        ...state,
        organization: { ...state.organization, ...action.payload },
      };
      
    case 'UPDATE_SETUP':
      return {
        ...state,
        setup: { ...state.setup, ...action.payload },
      };
      
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
      
    case 'COMPLETE_SETUP_STEP':
      return {
        ...state,
        setup: {
          ...state.setup,
          completedSteps: [...new Set([...state.setup.completedSteps, action.payload])],
          skippedSteps: state.setup.skippedSteps.filter(step => step !== action.payload),
        },
      };
      
    case 'SKIP_SETUP_STEP':
      return {
        ...state,
        setup: {
          ...state.setup,
          skippedSteps: [...new Set([...state.setup.skippedSteps, action.payload])],
          completedSteps: state.setup.completedSteps.filter(step => step !== action.payload),
        },
      };
      
    case 'SYNC_CONNECTIONS':
      return {
        ...state,
        connections: {
          ...state.connections,
          enabledConnections: action.payload
            .filter(conn => conn.status === 'connected')
            .map(conn => conn.id),
        },
      };
      
    case 'RESET_CONFIG':
      return DEFAULT_CONFIG;
      
    default:
      return state;
  }
}

// Context
interface ConfigContextType {
  config: AppConfig;
  updateConnections: (updates: Partial<AppConfig['connections']>) => void;
  updateDashboard: (updates: Partial<AppConfig['dashboard']>) => void;
  updateOrganization: (updates: Partial<AppConfig['organization']>) => void;
  updateSetup: (updates: Partial<AppConfig['setup']>) => void;
  updatePreferences: (updates: Partial<AppConfig['preferences']>) => void;
  completeSetupStep: (step: string) => void;
  skipSetupStep: (step: string) => void;
  syncConnections: (connections: Connection[]) => void;
  resetConfig: () => void;
  saveConfig: () => void;
  loadConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// Storage keys
const CONFIG_STORAGE_KEY = 'app_config';

// Provider component
interface ConfigProviderProps {
  children: React.ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [config, dispatch] = useReducer(configReducer, DEFAULT_CONFIG);

  // Load config from localStorage on mount
  useEffect(() => {
    loadConfig();
  }, []);

  // Save config to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    }
  }, [config]);

  const updateConnections = (updates: Partial<AppConfig['connections']>) => {
    dispatch({ type: 'UPDATE_CONNECTIONS', payload: updates });
  };

  const updateDashboard = (updates: Partial<AppConfig['dashboard']>) => {
    dispatch({ type: 'UPDATE_DASHBOARD', payload: updates });
  };

  const updateOrganization = (updates: Partial<AppConfig['organization']>) => {
    dispatch({ type: 'UPDATE_ORGANIZATION', payload: updates });
  };

  const updateSetup = (updates: Partial<AppConfig['setup']>) => {
    dispatch({ type: 'UPDATE_SETUP', payload: updates });
  };

  const updatePreferences = (updates: Partial<AppConfig['preferences']>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: updates });
  };

  const completeSetupStep = (step: string) => {
    dispatch({ type: 'COMPLETE_SETUP_STEP', payload: step });
  };

  const skipSetupStep = (step: string) => {
    dispatch({ type: 'SKIP_SETUP_STEP', payload: step });
  };

  const syncConnections = (connections: Connection[]) => {
    dispatch({ type: 'SYNC_CONNECTIONS', payload: connections });
  };

  const resetConfig = () => {
    dispatch({ type: 'RESET_CONFIG' });
  };

  const saveConfig = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    }
  };

  const loadConfig = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          dispatch({ type: 'LOAD_CONFIG', payload: parsedConfig });
        }
      } catch (error) {
        console.error('Failed to load config from localStorage:', error);
      }
    }
  };

  const value: ConfigContextType = {
    config,
    updateConnections,
    updateDashboard,
    updateOrganization,
    updateSetup,
    updatePreferences,
    completeSetupStep,
    skipSetupStep,
    syncConnections,
    resetConfig,
    saveConfig,
    loadConfig,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}

// Hook to use config context
export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}

// Utility hooks for specific config sections
export function useConnectionsConfig() {
  const { config, updateConnections } = useConfig();
  return {
    connectionsConfig: config.connections,
    updateConnections,
  };
}

export function useDashboardConfig() {
  const { config, updateDashboard } = useConfig();
  return {
    dashboardConfig: config.dashboard,
    updateDashboard,
  };
}

export function useOrganizationConfig() {
  const { config, updateOrganization } = useConfig();
  return {
    organizationConfig: config.organization,
    updateOrganization,
  };
}

export function useSetupConfig() {
  const { config, updateSetup, completeSetupStep, skipSetupStep } = useConfig();
  return {
    setupConfig: config.setup,
    updateSetup,
    completeSetupStep,
    skipSetupStep,
  };
}

export function usePreferencesConfig() {
  const { config, updatePreferences } = useConfig();
  return {
    preferencesConfig: config.preferences,
    updatePreferences,
  };
}

