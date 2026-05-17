import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export function ClayCard({ children, style, onPress, activeOpacity = 0.9 }) {
  const { theme } = useTheme();
  const cardStyle = styles(theme);

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          cardStyle.card,
          pressed && cardStyle.pressed,
          style,
        ]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle.card, style]}>{children}</View>;
}

const styles = (theme) =>
  StyleSheet.create({
    card: {
      borderRadius: 24,
      padding: 20,
      backgroundColor: theme.cardBg,
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
