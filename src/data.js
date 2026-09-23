// public/images/ に置いた画像を一覧化する。
// ファイル名の列挙は vite.config.js の仮想モジュール(virtual:image-list)が
// ビルド/起動時に public/images を走査して供給するため、手動列挙は不要。
//
// 画像は public 配下（Rollup のモジュールグラフ外）に置くため、
// ファイル名に日本語・空白・記号（# や ? を含む）があっても壊れない。
// URL は base 付きで実行時に組み立て、encodeURIComponent で1文字ずつ
// 安全にエスケープする（# → %23, ? → %3F, 空白 → %20, 日本語 → %E3.. など）。
// name はファイル名そのままを保持し、like/unlike ログのキー兼 React の key、
// および画面表示に使う（サーバ上の実ファイル名と完全一致させるため未正規化）。
import { imageNames } from "virtual:image-list";

const base = import.meta.env.BASE_URL; // 例: "/swipe-pages-app/"（末尾スラッシュ付き）

export const images = imageNames.map((name) => ({
  id: name,
  name,
  src: `${base}images/${encodeURIComponent(name)}`,
}));
