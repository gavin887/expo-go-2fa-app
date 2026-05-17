// [AI] Edit account screen with delete confirmation
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAccounts } from '../features/accounts/hooks/useAccounts';
import { ManualAddForm } from '../features/accounts/components/ManualAddForm';

export function EditAccountScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { id } = route.params;
  const { accounts, updateAccount, deleteAccount } = useAccounts();
  const account = accounts.find((a) => a.id === id);

  if (!account) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.textPrimary }}>账号不存在</Text>
      </View>
    );
  }

  const handleSave = (data) => {
    updateAccount({ ...account, ...data });
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
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ManualAddForm onSave={handleSave} initialValues={account} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
