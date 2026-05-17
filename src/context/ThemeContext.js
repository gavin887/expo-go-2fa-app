import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../shared/theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();
export { ThemeContext };

const THEME_KEY = '@theme_preference';

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system');

  const isDark =
    themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';
  const colors = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved) setThemeMode(saved);
    });
  }, []);

  const updateTheme = async (mode) => {
    setThemeMode(mode);
    await AsyncStorage.setItem(THEME_KEY, mode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: isDark ? 'dark' : 'light',
        colors,
        themeMode,
        setThemeMode: updateTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
