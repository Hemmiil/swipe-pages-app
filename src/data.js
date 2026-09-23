// src/images/ に置いた画像をビルド時に自動収集する。
// 画像を追加・削除したらファイルを置くだけで一覧へ反映される（ファイル名のハードコード不要）。
// Vite が base 付きのハッシュ化URLへ解決するため、パスの手動組み立ても不要。
const modules = import.meta.glob("./images/*.png", {
  eager: true,
  import: "default",
});

// パスでソートして表示順を安定させる。
// name（ファイル名）を like/unlike ログのキー兼 React の key として使う。
export const images = Object.keys(modules)
  .sort()
  .map((path) => {
    const name = path.split("/").pop();
    return { id: name, name, src: modules[path] };
  });
