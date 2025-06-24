# パスポートMRZシミュレーター要件

## 基本概要
- ベース: https://github.com/lollipop-onl/mrz.lollipop.onl の強化版
- 目的: パスポートのMRZ（Machine Readable Zone）シミュレーター

## 主要機能

### 1. 既存機能の維持
- パスポートMRZシミュレーション機能をそのまま継続

### 2. フォント機能
- OCR-Bフォント統合: https://tsukurimashou.org/ocr.php.en のOCR-Bフォントを組み込み
- プレビュー機能: 実際のMRZに近い見た目でプレビュー表示

### 3. エクスポート機能
- PNG出力: 生成されたMRZをPNG形式で保存・コピー
- SVG出力: 生成されたMRZをSVG形式で保存・コピー

### 4. 共有機能の改善
- セキュリティ強化: URLクエリに入力内容を直接含めない
- 共有リンク発行: 専用の共有リンクを生成
- プライバシー保護: シミュレーション画面のURLには入力内容を含めない

### 5. プリセット機能
- 事前定義データ: 数種類のMRZ内容を事前設定
- クイックアクセス: よく使用されるパターンを即座に適用

### 6. 履歴・ブックマーク機能
- ローカル保存: 生成したMRZをlocalStorageに保存
- ブックマーク管理: お気に入りのMRZ設定を管理
- 履歴機能: 過去に生成したMRZへのアクセス

## 技術要件

### モノレポ管理
- Turborepo: モノレポ管理ツール

### フロントエンド
- React: メインフレームワーク
- TailwindCSS: スタイリング
- Vite: ビルドツール

### NPMモジュール
- @simochee/passport-mrz-builder: MRZ生成ライブラリ（tsupでビルド）
- @simochee/passport-mrz-renderer: 画像生成ライブラリ（tsupでビルド）
  - ブラウザとNode.js両対応
  - PNGで生成
  - 生成時の幅をパラメータで指定可能

### MRZ対応タイプ
- TD3（パスポート）のみ対応: 2行×44文字

### 共有機能
- バックエンドなし
- URL Fragment（#）による状態管理

### デプロイ
- Cloudflare Pages: 静的サイトホスティング

### その他技術要件
- localStorage活用
- OCR-Bフォント組み込み
