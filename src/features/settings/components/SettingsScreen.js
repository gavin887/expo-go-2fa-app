import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { SettingsGroup } from './SettingsGroup';
import { SettingsItem } from './SettingsItem';
import { Toggle } from '../../../shared/components';

export function SettingsScreen() {
  const { colors, themeMode, setThemeMode } = useTheme();

  const themeLabels = { light: '浅色', dark: '深色', system: '跟随系统' };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SettingsGroup label="外观">
        <SettingsItem
          icon="🎨"
          label="主题"
          value={themeLabels[themeMode]}
          onPress={() => {
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
