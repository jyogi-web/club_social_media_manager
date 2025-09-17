# 環境変数設定手順

## 概要

このドキュメントでは、Club Social Media Manager バックエンドの環境変数設定方法を説明します。

## 必要な環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `DISCORD_APPLICATION_ID` | Discord Application ID | ✅ |
| `DISCORD_PUBLIC_KEY` | Discord Public Key | ✅ |
| `DISCORD_WEBHOOK_URL` | Discord Webhook URL（投稿プレビュー送信用） | ✅ |
| `GEMINI_API_KEY` | Google Gemini API Key（AI分析機能用） | ❌ |

## 1. ローカル開発環境の設定

### 1.1 .envファイルの準備

```bash
cd backend
cp .env.example .env
```

### 1.2 .envファイルの編集

`backend/.env` ファイルを開いて、実際の値を設定します：

```env
DISCORD_APPLICATION_ID=あなたのApplication ID
DISCORD_PUBLIC_KEY=あなたのPublic Key
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/あなたのWebhook URL
GEMINI_API_KEY=あなたのGemini APIキー
```

## 2. Discord設定の取得

### 2.1 Discord Developer Application

1. [Discord Developer Portal](https://discord.com/developers/applications) にアクセス
2. 「New Application」で新しいアプリケーションを作成
3. アプリケーション名を入力（例：「Club Social Media Manager」）

### 2.2 Application IDとPublic Keyの取得

1. **General Information** タブで以下を取得：
   - **Application ID**：そのままコピー
   - **Public Key**：そのままコピー

### 2.3 Discord Webhook URLの設定

1. Discordサーバーの **サーバー設定** → **連携サービス** → **ウェブフック**
2. **「ウェブフックを作成」** をクリック
3. 設定項目：
   - **名前**：「ソーシャルメディア管理」など
   - **チャンネル**：プレビューを送信したいチャンネルを選択
4. **「ウェブフックURLをコピー」** をクリック

## 3. Google Gemini API設定の取得

### 3.1 Google AI Studioでの設定

1. [Google AI Studio](https://aistudio.google.com/) にアクセス
2. Googleアカウントでログイン
3. **「Get API key」** をクリック
4. **「Create API key」** を選択
5. プロジェクトを選択または新規作成
6. 作成されたAPIキーをコピー

### 3.2 API制限の設定（推奨）

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. **APIs & Services** → **Credentials**
3. 作成したAPIキーを選択
4. **API restrictions** でGenerative AI APIのみを許可
5. **Application restrictions** で必要に応じてIP制限を設定

## 4. 本番環境（Cloudflare Workers）での設定

### 4.1 Wrangler CLIでの設定

```bash
cd backend

# 各環境変数をSecretsとして設定
wrangler secret put DISCORD_APPLICATION_ID
# プロンプトで実際の値を入力

wrangler secret put DISCORD_PUBLIC_KEY
# プロンプトで実際の値を入力

wrangler secret put DISCORD_WEBHOOK_URL
# プロンプトで実際の値を入力

wrangler secret put GEMINI_API_KEY
# プロンプトで実際の値を入力
```

### 4.2 Cloudflare Dashboardでの設定

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にアクセス
2. **Workers & Pages** → あなたのWorker
3. **Settings** → **Variables**
4. **Environment Variables** セクションで各変数を追加

## 5. 設定の確認

### 5.1 ローカル開発サーバーの起動

```bash
cd backend
npm install
npm run dev
```

### 5.2 動作確認

1. `http://localhost:8787` にアクセス
2. APIが正常に起動していることを確認
3. Discord連携とAI分析機能をテスト

## 6. セキュリティ注意事項

### 6.1 .envファイルの取り扱い

- ✅ `.env` ファイルは `.gitignore` に含まれていることを確認
- ✅ `.env.example` のみをリポジトリにコミット
- ❌ **絶対に** `.env` ファイルをGitにコミットしない

### 6.2 APIキーの管理

- 🔐 APIキーは定期的にローテーション
- 🔐 不要になったAPIキーは即座に無効化
- 🔐 APIキーには適切な制限を設定

## 7. トラブルシューティング

### 7.1 よくある問題

| 問題 | 解決方法 |
|------|----------|
| Discord Webhookが機能しない | Webhook URLの形式とチャンネル権限を確認 |
| Gemini APIエラー | APIキーの有効性とクォータ制限を確認 |
| 環境変数が読み込まれない | `.env` ファイルの場所とファイル名を確認 |

### 7.2 ログの確認

```bash
# ローカル開発時のログ確認
cd backend
npm run dev

# Cloudflare Workersのログ確認
wrangler tail
```

## 8. 更新履歴

- **2025-09-18**: 初回作成、基本的な環境変数設定手順を追加