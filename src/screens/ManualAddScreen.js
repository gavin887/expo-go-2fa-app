// [AI] Manual account add screen wrapping ManualAddForm
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ManualAddForm } from '../features/accounts/components/ManualAddForm';
import { useAccounts } from '../features/accounts/hooks/useAccounts';

export function ManualAddScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { addAccount } = useAccounts();
  const initialData = route.params?.parsedData;

  const handleSave = (data) => {
    addAccount(data);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ManualAddForm onSave={handleSave} initialValues={initialData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
