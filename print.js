let canPrint = false
loader.style.visibility = 'visible'
// print_btn.onclick = function() {
checkLoad()
//     if(canPrint == true){

//     }
// }
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

window.onload = function() {
    document.body.style.overflowY = "scroll";
    document.getElementById('content_all').innerHTML = '<div style="text-align:center;color:#888;margin-top:80px;">等待資料傳入...</div>';
};

window.addEventListener('message', function(event) {
    // 可加 event.origin 檢查
    const data = event.data;
    if (!data || !data.allImg) return;
    let { allImg, titleText, subTitle, columnNum, layoutDirection } = data;
    // allImg 已經是陣列，直接用
    let contentAll = document.getElementById('content_all');
    contentAll.innerHTML = '';
    setPrintPageOrientation(layoutDirection);
    let pageMaxHeight = (layoutDirection === 'vertical') ? 297 : 210; // mm
    let pageMaxWidth = (layoutDirection === 'vertical') ? 210 : 297; // mm
    let mm2px = mm => mm * 96 / 25.4;
    let maxPageHeightPx = mm2px(pageMaxHeight) - 40;
    let maxPageWidthPx = mm2px(pageMaxWidth);
    let itemsPerRow = columnNum;
    let rowsPerPage = (layoutDirection === 'vertical' ? 4 : 2);
    let itemHeightPx = (maxPageHeightPx - 60) / rowsPerPage;
    let itemWidthPx = (maxPageWidthPx - 20) / columnNum;
    let itemsPerPage = rowsPerPage * columnNum;
    for (let i = 0; i < allImg.length; i += itemsPerPage) {
        let pageDiv = document.createElement('div');
        pageDiv.className = 'page ' + (layoutDirection === 'vertical' ? 'print-content2' : 'print-content');
        // 每頁都插入標題與副標題
        let titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        let h2 = document.createElement('h2');
        let h3 = document.createElement('h3');
        h2.className = 'title_text';
        h3.className = 'subTitle';
        h2.innerHTML = titleText;
        h3.innerHTML = subTitle;
        titleDiv.appendChild(h2);
        titleDiv.appendChild(h3);
        pageDiv.appendChild(titleDiv);
        let group = allImg.slice(i, i + itemsPerPage);
        let itemCount = 0;
        for (let row = 0; row < rowsPerPage; row++) {
            let rowDiv = document.createElement('div');
            rowDiv.style.display = 'flex';
            rowDiv.style.justifyContent = 'center';
            rowDiv.style.marginBottom = '8px';
            for (let col = 0; col < itemsPerRow; col++) {
                let idx = row * itemsPerRow + col;
                let imgIdx = i + idx;
                if (imgIdx >= allImg.length) break;
                let imgBox = document.createElement('div');
                imgBox.className = 'image_box';
                imgBox.style.width = itemWidthPx + 'px';
                imgBox.style.height = itemHeightPx + 'px';
                imgBox.style.overflow = 'hidden';
                let img = document.createElement('img');
                img.className = 'image';
                // 支援 allImg[imgIdx] 為物件或字串
                let imgUrl = allImg[imgIdx];
                let imgText = '';
                if (typeof imgUrl === 'object' && imgUrl !== null) {
                    imgText = imgUrl.text;
                    imgUrl = imgUrl.url;
                }
                img.src = imgUrl;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                imgBox.appendChild(img);
                // 新增：有內容才顯示說明資料
                if (imgText && imgText.trim() !== '') {
                    let descDiv = document.createElement('div');
                    descDiv.className = 'image_desc';
                    descDiv.innerText = imgText;
                    imgBox.appendChild(descDiv);
                }
                rowDiv.appendChild(imgBox);
                itemCount++;
                if (itemCount >= itemsPerPage) break;
            }
            pageDiv.appendChild(rowDiv);
            if (itemCount >= itemsPerPage) break;
        }
        contentAll.appendChild(pageDiv);
    }
    // 隱藏 loader
    var loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
    window.goPrint = function() {
        document.getElementById('pdf_btn').style.display = 'none';
        document.getElementById('print_tip').style.display = 'none';
        window.print();
        window.close();
    };
});

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
        const div2 = document.getElementById('img_div2_' + num)
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

function setPrintPageOrientation(layoutDirection) {
    const oldStyle = document.getElementById('dynamic-print-orientation');
    if (oldStyle) oldStyle.remove();
    const style = document.createElement('style');
    style.id = 'dynamic-print-orientation';
    if (layoutDirection === 'vertical') {
        style.innerHTML = '@page { size: A4 portrait; margin: 0; }';
    } else {
        style.innerHTML = '@page { size: A4 landscape; margin: 0; }';
    }
    document.head.appendChild(style);
}
// 先定義 goPrint 為 function，然後再包裝
function goPrint() {
    if (canPrint == true) {
        pdf_btn.style.display = 'none'
        window.print()
        window.close();
    }
}

// 包裝 goPrint，列印前切換紙張方向
const oldGoPrint = goPrint;
goPrint = function() {
    setPrintPageOrientation();
    oldGoPrint();
}

// 新增：根據 layoutDirection 切換 .vertical-mode class
function updateVerticalModeClass() {
    const content = document.getElementById('content');
    if (!content) return;
    if (typeof layoutDirection !== 'undefined' && layoutDirection === 'vertical') {
        content.classList.add('vertical-mode');
    } else {
        content.classList.remove('vertical-mode');
    }
    // 切換排列方向時即時插入對應 @page，提升預覽正確率
    setPrintPageOrientation();
}
// 請在 setImage 或切換排列方向的地方呼叫 updateVerticalModeClass()
// 例如 setImage() 結尾加：
// updateVerticalModeClass();

// 載入時讀取 localStorage 的排列模式
let layoutDirection = localStorage.getItem('layoutDirection') || 'horizontal';
updateVerticalModeClass();

// 新增：每頁都插入標題與副標題（直式/橫式皆適用）
function insertTitleToPage(pageDiv) {
    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    let h2 = document.createElement('h2');
    let h3 = document.createElement('h3');
    h2.className = 'title_text';
    h3.className = 'subTitle';
    // 取用現有標題內容
    h2.innerHTML = document.getElementById('title_text') ? document.getElementById('title_text').innerHTML : '';
    h3.innerHTML = document.getElementById('subTitle') ? document.getElementById('subTitle').innerHTML : '';
    titleDiv.appendChild(h2);
    titleDiv.appendChild(h3);
    pageDiv.insertBefore(titleDiv, pageDiv.firstChild);
}
// 請在分頁產生時（每個 .page div）呼叫 insertTitleToPage(pageDiv)