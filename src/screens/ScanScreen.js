// [AI] QR code scanning screen for otpauth URLs
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Camera } from 'expo-camera';
import { parseOtpauthUrl } from '../../shared/utils/otpauth';
import { useTheme } from '../../context/ThemeContext';

export function ScanScreen({ navigation }) {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    const parsed = parseOtpauthUrl(data);
    if (parsed) {
      navigation.replace('ManualAdd', { parsedData: parsed });
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.textPrimary }}>需要相机权限</Text>
      </View>
    );
  }

  return (
    <Camera
      style={styles.camera}
      onBarCodeScanned={handleBarCodeScanned}
      barCodeScannerSettings={{ barCodeTypes: ['qr'] }}
    />
  );
}

const styles = StyleSheet.create({
  camera: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
