# InclusiBridge デプロイメントガイド

## アーキテクチャ

```
inclusibridge.com
├── /app/* → React アプリ (app.inclusibridge.com)
└── /* → Next.js LP (next.inclusibridge.com)
```

## ローカル開発

### 1. 全サービス起動
```bash
npm run dev:full
```
- Next.js LP: http://127.0.0.1:3000
- React アプリ: http://127.0.0.1:3001
- Cloudflare Worker: http://127.0.0.1:8787

### 2. 個別起動
```bash
# Next.js LP のみ
npm run dev

# React アプリ のみ
npm run start:react

# Cloudflare Worker のみ
npm run worker:dev
```

## 本番デプロイ

### 1. Next.js LP のデプロイ
```bash
# 静的サイト生成
npm run build:static

# 生成されたファイルを next.inclusibridge.com にデプロイ
# (Cloudflare Pages, Vercel, Netlify など)
```

### 2. React アプリのデプロイ
```bash
# React アプリビルド
npm run build

# 生成されたファイルを app.inclusibridge.com にデプロイ
# (Cloudflare Pages, Vercel, Netlify など)
```

### 3. Cloudflare Worker のデプロイ
```bash
# Worker デプロイ
npm run worker:deploy
```

## 環境変数

### 本番環境
- `ORIGIN_NEXT`: https://next.inclusibridge.com
- `ORIGIN_APP`: https://app.inclusibridge.com

### ローカル環境
- `ORIGIN_NEXT`: http://127.0.0.1:3000
- `ORIGIN_APP`: http://127.0.0.1:3001

## ルーティング設定

### Cloudflare Worker
- `/app/*` → React アプリ
- その他 → Next.js LP

### ドメイン設定
- `inclusibridge.com` → Cloudflare Worker
- `next.inclusibridge.com` → Next.js LP
- `app.inclusibridge.com` → React アプリ

## 注意事項

1. **CORS設定**: 各オリジンで適切なCORS設定が必要
2. **セッション管理**: アプリ間でのセッション共有は考慮が必要
3. **アセットパス**: 相対パスでのアセット参照に注意
4. **SEO**: Next.js LP側でメタタグやサイトマップを管理
