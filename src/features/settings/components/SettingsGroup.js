import React, { Children, isValidElement, cloneElement } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { SettingsItem } from './SettingsItem';

export function SettingsGroup({ label, children }) {
  const { colors } = useTheme();

  const childrenArray = Children.toArray(children);
  // Find last SettingsItem index (only count SettingsItem children)
  let lastItemIdx = -1;
  for (let i = childrenArray.length - 1; i >= 0; i--) {
    const child = childrenArray[i];
    if (isValidElement(child) && child.type === SettingsItem) {
      lastItemIdx = i;
      break;
    }
  }

  const enhancedChildren = childrenArray.map((child, index) => {
    if (isValidElement(child) && child.type === SettingsItem) {
      return cloneElement(child, { isLast: index === lastItemIdx });
    }
    return child;
  });

  return (
    <View style={styles.group}>
      <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[styles.groupCard, { backgroundColor: colors.settingGroupBg }]}>{enhancedChildren}</View>
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
