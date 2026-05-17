import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

const SIZE = 20;

/**
 * Generate SVG path for a circular sector (pie slice).
 * progress: 0..1 (0 = empty, 1 = full circle)
 * Starts from top (-90°), goes clockwise.
 */
function describeArc(cx, cy, r, progress) {
  if (progress <= 0) return '';
  if (progress >= 1) {
    // Full circle path
    return `M ${cx},${cy - r} A ${r},${r} 0 1,1 ${cx - 0.001},${cy - r} Z`;
  }

  const angle = progress * 360;
  // Start from top (–90° in standard coords)
  const startAngle = -90;
  const endAngle = startAngle + angle;

  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);

  const largeArc = angle > 180 ? 1 : 0;

  return `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc},0 ${x2},${y2} Z`;
}

export function TimerRing({ seconds, totalSeconds = 30 }) {
  const { colors } = useTheme();
  const progress = seconds / totalSeconds;
  const isWarning = seconds < 5;
  const fillColor = isWarning ? colors.timerWarning : colors.timerRing;

  const r = SIZE / 2 - 1;
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        {/* Background circle */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          fill={colors.divider}
          opacity={0.3}
        />
        {/* Progress pie — clockwise from top */}
        {progress > 0 && (
          <Path
            d={describeArc(cx, cy, r, progress)}
            fill={fillColor}
          />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: SIZE, height: SIZE },
});
