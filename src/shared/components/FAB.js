import React from 'react';
import { Pressable, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

export function FAB({ onPress, icon = '+' }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.fab,
        {
          backgroundColor: colors.fabBg,
          right: 16 + insets.right,
          bottom: 16 + insets.bottom,
        },
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
