// print.js 已不再需要複雜的圖片縮放與載入判斷，因為 print.html/print.css 已自動處理
// 保留空檔案或僅作為列印觸發用

// 可選：自動列印並關閉視窗
window.onload = function() {
    setTimeout(function() {
        window.print();
        window.close();
    }, 500);
};