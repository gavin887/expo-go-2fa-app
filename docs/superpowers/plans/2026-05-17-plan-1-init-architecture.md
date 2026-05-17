# 计划 1: 项目初始化 + 基础架构

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 初始化 Expo Go 项目，创建目录结构、主题系统、基础组件

**Architecture:** 使用 `npx create-expo-app` 初始化，按 Feature-Sliced 架构创建目录，先建共享层（theme/components），再建 Context

**Tech Stack:** Expo, React Native, React Context

---

### Task 1.1: 初始化 Expo 项目

**Files:**
- 项目根目录

- [ ] **Step 1: 创建 Expo 项目**

```bash
cd /mnt/g/soho-workspace/expo-go-develop/0x01.expo-go-2fa-app
npx create-expo-app@latest . --template blank
```

- [ ] **Step 2: 安装依赖**

```bash
npx expo install expo-secure-store expo-barcode-scanner expo-camera expo-clipboard expo-document-picker expo-sharing expo-local-authentication expo-app-state
```

- [ ] **Step 3: 创建目录结构**

```bash
mkdir -p src/{features/{accounts/{components,hooks,utils},otp,security,import-export,settings/{components,hooks}},shared/{components,hooks,utils,theme},navigation,context}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "[AI] feat: init expo project with feature-sliced structure"
```

---

### Task 1.2: 主题系统

**Files:**
- Create: `src/shared/theme/colors.js`
- Create: `src/shared/theme/shadows.js`
- Create: `src/shared/theme/animations.js`
- Create: `src/shared/theme/index.js`

- [ ] **Step 1: 创建颜色定义**

```javascript
// src/shared/theme/colors.js
export const lightTheme = {
  bg: '#F0F4F8',
  bgGradient: ['#F0F4F8', '#E8EEF2'],
  cardBg: '#FFFFFF',
  textPrimary: '#2D3748',
  textSecondary: '#718096',
  accentPink: '#FFB6C1',
  accentBlue: '#A8D8EA',
  accentPurple: '#C3B1E1',
  accentGreen: '#B5EAD7',
  accentOrange: '#FFDAC1',
  timerRing: '#A8D8EA',
  timerWarning: '#FFB6C1',
  fabBg: '#C3B1E1',
  inputBg: '#F7FAFC',
  divider: 'rgba(163, 177, 198, 0.2)',
  toastBg: '#2D3748',
  toastText: '#FFFFFF',
  settingGroupBg: '#FFFFFF',
  emptyIllustration: '#E8EEF2',
};

export const darkTheme = {
  bg: '#1A1D23',
  bgGradient: ['#1A1D23', '#22262E'],
  cardBg: '#2A2E36',
  textPrimary: '#E8ECF1',
  textSecondary: '#8892A0',
  accentPink: '#D4949B',
  accentBlue: '#7BB8D0',
  accentPurple: '#9B8DC4',
  accentGreen: '#88C9A8',
  accentOrange: '#D4A88B',
  timerRing: '#7BB8D0',
  timerWarning: '#D4949B',
  fabBg: '#9B8DC4',
  inputBg: '#22262E',
  divider: 'rgba(255, 255, 255, 0.08)',
  toastBg: '#E8ECF1',
  toastText: '#1A1D23',
  settingGroupBg: '#2A2E36',
  emptyIllustration: '#22262E',
};
```

- [ ] **Step 2: 创建阴影定义**

```javascript
// src/shared/theme/shadows.js
import { Platform } from 'react-native';

export const getCardShadow = (theme, type = 'outer') => {
  if (type === 'outer') {
    return Platform.select({
      ios: {
        shadowColor: '#A3B1C6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      },
      android: {
        elevation: 4,
      },
    });
  }
  // pressed / inner shadows handled via custom component
  return {};
};
```

- [ ] **Step 3: 创建动画定义**

```javascript
// src/shared/theme/animations.js
export const animations = {
  spring: { duration: 400, damping: 8, stiffness: 120 },
  smooth: { duration: 300 },
  linear: { duration: 1000 },
};

export const springEasing = [0.34, 1.56, 0.64, 1];
export const smoothEasing = [0.4, 0, 0.2, 1];
```

- [ ] **Step 4: 创建主题导出**

```javascript
// src/shared/theme/index.js
export { lightTheme, darkTheme } from './colors';
export { getCardShadow } from './shadows';
export { animations, springEasing, smoothEasing } from './animations';
```

- [ ] **Step 5: Commit**

```bash
git add src/shared/theme/
git commit -m "[AI] feat: add claymorphism theme system"
```

---

### Task 1.3: 共享组件

**Files:**
- Create: `src/shared/components/ClayCard.js`
- Create: `src/shared/components/TimerRing.js`
- Create: `src/shared/components/Toggle.js`
- Create: `src/shared/components/Toast.js`
- Create: `src/shared/components/FAB.js`
- Create: `src/shared/components/index.js`

