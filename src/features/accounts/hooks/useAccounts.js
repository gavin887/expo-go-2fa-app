// [AI] useAccounts hook with CRUD operations for account management
import { useApp } from '../../../context/AppContext';

export function useAccounts() {
  const { state, dispatch } = useApp();

  const addAccount = (accountData) => {
    const newAccount = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
      order: state.accounts.length,
      color: ['accentPink', 'accentBlue', 'accentPurple', 'accentGreen', 'accentOrange'][
        state.accounts.length % 5
      ],
      ...accountData,
    };
    dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
    return newAccount;
  };

  const updateAccount = (updatedAccount) => {
    dispatch({ type: 'UPDATE_ACCOUNT', payload: updatedAccount });
  };

  const deleteAccount = (id) => {
    dispatch({ type: 'DELETE_ACCOUNT', payload: id });
  };

  return {
    accounts: state.accounts.sort((a, b) => a.order - b.order),
    addAccount,
    updateAccount,
    deleteAccount,
  };
}
