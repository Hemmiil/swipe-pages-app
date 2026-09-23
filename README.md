# Swipe Pages App

スマホ操作を前提にした、画像を左右へスワイプして `Like / Unlike` を記録する最小構成のWebアプリです。

## 技術構成

- React
- Vite
- Framer Motion
- localStorage
- GitHub Actions
- GitHub Pages

バックエンドはありません。アプリ本体はGitHub Pagesから配信され、ブラウザ上で動作します。

## ディレクトリ

```text
swipe-pages-app/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── components/
│   │   ├── ActionButtons.jsx
│   │   ├── CardStack.jsx
│   │   └── SwipeCard.jsx
│   ├── images/
│   ├── App.css
│   ├── App.jsx
│   ├── data.js
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 1. 画像を配置

`src/images/` に表示したい画像を置くだけです。`src/data.js` が `import.meta.glob` で
ビルド時に自動収集するため、ファイル名の列挙は不要です（追加・削除がそのまま反映されます）。

- 対応拡張子: `png` / `jpg` / `jpeg` / `webp` / `gif` / `svg`
- 表示順はファイル名の昇順
- 現在は `ofuro_sauna_neppashi_man.png` と `ofuro_sauna_neppashi_woman.png` の2枚

画像URLは Vite が `base`（`vite.config.js`）付きのハッシュ化パスへ自動解決するため、
`base` を変更してもパスの手動修正は不要です。

## 2. ローカル起動

```bash
npm install
npm run dev
```

## 3. GitHubへpush

このプロジェクトではGitHubリポジトリ名を `swipe-pages-app` と想定しています。
異なるリポジトリ名を使う場合は `vite.config.js` の `base` を `/リポジトリ名/` に変更してください
（画像パスは `base` を基準に自動で組み立てられるため、変更は不要です）。

## 4. GitHub Pagesを有効化

GitHubリポジトリで以下を設定します。

```text
Settings
→ Pages
→ Build and deployment
→ Source
→ GitHub Actions
```

その後 `main` ブランチへpushすると、GitHub Actionsが `npm ci` → `npm run build` → Pagesへのデプロイを自動実行します。

公開URLは通常以下です。

```text
https://<GitHubユーザー名>.github.io/swipe-pages-app/
```

## データ保存

Like / Unlike の結果はまずブラウザの `localStorage`（キー `swipe-labels`）に保存されます。
ファイル名をキーにした次の形式で、ラベル済み画像は再表示されません。

```json
{
  "001.png": { "reaction": "like",   "createdAt": "2026-09-23T..." },
  "002.png": { "reaction": "unlike", "createdAt": "2026-09-23T..." }
}
```

- ローカルPCを起動しておく必要はありません
- 同じブラウザでは再読み込み後も結果が残ります
- ブラウザデータを削除すると `localStorage` 側の結果は消えます

### クラウド保存（Google スプレッドシート）

環境変数 `VITE_GAS_URL` を設定すると、スワイプのたびに Google スプレッドシートへ
ログを追記します（`fileName` / `reaction` / `createdAt`）。別端末とも共有でき、
送信に失敗した分は `localStorage` のキュー（`swipe-sync-queue`）に溜め、次回自動で再送します。

セットアップ:

1. `google-apps-script/Code.gs` をスプレッドシートの Apps Script に貼り付け、
   「ウェブアプリ」としてデプロイする（詳細はファイル冒頭のコメント参照）。
2. 発行された URL を環境変数に設定する。
   - ローカル: `.env.example` を `.env` にコピーして `VITE_GAS_URL` を設定
   - 本番(GitHub Pages): リポジトリの `Settings → Secrets and variables → Actions → Variables`
     に `VITE_GAS_URL` を登録（`deploy.yml` がビルド時に注入）

`VITE_GAS_URL` 未設定でもアプリは動作し、その場合は `localStorage` のみで保存します。

## 操作

- 右スワイプ: Like
- 左スワイプ: Unlike
- 下部の `×`: Unlike
- 下部の `♡`: Like
- 全件終了後: 集計表示
- 「最初から」: localStorageを削除してリセット
