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
 * スプレッドシートの "logs" シートに1行ずつ追記する。
 */

var SHEET_NAME = "logs";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    sheet.appendRow([
      data.fileName || "",
      data.reaction || "",
      data.createdAt || "",
      new Date(), // サーバ受信時刻
    ]);
    return jsonOutput_({ ok: true });
  } catch (err) {
    return jsonOutput_({ ok: false, error: String(err) });
  }
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
