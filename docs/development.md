# 開発ガイド

## 開発環境のセットアップ

### 前提条件
- Node.js 18以上
- npm
- Git

### 初期セットアップ
```bash
# リポジトリのクローン
git clone https://github.com/your-username/club_social_media_manager.git
cd club_social_media_manager

# 依存関係のインストール
npm install

# Cloudflare認証
npx wrangler login
```

## 開発サーバーの起動

### フロントエンド
```bash
cd frontend
npm run dev
# http://localhost:3000 でアクセス
```

### バックエンド
```bash
cd backend
npm run dev
# http://localhost:8787 でWorkers開発サーバーが起動
```

### 同時起動（推奨）
```bash
# ターミナル1: フロントエンド
npm run dev

# ターミナル2: バックエンド
npm run dev:backend
```

## コード構成

### フロントエンド
```
frontend/src/
├── api/
│   └── apiClient.ts      # バックエンドAPI通信
├── components/
│   ├── TweetEditor.tsx   # 投稿入力コンポーネント
│   └── AIAssistant.tsx   # AI分析結果表示
├── pages/
│   ├── LoginPage.tsx     # ログインページ
│   └── EditorPage.tsx    # メインエディター
├── App.tsx               # ルーティング
└── main.tsx             # エントリーポイント
```

### バックエンド
```
backend/src/
├── services/
│   ├── auth.ts          # 認証サービス
│   ├── ai.ts            # AI分析サービス
│   └── discord.ts       # Discord通知サービス
├── types.ts             # 型定義
└── index.ts             # メインAPI
```

## コーディング規約

### TypeScript
- **Strict mode**: 有効
- **型定義**: 明示的な型指定を推奨
- **命名**: camelCase（変数・関数）、PascalCase（型・コンポーネント）

### React
- **関数コンポーネント**: class コンポーネントは使用しない
- **Hooks**: useState, useEffect を活用
- **Props**: interface で型定義

### Hono
- **ミドルウェア**: CORS, エラーハンドリングを適切に設定
- **レスポンス**: 統一されたAPIレスポンス形式
- **エラー**: try-catch での適切なエラーハンドリング

## テスト

### 現在の状況
- ユニットテストは未実装
- 手動テストでの品質確保

### 今後の実装予定
```bash
# フロントエンド: Vitest + React Testing Library
npm test

# バックエンド: Vitest + Miniflare
npm run test:backend
```

## デバッグ

### フロントエンド
- **DevTools**: React Developer Tools
- **ネットワーク**: ブラウザの Network タブ
- **ログ**: console.log, console.error

### バックエンド
- **Wrangler Logs**: `npx wrangler tail`
- **ローカルデバッグ**: console.log での出力
- **エラー追跡**: Cloudflare Dashboard でのログ確認

## デプロイ

### 開発環境
```bash
# プレビューデプロイ
npm run deploy:frontend
npm run deploy:backend
```

### 本番環境
```bash
# mainブランチへのマージで自動デプロイ
git push origin main
```

## 機能追加の手順

### 1. 機能設計
- 要件定義
- API設計
- UI/UX設計

### 2. バックエンド実装
```bash
cd backend
# 新しいサービスファイル作成
touch src/services/new-feature.ts
# types.ts に型定義追加
# index.ts にエンドポイント追加
```

### 3. フロントエンド実装
```bash
cd frontend
# 新しいコンポーネント作成
touch src/components/NewFeature.tsx
# apiClient.ts にAPI呼び出し追加
```

### 4. テスト・デプロイ
```bash
# ローカルテスト
npm run dev
npm run dev:backend

# デプロイ
npm run deploy
```

## トラブルシューティング

### よくある問題

#### CORS エラー
```typescript
// backend/src/index.ts
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))
```

#### TypeScript エラー
```bash
# 型チェック
npm run build

# 型定義の確認
npx tsc --noEmit
```

#### 環境変数エラー
```bash
# Workers Secrets の確認
npx wrangler secret list

# 環境変数の設定
npx wrangler secret put VARIABLE_NAME
```

## コントリビューション

### プルリクエスト
1. feature ブランチで開発
2. コードレビュー
3. CI/CD パイプライン確認
4. main ブランチにマージ

### コミットメッセージ
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: フォーマット修正
refactor: リファクタリング
test: テスト追加
```