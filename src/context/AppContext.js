import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getItem, setItem } from '../shared/utils/storage';
import { loadAccounts, saveAccounts } from '../features/security/encryption';

const AppContext = createContext();

const SETTINGS_KEY = 'app_settings';

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
  const [isReady, setIsReady] = React.useState(false);

  // Load on mount
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      // Load settings
      try {
        const saved = await getItem(SETTINGS_KEY);
        if (saved && mounted) {
          const parsed = JSON.parse(saved);
          console.log('[AppContext] Loaded settings:', saved);
          dispatch({ type: 'SET_SETTINGS', payload: { ...defaultSettings, ...parsed } });
        } else {
          console.log('[AppContext] No saved settings found, using defaults');
        }
      } catch (e) {
        console.warn('Failed to load settings:', e);
      }

      // Load accounts
      try {
        const accounts = await loadAccounts();
        if (accounts && accounts.length > 0 && mounted) {
          dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
        }
      } catch (e) {
        console.warn('Failed to load accounts:', e);
      }

      if (mounted) setIsReady(true);
    };
    init();
    return () => { mounted = false; };
  }, []);

  // Save settings whenever they change (after mount)
  useEffect(() => {
    if (!isReady) return;
    console.log('[AppContext] Saving settings:', JSON.stringify(state.settings));
    setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  }, [state.settings, isReady]);

  // Save accounts whenever they change (after mount)
  useEffect(() => {
    if (!isReady) return;
    if (state.accounts.length > 0) {
      saveAccounts(state.accounts);
    } else {
      import('../features/security/encryption').then(({ clearAccounts }) => clearAccounts());
    }
  }, [state.accounts, isReady]);

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
