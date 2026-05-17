import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

const SIZE = 20;

/**
 * Generate SVG path for a circular sector (pie slice).
 * progress: 0..1 (0 = empty, 1 = full circle)
 * Starts from top, disappears counter-clockwise.
 */
function describeArc(cx, cy, r, progress) {
  if (progress <= 0.001) return '';
  if (progress >= 0.999) {
    return `M ${cx},${cy} m 0,${-r} a ${r},${r} 0 1,1 0,${r * 2} a ${r},${r} 0 1,1 0,${-r * 2} Z`;
  }

  // Angle that remains filled (counter-clockwise disappearance = angle shrinks from 360 to 0)
  const angle = progress * 360;
  // Start from top: in SVG coords top is (cx, cy - r)
  const endAngleRad = ((-90 + angle) * Math.PI) / 180;

  const ex = cx + r * Math.cos(endAngleRad);
  const ey = cy + r * Math.sin(endAngleRad);

  const largeArc = angle > 180 ? 1 : 0;

  // Always sweep clockwise (sweep=1)
  return `M ${cx},${cy} L ${cx},${cy - r} A ${r},${r} 0 ${largeArc},1 ${ex},${ey} Z`;
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
