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
