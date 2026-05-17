# 2FA Authenticator App - 设计文档

> 创建日期：2026-05-17
> 状态：待审核

---

## 一、项目概述

基于 Expo Go 开发的 TOTP/HOTP 身份验证器 App，采用 Claymorphism（黏土形态）设计风格。支持完整的账号管理、验证码生成、安全存储、导入导出、时间校准等功能。

### 技术栈

| 层级 | 技术选型 |
|------|----------|
| 框架 | Expo Go (纯 JavaScript + Expo SDK) |
| 状态管理 | React Context + useReducer |
| 架构模式 | Feature-Sliced Design |
| UI 风格 | Claymorphism (黏土形态/马卡龙色系) |
| 加密存储 | expo-secure-store |
| 二维码扫描 | expo-barcode-scanner |
| 剪贴板 | expo-clipboard |
| 文件选择 | expo-document-picker |
| 时间校准 | ntp-client |

---

## 二、架构设计

### 2.1 Feature-Sliced 目录结构

```
src/
├── features/
│   ├── accounts/       # 账号管理 feature
│   │   ├── components/ # 账号特有组件（账号卡片、空状态等）
│   │   ├── hooks/      # 账号相关 hooks
│   │   └── utils/      # 账号工具函数
│   ├── otp/            # OTP 算法 feature
│   │   ├── totp.js     # TOTP 实现
│   │   ├── hotp.js     # HOTP 实现
│   │   └── time-sync.js# 时间校准
│   ├── security/       # 安全 feature
│   │   ├── encryption.js   # 加密/解密
│   │   ├── app-lock.js     # 应用锁
│   │   └── biometric.js    # 生物识别
│   ├── import-export/# 导入导出 feature
│   │   ├── export.js       # 导出逻辑
│   │   ├── backup.js       # 备份逻辑
│   │   └── import.js       # 导入逻辑
│   └── settings/       # 设置 feature
│       ├── theme.js        # 主题管理
│       └── preferences.js  # 偏好设置
├── shared/
│   ├── components/     # 通用 UI 组件
│   │   ├── ClayCard.js     # 黏土卡片
│   │   ├── TimerRing.js    # 倒计时圆环
│   │   ├── Toggle.js       # 开关组件
│   │   ├── Toast.js        # 提示组件
│   │   └── FAB.js          # 悬浮按钮
│   ├── hooks/          # 自定义 Hooks
│   ├── utils/          # 工具函数
│   │   ├── base32.js       # Base32 编解码
│   │   ├── clipboard.js    # 剪贴板处理
│   │   └── otpauth.js      # otpauth URL 解析
│   └── theme/          # 主题配置
│       ├── colors.js       # 颜色定义
│       ├── shadows.js      # 阴影定义
│       └── animations.js   # 动画定义
├── navigation/         # 路由配置
│   └── AppNavigator.js
├── context/            # 全局 Context Providers
│   ├── AppContext.js       # 应用状态
│   ├── ThemeContext.js     # 主题状态
│   └── SecurityContext.js  # 安全状态
└── App.js              # 应用入口
```

### 2.2 数据流

```
用户操作 → Feature 处理 → Context dispatch → 加密存储 → UI 更新
                                                    ↓
                                             倒计时定时器 → 自动刷新
```

### 2.3 全局状态结构

```javascript
// AppContext 状态
{
  accounts: [
    {
      id: string,           // 唯一标识
      issuer: string,       // 发行方
      account: string,      // 账号名称
      secret: string,       // Base32 密钥（加密存储）
      algorithm: 'TOTP'|'HOTP',
      digits: number,       // 验证码位数
      period: number,       // TOTP 周期（默认 30s）
      counter: number,      // HOTP 计数器
      color: string,        // 卡片 accent 颜色
      order: number         // 排序权重
    }
  ],
  settings: {
    theme: 'light'|'dark'|'system',
    timeSyncEnabled: boolean,
    timeOffset: number,     // 时间差值（毫秒）
    lastCalibration: Date,
    appLockEnabled: boolean,
    appLockType: 'pin'|'biometric'|'none'
  }
}
```

---

## 三、UI 设计规范

### 3.1 Claymorphism 设计原则

1. **双重阴影机制** - 外阴影（凸起）+ 内阴影（凹陷）模拟物理黏土质感
2. **马卡龙色系** - 粉/蓝/紫/绿/橙柔和配色，避免高饱和度
3. **弹簧动效** - cubic-bezier(0.34, 1.56, 0.64, 1) 回弹曲线
4. **圆角系统** - lg: 24px, md: 18px, sm: 14px, pill: 999px

### 3.2 颜色系统

#### 浅色主题

```css
--bg: #F0F4F8
--card-bg: #FFFFFF
--text-primary: #2D3748
--text-secondary: #718096
--accent-pink: #FFB6C1
--accent-blue: #A8D8EA
--accent-purple: #C3B1E1
--accent-green: #B5EAD7
--accent-orange: #FFDAC1
--timer-ring: #A8D8EA
--timer-warning: #FFB6C1
```

