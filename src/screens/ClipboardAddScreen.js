// [AI] Clipboard import screen for otpauth URLs or base32 secrets
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../../context/ThemeContext';
import { parseOtpauthUrl } from '../../shared/utils/otpauth';
import { isValidBase32 } from '../../shared/utils/base32';
import { useAccounts } from '../../features/accounts/hooks/useAccounts';

export function ClipboardAddScreen({ navigation }) {
  const { colors } = useTheme();
  const { addAccount } = useAccounts();
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const content = await Clipboard.getStringAsync();
      let data = parseOtpauthUrl(content);
      if (!data && isValidBase32(content.trim())) {
        data = {
          secret: content.trim().toUpperCase(),
          issuer: '',
          account: 'Imported Account',
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
        };
      }
      if (data) {
        setParsedData(data);
      } else {
        setError('无法识别剪贴板内容');
      }
    })();
  }, []);

  const handleSave = () => {
    if (parsedData) {
      addAccount(parsedData);
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {parsedData ? (
        <>
          <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 16 }}>识别成功</Text>
          <Text style={{ color: colors.textSecondary }}>发行方: {parsedData.issuer || '(无)'}</Text>
          <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>账号: {parsedData.account}</Text>
          <Pressable style={[styles.saveBtn, { backgroundColor: colors.fabBg }]} onPress={handleSave}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>保存</Text>
          </Pressable>
        </>
      ) : (
        <Text style={{ color: colors.textSecondary }}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  saveBtn: { padding: 16, borderRadius: 24, alignItems: 'center', marginTop: 24 },
});
