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

## 📚 ドキュメント

- [📖 セットアップガイド](./docs/setup.md) - 初期設定とデプロイ手順
- [🚀 使用方法](./docs/usage.md) - アプリケーションの使い方
- [🏗️ アーキテクチャ](./docs/architecture.md) - システム構成と技術詳細
- [💻 開発ガイド](./docs/development.md) - 開発環境とコントリビューション

## 🚀 クイックスタート

```bash
# 1. リポジトリのクローン
git clone https://github.com/your-username/club_social_media_manager.git
cd club_social_media_manager

# 2. 依存関係のインストール
npm install

# 3. 開発サーバーの起動
npm run dev              # フロントエンド (localhost:3000)
npm run dev:backend      # バックエンド (localhost:8787)

# 4. デプロイ
npm run deploy
```

詳細な設定方法は [セットアップガイド](./docs/setup.md) をご覧ください。

## 🎯 主な機能

- 🔐 **安全な認証**: 団体IDとパスワードによる認証
- 🤖 **AI分析**: Gemini API + Cloudflare AI による投稿内容チェック
- 📢 **Discord通知**: レビュー依頼の自動通知
- 🐦 **Twitter連携**: Web Intentsによる投稿補助
- 📱 **レスポンシブUI**: モバイル対応のモダンなUI

## 🏃‍♂️ 使用方法

1. **ログイン**: 団体IDとパスワードを入力
2. **投稿作成**: テキストと画像を入力
3. **AIチェック**: 自動で内容を分析
4. **レビュー依頼**: Discord でチームに確認依頼
5. **投稿実行**: Twitter で投稿

詳しくは [使用方法ドキュメント](./docs/usage.md) をご確認ください。