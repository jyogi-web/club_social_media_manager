# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

これは React + Vite (frontend)、Hono + Cloudflare Workers (backend)、Terraform (infra) を使用したクラブソーシャルメディアマネージャーアプリケーションです。

## アーキテクチャ

プロジェクトは以下の3つの主要コンポーネントで構成されています：

- **frontend/**: React + Viteを使用したクライアントサイドアプリケーション
- **backend/**: Hono + Cloudflare Workersを使用したサーバーレスAPI
- **infra/**: Terraformを使用したインフラストラクチャ管理

## 開発コマンド

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run preview      # ビルド後のプレビュー
npm run lint         # ESLint実行
npm run typecheck    # TypeScript型チェック
```

### Backend (Hono + Cloudflare Workers)
```bash
cd backend
npm install
npm run dev          # 開発サーバー起動 (wrangler dev)
npm run deploy       # Cloudflare Workersにデプロイ
npm run typecheck    # TypeScript型チェック
```

### Infrastructure (Terraform)
```bash
cd infra
terraform init       # Terraform初期化
terraform plan       # 実行プランの確認
terraform apply      # インフラストラクチャのデプロイ
terraform destroy    # インフラストラクチャの削除
```

## ディレクトリ構造の詳細

### Frontend
- `src/components/`: 再利用可能なUIコンポーネント
- `src/pages/`: ページコンポーネント (LoginPage.tsx, EditorPage.tsx など)
- `src/api/`: バックエンドAPIとの通信ロジック
- `src/hooks/`: カスタムReactフック
- `src/styles/`: スタイルシート

### Backend
- `src/routes/`: APIルーティング (auth.ts, discord.ts など)
- `src/services/`: AIやDiscordとの通信などのコアビジネスロジック
- `src/types/`: 共通型定義
- `src/utils/`: 共通ユーティリティ関数

### 設定ファイル
- `wrangler.toml`: Cloudflare Workers設定
- `vite.config.ts`: Vite設定
- `tsconfig.json`: TypeScript設定

## 開発時の注意事項

- TypeScriptを使用してタイプセーフティを確保
- Cloudflare Workersの制限事項に注意してバックエンド開発を行う
- フロントエンドとバックエンドで共通の型定義を使用
- Terraformでインフラストラクチャをコード管理