- [ ] **Step 1: 创建 ClayCard**

```javascript
// src/shared/components/ClayCard.js
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export function ClayCard({ children, style, onPress, activeOpacity = 0.9 }) {
  const { theme } = useTheme();
  const cardStyle = styles(theme);

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          cardStyle.card,
          pressed && cardStyle.pressed,
          style,
        ]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle.card, style]}>{children}</View>;
}

const styles = (theme) =>
  StyleSheet.create({
    card: {
      borderRadius: 24,
      padding: 20,
      backgroundColor: theme.cardBg,
      shadowColor: '#A3B1C6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
  });
```

- [ ] **Step 2: 创建 TimerRing**

```javascript
// src/shared/components/TimerRing.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

const SIZE = 40;
const STROKE_WIDTH = 4;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerRing({ seconds, totalSeconds = 30 }) {
  const { theme, colors } = useTheme();
  const progress = seconds / totalSeconds;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const isWarning = seconds < 5;
  const ringColor = isWarning ? colors.timerWarning : colors.timerRing;

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} style={styles.svg}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.divider}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={ringColor}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        {seconds}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', width: SIZE, height: SIZE },
  svg: { transform: [{ rotate: '0deg' }] },
  text: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -8 }, { translateY: -8 }],
    fontSize: 11,
    fontWeight: '700',
  },
});
```

- [ ] **Step 3: 创建 Toggle**

```javascript
// src/shared/components/Toggle.js
import React from 'react';
import { Pressable, StyleSheet, Animated, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const TOGGLE_WIDTH = 52;
const TOGGLE_HEIGHT = 32;
 const THUMB_SIZE = 26;
const THUMB_OFFSET = 3;

export function Toggle({ value, onValueChange }) {
  const { colors } = useTheme();
  const offsetAnim = React.useRef(new Animated.Value(value ? THUMB_OFFSET + THUMB_SIZE : THUMB_OFFSET)).current;

  React.useEffect(() => {
    Animated.spring(offsetAnim, {
      toValue: value ? THUMB_OFFSET + THUMB_SIZE : THUMB_OFFSET,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [value]);

  return (
    <Pressable
      style={[
        styles.track,
        { backgroundColor: value ? colors.accentGreen : colors.divider },
      ]}
      onPress={() => onValueChange(!value)}
    >
      <Animated.View
        style={[
          styles.thumb,
          { transform: [{ translateX: offsetAnim }] },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    borderRadius: 16,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
});
```

- [ ] **Step 4: 创建 Toast**

```javascript
// src/shared/components/Toast.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export function Toast({ message, visible, duration = 2000 }) {
  const { colors } = useTheme();
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: 20, duration: 300, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }], opacity },
      ]}
    >
      <Text style={[styles.text, { backgroundColor: colors.toastBg, color: colors.toastText }]}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    zIndex: 20,
  },
  text: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    fontSize: 14,
    fontWeight: '600',
  },
});
```

- [ ] **Step 5: 创建 FAB**

```javascript
// src/shared/components/FAB.js
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export function FAB({ onPress, icon = '+' }) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.fab,
        { backgroundColor: colors.fabBg },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.icon}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  icon: {
    fontSize: 32,
    fontWeight: '300',
    color: '#FFFFFF',
  },
});
```

- [ ] **Step 6: 创建组件导出**

```javascript
// src/shared/components/index.js
export { ClayCard } from './ClayCard';
export { TimerRing } from './TimerRing';
export { Toggle } from './Toggle';
export { Toast } from './Toast';
export { FAB } from './FAB';
```

- [ ] **Step 7: Commit**

```bash
git add src/shared/components/
git commit -m "[AI] feat: add claymorphism shared components"
```

---

### Task 1.4: ThemeContext

**Files:**
- Create: `src/context/ThemeContext.js`

- [ ] **Step 1: 创建 ThemeContext**

```javascript
// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../shared/theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

const THEME_KEY = '@theme_preference';

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'light' | 'dark' | 'system'

  const isDark = themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';
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
    <ThemeContext.Provider value={{ theme: isDark ? 'dark' : 'light', colors, themeMode, setThemeMode: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

- [ ] **Step 2: 安装 AsyncStorage**

```bash
npx expo install @react-native-async-storage/async-storage
```

- [ ] **Step 3: Commit**

```bash
git add src/context/ThemeContext.js
git commit -m "[AI] feat: add ThemeContext with system theme support"
```

---

### Task 1.5: AppContext (基础结构)

**Files:**
- Create: `src/context/AppContext.js`

- [ ] **Step 1: 创建 AppContext 骨架**

```javascript
// src/context/AppContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

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

- [ ] **Step 2: Commit**

```bash
git add src/context/AppContext.js
git commit -m "[AI] feat: add AppContext with basic reducer"
```
