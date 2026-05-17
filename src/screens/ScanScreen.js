// [AI] QR code scanning screen for otpauth URLs with error handling
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Camera } from 'expo-camera';
import { parseOtpauthUrl } from '../../shared/utils/otpauth';
import { useTheme } from '../../context/ThemeContext';

export function ScanScreen({ navigation }) {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  const [lastScanned, setLastScanned] = useState(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    // Prevent duplicate scans
    if (data === lastScanned) return;
    setLastScanned(data);

    const parsed = parseOtpauthUrl(data);
    if (parsed) {
      navigation.replace('ManualAdd', { parsedData: parsed });
    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setLastScanned(null);
      }, 2000);
    }
  };

  if (hasPermission === null) return <View style={styles.center} />;
  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.textPrimary, fontSize: 16, marginBottom: 16 }}>
          需要相机权限
        </Text>
        <Text style={{ color: colors.textSecondary }}>
          请在系统设置中授予相机权限
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        onBarCodeScanned={handleBarCodeScanned}
        barCodeScannerSettings={{ barCodeTypes: ['qr'] }}
      />
      {showError && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>无法识别的二维码</Text>
        </View>
      )}
      <View style={styles.hintOverlay}>
        <Text style={styles.hintText}>将二维码放入框内自动扫描</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.9)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  errorText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  hintOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  hintText: { color: '#FFFFFF', fontSize: 14 },
});
