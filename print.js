// print.js 僅保留手動列印
// 不自動 window.print()
document.getElementById('pdf_btn').onclick = function() {
    window.print();
};