import { useEffect, useState } from "react";
import { images } from "./data";
import CardStack from "./components/CardStack";
import ActionButtons from "./components/ActionButtons";

const STORAGE_KEY = "swipe-results";

export default function App() {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  }, [results]);

  const reactToImage = (reaction) => {
    const image = images[index];
    if (!image) return;
    setResults((prev) => [
      ...prev,
      { imageId: image.id, reaction, createdAt: new Date().toISOString() },
    ]);
    setIndex((prev) => prev + 1);
  };

  const reset = () => {
    setResults([]);
    setIndex(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (index >= images.length) {
    const likes = results.filter((r) => r.reaction === "like").length;
    return (
      <main className="app complete-screen">
        <h1>完了</h1>
        <p>{images.length}件の評価が完了しました。</p>
        <p>Like: {likes} / Unlike: {results.length - likes}</p>
        <button className="reset-button" onClick={reset}>最初から</button>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="header">
        <span>Swipe</span>
        <span className="progress">{index + 1} / {images.length}</span>
      </header>
      <section className="card-area">
        <CardStack images={images} index={index} onSwipe={reactToImage} />
      </section>
      <ActionButtons
        onUnlike={() => reactToImage("unlike")}
        onLike={() => reactToImage("like")}
      />
    </main>
  );
}
