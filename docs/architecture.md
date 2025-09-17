# アーキテクチャ

## システム構成

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   フロントエンド    │    │   バックエンド       │    │   外部サービス     │
│                 │    │                  │    │                 │
│ React + Vite    │◄──►│ Hono + Workers   │◄──►│ Gemini API      │
│ Cloudflare Pages│    │ Cloudflare KV    │    │ Discord Webhook │
│                 │    │                  │    │ Twitter API     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## フロントエンド (React + Vite)

### 主要コンポーネント
- **App.tsx**: ルーティングと認証状態管理
- **LoginPage**: 団体IDとパスワードによる認証
- **EditorPage**: 投稿作成とAI分析
- **TweetEditor**: テキスト・画像入力コンポーネント
- **AIAssistant**: AI分析結果表示

### 状態管理
- React Hooks（useState）による軽量な状態管理
- 認証状態（isAuthenticated, clubId）
- 投稿データ（text, image）
- AI分析結果

## バックエンド (Hono + Cloudflare Workers)

### API エンドポイント
```
POST /auth              # 認証
POST /ai/analyze        # AI分析
POST /discord/review    # Discord通知
GET  /health           # ヘルスチェック
```

### サービス層
- **auth.ts**: bcrypt によるパスワード認証
- **ai.ts**: Gemini API + Cloudflare AI 連携
- **discord.ts**: Discord Webhook 通知

### データストレージ
**Cloudflare KV**:
```
club:{clubId} → {
  id: string,
  passwordHash: string,
  name: string,
  createdAt: string,
  settings?: ClubSettings
}
```

## 外部サービス連携

### Gemini API (テキスト分析)
- **用途**: 投稿テキストの適切性判定
- **入力**: 投稿文 + 分析プロンプト
- **出力**: JSON形式の分析結果

### Cloudflare AI (画像分析)
- **用途**: 画像内容の説明と適切性判定
- **モデル**: ResNet-50 等
- **処理**: Workers AI で実行

### Discord Webhook (通知)
- **用途**: レビュー依頼の送信
- **形式**: Embedded メッセージ + アクションボタン
- **内容**: 投稿内容 + AI分析結果

### Twitter Web Intents (投稿)
- **用途**: Twitter投稿画面へのリダイレクト
- **方式**: クライアントサイドでの window.open
- **パラメータ**: 投稿テキストをURLエンコード

## セキュリティ

### 認証
- **パスワード**: bcrypt によるハッシュ化（salt rounds: 10）
- **セッション**: ステートレス（JWT未使用、フロントエンド管理）

### データ保護
- **画像**: 永続保存せず、一時的な処理のみ
- **環境変数**: Cloudflare Workers Secrets で管理
- **CORS**: フロントエンドドメインのみ許可

## パフォーマンス

### フロントエンド
- **バンドルサイズ**: ~195KB (gzipped: ~62KB)
- **CDN**: Cloudflare Pages での配信
- **キャッシュ**: Static assets の長期キャッシュ

### バックエンド
- **コールドスタート**: ~10ms (Cloudflare Workers)
- **レスポンス時間**:
  - 認証: ~50ms
  - AI分析: ~2-5秒
  - Discord通知: ~200ms

## スケーラビリティ

### 制限
- **Cloudflare Workers**: 10万リクエスト/日（無料プラン）
- **KV**: 1000回読み取り/日（無料プラン）
- **Gemini API**: 使用量による従量課金

### 拡張性
- **水平スケーリング**: Workers の自動スケーリング
- **地域分散**: Cloudflare の全世界エッジネットワーク
- **データベース**: KV から D1 への移行も可能