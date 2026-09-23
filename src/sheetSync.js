// like/unlike ログを Google スプレッドシートへ送信する（Apps Script Webアプリ経由）。
//
// 送信先URLはビルド時の環境変数 VITE_GAS_URL で設定する。
// 未設定の場合は送信を行わず、localStorage のみで動作する（オフライン扱い）。
//
// 送信に失敗した分は localStorage のキュー（swipe-sync-queue）に溜め、
// 次のスワイプ時やアプリ起動時に再送する（ログ取りこぼしを防ぐ）。
const GAS_URL = import.meta.env.VITE_GAS_URL;
const QUEUE_KEY = "swipe-sync-queue";

function loadQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

// 1件送信する。
// - text/plain にすることで CORS プリフライトを避ける（Apps Script 側は
//   e.postData.contents を JSON.parse する）。
// - mode: "no-cors" で「撃ちっぱなし」にする。応答は読まない（不透明）ため
//   CORS 読み取り失敗による誤リトライ（＝重複行）を防げる。
//   ネットワーク不通のときは fetch が reject するので、その場合だけ再送される。
async function postEntry(entry) {
  await fetch(GAS_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(entry),
  });
}

// 送信ループの二重起動を防ぐフラグ。
// 高速スワイプで flushQueue が重なると、両方が同じ先頭要素を
// 送ってしまい重複行になるため、常に1本だけ走らせる。
let flushing = false;

// 溜まっているキューを先頭から順に送信する。
// ネットワーク失敗時は中断し、残りは次回に持ち越す。
export async function flushQueue() {
  if (!GAS_URL) return;
  if (flushing) return; // 既に送信ループが走っているので任せる。
  flushing = true;
  try {
    let queue = loadQueue();
    while (queue.length > 0) {
      try {
        await postEntry(queue[0]);
      } catch {
        // 送信失敗。キューは減らさず次回リトライ。
        return;
      }
      // 送信中に追加された分も拾えるよう、毎回 storage から読み直す。
      queue = loadQueue().slice(1);
      saveQueue(queue);
    }
  } finally {
    flushing = false;
  }
}

// 未送信の再送キューを空にする（リセット用）。
export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

// 1件をキューへ追加し、その場で送信を試みる。
export async function syncEntry(entry) {
  if (!GAS_URL) return;
  const queue = loadQueue();
  queue.push(entry);
  saveQueue(queue);
  await flushQueue();
}
