# InclusiBridge - Next.js ハイブリッド構成

## 概要
このプロジェクトは、LP部分をNext.js化し、アプリ部分は既存のReact SPAとして維持するハイブリッド構成です。

## 構成
- **LP部分**: Next.js（SEO最適化、静的生成）
- **アプリ部分**: 既存のReact SPA（`/app`ルート）

## 開発環境

### Next.js開発サーバー起動
```bash
npm run dev
```

### 既存のReact SPA開発サーバー起動
```bash
npm start
```

## ビルド

### Next.js用ビルド
```bash
npm run build:next
```

### 統合ビルド
```bash
npm run export
```

## デプロイ

### Cloudflare Pages
```bash
npm run build:next
npm run build
```

## ルーティング
- `/` - Next.js LP
- `/app/*` - React SPA（リダイレクト）
- `/about`, `/concept`, `/contact` - Next.jsページ

## 設定ファイル
- `next.config.js` - Next.js設定
- `wrangler.toml` - Cloudflare Pages設定
- `tsconfig.next.json` - Next.js用TypeScript設定
