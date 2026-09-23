// public/images/ に配置した画像ファイル名を列挙する。
// 画像を追加・削除したら、この配列を更新する。
const files = [
  "ofuro_sauna_neppashi_man.png",
  "ofuro_sauna_neppashi_woman.png",
];

// BASE_URL は vite.config.js の base 設定（例: /swipe-pages-app/）を参照する。
// これにより base を変更してもパスの修正はここで不要になる。
export const images = files.map((file, i) => ({
  id: i + 1,
  src: `${import.meta.env.BASE_URL}images/${file}`,
}));
