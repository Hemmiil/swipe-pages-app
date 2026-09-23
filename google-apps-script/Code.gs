/**
 * Swipe Pages App - like/unlike ログ受信用 Google Apps Script
 *
 * 【セットアップ手順】
 * 1. 保存先の Google スプレッドシートを開く。
 * 2. メニュー「拡張機能」→「Apps Script」を開く。
 * 3. このファイルの内容を貼り付けて保存する。
 * 4. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」を選択。
 *      - 次のユーザーとして実行: 自分
 *      - アクセスできるユーザー: 全員
 * 5. 発行された「ウェブアプリのURL」をコピーし、
 *    アプリ側の環境変数 VITE_GAS_URL に設定する（.env / GitHub Actions）。
 *
 * 受信するデータ（JSON）: { fileName, reaction, createdAt }
 * スプレッドシートの "logs" シートに fileName をキーに1行ずつ保存する。
 *   - 同じ fileName の行が既にあれば「上書き（最新のみ保持）」。
 *   - なければ新規行として追記。
 * これにより、クライアントの再送やラベル付け直しがあっても
 * ファイルごとに常に1行だけになる（重複しない）。
 */

var SHEET_NAME = "logs";

function doPost(e) {
  // 同時POSTでの二重書き込みを防ぐため、スクリプトロックで直列化する。
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var data = JSON.parse(e.postData.contents);
    var fileName = data.fileName || "";
    var row = [
      fileName,
      data.reaction || "",
      data.createdAt || "",
      new Date(), // サーバ受信時刻
    ];

    var sheet = getSheet_();
    var rowIndex = findRowByFileName_(sheet, fileName);
    if (rowIndex > 0) {
      // 既存行を上書き（1行/ファイルを維持）。
      sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }
    return jsonOutput_({ ok: true });
  } catch (err) {
    return jsonOutput_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// fileName に一致する行番号（1始まり）を返す。無ければ -1。
// 1行目はヘッダーなので2行目以降を探索する。
function findRowByFileName_(sheet, fileName) {
  if (!fileName) return -1;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  var values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] === fileName) {
      return i + 2; // ヘッダー分(+1)と0始まり補正(+1)
    }
  }
  return -1;
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // ヘッダー行を用意する。
    sheet.appendRow(["fileName", "reaction", "createdAt", "receivedAt"]);
  }
  return sheet;
}

function jsonOutput_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
