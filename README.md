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
├── public/
│   └── images/
├── src/
│   ├── components/
│   │   ├── ActionButtons.jsx
│   │   ├── CardStack.jsx
│   │   └── SwipeCard.jsx
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

`public/images/` に表示したい画像を置き、`src/data.js` の `files` 配列にファイル名を列挙します。
現在は以下の2枚を登録しています。

```text
ofuro_sauna_neppashi_man.png
ofuro_sauna_neppashi_woman.png
```

画像パスは `import.meta.env.BASE_URL`（= `vite.config.js` の `base`）を基準に組み立てるため、
`base` を変更してもファイル名の列挙以外の修正は不要です。

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

Like / Unlike の結果はブラウザの `localStorage` に保存されます。

- ローカルPCを起動しておく必要はありません
- サーバー側DBは不要です
- 同じブラウザでは再読み込み後も結果が残ります
- 別端末とは結果を共有しません
- ブラウザデータを削除すると結果も消えます

## 操作

- 右スワイプ: Like
- 左スワイプ: Unlike
- 下部の `×`: Unlike
- 下部の `♡`: Like
- 全件終了後: 集計表示
- 「最初から」: localStorageを削除してリセット
