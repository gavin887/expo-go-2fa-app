# 计划 6: 设置模块

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现设置页面（外观、安全、数据管理、高级、关于）

**Architecture:** features/settings 包含设置组件和偏好管理

**Tech Stack:** React Native

---

### Task 6.1: 设置页面组件

**Files:**
- Create: `src/features/settings/components/SettingsScreen.js`
- Create: `src/features/settings/components/SettingsItem.js`
- Create: `src/features/settings/components/SettingsGroup.js`

- [ ] **Step 1: 创建设置项组件**

```javascript
// src/features/settings/components/SettingsItem.js
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

const ICON_COLORS = ['pink', 'blue', 'purple', 'green', 'orange'];

export function SettingsItem({ icon, label, value, onPress, rightElement, colorIndex = 0 }) {
  const { colors } = useTheme();
  const colorKey = `accent${ICON_COLORS[colorIndex % ICON_COLORS].charAt(0).toUpperCase()}${ICON_COLORS[colorIndex % ICON_COLORS].slice(1)}`;
  const iconBg = colors[colorKey] || colors.accentPurple;

  return (
    <Pressable
      style={[styles.item, { borderBottomColor: colors.divider }]}
      onPress={onPress}
    >
      <View style={styles.left}>
        <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
          <Text style={{ fontSize: 18 }}>{icon}</Text>
        </View>
        <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      </View>
      {rightElement || (value && <Text style={[styles.value, { color: colors.textSecondary }]}>{value}</Text>)}
      {!rightElement && !value && <Text style={styles.chevron}>›</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 15, fontWeight: '500' },
  value: { fontSize: 14 },
  chevron: { fontSize: 16, opacity: 0.4 },
});
```

- [ ] **Step 2: 创建设置分组**

```javascript
// src/features/settings/components/SettingsGroup.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export function SettingsGroup({ label, children }) {
  const { colors } = useTheme();

  return (
    <View style={styles.group}>
      <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[styles.groupCard, { backgroundColor: colors.settingGroupBg }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: 24 },
  groupLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    padding: 0,
    paddingLeft: 16,
    paddingBottom: 10,
  },
  groupCard: {
    borderRadius: 24,
    padding: 4,
    overflow: 'hidden',
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
```

- [ ] **Step 3: 创建设置页面**

```javascript
// src/features/settings/components/SettingsScreen.js
import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { SettingsGroup } from './SettingsGroup';
import { SettingsItem } from './SettingsItem';
import { Toggle } from '../../../shared/components';

export function SettingsScreen({ navigation }) {
  const { colors, themeMode, setThemeMode } = useTheme();
  // Add more state hooks as needed

  const themeLabels = { light: '浅色', dark: '深色', system: '跟随系统' };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SettingsGroup label="外观">
        <SettingsItem
          icon="🎨"
          label="主题"
          value={themeLabels[themeMode]}
          onPress={() => {
            // Cycle through themes
            const modes = ['light', 'dark', 'system'];
            const next = modes[(modes.indexOf(themeMode) + 1) % 3];
            setThemeMode(next);
          }}
          colorIndex={2}
        />
      </SettingsGroup>

      <SettingsGroup label="安全">
        <SettingsItem
          icon="🔒"
          label="应用锁"
          rightElement={<Toggle value={false} onValueChange={() => {}} />}
          colorIndex={0}
        />
      </SettingsGroup>

      <SettingsGroup label="数据管理">
        <SettingsItem icon="📤" label="导出账号" onPress={() => {}} colorIndex={1} />
        <SettingsItem icon="💾" label="备份账号" onPress={() => {}} colorIndex={3} />
        <SettingsItem icon="📥" label="导入账号" onPress={() => {}} colorIndex={4} />
      </SettingsGroup>

      <SettingsGroup label="高级">
        <SettingsItem
          icon="⏱"
          label="时间校准"
          rightElement={<Toggle value={true} onValueChange={() => {}} />}
          colorIndex={1}
        />
      </SettingsGroup>

      <SettingsGroup label="关于">
        <SettingsItem icon="ℹ" label="版本" value="1.0.0" colorIndex={2} />
      </SettingsGroup>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
});
```

- [ ] **Step 4: Commit**

```bash
git add src/features/settings/components/
git commit -m "[AI] feat: add settings screen with grouped layout"
```
