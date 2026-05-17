import React, { createContext, useContext, useReducer, useEffect, useRef, useState } from 'react';
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

// Load settings synchronously for initial state
function loadInitialSettings() {
  try {
    const saved = AsyncStorage.getItem(SETTINGS_KEY);
    // getItem returns a Promise, but we can use the sync-compatible approach
    // by storing in a module-level cache
    return null; // Will be handled below
  } catch {
    return null;
  }
}

// Module-level cache for synchronous initial state
let cachedSettings = null;

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
  const [ready, setReady] = useState(false);

  // Load settings and accounts on mount
  useEffect(() => {
    const init = async () => {
      // Load settings
      try {
        const saved = await AsyncStorage.getItem(SETTINGS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          cachedSettings = parsed;
          dispatch({ type: 'SET_SETTINGS', payload: { ...defaultSettings, ...parsed } });
        }
      } catch {
        // Use defaults on parse error
      }

      // Load accounts
      try {
        const accounts = await loadAccounts();
        if (accounts && accounts.length > 0) {
          dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
        }
      } catch {
        // Use empty accounts on error
      }

      setReady(true);
    };
    init();
  }, []);

  // Save settings when changed (only after initial load)
  const firstSaveSkipped = useRef(false);
  useEffect(() => {
    if (!ready) return;
    // Skip the very first save that comes from loading persisted data
    if (!firstSaveSkipped.current) {
      firstSaveSkipped.current = true;
      // If we just loaded from storage, no need to write back
      if (cachedSettings && JSON.stringify(state.settings) === JSON.stringify({ ...defaultSettings, ...cachedSettings })) {
        return;
      }
    }
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  }, [ready, state.settings]);

  // Save accounts when changed (skip initial load)
  const accountsFirstSaveSkipped = useRef(false);
  useEffect(() => {
    if (!ready) return;
    if (!accountsFirstSaveSkipped.current) {
      accountsFirstSaveSkipped.current = true;
      return;
    }
    if (state.accounts.length > 0) {
      saveAccounts(state.accounts);
    } else {
      import('../features/security/encryption').then(({ clearAccounts }) => clearAccounts());
    }
  }, [ready, state.accounts]);

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
