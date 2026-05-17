import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

const SIZE = 40;
const STROKE_WIDTH = 4;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerRing({ seconds, totalSeconds = 30 }) {
  const { colors } = useTheme();
  const progress = seconds / totalSeconds;
  // Clockwise: strokeDashoffset increases as time decreases
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const isWarning = seconds < 5;
  const ringColor = isWarning ? colors.timerWarning : colors.timerRing;

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        {/* Background track */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.divider}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        {/* Progress arc — starts from top (rotation -90°), clockwise */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={ringColor}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: SIZE, height: SIZE },
});
