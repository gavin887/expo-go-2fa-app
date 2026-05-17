import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadAccounts, saveAccounts } from '../features/security/encryption';

const AppContext = createContext();

const SETTINGS_KEY = '@app_settings';

const defaultSettings = {
  timeSyncEnabled: true,
  timeOffset: 0,
  lastCalibration: null,
  appLockEnabled: false,
  appLockType: 'none',
};

const initialState = {
  accounts: [],
  settings: defaultSettings,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map((acc) =>
          acc.id === action.payload.id ? action.payload : acc
        ),
      };
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter((acc) => acc.id !== action.payload),
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const isInitialized = useRef(false);

  // Load settings and accounts on mount
  useEffect(() => {
    const init = async () => {
      // Load settings
      try {
        const saved = await AsyncStorage.getItem(SETTINGS_KEY);
        if (saved) {
          dispatch({ type: 'SET_SETTINGS', payload: { ...defaultSettings, ...JSON.parse(saved) } });
        }
      } catch {
        // Use defaults on parse error
      }

      // Load accounts
      const accounts = await loadAccounts();
      if (accounts && accounts.length > 0) {
        dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
      }
      isInitialized.current = true;
    };
    init();
  }, []);

  // Save settings when changed
  useEffect(() => {
    if (!isInitialized.current) return;
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  }, [state.settings]);

  // Save accounts when changed (skip initial load)
  useEffect(() => {
    if (!isInitialized.current) return;
    if (state.accounts.length > 0) {
      saveAccounts(state.accounts);
    } else {
      import('../features/security/encryption').then(({ clearAccounts }) => clearAccounts());
    }
  }, [state.accounts]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
