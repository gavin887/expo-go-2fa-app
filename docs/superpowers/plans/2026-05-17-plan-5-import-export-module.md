# 计划 5: 导入导出模块

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现账号导出（Secret/otpauth）、备份（加密JSON）、导入（覆盖/合并）

**Architecture:** features/import-export 封装文件读写逻辑，使用 expo-document-picker 和 expo-sharing

**Tech Stack:** expo-document-picker, expo-sharing, expo-clipboard

---

### Task 5.1: 导出功能

**Files:**
- Create: `src/features/import-export/export.js`

- [ ] **Step 1: 实现导出逻辑**

```javascript
// src/features/import-export/export.js
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { buildOtpauthUrl } from '../../shared/utils/otpauth';

export async function exportAsSecrets(accounts) {
  const content = accounts.map((a) => a.secret).join('\n');
  return await shareText(content, 'secrets.txt');
}

export async function exportAsOtpauthUrls(accounts) {
  const content = accounts
    .map((a) =>
      buildOtpauthUrl({
        type: a.type || 'totp',
        issuer: a.issuer,
        account: a.account,
        secret: a.secret,
        algorithm: a.algorithm,
        digits: a.digits,
        period: a.period,
        counter: a.counter,
      })
    )
    .join('\n');
  return await shareText(content, 'otpauth-urls.txt');
}

async function shareText(content, filename) {
  const fileUri = FileSystem.documentDirectory + filename;
  await FileSystem.writeAsStringAsync(fileUri, content);
  await Sharing.shareAsync(fileUri, {
    mimeType: 'text/plain',
    UTI: 'public.plain-text',
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/import-export/export.js
git commit -m "[AI] feat: add account export as secrets and otpauth URLs"
```

---

### Task 5.2: 备份功能

**Files:**
- Create: `src/features/import-export/backup.js`

- [ ] **Step 1: 实现备份逻辑**

```javascript
// src/features/import-export/backup.js
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { obfuscate } from '../security/encryption';

export async function backupAccounts(accounts, settings) {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    accounts,
    settings,
  };
  const content = obfuscate(data);
  const fileUri = FileSystem.documentDirectory + '2fa-backup.json';
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ data: content }));
  await Sharing.shareAsync(fileUri, {
    mimeType: 'application/json',
    UTI: 'public.json',
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/import-export/backup.js
git commit -m "[AI] feat: add encrypted account backup"
```

---

### Task 5.3: 导入功能

**Files:**
- Create: `src/features/import-export/import.js`

- [ ] **Step 1: 实现导入逻辑**

```javascript
// src/features/import-export/import.js
import * as DocumentPicker from 'expo-document-picker';
import { parseOtpauthUrl } from '../../shared/utils/otpauth';
import { isValidBase32 } from '../../shared/utils/base32';
import { deobfuscate } from '../security/encryption';

export async function pickFile() {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    type: '*/*',
  });
  if (result.canceled) return null;
  return result.assets[0].uri;
}

export async function importFromBackup(fileUri, merge = true) {
  const content = await fetch(fileUri).then((r) => r.text());
  const parsed = JSON.parse(content);
  const data = deobfuscate(parsed.data);
  if (!data || !data.accounts) throw new Error('Invalid backup file');

  if (merge) {
    return { type: 'merge', accounts: data.accounts, settings: data.settings };
  }
  return { type: 'replace', accounts: data.accounts, settings: data.settings };
}

export async function importFromText(fileUri) {
  const content = await fetch(fileUri).then((r) => r.text());
  const lines = content.split('\n').filter(Boolean);
  const accounts = [];
  const errors = [];

  lines.forEach((line, i) => {
    if (line.startsWith('otpauth://')) {
      const parsed = parseOtpauthUrl(line);
      if (parsed) {
        accounts.push({ ...parsed, id: generateId() });
      } else {
        errors.push(`Line ${i + 1}: Invalid otpauth URL`);
      }
    } else if (isValidBase32(line)) {
      accounts.push({
        id: generateId(),
        secret: line.toUpperCase(),
        issuer: '',
        account: `Account ${accounts.length + 1}`,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
      });
    } else {
      errors.push(`Line ${i + 1}: Invalid format`);
    }
  });

  return { accounts, errors };
}

function generateId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 8);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/import-export/import.js
git commit -m "[AI] feat: add account import from backup and text files"
```
