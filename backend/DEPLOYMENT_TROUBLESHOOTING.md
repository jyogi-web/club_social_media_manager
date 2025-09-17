# デプロイメント・トラブルシューティングガイド

## CORSエラー解決とCloudflare Workers環境変数設定手順

このドキュメントでは、CORSエラーの解決方法とCloudflare Workersでの適切な環境変数設定方法を説明します。

## 目次

1. [CORSエラーの解決](#corsエラーの解決)
2. [環境変数設定の問題と解決策](#環境変数設定の問題と解決策)
3. [完全なデプロイ手順](#完全なデプロイ手順)
4. [トラブルシューティング](#トラブルシューティング)

---

## CORSエラーの解決

### 問題
フロントエンドからバックエンドAPIへのリクエストでCORSエラーが発生：
```
Access to fetch at 'https://club-social-media-manager-backend.jyogi.workers.dev/discord/preview'
from origin 'https://club-social-media-manager.pages.dev' has been blocked by CORS policy
```

### 解決策

#### 1. 動的CORS設定の実装

`backend/src/index.ts`で動的なオリジン検証を実装：

```typescript
// CORS設定
app.use('*', cors({
  origin: (origin) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:3001',
      'https://club-social-media-manager.pages.dev'
    ]

    // 許可されたオリジンまたはpages.devサブドメインをチェック
    if (allowedOrigins.includes(origin) || origin?.endsWith('.pages.dev')) {
      return origin
    }

    return null
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
```

#### 2. 対応するオリジン

✅ **ローカル開発環境**
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:5173`

✅ **本番環境**
- `https://club-social-media-manager.pages.dev`
- `https://*.pages.dev` (すべてのCloudflare Pagesプレビュー)

---

## 環境変数設定の問題と解決策

### 問題
```bash
Error: Binding name 'DISCORD_WEBHOOK_URL' already in use.
Please use a different name and try again. [code: 10053]
```

この問題は、環境変数が`wrangler.jsonc`の`vars`セクション（平文）とSecrets（暗号化）の両方で定義されている場合に発生します。

### 解決手順

#### 1. wrangler.jsoncからvarsセクションを削除

**❌ 問題のある設定:**
```jsonc
{
  "vars": {
    "DISCORD_APPLICATION_ID": "",
    "DISCORD_PUBLIC_KEY": "",
    "DISCORD_WEBHOOK_URL": "",
    "GEMINI_API_KEY": ""
  }
}
```

**✅ 正しい設定:**
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "club-social-media-manager-backend",
  "main": "src/index.ts",
  "compatibility_date": "2025-09-16",
  "kv_namespaces": [
    {
      "binding": "CLUB_KV",
      "id": "08268c358afd440785cfe385d5b9d557"
    }
  ]
}
```

#### 2. 古い設定をクリアするためにデプロイ

```bash
cd backend
wrangler deploy --minify
```

#### 3. 環境変数をSecretsとして設定

```bash
# Discord Webhook URL
echo "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL" | wrangler secret put DISCORD_WEBHOOK_URL

# Discord Application ID
echo "YOUR_APPLICATION_ID" | wrangler secret put DISCORD_APPLICATION_ID

# Discord Public Key
echo "YOUR_PUBLIC_KEY" | wrangler secret put DISCORD_PUBLIC_KEY

# Gemini API Key
echo "YOUR_GEMINI_API_KEY" | wrangler secret put GEMINI_API_KEY
```

#### 4. Secrets設定を確認

```bash
wrangler secret list
```

期待される出力：
```json
[
  {
    "name": "DISCORD_APPLICATION_ID",
    "type": "secret_text"
  },
  {
    "name": "DISCORD_PUBLIC_KEY",
    "type": "secret_text"
  },
  {
    "name": "DISCORD_WEBHOOK_URL",
    "type": "secret_text"
  },
  {
    "name": "GEMINI_API_KEY",
    "type": "secret_text"
  }
]
```

#### 5. 最終デプロイ

```bash
wrangler deploy --minify
```

---

## 完全なデプロイ手順

### 1. ローカル開発環境の設定

```bash
# バックエンドディレクトリに移動
cd backend

# .envファイルを作成（ローカル開発用）
cp .env.example .env

# .envファイルを編集して実際の値を設定
# DISCORD_APPLICATION_ID=1417852563822350426
# DISCORD_PUBLIC_KEY=f547a7f50ed6c12ad8f09fd5121cd33292c2d72a5ab4c429bba12b12d91cac09
# DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1417930164125438165/D6ppXbOAoCusbqzYvWoVTU5cqZEct8tu4zOt0cjf-ik0la-BgPW7KuF33C6cBihHc16o
# GEMINI_API_KEY=AIzaSyBngHywa0fKjI0pJdrQuzccisBVopnWjiI
```

### 2. 本番環境の設定

```bash
# wrangler.jsoncからvarsセクションを削除（既に完了）

# 古い設定をクリア
wrangler deploy --minify

# Secretsを設定
echo "https://discord.com/api/webhooks/1417930164125438165/D6ppXbOAoCusbqzYvWoVTU5cqZEct8tu4zOt0cjf-ik0la-BgPW7KuF33C6cBihHc16o" | wrangler secret put DISCORD_WEBHOOK_URL
echo "1417852563822350426" | wrangler secret put DISCORD_APPLICATION_ID
echo "f547a7f50ed6c12ad8f09fd5121cd33292c2d72a5ab4c429bba12b12d91cac09" | wrangler secret put DISCORD_PUBLIC_KEY
echo "AIzaSyBngHywa0fKjI0pJdrQuzccisBVopnWjiI" | wrangler secret put GEMINI_API_KEY

# 最終デプロイ
wrangler deploy --minify
```

### 3. 動作確認

**ローカル開発環境:**
```bash
# バックエンド起動
cd backend && npm run dev

# フロントエンド起動（別ターミナル）
cd frontend && npm run dev
```

**本番環境:**
- フロントエンド: `https://club-social-media-manager.pages.dev`
- バックエンド: `https://club-social-media-manager-backend.jyogi.workers.dev`

---

## トラブルシューティング

### よくある問題と解決策

#### 1. CORSエラーが継続する場合

**確認事項:**
- ✅ CORS設定が正しく実装されているか
- ✅ 動的オリジン検証が機能しているか
- ✅ OPTIONSメソッドが許可されているか

**解決策:**
```bash
# バックエンドを再デプロイ
cd backend
wrangler deploy --minify
```

#### 2. 環境変数が反映されない場合

**確認コマンド:**
```bash
# Secretsの一覧を確認
wrangler secret list

# デプロイ状況を確認
wrangler status
```

**解決策:**
```bash
# Secretsを再設定
wrangler secret put VARIABLE_NAME

# 再デプロイ
wrangler deploy --minify
```

#### 3. 開発モードと本番モードの動作確認

**開発モード（期待される応答）:**
```json
{
  "success": true,
  "message": "Discordにプレビューを送信しました（開発モード）"
}
```

**本番モード（期待される応答）:**
```json
{
  "success": true,
  "message": "Discordにプレビューを送信しました"
}
```

#### 4. Discord Webhookの動作確認

**テスト方法:**
```bash
# 直接Webhook URLにPOSTリクエストを送信
curl -X POST "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "テスト投稿"}'
```

### セキュリティのベストプラクティス

#### 1. 環境変数の管理

✅ **推奨:**
- 機密情報はSecretsとして保存
- ローカル開発では`.env`ファイルを使用
- `.env`ファイルを`.gitignore`に追加

❌ **非推奨:**
- `wrangler.jsonc`の`vars`セクションに機密情報を保存
- 機密情報をコードに直接記述

#### 2. CORS設定

✅ **推奨:**
- 明示的なオリジン許可
- 動的な検証ロジック
- 必要最小限のメソッドとヘッダーのみ許可

❌ **非推奨:**
- `origin: "*"`（すべてのオリジンを許可）
- 過度に寛容な設定

---

## 更新履歴

- **2025-09-18**: 初回作成
  - CORSエラー解決手順を追加
  - 環境変数設定の問題と解決策を追加
  - 完全なデプロイ手順を文書化
  - トラブルシューティングガイドを追加