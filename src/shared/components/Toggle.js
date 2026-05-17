import React from 'react';
import { Pressable, StyleSheet, Animated, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const TOGGLE_WIDTH = 52;
const TOGGLE_HEIGHT = 32;
const THUMB_SIZE = 26;
const THUMB_OFFSET = 3;

export function Toggle({ value, onValueChange }) {
  const { colors } = useTheme();
  const offsetAnim = React.useRef(
    new Animated.Value(value ? THUMB_OFFSET + THUMB_SIZE : THUMB_OFFSET)
  ).current;

  React.useEffect(() => {
    Animated.spring(offsetAnim, {
      toValue: value ? THUMB_OFFSET + THUMB_SIZE : THUMB_OFFSET,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [value]);

  return (
    <Pressable
      style={[
        styles.track,
        { backgroundColor: value ? colors.accentGreen : colors.divider },
      ]}
      onPress={() => onValueChange(!value)}
    >
      <Animated.View
        style={[styles.thumb, { transform: [{ translateX: offsetAnim }] }]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    borderRadius: 16,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
});
