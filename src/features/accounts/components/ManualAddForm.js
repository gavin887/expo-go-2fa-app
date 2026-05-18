// [AI] Manual account input form with live OTP preview
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useApp } from '../../../context/AppContext';
import { totpGenerate, getTimeRemaining } from '../../otp/totp';
import { isValidBase32 } from '../../../shared/utils/base32';

export function ManualAddForm({ onSave, initialValues }) {
  const { colors } = useTheme();
  const { state } = useApp();
  const [issuer, setIssuer] = useState(initialValues?.issuer || '');
  const [account, setAccount] = useState(initialValues?.account || '');
  const [secret, setSecret] = useState(initialValues?.secret || '');
  const [previewCode, setPreviewCode] = useState('');
  const [previewSeconds, setPreviewSeconds] = useState(30);

  const timeOffset = state.settings.timeSyncEnabled ? state.settings.timeOffset : 0;
  const previewDigits = initialValues?.digits || 6;
  const previewPeriod = initialValues?.period || 30;
  const previewAlgorithm = initialValues?.algorithm || 'SHA1';

  const updatePreview = useCallback(() => {
    if (secret && isValidBase32(secret)) {
      const remaining = getTimeRemaining(timeOffset, previewPeriod);
      setPreviewSeconds(Math.floor(remaining));
      setPreviewCode(
        totpGenerate(secret, timeOffset, previewDigits, previewPeriod, previewAlgorithm)
      );
    } else {
      setPreviewCode('');
    }
  }, [secret, timeOffset, previewPeriod, previewDigits, previewAlgorithm]);

  useEffect(() => {
    updatePreview();
    const interval = setInterval(updatePreview, 1000);
    return () => clearInterval(interval);
  }, [updatePreview]);

  const handleSave = () => {
    if (!secret || !isValidBase32(secret)) return;
    onSave({
      issuer: issuer.trim(),
      account: account.trim(),
      secret: secret.toUpperCase().replace(/\s/g, ''),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>发行方 (Issuer)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary }]}
          placeholder="例如：GitHub, Google..."
          value={issuer}
          onChangeText={setIssuer}
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>账号名称 (Account)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary }]}
          placeholder="例如：用户名或邮箱"
          value={account}
          onChangeText={setAccount}
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>密钥 (Secret)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary }]}
          placeholder="Base32 格式密钥"
          value={secret}
          onChangeText={(t) => setSecret(t.toUpperCase())}
          autoCapitalize="characters"
        />
      </View>

      {previewCode && (
        <View style={[styles.previewBox, { backgroundColor: colors.cardBg }]}>
          <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>验证码预览</Text>
          <Text style={[styles.previewCode, { color: colors.accentGreen }]}>
            {previewCode.slice(0, 3)} {previewCode.slice(3)}
          </Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>
            剩余 {previewSeconds} 秒
          </Text>
        </View>
      )}

      <Pressable
        style={[styles.saveBtn, { backgroundColor: colors.fabBg }, (!isValidBase32(secret)) && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={!isValidBase32(secret)}
      >
        <Text style={styles.saveBtnText}>保存账号</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: {
    padding: 14,
    borderRadius: 18,
    fontSize: 15,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  previewBox: {
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  previewCode: {
    fontFamily: 'monospace',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 6,
  },
  saveBtn: {
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
