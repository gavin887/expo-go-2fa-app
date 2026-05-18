// [AI] Edit account screen with delete confirmation
import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAccounts } from '../features/accounts/hooks/useAccounts';
import { ManualAddForm } from '../features/accounts/components/ManualAddForm';
import { Toast } from '../shared/components';

export function EditAccountScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { id } = route.params;
  const { accounts, updateAccount, deleteAccount } = useAccounts();
  const account = accounts.find((a) => a.id === id);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(msg);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2000);
  }, []);

  if (!account) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.textPrimary }}>账号不存在</Text>
      </View>
    );
  }

  const handleSave = async (data) => {
    await updateAccount({ ...account, ...data });
    showToast('已保存');
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('删除账号', '确定要删除此账号吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          deleteAccount(id);
          showToast('已删除');
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ManualAddForm onSave={handleSave} initialValues={account} />
      <View style={styles.toastContainer} pointerEvents="none">
        <Toast message={toastMessage} visible={toastVisible} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