#### 深色主题

```css
--bg: #1A1D23
--card-bg: #2A2E36
--text-primary: #E8ECF1
--text-secondary: #8892A0
--accent-pink: #D4949B
--accent-blue: #7BB8D0
--accent-purple: #9B8DC4
--accent-green: #88C9A8
--accent-orange: #D4A88B
--timer-ring: #7BB8D0
--timer-warning: #D4949B
```

### 3.3 阴影系统

```css
/* 浅色外阴影（凸起效果） */
--card-shadow-outer: 8px 8px 16px rgba(163,177,198,0.3), -8px -8px 16px rgba(255,255,255,0.8);

/* 浅色内阴影（凹陷效果） */
--card-shadow-inner: inset 4px 4px 8px rgba(163,177,198,0.15), inset -4px -4px 8px rgba(255,255,255,0.9);

/* 按下状态 */
--pressed-shadow: inset 6px 6px 12px rgba(163,177,198,0.25), inset -6px -6px 12px rgba(255,255,255,0.7);
```

### 3.4 动效规范

| 场景 | 时长 | 缓动函数 |
|------|------|----------|
| 卡片按压 | 400ms | cubic-bezier(0.34, 1.56, 0.64, 1) |
| Toast 出现 | 300ms | cubic-bezier(0.4, 0, 0.2, 1) |
| 页面切换 | 300ms | cubic-bezier(0.4, 0, 0.2, 1) |
| 倒计时更新 | 1000ms | linear |

---

## 四、功能模块详细设计

### 4.1 账号管理 (features/accounts)

#### 添加账号
- **扫码添加**：调用相机扫描 → 解析 otpauth:// URL → 预览确认 → 保存
- **手动输入**：表单（Issuer/Account/Secret）→ 实时预览验证码 → 保存
- **剪贴板导入**：读取剪贴板 → 自动识别格式 → 预览确认 → 保存

#### 账号卡片
- 显示：Issuer + Account + 验证码（等宽字体 28-32sp）+ 倒计时圆环
- 交互：点击验证码 → 复制到剪贴板 + Toast 提示
- 倒计时 < 5 秒时，圆环变为红色

#### 编辑/删除
- 编辑：修改名称/Secret，需二次确认
- 删除：左滑卡片或长按弹出菜单，需二次确认

### 4.2 OTP 算法 (features/otp)

#### TOTP 实现
- 算法：RFC 6238
- 周期：默认 30 秒
- 位数：6 位数字
- 时间偏移：支持服务器时间校准

#### HOTP 实现
- 算法：RFC 4226
- 计数器：递增

#### 时间校准
- 原理：NTP 服务器获取标准时间，计算与本地时间差值
- 生命周期：App 启动时校准一次，后台切回前台时可选择性校准
- 用户控制：开关/手动校准/显示差值/显示上次校准时间

### 4.3 安全 (features/security)

#### 加密存储
- 所有账号数据加密存储于 expo-secure-store
- 加密密钥由设备安全环境托管（Keychain/Keystore）

#### 应用锁（可选）
- 支持 PIN 码 / 生物识别（指纹/面容）
- 默认关闭，可开关

### 4.4 导入导出 (features/import-export)

#### 导出
- **Secret 列表**：每行一个 Base32 Secret
- **otpauth 链接**：每行一个完整 URL
- 调用系统分享面板

#### 备份
- 加密 JSON 文件（包含名称、排序、自定义字段）
- 调用系统分享面板

#### 导入
- **从备份文件**：加密 JSON → 覆盖/合并（去重）
- **从导出文件**：纯文本 → 逐行解析 → 遇错跳过并报告

### 4.5 设置 (features/settings)

#### 分组结构
| 分组 | 内容 |
|------|------|
| 外观 | 主题切换（浅色/深色/跟随系统） |
| 安全 | 应用锁开关 |
| 数据管理 | 导出/备份/导入 |
| 高级 | 时间校准开关/差值显示/手动校准 |
| 关于 | 版本号/开源协议/隐私政策 |

---

## 五、页面路由

| 页面 | 路由 | 说明 |
|------|------|------|
| 账号列表 | `/` | 主页，底部 FAB |
| 扫码 | `/scan` | 全屏相机预览 |
| 手动输入 | `/add/manual` | 表单页 |
| 剪贴板导入 | `/add/clipboard` | 预览确认页 |
| 编辑账号 | `/edit/:id` | 编辑表单 |
| 设置 | `/settings` | 分组列表 |

---

## 六、技术约束

- 所有功能基于纯 JavaScript 和 Expo SDK 可实现
- 不使用需要预编译的自定义原生模块
- 加密存储使用 expo-secure-store
- 二维码扫描使用 expo-barcode-scanner
- 剪贴板读写使用 expo-clipboard
- 文件选择使用 expo-document-picker
- 时间校准通过 ntp-client 实现
