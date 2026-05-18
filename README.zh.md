# 双重身份验证器 (2FA Authenticator)

基于 Expo Go 构建的 Claymorphism 风格 TOTP/HOTP 验证器应用。

## 功能特性

- **TOTP/HOTP 支持**: 符合 RFC 6238 / RFC 4226 标准的一次性密码生成
- **二维码扫描**: 通过 expo-camera 扫描 otpauth:// 链接
- **手动添加**: 手动输入密钥添加账号
- **剪贴板导入**: 一键从剪贴板导入
- **时间校准**: 基于 NTP 的时间同步，确保验证码准确
- **数据管理**: 导出、备份、导入账号数据
- **主题系统**: 浅色 / 深色 / 跟随系统，采用 Claymorphism 设计风格
- **应用锁**: 支持生物识别 / PIN 锁
- **持久化设置**: 所有偏好设置通过 SecureStore 加密存储

## 技术栈

- **运行时**: Expo Go (JavaScript + Expo SDK 54)
- **UI 风格**: Claymorphism（马卡龙色系、双重阴影、弹簧动效）
- **状态管理**: React Context + useReducer
- **存储方案**: expo-secure-store（加密存储）
- **导航**: React Navigation（Native Stack）
- **OTP 算法**: jsSHA（HMAC-SHA1/256/512）

## 快速开始

```bash
npm install
npx expo start
```

使用手机上的 Expo Go 扫描终端中的二维码。

## 项目结构

```
src/
├── context/          # 全局 Context：AppContext、ThemeContext、SecurityContext
├── features/
│   ├── accounts/     # 账号卡片、账号列表
│   ├── otp/          # TOTP/HOTP 生成、时间同步
│   ├── security/     # 加密、账号持久化
│   ├── import-export/# 导出、备份、导入
│   └── settings/     # 设置页面及组件
├── navigation/       # AppNavigator、Stack 路由配置
├── screens/          # 首页、扫码页、手动添加、编辑页
└── shared/
    ├── components/   # FAB、计时器圆环、开关、Toast
    ├── theme/        # 浅色/深色主题色值定义
    └── utils/        # SecureStore 存储适配器
```

## 许可证

私有项目
