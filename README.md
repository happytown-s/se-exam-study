# SE Exam Study

> ネットワークスペシャリスト（SE）試験対策のWebアプリケーション

## Features

- 科目A（午前）対策クイズ -- カテゴリ別・ランダム出題に対応
- 計算トレーニング -- 信頼性・キャパシティ等の数値計算問題
- 科目B（午後）演習 -- アーキテクチャ設計の実践的問題
- 学習進捗管理 -- localStorageによる解答履歴の記録
- ダークテーマUI -- オレンジ系アクセントのダークスキーム

## Contents

### Quiz（科目A）
- 250問
- カテゴリ一覧（問題数）:
  - System Architecture: 35
  - Software Design: 30
  - Requirements Definition: 30
  - Database Design: 25
  - Performance Design: 25
  - API Design: 25
  - UI/UX Design: 20
  - Testing Strategy: 20
  - Cloud Architecture: 20
  - Security Design: 20
- クイズモード: カテゴリ選択、ランダム出題、解説表示

### Calc Training（計算トレーニング）
- 100問
- カテゴリ一覧（問題数）:
  - Reliability Engineering: 25
  - Capacity Planning: 20
  - Cost Estimation: 15
  - Performance Metrics: 15
  - Database Sizing: 15
  - Network Design: 10

### Subject B（科目B演習）
- 80問
- カテゴリ一覧（問題数）:
  - Architecture Decisions: 20
  - Design Review: 20
  - Migration Planning: 15
  - Scalability Scenarios: 15
  - Integration Design: 10

### Progress（進捗管理）
- 解答履歴と正答率の確認

## Tech Stack

- React 19 + TypeScript
- Vite（ビルドツール）
- Tailwind CSS（スタイリング）
- localStorage（進捗データ永続化）

## Usage

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` にアクセス。

## Deployment

```bash
npm run build
```

`dist/` ディレクトリを任意の静的ホスティングサービスにデプロイ。

## License: MIT
