// [AI] Account card component with live OTP display, edit/delete via long press
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { ClayCard } from '../../../shared/components';
import { TimerRing } from '../../../shared/components/TimerRing';
import { useTheme } from '../../../context/ThemeContext';
import { useApp } from '../../../context/AppContext';
import { totpGenerate, getTimeRemaining } from '../../otp/totp';

const ACCENT_COLORS = [
  'accentPink', 'accentBlue', 'accentPurple', 'accentGreen', 'accentOrange',
];

export function AccountCard({ account, onPressCode }) {
  const { colors } = useTheme();
  const { state, dispatch } = useApp();
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(30);
  const [menuVisible, setMenuVisible] = useState(false);

  const timeOffset = state.settings.timeSyncEnabled ? state.settings.timeOffset : 0;

  const updateCode = useCallback(() => {
    const remaining = getTimeRemaining(timeOffset, account.period || 30);
    setSeconds(remaining);
    const newCode = totpGenerate(
      account.secret,
      timeOffset,
      account.digits || 6,
      account.period || 30,
      account.algorithm
    );
    setCode(newCode);
  }, [account, timeOffset]);

  useEffect(() => {
    updateCode();
    const interval = setInterval(updateCode, 1000);
    return () => clearInterval(interval);
  }, [updateCode]);

  const formattedCode = code.slice(0, 3) + ' ' + code.slice(3);
  const accentColor = colors[account.color || ACCENT_COLORS[0]] || colors.accentPurple;

  return (
    <>
      <Pressable onLongPress={() => setMenuVisible(true)} delayLongPress={500}>
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
              <Pressable onPress={() => onPressCode && onPressCode(formattedCode)} style={styles.codeBtn}>
                <Text style={[styles.code, { color: colors.textPrimary }]}>
                  {formattedCode}
                </Text>
              </Pressable>
              <TimerRing seconds={seconds} totalSeconds={account.period || 30} />
            </View>
          </View>
        </ClayCard>
      </Pressable>

      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={[styles.menu, { backgroundColor: colors.cardBg }]}>
            <Pressable
              style={[styles.menuItem, { backgroundColor: colors.inputBg }]}
              onPress={() => {
                setMenuVisible(false);
                dispatch({ type: 'DELETE_ACCOUNT', payload: account.id });
              }}
            >
              <Text style={[styles.menuText, { color: '#FF6B6B' }]}>🗑 删除账号</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menu: {
    borderRadius: 24,
    padding: 20,
    minWidth: 200,
  },
  menuItem: {
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  menuText: { fontSize: 16, fontWeight: '600' },
});
