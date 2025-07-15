let canPrint = false
loader.style.visibility = 'visible'
// print_btn.onclick = function() {
// checkLoad()
//     if(canPrint == true){

//     }
// }
// 參數解析
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let columnNum = parseInt(getParameterByName('columnNum')) || 2;
let allImg = getParameterByName('iurl')
allImg = allImg ? allImg.split(',') : [];
let infoData = getParameterByName('data')
let layoutDirection = getParameterByName('layoutDirection') || 'vertical';

// 切換 body class 以配合列印方向
if (layoutDirection === 'vertical') {
    document.body.classList.add('portrait');
    document.body.classList.remove('landscape');
} else {
    document.body.classList.add('landscape');
    document.body.classList.remove('portrait');
}

// 動態產生圖片分頁
function renderImages() {
    const content = document.getElementById('content');
    content.innerHTML = '';
    // A4尺寸（mm），需轉換為 px，假設 1mm = 3.78px
    const mm2px = mm => mm * 3.78;
    const a4w = layoutDirection === 'vertical' ? mm2px(210) : mm2px(297);
    const a4h = layoutDirection === 'vertical' ? mm2px(297) : mm2px(210);
    let rowsPerPage, colsPerPage;
    if (layoutDirection === 'vertical') {
        // 直式：自動判斷3或4列哪個較佳
        // 以欄數為主，計算每格高度
        let try3 = a4h / 3, try4 = a4h / 4;
        // 假設圖片比例約4:3，視覺上較佳的格子高度
        let score3 = Math.abs((try3 / (a4w / columnNum)) - (4/3));
        let score4 = Math.abs((try4 / (a4w / columnNum)) - (4/3));
        rowsPerPage = score3 < score4 ? 3 : 4;
        colsPerPage = columnNum;
    } else {
        // 橫式：每頁2列，欄數依使用者選擇
        rowsPerPage = 2;
        colsPerPage = columnNum;
    }
    const cellW = a4w / colsPerPage;
    const cellH = a4h / rowsPerPage;
    const imgsPerPage = rowsPerPage * colsPerPage;
    let pageIdx = 0;
    for (let i = 0; i < allImg.length; i += imgsPerPage) {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        pageDiv.style.width = a4w + 'px';
        pageDiv.style.height = a4h + 'px';
        pageDiv.style.border = '2px solid red';
        pageDiv.style.boxSizing = 'border-box';
        for (let r = 0; r < rowsPerPage; r++) {
            const rowDiv = document.createElement('div');
            rowDiv.style.display = 'flex';
            rowDiv.style.flexDirection = 'row';
            rowDiv.style.width = '100%';
            rowDiv.style.height = cellH + 'px';
            for (let c = 0; c < colsPerPage; c++) {
                const imgIdx = i + r * colsPerPage + c;
                if (imgIdx >= allImg.length) break;
                const div = document.createElement('div');
                const div2 = document.createElement('div');
                const img = document.createElement('img');
                div.id = 'img_div_' + imgIdx;
                img.id = 'img_' + imgIdx;
                div2.id = 'img_div2_' + imgIdx;
                div.className = 'item_img' + colsPerPage;
                div2.className = 'image_box';
                div.style.width = cellW + 'px';
                div.style.height = cellH + 'px';
                div2.style.width = '100%';
                div2.style.height = '100%';
                img.src = allImg[imgIdx];
                img.className = 'image';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
                div.appendChild(div2);
                div2.appendChild(img);
                rowDiv.appendChild(div);
            }
            pageDiv.appendChild(rowDiv);
        }
        content.appendChild(pageDiv);
        pageIdx++;
    }

    loader.style.visibility = 'hidden'
}

// 初始化
window.onload = function() {
    document.body.style.overflowY = "scroll";
    renderImages();
    // document.getElementById('pdf_btn').onclick = function() {
    //     window.print();
    // };
    // checkLoad();
}

function checkLoad() {

    let i = 0
    const imgID = document.querySelectorAll('.image');
    const title = document.querySelectorAll('.title')
    title.forEach((item, index) => {
        item.style.display = 'flex'
    })
    imgID.forEach((item, index) => {
        // let tmp = []
        const img = new Image();
        img.src = item.src;
        const id = item.id
        console.log('id=', id)

        const num = id.split('_')[1]
        console.log('num=', num)
        // 支援多分頁
        let div2 = item.parentElement;
        if (!div2 || !div2.id.startsWith('img_div2_')) {
            div2 = document.getElementById('img_div2_' + num)
        }
        const w1 = div2.offsetWidth
        const h1 = div2.offsetHeight
        img.addEventListener("load", () => {



            const w = item.offsetWidth
            const h = item.offsetHeight

            const rate = h / w
            const rate1 = h1 / w1
            console.log('rate=', rate)
            console.log('rate1=', rate1)

            if (rate > rate1) {
                item.style.width = "auto"
                item.style.height = "92%"
                img.style.width = h1 * 0.92 / rate + "px"

            } else {
                item.style.height = "auto"
                item.style.width = "92%"
                img.style.height = w1 * 0.92 * rate + "px"
                // const dh = h1 - 
            }

            i += 1; // 讀取完畢就 + 1
            // console.log("i==", i);
            // console.log("id==", item.id);
            // console.log(item.naturalWidth, item.naturalHeight);


            if (imgID.length === i) { // 當圖片全部讀取完畢就顯示載入完成，這邊可以搭配 Loading 狀態切換畫面
                loader.style.visibility = 'hidden'
                console.log('圖片全部載入完成');
                //       console.log("orgSize==",orgSize);
                // checkSize()
                canPrint = true

            }
        });
    })
}

function goPrint() {
    if (canPrint == true) {
        pdf_btn.style.display = 'none'
        window.print()
        window.close();
    }

}