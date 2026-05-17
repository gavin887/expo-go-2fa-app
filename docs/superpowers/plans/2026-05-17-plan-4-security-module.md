# 计划 4: 安全存储模块

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现账号数据加密持久化存储、应用锁（PIN/生物识别）

**Architecture:** features/security 封装 expo-secure-store 和 expo-local-authentication

**Tech Stack:** expo-secure-store, expo-local-authentication

---

### Task 4.1: 加密存储

**Files:**
- Create: `src/features/security/encryption.js`

- [ ] **Step 1: 实现加密存储**

```javascript
// src/features/security/encryption.js
import * as SecureStore from 'expo-secure-store';

const ACCOUNTS_KEY = 'encrypted_accounts';

// Simple XOR obfuscation + base64 (expo-secure-store already encrypts at OS level)
// For production, consider proper encryption like AES
function obfuscate(data) {
  const json = JSON.stringify(data);
  const key = 0x5a;
  const bytes = [];
  for (let i = 0; i < json.length; i++) {
    bytes.push(json.charCodeAt(i) ^ key);
  }
  return btoa(String.fromCharCode(...bytes));
}

function deobfuscate(encoded) {
  try {
    const str = atob(encoded);
    const key = 0x5a;
    let json = '';
    for (let i = 0; i < str.length; i++) {
      json += String.fromCharCode(str.charCodeAt(i) ^ key);
    }
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function saveAccounts(accounts) {
  const encoded = obfuscate(accounts);
  await SecureStore.setItemAsync(ACCOUNTS_KEY, encoded);
}

export async function loadAccounts() {
  const encoded = await SecureStore.getItemAsync(ACCOUNTS_KEY);
  if (!encoded) return [];
  return deobfuscate(encoded) || [];
}

export async function clearAccounts() {
  await SecureStore.deleteItemAsync(ACCOUNTS_KEY);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/security/encryption.js
git commit -m "[AI] feat: add encrypted account storage with SecureStore"
```

---

### Task 4.2: 应用锁

**Files:**
- Create: `src/features/security/app-lock.js`
- Create: `src/features/security/biometric.js`

- [ ] **Step 1: 创建应用锁逻辑**

```javascript
// src/features/security/app-lock.js
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'app_pin';
const LOCK_ENABLED_KEY = 'app_lock_enabled';

export async function setPin(pin) {
  await SecureStore.setItemAsync(PIN_KEY, pin);
}

export async function verifyPin(pin) {
  const stored = await SecureStore.getItemAsync(PIN_KEY);
  return stored === pin;
}

export async function isAppLockEnabled() {
  const val = await SecureStore.getItemAsync(LOCK_ENABLED_KEY);
  return val === 'true';
}

export async function setAppLockEnabled(enabled) {
  await SecureStore.setItemAsync(LOCK_ENABLED_KEY, enabled ? 'true' : 'false');
}
```

- [ ] **Step 2: 创建生物识别**

```javascript
// src/features/security/biometric.js
import * as LocalAuthentication from 'expo-local-authentication';

export async function isBiometricAvailable() {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
}

export async function authenticateWithBiometric(promptMessage = '验证身份') {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    fallbackLabel: '使用 PIN',
    cancelLabel: '取消',
  });
  return result.success;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/features/security/app-lock.js src/features/security/biometric.js
git commit -m "[AI] feat: add app lock with PIN and biometric support"
```

---

### Task 4.3: SecurityContext

**Files:**
- Create: `src/context/SecurityContext.js`

- [ ] **Step 1: 创建 SecurityContext**

```javascript
// src/context/SecurityContext.js
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
```

- [ ] **Step 2: Commit**

```bash
git add src/context/SecurityContext.js
git commit -m "[AI] feat: add SecurityContext for app lock state"
```
