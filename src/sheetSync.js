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

// 1件送信する。text/plain にすることで CORS プリフライトを避ける
// （Apps Script 側は e.postData.contents を JSON.parse する）。
async function postEntry(entry) {
  await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(entry),
  });
}

// 溜まっているキューを先頭から順に送信する。
// ネットワーク失敗時は中断し、残りは次回に持ち越す。
export async function flushQueue() {
  if (!GAS_URL) return;
  let queue = loadQueue();
  while (queue.length > 0) {
    try {
      await postEntry(queue[0]);
    } catch {
      // 送信失敗。キューは減らさず次回リトライ。
      return;
    }
    queue = loadQueue().slice(1);
    saveQueue(queue);
  }
}

// 1件をキューへ追加し、その場で送信を試みる。
export async function syncEntry(entry) {
  if (!GAS_URL) return;
  const queue = loadQueue();
  queue.push(entry);
  saveQueue(queue);
  await flushQueue();
}
