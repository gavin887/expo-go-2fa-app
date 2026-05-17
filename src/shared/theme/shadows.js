import { Platform } from 'react-native';

export const getCardShadow = (theme, type = 'outer') => {
  if (type === 'outer') {
    return Platform.select({
      ios: {
        shadowColor: '#A3B1C6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      },
      android: {
        elevation: 4,
      },
    });
  }
  return {};
};
