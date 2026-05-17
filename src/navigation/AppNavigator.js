// [AI] App navigation configuration with stack routes
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { ManualAddScreen } from '../screens/ManualAddScreen';
import { ClipboardAddScreen } from '../screens/ClipboardAddScreen';
import { EditAccountScreen } from '../screens/EditAccountScreen';
import { SettingsScreen } from '../features/settings/components/SettingsScreen';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitleStyle: { fontWeight: '800', fontSize: 22 },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Scan" component={ScanScreen} options={{ title: '扫描二维码' }} />
        <Stack.Screen name="ManualAdd" component={ManualAddScreen} options={{ title: '手动添加' }} />
        <Stack.Screen name="ClipboardAdd" component={ClipboardAddScreen} options={{ title: '剪贴板导入' }} />
        <Stack.Screen name="EditAccount" component={EditAccountScreen} options={{ title: '编辑账号' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: '设置' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
