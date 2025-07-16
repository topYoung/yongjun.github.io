let canPrint = false
loader.style.visibility = 'visible'
// print_btn.onclick = function() {
checkLoad()
//     if(canPrint == true){

//     }
// }
window.onload = function() {
    document.body.style.overflowY = "scroll";
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

function setPrintPageOrientation() {
    // 移除舊的 style
    const oldStyle = document.getElementById('dynamic-print-orientation');
    if (oldStyle) oldStyle.remove();
    // 新增 style
    const style = document.createElement('style');
    style.id = 'dynamic-print-orientation';
    if (layoutDirection === 'vertical') {
        style.innerHTML = '@page { size: A4 portrait; margin: 0; }';
    } else {
        style.innerHTML = '@page { size: A4 landscape; margin: 0; }';
    }
    document.head.appendChild(style);
}
// 在 goPrint() 執行 window.print() 前呼叫 setPrintPageOrientation()
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
}
// 請在 setImage 或切換排列方向的地方呼叫 updateVerticalModeClass()
// 例如 setImage() 結尾加：
// updateVerticalModeClass();

// 載入時讀取 localStorage 的排列模式
let layoutDirection = localStorage.getItem('layoutDirection') || 'horizontal';
updateVerticalModeClass();