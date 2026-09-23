import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// public/images/ を走査して画像ファイル名の一覧を返す仮想モジュール。
//   import { imageNames } from "virtual:image-list";
// public 配下の画像は Rollup のモジュールグラフを通らないため、
// # や ? を含むファイル名でもビルドが壊れない（URLは実行時に組み立てる）。
function imageListPlugin() {
  const virtualId = "virtual:image-list";
  const resolvedId = "\0" + virtualId; // 仮想モジュールの慣習的な内部ID
  const imagesDir = path.resolve(import.meta.dirname, "public/images");
  const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg)$/i;

  function readImageNames() {
    if (!fs.existsSync(imagesDir)) return [];
    return fs
      .readdirSync(imagesDir)
      .filter((name) => IMAGE_EXT.test(name)) // .gitkeep 等を除外
      .sort();
  }

  return {
    name: "image-list",
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    load(id) {
      if (id === resolvedId) {
        // 走査結果を配列としてそのまま埋め込む。
        return `export const imageNames = ${JSON.stringify(readImageNames())};`;
      }
    },
    // dev: 画像の追加・削除を検知してモジュールを無効化し、フルリロードする。
    configureServer(server) {
      server.watcher.add(imagesDir);
      const invalidate = (file) => {
        if (!file.startsWith(imagesDir)) return;
        const mod = server.moduleGraph.getModuleById(resolvedId);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", invalidate);
      server.watcher.on("unlink", invalidate);
    },
  };
}

export default defineConfig({
  plugins: [react(), imageListPlugin()],
  base: "/swipe-pages-app/",
});
