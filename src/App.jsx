import { useEffect, useState } from "react";
import { images } from "./data";
import CardStack from "./components/CardStack";
import ActionButtons from "./components/ActionButtons";
import { syncEntry, flushQueue, clearQueue } from "./sheetSync";

// ファイル名をキーに like/unlike ラベルを保管する。
// 形式: { "001.png": { reaction: "like" | "unlike", createdAt: ISO文字列 } }
const STORAGE_KEY = "swipe-labels";

export default function App() {
  const [labels, setLabels] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(labels));
  }, [labels]);

  // 起動時に、前回送信できなかった分をクラウド（スプレッドシート）へ再送する。
  useEffect(() => {
    flushQueue();
  }, []);

  // ラベル未付与＝未チェックの画像だけを選択の俎上に載せる。
  // ラベル付与済み（チェック済み）の画像は自動的に除外される。
  const pending = images.filter((image) => !labels[image.name]);

  const reactToImage = (reaction) => {
    const image = pending[0];
    if (!image) return;
    const createdAt = new Date().toISOString();
    setLabels((prev) => ({
      ...prev,
      [image.name]: { reaction, createdAt },
    }));
    // ファイル名をキーにログをクラウドへ送信（best-effort、失敗時は自動リトライ）。
    syncEntry({ fileName: image.name, reaction, createdAt });
  };

  const reset = () => {
    setLabels({});
    localStorage.removeItem(STORAGE_KEY);
    // 未送信の再送キューも消して完全リセットする。
    clearQueue();
  };

  if (pending.length === 0) {
    const entries = Object.values(labels);
    const likes = entries.filter((r) => r.reaction === "like").length;
    return (
      <main className="app complete-screen">
        <h1>完了</h1>
        <p>{images.length}件の評価が完了しました。</p>
        <p>Like: {likes} / Unlike: {entries.length - likes}</p>
        <button className="reset-button" onClick={reset}>最初から</button>
      </main>
    );
  }

  const checked = images.length - pending.length;
  return (
    <main className="app">
      <header className="header">
        <span>Swipe</span>
        <span className="progress">{checked + 1} / {images.length}</span>
      </header>
      <section className="card-area">
        <CardStack images={pending} index={0} onSwipe={reactToImage} />
      </section>
      <ActionButtons
        onUnlike={() => reactToImage("unlike")}
        onLike={() => reactToImage("like")}
      />
    </main>
  );
}
