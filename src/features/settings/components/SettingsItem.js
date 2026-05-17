import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

const ICON_COLORS = ['pink', 'blue', 'purple', 'green', 'orange'];

export function SettingsItem({ icon, label, value, onPress, rightElement, colorIndex = 0, isLast = false }) {
  const { colors } = useTheme();
  const idx = typeof colorIndex === 'number' ? colorIndex : 0;
  const colorName = ICON_COLORS[idx % ICON_COLORS.length];
  const colorKey = `accent${colorName.charAt(0).toUpperCase()}${colorName.slice(1)}`;
  const iconBg = colors[colorKey] || colors.accentPurple;

  return (
    <Pressable
      style={[styles.item, { borderBottomWidth: isLast ? 0 : 1, borderBottomColor: colors.divider }]}
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
