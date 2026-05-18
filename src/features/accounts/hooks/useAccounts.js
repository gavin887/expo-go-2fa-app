// [AI] useAccounts hook with CRUD operations for account management
import { useApp } from '../../../context/AppContext';
import { saveAccounts } from '../../security/encryption';

export function useAccounts() {
  const { state, dispatch } = useApp();

  const addAccount = async (accountData) => {
    const newAccount = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
      order: state.accounts.length,
      color: ['accentPink', 'accentBlue', 'accentPurple', 'accentGreen', 'accentOrange'][
        state.accounts.length % 5
      ],
      ...accountData,
    };

    const nextAccounts = [...state.accounts, newAccount];
    dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });

    // Critical: persist immediately so killing the app right after "Add" still keeps data.
    // This intentionally duplicates AppContext's effect-based persistence for reliability.
    try {
      await saveAccounts(nextAccounts);
    } catch (e) {
      console.warn('Failed to persist accounts after add:', e);
    }

    return newAccount;
  };

  const updateAccount = async (updatedAccount) => {
    const nextAccounts = state.accounts.map((acc) =>
      acc.id === updatedAccount.id ? updatedAccount : acc
    );
    dispatch({ type: 'UPDATE_ACCOUNT', payload: updatedAccount });
    try {
      await saveAccounts(nextAccounts);
    } catch (e) {
      console.warn('Failed to persist accounts after update:', e);
    }
  };

  const deleteAccount = async (id) => {
    const nextAccounts = state.accounts.filter((acc) => acc.id !== id);
    dispatch({ type: 'DELETE_ACCOUNT', payload: id });
    try {
      await saveAccounts(nextAccounts);
    } catch (e) {
      console.warn('Failed to persist accounts after delete:', e);
    }
  };

  return {
    accounts: [...state.accounts].sort((a, b) => a.order - b.order),
    addAccount,
    updateAccount,
    deleteAccount,
  };
}
