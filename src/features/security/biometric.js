import * as LocalAuthentication from 'expo-local-authentication';

export async function isBiometricAvailable() {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
}

export async function authenticateWithBiometric(promptMessage = '验证身份') {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    fallbackLabel: '使用 PIN',
    cancelLabel: '取消',
  });
  return result.success;
}
