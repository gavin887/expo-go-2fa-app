// [AI] Manual account add screen wrapping ManualAddForm
import React from 'react';
import { ManualAddForm } from '../features/accounts/components/ManualAddForm';
import { useAccounts } from '../features/accounts/hooks/useAccounts';

export function ManualAddScreen({ navigation, route }) {
  const { addAccount } = useAccounts();
  const initialData = route.params?.parsedData;

  const handleSave = (data) => {
    addAccount(data);
    navigation.goBack();
  };

  return <ManualAddForm onSave={handleSave} initialValues={initialData} />;
}
