// print.js 僅保留手動列印
// 不自動 window.print()
window.onload = function() {
    document.body.style.overflowY = "scroll";
    checkLoad();
}

function checkLoad() {
    let i = 0;
    const imgID = document.querySelectorAll('.image');
    const isPortrait = document.body.classList.contains('portrait');
    // 根據A4方向決定欄數與容器高度
    const colNum = isPortrait ? 2 : 4; // 直式2欄，橫式4欄
    const containerHeight = isPortrait ? 120 : 80; // mm

    imgID.forEach((item, index) => {
        const img = new Image();
        img.src = item.src;
        const id = item.id;
        const num = id.split('_')[1];
        const div2 = document.getElementById('img_div2_' + num);

        // 設定容器寬高
        div2.style.width = `calc(${100/colNum}% - 8mm)`;
        div2.style.height = containerHeight + 'mm';

        img.addEventListener("load", () => {
            const w = item.offsetWidth;
            const h = item.offsetHeight;
            const w1 = div2.offsetWidth;
            const h1 = div2.offsetHeight;
            const rate = h / w;
            const rate1 = h1 / w1;

            if (rate > rate1) {
                item.style.width = "auto";
                item.style.height = "92%";
                img.style.width = h1 * 0.92 / rate + "px";
            } else {
                item.style.height = "auto";
                item.style.width = "92%";
                img.style.height = w1 * 0.92 * rate + "px";
            }

            i += 1;
            if (imgID.length === i) {
                // 所有圖片載入完成
            }
        });
    });
}

document.getElementById('print_btn').onclick = function() {
    window.print();
};