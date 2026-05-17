// [AI] App entry point with all providers and navigation
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppProvider } from './src/context/AppContext';
import { SecurityProvider } from './src/context/SecurityContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <SecurityProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </SecurityProvider>
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
