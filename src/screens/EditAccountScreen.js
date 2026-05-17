// [AI] Edit account screen with delete confirmation
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAccounts } from '../features/accounts/hooks/useAccounts';
import { ManualAddForm } from '../features/accounts/components/ManualAddForm';

export function EditAccountScreen({ route, navigation }) {
  const { id } = route.params;
  const { accounts, updateAccount, deleteAccount } = useAccounts();
  const account = accounts.find((a) => a.id === id);

  if (!account) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>账号不存在</Text>
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
    <View style={{ flex: 1 }}>
      <ManualAddForm onSave={handleSave} initialValues={account} />
    </View>
  );
}
