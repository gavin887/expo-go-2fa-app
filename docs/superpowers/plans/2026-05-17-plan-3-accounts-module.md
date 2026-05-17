# 计划 3: 账号管理模块

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现账号列表展示、添加/编辑/删除账号、验证码显示与倒计时

**Architecture:** features/accounts 包含组件、hooks、utils，通过 AppContext 管理状态

**Tech Stack:** React Native, expo-clipboard

---

### Task 3.1: 账号卡片组件

**Files:**
- Create: `src/features/accounts/components/AccountCard.js`

- [ ] **Step 1: 创建账号卡片**

```javascript
// src/features/accounts/components/AccountCard.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ClayCard, TimerRing } from '../../../shared/components';
import { useTheme } from '../../../context/ThemeContext';
import { totpGenerate, getTimeRemaining } from '../../otp/totp';

const ACCENT_COLORS = [
  'accentPink', 'accentBlue', 'accentPurple', 'accentGreen', 'accentOrange',
];

export function AccountCard({ account, onPressCode, onEdit }) {
  const { colors } = useTheme();
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(30);

  const updateCode = useCallback(() => {
    const remaining = getTimeRemaining(0, account.period || 30);
    setSeconds(remaining);
    const newCode = totpGenerate(
      account.secret,
      0,
      account.digits || 6,
      account.period || 30,
      account.algorithm
    );
    setCode(newCode);
  }, [account]);

  useEffect(() => {
    updateCode();
    const interval = setInterval(updateCode, 1000);
    return () => clearInterval(interval);
  }, [updateCode]);

  const formattedCode = code.slice(0, 3) + ' ' + code.slice(3);
  const accentColor = colors[account.color || ACCENT_COLORS[0]] || colors.accentPurple;

  return (
    <ClayCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={[styles.issuer, { color: accentColor }]}>
            {account.issuer?.toUpperCase()}
          </Text>
          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {account.account}
          </Text>
        </View>
        <View style={styles.codeSection}>
          <Pressable onPress={onPressCode} style={styles.codeBtn}>
            <Text style={[styles.code, { color: colors.textPrimary }]}>
              {formattedCode}
            </Text>
          </Pressable>
          <TimerRing seconds={seconds} totalSeconds={account.period || 30} />
        </View>
      </View>
    </ClayCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  info: { flex: 1 },
  issuer: { fontSize: 13, fontWeight: '600', letterSpacing: 0.5, marginBottom: 4 },
  name: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  codeSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  codeBtn: { padding: 8 },
  code: {
    fontFamily: 'monospace',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 4,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/features/accounts/components/AccountCard.js
git commit -m "[AI] feat: add account card component with live OTP display"
```

---

### Task 3.2: 空状态组件

**Files:**
- Create: `src/features/accounts/components/EmptyState.js`

- [ ] **Step 1: 创建空状态**

```javascript
// src/features/accounts/components/EmptyState.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export function EmptyState() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.illustration, { backgroundColor: colors.emptyIllustration }]}>
        <Text style={{ fontSize: 64, opacity: 0.6 }}>🔐</Text>
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        欢迎使用身份验证器
      </Text>
      <Text style={[styles.desc, { color: colors.textSecondary }]}>
        点击下方 + 按钮，扫描或手动添加你的第一个账号，开始生成动态验证码。
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 60 },
  illustration: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  desc: { fontSize: 14, lineHeight: 22, textAlign: 'center', maxWidth: 260 },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/features/accounts/components/EmptyState.js
git commit -m "[AI] feat: add empty state component"
```

---

### Task 3.3: 添加账号 - 手动输入表单

**Files:**
- Create: `src/features/accounts/components/ManualAddForm.js`

- [ ] **Step 1: 创建手动输入表单**

```javascript
// src/features/accounts/components/ManualAddForm.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { totpGenerate, getTimeRemaining } from '../../otp/totp';
import { isValidBase32 } from '../../../shared/utils/base32';

export function ManualAddForm({ onSave }) {
  const { colors } = useTheme();
  const [issuer, setIssuer] = useState('');
  const [account, setAccount] = useState('');
  const [secret, setSecret] = useState('');
  const [previewCode, setPreviewCode] = useState('');
  const [previewSeconds, setPreviewSeconds] = useState(30);

  const updatePreview = useCallback(() => {
    if (secret && isValidBase32(secret)) {
      const remaining = getTimeRemaining(0, 30);
      setPreviewSeconds(remaining);
      setPreviewCode(totpGenerate(secret, 0, 6, 30));
    } else {
      setPreviewCode('');
    }
  }, [secret]);

  useEffect(() => {
    updatePreview();
    const interval = setInterval(updatePreview, 1000);
    return () => clearInterval(interval);
  }, [updatePreview]);

  const handleSave = () => {
    if (!secret || !isValidBase32(secret)) return;
    onSave({
      issuer: issuer.trim(),
      account: account.trim(),
      secret: secret.toUpperCase().replace(/\s/g, ''),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>发行方 (Issuer)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary }]}
          placeholder="例如：GitHub, Google..."
          value={issuer}
          onChangeText={setIssuer}
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>账号名称 (Account)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary }]}
          placeholder="例如：用户名或邮箱"
          value={account}
          onChangeText={setAccount}
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>密钥 (Secret)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary }]}
          placeholder="Base32 格式密钥"
          value={secret}
          onChangeText={(t) => setSecret(t.toUpperCase())}
          autoCapitalize="characters"
        />
      </View>

      {previewCode && (
        <View style={[styles.previewBox, { backgroundColor: colors.cardBg }]}>
          <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>验证码预览</Text>
          <Text style={[styles.previewCode, { color: colors.accentGreen }]}>
            {previewCode.slice(0, 3)} {previewCode.slice(3)}
          </Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>
            剩余 {previewSeconds} 秒
          </Text>
        </View>
      )}

      <Pressable
        style={[styles.saveBtn, { backgroundColor: colors.fabBg }, (!isValidBase32(secret)) && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={!isValidBase32(secret)}
      >
        <Text style={styles.saveBtnText}>保存账号</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: {
    padding: 14,
    borderRadius: 18,
    fontSize: 15,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  previewBox: {
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  previewCode: {
    fontFamily: 'monospace',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 6,
  },
  saveBtn: {
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/features/accounts/components/ManualAddForm.js
git commit -m "[AI] feat: add manual account input form with live preview"
```

---

### Task 3.4: 账号列表 Hook

**Files:**
- Create: `src/features/accounts/hooks/useAccounts.js`

- [ ] **Step 1: 创建账号 Hook**

```javascript
// src/features/accounts/hooks/useAccounts.js
import { useApp } from '../../../context/AppContext';

export function useAccounts() {
  const { state, dispatch } = useApp();

  const addAccount = (accountData) => {
    const newAccount = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
      order: state.accounts.length,
      color: ['accentPink', 'accentBlue', 'accentPurple', 'accentGreen', 'accentOrange'][
        state.accounts.length % 5
      ],
      ...accountData,
    };
    dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
    return newAccount;
  };

  const updateAccount = (updatedAccount) => {
    dispatch({ type: 'UPDATE_ACCOUNT', payload: updatedAccount });
  };

  const deleteAccount = (id) => {
    dispatch({ type: 'DELETE_ACCOUNT', payload: id });
  };

  return {
    accounts: state.accounts.sort((a, b) => a.order - b.order),
    addAccount,
    updateAccount,
    deleteAccount,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/accounts/hooks/useAccounts.js
git commit -m "[AI] feat: add useAccounts hook with CRUD operations"
```
