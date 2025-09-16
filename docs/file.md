## ファイル構成

```md
.
├── .gitignore             # Gitの管理対象外ファイル
├── package.json           # プロジェクト全体の依存関係
├── tsconfig.json          # TypeScriptの設定
├── wrangler.toml          # Cloudflare Workersの設定
├── frontend/              # React + Viteのコード
│   ├── public/            # 公開リソース
│   ├── src/
│   │   ├── components/    # 再利用可能なUIコンポーネント
│   │   ├── pages/         # ページのコンポーネント (例: LoginPage.tsx, EditorPage.tsx)
│   │   ├── api/           # バックエンドAPIとの通信ロジック
│   │   ├── hooks/         # カスタムフック
│   │   ├── styles/        # スタイルシート
│   │   ├── App.tsx        # メインコンポーネント
│   │   └── main.tsx       # アプリケーションエントリーポイント
│   ├── index.html
│   ├── vite.config.ts
│   └── tsconfig.json
|
├── backend/               # Hono + Cloudflare Workersのコード
│   ├── src/
│   │   ├── routes/        # APIのルーティング (例: auth.ts, discord.ts)
│   │   ├── services/      # AIやDiscordとの通信など、コアなビジネスロジック
│   │   ├── types/         # 共通の型定義
│   │   ├── utils/         # 共通ユーティリティ関数
│   │   └── index.ts       # Workersのエントリーポイント
│   ├── package.json
│   └── tsconfig.json
|
└── infra/                 # IaC (Terraform)のコード
    ├── main.tf            # メインのインフラ定義
    ├── variables.tf       # 変数定義
    └── outputs.tf         # 出力定義
```