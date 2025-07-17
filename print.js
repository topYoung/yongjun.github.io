let canPrint = false
loader.style.visibility = 'visible'
// print_btn.onclick = function() {
checkLoad()
//     if(canPrint == true){

//     }
// }
// window.onload = function() {
//     document.body.style.overflowY = "scroll";
//     // 只針對直式（寬度600px）進行A4分頁，並依欄數分組
//     const content = document.getElementById('content');
//     if (content && content.offsetWidth <= 620) { // 600px + padding
//         const items = Array.from(content.children);
//         // 依照 columnNum 分組每行
//         let columnNum = 2;
//         try {
//             columnNum = window.opener ? window.opener.columnNum : columnNum;
//         } catch(e) {}
//         if (!columnNum || columnNum < 1) columnNum = 2;
//         let rows = [];
//         for (let i = 0; i < items.length; i += columnNum) {
//             let rowDiv = document.createElement('div');
//             rowDiv.style.display = 'flex';
//             rowDiv.style.justifyContent = 'center';
//             rowDiv.style.marginBottom = '8px';
//             for (let j = 0; j < columnNum; j++) {
//                 if (i + j >= items.length) break;
//                 rowDiv.appendChild(items[i + j]);
//             }
//             rows.push(rowDiv);
//         }
//         // 分頁：每頁最多可容納的行數
//         const pageHeightPx = 1122; // 297mm @ 96dpi
//         let pages = [];
//         let currentPage = [];
//         let currentHeight = 0;
//         rows.forEach((row, idx) => {
//             // 強制渲染，取得高度
//             row.style.display = 'flex';
//             const rowHeight = row.offsetHeight + 24;
//             if (currentHeight + rowHeight > pageHeightPx && currentPage.length > 0) {
//                 pages.push(currentPage);
//                 currentPage = [];
//                 currentHeight = 0;
//             }
//             currentPage.push(row);
//             currentHeight += rowHeight;
//         });
//         if (currentPage.length > 0) pages.push(currentPage);
//         // 清空原內容
//         content.innerHTML = '';
//         // 產生分頁
//         pages.forEach(pageRows => {
//             const pageDiv = document.createElement('div');
//             pageDiv.className = 'print-content-vertical';
//             // 標題副標
//             const titleDiv = document.createElement('div');
//             titleDiv.className = 'title';
//             let h2 = document.createElement('h2');
//             let h3 = document.createElement('h3');
//             h2.className = 'title_text';
//             h3.className = 'subTitle';
//             const firstTitle = document.querySelector('.title_text');
//             const firstSub = document.querySelector('.subTitle');
//             h2.innerHTML = firstTitle ? firstTitle.innerHTML : '';
//             h3.innerHTML = firstSub ? firstSub.innerHTML : '';
//             titleDiv.appendChild(h2);
//             titleDiv.appendChild(h3);
//             pageDiv.appendChild(titleDiv);
//             // 加入本頁內容
//             pageRows.forEach(row => pageDiv.appendChild(row));
//             content.appendChild(pageDiv);
//         });
//     }
// }

function checkLoad() {



    const content = document.getElementById('content');
    if (content && content.offsetWidth <= 620) {
        // 直式模式：動態插入 @page portrait
        if (!document.getElementById('vertical-print-style')) {
            const style = document.createElement('style');
            style.id = 'vertical-print-style';
            style.innerHTML = `
                    @media print {
                        @page {
                            size: A4 portrait;
                            margin: 0;
                        }
                    }
                `;
            document.head.appendChild(style);
        }
    }
    // ...原本 checkLoad 內容...

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



function goPrint() {
    if (canPrint == true) {
        pdf_btn.style.display = 'none'
        window.print()
        window.close();
    }

}