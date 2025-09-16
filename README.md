# 広報補佐うさこ

クラブ活動のSNS広報を効率化するツールです。

## 機能

- 団体IDとパスワードによる認証
- AIによる画像・本文の自動チェック
- Discordへのレビュー依頼通知
- Twitter Web Intentsによる投稿補助

## 技術スタック

- **フロントエンド**: React + TypeScript + Vite
- **バックエンド**: Hono + Cloudflare Workers
- **データベース**: Cloudflare Workers KV
- **AI**: Gemini API, Cloudflare AI

## セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定

`wrangler.toml`ファイルを編集し、以下の環境変数を設定してください：

```bash
# Cloudflare Workers環境変数の設定
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put DISCORD_WEBHOOK_URL
npx wrangler secret put AUTH_SECRET
```

### 3. KV Namespaceの作成

```bash
npx wrangler kv:namespace create "CLUB_KV"
```

作成されたNamespace IDを`wrangler.toml`の`kv_namespaces`セクションに設定してください。

### 4. 開発環境の起動

#### フロントエンド
```bash
npm run dev
```

#### バックエンド
```bash
npm run dev:backend
```

### 5. デプロイ

```bash
npm run deploy
```

## TODO

- [ ] 団体IDとパスワードの初期設定機能
- [ ] AI チェック精度の向上
- [ ] Discord通知テンプレートのカスタマイズ機能
- [ ] 投稿履歴の表示機能