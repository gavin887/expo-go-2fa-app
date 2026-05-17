# 计划 7: 导航集成 + App 入口

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 整合所有模块，创建导航路由、主页面、App 入口

**Architecture:** navigation 层管理路由，App.js 组装所有 Provider

**Tech Stack:** @react-navigation/native, @react-navigation/native-stack

---

### Task 7.1: 安装导航依赖

**Files:**
- 项目根目录

- [ ] **Step 1: 安装 React Navigation**

```bash
cd /mnt/g/soho-workspace/expo-go-develop/0x01.expo-go-2fa-app
npx expo install react-native-screens react-native-safe-area-context
npm install @react-navigation/native @react-navigation/native-stack
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "[AI] feat: install react navigation dependencies"
```

---

### Task 7.2: App 导航配置

**Files:**
- Create: `src/navigation/AppNavigator.js`

- [ ] **Step 1: 创建导航配置**

```javascript
// src/navigation/AppNavigator.js
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
          headerStyle: { backgroundColor: 'transparent' },
          headerTransparent: true,
          headerTitleStyle: { fontWeight: '800', fontSize: 28 },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '身份验证器', headerLargeTitle: true }}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/navigation/AppNavigator.js
git commit -m "[AI] feat: configure app navigation with stack routes"
```

---

### Task 7.3: 主页面

**Files:**
- Create: `src/screens/HomeScreen.js`

- [ ] **Step 1: 创建主页面**

```javascript
// src/screens/HomeScreen.js
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAccounts } from '../features/accounts/hooks/useAccounts';
import { AccountCard } from '../features/accounts/components/AccountCard';
import { EmptyState } from '../features/accounts/components/EmptyState';
import { FAB, Toast } from '../shared/components';
import * as Clipboard from 'expo-clipboard';

export function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { accounts, addAccount, deleteAccount } = useAccounts();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Load accounts from secure storage on focus
      // Implementation depends on persistence setup
    }, [])
  );

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const handleCopyCode = async (code) => {
    await Clipboard.setStringAsync(code.replace(' ', ''));
    showToast('已复制到剪贴板 ✓');
  };

  const handleDelete = (id) => {
    Alert.alert('删除账号', '确定要删除此账号吗？', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => deleteAccount(id) },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={[styles.title, { color: colors.textPrimary }]}>身份验证器</Text>
            </View>
            <Pressable
              style={[styles.settingsBtn, { backgroundColor: colors.cardBg }]}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={{ fontSize: 18 }}>⚙</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.list}>
        {accounts.length === 0 ? (
          <EmptyState />
        ) : (
          accounts.map((acc) => (
            <AccountCard
              key={acc.id}
              account={acc}
              onPressCode={() => handleCopyCode(/* code from card */)}
              onEdit={() => navigation.navigate('EditAccount', { id: acc.id })}
              onDelete={() => handleDelete(acc.id)}
            />
          ))
        )}
      </View>

      <FAB onPress={() => setActionSheetVisible(true)} />

      <Modal
        visible={actionSheetVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setActionSheetVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setActionSheetVisible(false)}>
          <View style={[styles.actionSheet, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.actionSheetTitle, { color: colors.textPrimary }]}>添加账号</Text>
            <Pressable
              style={[styles.actionItem, { backgroundColor: colors.inputBg }]}
              onPress={() => {
                setActionSheetVisible(false);
                navigation.navigate('Scan');
              }}
            >
              <Text style={{ fontSize: 20 }}>📷</Text>
              <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>扫描二维码</Text>
            </Pressable>
            <Pressable
              style={[styles.actionItem, { backgroundColor: colors.inputBg }]}
              onPress={() => {
                setActionSheetVisible(false);
                navigation.navigate('ManualAdd');
              }}
            >
              <Text style={{ fontSize: 20 }}>⌨</Text>
              <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>手动输入密钥</Text>
            </Pressable>
            <Pressable
              style={[styles.actionItem, { backgroundColor: colors.inputBg }]}
              onPress={() => {
                setActionSheetVisible(false);
                navigation.navigate('ClipboardAdd');
              }}
            >
              <Text style={{ fontSize: 20 }}>📋</Text>
              <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>从剪贴板导入</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Toast message={toastMessage} visible={toastVisible} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '800' },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { flex: 1, padding: 16, paddingTop: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  actionSheet: {
    borderRadius: 24,
    padding: 20,
  },
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
    marginBottom: 8,
  },
  actionLabel: { fontSize: 15, fontWeight: '600' },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/HomeScreen.js
git commit -m "[AI] feat: create home screen with account list and action sheet"
```

---

### Task 7.4: 其他页面

**Files:**
- Create: `src/screens/ScanScreen.js`
- Create: `src/screens/ManualAddScreen.js`
- Create: `src/screens/ClipboardAddScreen.js`
- Create: `src/screens/EditAccountScreen.js`

- [ ] **Step 1: 扫码页面**

