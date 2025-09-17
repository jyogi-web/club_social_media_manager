# セットアップガイド

## 必要な準備

### 1. Cloudflareアカウント
- [Cloudflare](https://dash.cloudflare.com)でアカウント作成
- Workers プランに登録（無料プランでも開始可能）

### 2. 外部サービスのAPIキー

#### Gemini API (テキスト分析用)
1. [Google AI Studio](https://aistudio.google.com/)にアクセス
2. APIキーを生成
3. `GEMINI_API_KEY` として設定

#### Discord Webhook (通知用)
1. Discordサーバーで「サーバー設定」→「連携」
2. 「ウェブフック」→「新しいウェブフック」
3. Webhook URLをコピー
4. `DISCORD_WEBHOOK_URL` として設定

## デプロイ手順

### 1. リポジトリのクローン
```bash
git clone https://github.com/your-username/club_social_media_manager.git
cd club_social_media_manager
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. Cloudflare認証
```bash
npx wrangler login
```

### 4. 環境変数の設定
```bash
# バックエンドの環境変数
cd backend
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put DISCORD_WEBHOOK_URL
npx wrangler secret put AUTH_SECRET
cd ..
```

### 5. デプロイ
```bash
npm run deploy
```

## 初期設定

### 団体アカウントの作成
現在は手動でKVに団体データを登録する必要があります：

```bash
# 例：テニス部のアカウント作成
npx wrangler kv key put --binding=CLUB_KV "club:tennis-club" '{
  "id": "tennis-club",
  "passwordHash": "$2a$10$example_hashed_password",
  "name": "テニス部",
  "createdAt": "2024-01-01T00:00:00.000Z"
}'
```

## トラブルシューティング

### よくある問題
1. **デプロイエラー**: API Tokenの権限を確認
2. **AI分析エラー**: Gemini APIキーの有効性を確認
3. **Discord通知エラー**: Webhook URLの形式を確認