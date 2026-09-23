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
