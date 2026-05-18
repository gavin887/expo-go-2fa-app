// [AI] App entry point with all providers and navigation
import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
import { AppProvider } from './src/context/AppContext';
import { SecurityProvider } from './src/context/SecurityContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBarConsumer />
        <AppProvider>
          <SecurityProvider>
            <AppNavigator />
          </SecurityProvider>
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function StatusBarConsumer() {
  const { theme } = useContext(ThemeContext);
  return <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />;
}
