import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAppLockEnabled, setAppLockEnabled } from '../features/security/app-lock';
import { isBiometricAvailable } from '../features/security/biometric';

const SecurityContext = createContext();

export function SecurityProvider({ children }) {
  const [lockEnabled, setLockEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      const locked = await isAppLockEnabled();
      setLockEnabled(locked);
      const bio = await isBiometricAvailable();
      setBiometricAvailable(bio);
    })();
  }, []);

  const toggleLock = async (enabled) => {
    await setAppLockEnabled(enabled);
    setLockEnabled(enabled);
  };

  return (
    <SecurityContext.Provider
      value={{ lockEnabled, biometricAvailable, toggleLock }}
    >
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) throw new Error('useSecurity must be used within SecurityProvider');
  return context;
}
