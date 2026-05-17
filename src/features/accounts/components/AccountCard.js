// [AI] Account card component with live OTP display
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ClayCard } from '../../../shared/components';
import { TimerRing } from '../../../shared/components/TimerRing';
import { useTheme } from '../../../context/ThemeContext';
import { totpGenerate, getTimeRemaining } from '../../otp/totp';

const ACCENT_COLORS = [
  'accentPink', 'accentBlue', 'accentPurple', 'accentGreen', 'accentOrange',
];

export function AccountCard({ account, onPressCode, onEdit }) {
  const { colors } = useTheme();
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(30);

  const updateCode = useCallback(() => {
    const remaining = getTimeRemaining(0, account.period || 30);
    setSeconds(remaining);
    const newCode = totpGenerate(
      account.secret,
      0,
      account.digits || 6,
      account.period || 30,
      account.algorithm
    );
    setCode(newCode);
  }, [account]);

  useEffect(() => {
    updateCode();
    const interval = setInterval(updateCode, 1000);
    return () => clearInterval(interval);
  }, [updateCode]);

  const formattedCode = code.slice(0, 3) + ' ' + code.slice(3);
  const accentColor = colors[account.color || ACCENT_COLORS[0]] || colors.accentPurple;

  return (
    <ClayCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={[styles.issuer, { color: accentColor }]}>
            {account.issuer?.toUpperCase()}
          </Text>
          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {account.account}
          </Text>
        </View>
        <View style={styles.codeSection}>
          <Pressable onPress={onPressCode} style={styles.codeBtn}>
            <Text style={[styles.code, { color: colors.textPrimary }]}>
              {formattedCode}
            </Text>
          </Pressable>
          <TimerRing seconds={seconds} totalSeconds={account.period || 30} />
        </View>
      </View>
    </ClayCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  info: { flex: 1 },
  issuer: { fontSize: 13, fontWeight: '600', letterSpacing: 0.5, marginBottom: 4 },
  name: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  codeSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  codeBtn: { padding: 8 },
  code: {
    fontFamily: 'monospace',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 4,
  },
});
