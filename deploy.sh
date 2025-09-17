#!/bin/bash

# 広報補佐うさこ - 自動デプロイスクリプト
# Usage: ./deploy.sh [backend|frontend|all]

set -e

echo "🐰 広報補佐うさこ - デプロイスクリプト"
echo "=================================="

deploy_backend() {
    echo "📦 バックエンドをデプロイ中..."
    cd backend
    echo "  ├─ 依存関係をインストール中..."
    npm ci
    echo "  ├─ TypeScriptをビルド中..."
    npm run build
    echo "  └─ Cloudflare Workersにデプロイ中..."
    npm run deploy
    cd ..
    echo "✅ バックエンドのデプロイが完了しました！"
}

deploy_frontend() {
    echo "🎨 フロントエンドをデプロイ中..."
    cd frontend
    echo "  ├─ 依存関係をインストール中..."
    npm ci
    echo "  ├─ プロダクションビルド中..."
    npm run build
    echo "  └─ Cloudflare Pagesにデプロイ中..."
    npx wrangler pages deploy dist --project-name club-social-media-manager-frontend --commit-dirty=true
    cd ..
    echo "✅ フロントエンドのデプロイが完了しました！"
}

case "${1:-all}" in
    "backend")
        deploy_backend
        ;;
    "frontend")
        deploy_frontend
        ;;
    "all")
        deploy_backend
        echo ""
        deploy_frontend
        ;;
    *)
        echo "❌ 使用方法: ./deploy.sh [backend|frontend|all]"
        exit 1
        ;;
esac

echo ""
echo "🎉 デプロイが完了しました！"
echo "📱 フロントエンド: https://club-social-media-manager-frontend.pages.dev"
echo "🔧 バックエンド: https://club-social-media-manager-backend.jyogi.workers.dev"