// [AI] Empty state component for when no accounts exist
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export function EmptyState() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.illustration, { backgroundColor: colors.emptyIllustration }]}>
        <Text style={{ fontSize: 64, opacity: 0.6 }}>🔐</Text>
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        欢迎使用身份验证器
      </Text>
      <Text style={[styles.desc, { color: colors.textSecondary }]}>
        点击下方 + 按钮，扫描或手动添加你的第一个账号，开始生成动态验证码。
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 60 },
  illustration: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  desc: { fontSize: 14, lineHeight: 22, textAlign: 'center', maxWidth: 260 },
});
