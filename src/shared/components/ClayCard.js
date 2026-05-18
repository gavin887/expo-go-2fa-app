import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export function ClayCard({ children, style, onPress, activeOpacity = 0.9 }) {
  const { colors } = useTheme();

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          cardStyle(colors).card,
          pressed && cardStyle(colors).pressed,
          style,
        ]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle(colors).card, style]}>{children}</View>;
}

const cardStyle = (colors) =>
  StyleSheet.create({
    card: {
      borderRadius: 24,
      padding: 20,
      backgroundColor: colors.cardBg,
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
