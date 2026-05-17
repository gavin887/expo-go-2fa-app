// [AI] src/features/settings/components/SettingsScreen.js
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useApp } from '../../../context/AppContext';
import { useSecurity } from '../../../context/SecurityContext';
import { SettingsGroup } from './SettingsGroup';
import { SettingsItem } from './SettingsItem';
import { Toggle } from '../../../shared/components';
import { exportAsSecrets, exportAsOtpauthUrls } from '../../import-export/export';
import { backupAccounts } from '../../import-export/backup';
import { pickFile, importFromBackup, importFromText } from '../../import-export/import';
import { calibrateTime } from '../../otp/time-sync';

export function SettingsScreen() {
  const { colors, themeMode, setThemeMode } = useTheme();
  const { state, dispatch } = useApp();
  const { lockEnabled, biometricAvailable, toggleLock } = useSecurity();
  const [calibrating, setCalibrating] = useState(false);

  const themeLabels = { light: '浅色', dark: '深色', system: '跟随系统' };

  const handleExport = () => {
    Alert.alert('导出格式', '选择导出格式', [
      { text: 'Secret 列表', onPress: () => exportAsSecrets(state.accounts) },
      { text: 'otpauth 链接', onPress: () => exportAsOtpauthUrls(state.accounts) },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handleBackup = () => {
    backupAccounts(state.accounts, state.settings);
  };

  const handleImport = () => {
    Alert.alert('导入来源', '选择导入类型', [
      {
        text: '备份文件',
        onPress: async () => {
          const uri = await pickFile();
          if (!uri) return;
          try {
            const result = await importFromBackup(uri, true);
            if (result.type === 'merge') {
              result.accounts.forEach((acc) => {
                dispatch({ type: 'ADD_ACCOUNT', payload: { ...acc, id: Date.now().toString() + Math.random().toString(36).slice(2, 8) } });
              });
            }
            Alert.alert('导入成功', `已导入 ${result.accounts.length} 个账号`);
          } catch (e) {
            Alert.alert('导入失败', e.message);
          }
        },
      },
      {
        text: '文本文件',
        onPress: async () => {
          const uri = await pickFile();
          if (!uri) return;
          try {
            const result = await importFromText(uri);
            result.accounts.forEach((acc) => {
              dispatch({ type: 'ADD_ACCOUNT', payload: acc });
            });
            const msg = result.errors.length > 0
              ? `已导入 ${result.accounts.length} 个账号，${result.errors.length} 个失败`
              : `已导入 ${result.accounts.length} 个账号`;
            Alert.alert('导入完成', msg);
          } catch (e) {
            Alert.alert('导入失败', e.message);
          }
        },
      },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handleCalibrate = async () => {
    setCalibrating(true);
    try {
      const result = await calibrateTime();
      dispatch({
        type: 'UPDATE_SETTINGS',
        payload: {
          timeOffset: result.offset,
          lastCalibration: result.calibratedAt,
        },
      });
      Alert.alert('校准成功', `时间差: +${(result.offset / 1000).toFixed(2)} 秒`);
    } catch (e) {
      Alert.alert('校准失败', e.message);
    } finally {
      setCalibrating(false);
    }
  };

  const timeSyncEnabled = state.settings.timeSyncEnabled;
  const timeOffset = state.settings.timeOffset;
  const lastCalibration = state.settings.lastCalibration;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
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
          rightElement={
            <Toggle value={lockEnabled} onValueChange={toggleLock} />
          }
          colorIndex={0}
        />
      </SettingsGroup>

      <SettingsGroup label="数据管理">
        <SettingsItem icon="📤" label="导出账号" onPress={handleExport} colorIndex={1} />
        <SettingsItem icon="💾" label="备份账号" onPress={handleBackup} colorIndex={3} />
        <SettingsItem icon="📥" label="导入账号" onPress={handleImport} colorIndex={4} />
      </SettingsGroup>

      <SettingsGroup label="高级">
        <SettingsItem
          icon="⏱"
          label="时间校准"
          rightElement={
            <Toggle value={timeSyncEnabled} onValueChange={(v) =>
              dispatch({ type: 'UPDATE_SETTINGS', payload: { timeSyncEnabled: v } })
            } />
          }
          colorIndex={1}
        />
        {timeSyncEnabled && (
          <SettingsItem
            icon="🔄"
            label="立即校准"
            onPress={handleCalibrate}
            colorIndex={1}
            rightElement={
              <Text
                style={[
                  styles.calibrationOffset,
                  {
                    color: timeOffset !== 0 ? colors.accentGreen : colors.textSecondary,
                  },
                ]}
              >
                {timeOffset !== 0 ? `${timeOffset > 0 ? '+' : ''}${(timeOffset / 1000).toFixed(2)} 秒` : '未校准'}
              </Text>
            }
          />
        )}
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
  calibrationOffset: { fontSize: 13, fontWeight: '600' },
});
