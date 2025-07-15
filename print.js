let canPrint = false
loader.style.visibility = 'visible'
// print_btn.onclick = function() {
checkLoad()
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
    // 預設每張圖高度（含間距），可調整
    const imgH = layoutDirection === 'vertical' ? mm2px(120) : mm2px(80);
    const imgW = a4w / columnNum;
    let pageImgs = [];
    let curH = 0;
    let pageIdx = 0;
    for (let i = 0; i < allImg.length; i++) {
        if (curH + imgH > a4h || pageImgs.length === 0) {
            // 新增一頁
            if (pageImgs.length > 0) {
                // 塞進上一頁
                const pageDiv = document.createElement('div');
                pageDiv.className = 'page';
                pageDiv.style.width = a4w + 'px';
                pageDiv.style.height = a4h + 'px';
                pageDiv.style.border = '2px solid red';
                pageDiv.style.boxSizing = 'border-box';
                // 塞 row
                for (const rowImgs of pageImgs) {
                    const rowDiv = document.createElement('div');
                    rowDiv.style.display = 'flex';
                    rowDiv.style.flexDirection = 'row';
                    rowDiv.style.width = '100%';
                    rowDiv.style.height = imgH + 'px';
                    for (let k = 0; k < rowImgs.length; k++) {
                        const div = document.createElement('div');
                        const div2 = document.createElement('div');
                        const img = document.createElement('img');
                        div.id = 'img_div_' + rowImgs[k].idx;
                        img.id = 'img_' + rowImgs[k].idx;
                        div2.id = 'img_div2_' + rowImgs[k].idx;
                        div.className = 'item_img' + columnNum;
                        div2.className = 'image_box';
                        img.src = rowImgs[k].url;
                        img.className = 'image';
                        div.appendChild(div2);
                        div2.appendChild(img);
                        rowDiv.appendChild(div);
                    }
                    pageDiv.appendChild(rowDiv);
                }
                content.appendChild(pageDiv);
            }
            // 開新頁
            pageImgs = [];
            curH = 0;
            pageIdx++;
        }
        // 塞進本頁
        let lastRow = pageImgs[pageImgs.length - 1];
        if (!lastRow || lastRow.length >= columnNum) {
            lastRow = [];
            pageImgs.push(lastRow);
            curH += imgH;
        }
        lastRow.push({ url: allImg[i], idx: i });
    }
    // 處理最後一頁
    if (pageImgs.length > 0) {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        pageDiv.style.width = a4w + 'px';
        pageDiv.style.height = a4h + 'px';
        pageDiv.style.border = '2px solid red';
        pageDiv.style.boxSizing = 'border-box';
        for (const rowImgs of pageImgs) {
            const rowDiv = document.createElement('div');
            rowDiv.style.display = 'flex';
            rowDiv.style.flexDirection = 'row';
            rowDiv.style.width = '100%';
            rowDiv.style.height = imgH + 'px';
            for (let k = 0; k < rowImgs.length; k++) {
                const div = document.createElement('div');
                const div2 = document.createElement('div');
                const img = document.createElement('img');
                div.id = 'img_div_' + rowImgs[k].idx;
                img.id = 'img_' + rowImgs[k].idx;
                div2.id = 'img_div2_' + rowImgs[k].idx;
                div.className = 'item_img' + columnNum;
                div2.className = 'image_box';
                img.src = rowImgs[k].url;
                img.className = 'image';
                div.appendChild(div2);
                div2.appendChild(img);
                rowDiv.appendChild(div);
            }
            pageDiv.appendChild(rowDiv);
        }
        content.appendChild(pageDiv);
    }
}

// 初始化
window.onload = function() {
    document.body.style.overflowY = "scroll";
    renderImages();
    document.getElementById('print_btn').onclick = function() {
        window.print();
    };
    checkLoad();
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