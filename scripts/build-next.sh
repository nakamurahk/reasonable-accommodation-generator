#!/bin/bash

# Next.js用のビルドスクリプト
echo "Building Next.js application..."

# Next.jsのビルド
npm run build:next

# 既存のReact SPAのビルド
npm run build

# 出力ディレクトリの統合
echo "Merging build outputs..."
cp -r build/* out/
cp -r .next/static out/_next/static

echo "Build completed!"
