// src/images/ に置いた画像をビルド時に自動収集する。
// 画像を追加・削除したらファイルを置くだけで一覧へ反映される（ファイル名のハードコード不要）。
// Vite が base 付きのハッシュ化URLへ解決するため、パスの手動組み立ても不要。
const modules = import.meta.glob("./images/*.{png,jpg,jpeg,webp,gif,svg}", {
  eager: true,
  import: "default",
});

// パスでソートして表示順を安定させる。
export const images = Object.keys(modules)
  .sort()
  .map((path, i) => ({ id: i + 1, src: modules[path] }));