```javascript
// src/screens/ScanScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Camera } from 'expo-camera';
import { parseOtpauthUrl } from '../shared/utils/otpauth';
import { useTheme } from '../context/ThemeContext';

export function ScanScreen({ navigation, route }) {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    const parsed = parseOtpauthUrl(data);
    if (parsed) {
      navigation.replace('ManualAdd', { parsedData: parsed });
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.textPrimary }}>需要相机权限</Text>
      </View>
    );
  }

  return (
    <Camera
      style={styles.camera}
      onBarCodeScanned={handleBarCodeScanned}
      barCodeScannerSettings={{ barCodeTypes: ['qr'] }}
    />
  );
}

const styles = StyleSheet.create({
  camera: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
```

- [ ] **Step 2: 手动添加页面**

```javascript
// src/screens/ManualAddScreen.js
import React from 'react';
import { ManualAddForm } from '../features/accounts/components/ManualAddForm';
import { useAccounts } from '../features/accounts/hooks/useAccounts';
import { parseOtpauthUrl } from '../shared/utils/otpauth';

export function ManualAddScreen({ navigation, route }) {
  const { addAccount } = useAccounts();
  const initialData = route.params?.parsedData;

  const handleSave = (data) => {
    addAccount(data);
    navigation.goBack();
  };

  return <ManualAddForm onSave={handleSave} initialValues={initialData} />;
}
```

- [ ] **Step 3: 剪贴板导入页面**

```javascript
// src/screens/ClipboardAddScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../context/ThemeContext';
import { parseOtpauthUrl, isValidBase32 } from '../shared/utils/otpauth';
import { useAccounts } from '../features/accounts/hooks/useAccounts';

export function ClipboardAddScreen({ navigation }) {
  const { colors } = useTheme();
  const { addAccount } = useAccounts();
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const content = await Clipboard.getStringAsync();
      let data = parseOtpauthUrl(content);
      if (!data && isValidBase32(content.trim())) {
        data = {
          secret: content.trim().toUpperCase(),
          issuer: '',
          account: 'Imported Account',
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
        };
      }
      if (data) {
        setParsedData(data);
      } else {
        setError('无法识别剪贴板内容');
      }
    })();
  }, []);

  const handleSave = () => {
    if (parsedData) {
      addAccount(parsedData);
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {parsedData ? (
        <>
          <Text style={{ color: colors.textPrimary }}>识别成功</Text>
          <Text style={{ color: colors.textSecondary }}>发行方: {parsedData.issuer}</Text>
          <Text style={{ color: colors.textSecondary }}>账号: {parsedData.account}</Text>
          <Pressable style={[styles.saveBtn, { backgroundColor: colors.fabBg }]} onPress={handleSave}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>保存</Text>
          </Pressable>
        </>
      ) : (
        <Text style={{ color: colors.textSecondary }}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  saveBtn: { padding: 16, borderRadius: 24, alignItems: 'center', marginTop: 24 },
});
```

- [ ] **Step 4: 编辑账号页面**

```javascript
// src/screens/EditAccountScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAccounts } from '../features/accounts/hooks/useAccounts';
import { ManualAddForm } from '../features/accounts/components/ManualAddForm';

export function EditAccountScreen({ route, navigation }) {
  const { id } = route.params;
  const { accounts, updateAccount, deleteAccount } = useAccounts();
  const account = accounts.find((a) => a.id === id);

  if (!account) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>账号不存在</Text>
      </View>
    );
  }

  const handleSave = (data) => {
    updateAccount({ ...account, ...data });
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('删除账号', '确定要删除此账号吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          deleteAccount(id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <ManualAddForm onSave={handleSave} initialValues={account} />
      <Pressable style={{ padding: 16, backgroundColor: '#FF6B6B' }} onPress={handleDelete}>
        <Text style={{ color: '#FFFFFF', textAlign: 'center', fontWeight: '600' }}>删除账号</Text>
      </Pressable>
    </View>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/screens/
git commit -m "[AI] feat: add scan, manual add, clipboard, and edit screens"
```

---

### Task 7.5: App.js 入口

**Files:**
- Modify: `App.js`

- [ ] **Step 1: 创建 App 入口**

```javascript
// App.js
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
```

- [ ] **Step 2: Commit**

```bash
git add App.js
git commit -m "[AI] feat: wire up app entry with all providers"
```

---

### Task 7.6: 数据持久化集成

**Files:**
- Modify: `src/context/AppContext.js`

- [ ] **Step 1: 更新 AppContext 集成持久化**

```javascript
// src/context/AppContext.js - 更新
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { loadAccounts, saveAccounts } from '../features/security/encryption';

const AppContext = createContext();

const initialState = {
  accounts: [],
  settings: {
    theme: 'system',
    timeSyncEnabled: true,
    timeOffset: 0,
    lastCalibration: null,
    appLockEnabled: false,
    appLockType: 'none',
  },
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
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load accounts on mount
  useEffect(() => {
    loadAccounts().then((accounts) => {
      dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
    });
  }, []);

  // Save accounts when changed
  useEffect(() => {
    if (state.accounts.length > 0) {
      saveAccounts(state.accounts);
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
```

- [ ] **Step 2: Final Commit**

```bash
git add src/context/AppContext.js
git commit -m "[AI] feat: integrate account persistence with secure storage"
```
