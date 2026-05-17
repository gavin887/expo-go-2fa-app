// [AI] Home screen with account list, action sheet, and copy-to-clipboard
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAccounts } from '../features/accounts/hooks/useAccounts';
import { AccountCard } from '../features/accounts/components/AccountCard';
import { EmptyState } from '../features/accounts/components/EmptyState';
import { FAB, Toast } from '../shared/components';
import * as Clipboard from 'expo-clipboard';

export function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { accounts, addAccount, deleteAccount } = useAccounts();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Accounts loaded via persistence in AppContext
    }, [])
  );

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const handleCopyCode = async (code) => {
    await Clipboard.setStringAsync(code.replace(' ', ''));
    showToast('已复制到剪贴板 ✓');
  };

  const handleDelete = (id) => {
    Alert.alert('删除账号', '确定要删除此账号吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          deleteAccount(id);
          showToast('已删除');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Pressable
            style={[styles.settingsBtn, { backgroundColor: colors.cardBg }]}
            onPress={() => navigation.navigate('Settings')}
            hitSlop={8}
          >
            <Text style={{ fontSize: 18 }}>⚙</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={accounts.length === 0 ? { flex: 1 } : {}}>
        {accounts.length === 0 ? (
          <EmptyState />
        ) : (
          accounts.map((acc) => (
            <AccountCard
              key={acc.id}
              account={acc}
              onPressCode={handleCopyCode}
              onEdit={() => navigation.navigate('EditAccount', { id: acc.id })}
              onDelete={() => handleDelete(acc.id)}
            />
          ))
        )}
      </ScrollView>

      <FAB onPress={() => setActionSheetVisible(true)} />

      <Modal
        visible={actionSheetVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setActionSheetVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setActionSheetVisible(false)}>
          <View style={[styles.actionSheet, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.actionSheetTitle, { color: colors.textPrimary }]}>添加账号</Text>
            <Pressable
              style={[styles.actionItem, { backgroundColor: colors.inputBg }]}
              onPress={() => {
                setActionSheetVisible(false);
                navigation.navigate('Scan');
              }}
            >
              <Text style={{ fontSize: 20 }}>📷</Text>
              <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>扫描二维码</Text>
            </Pressable>
            <Pressable
              style={[styles.actionItem, { backgroundColor: colors.inputBg }]}
              onPress={() => {
                setActionSheetVisible(false);
                navigation.navigate('ManualAdd');
              }}
            >
              <Text style={{ fontSize: 20 }}>⌨</Text>
              <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>手动输入密钥</Text>
            </Pressable>
            <Pressable
              style={[styles.actionItem, { backgroundColor: colors.inputBg }]}
              onPress={() => {
                setActionSheetVisible(false);
                navigation.navigate('ClipboardAdd');
              }}
            >
              <Text style={{ fontSize: 20 }}>📋</Text>
              <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>从剪贴板导入</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Toast message={toastMessage} visible={toastVisible} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 8, paddingBottom: 8 },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { flex: 1, padding: 16, paddingTop: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  actionSheet: {
    borderRadius: 24,
    padding: 20,
  },
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
    marginBottom: 8,
  },
  actionLabel: { fontSize: 15, fontWeight: '600' },
});
