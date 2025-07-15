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
let layoutDirection = getParameterByName('layoutDirection') || 'vertical';

if (layoutDirection === 'vertical') {
    document.body.classList.add('portrait');
    document.body.classList.remove('landscape');
} else {
    document.body.classList.add('landscape');
    document.body.classList.remove('portrait');
}

function renderImages() {
    const content = document.getElementById('print-content');
    console.log('content:', content);
    content.innerHTML = '';
    const mm2px = mm => mm * 3.78;
    const a4w = layoutDirection === 'vertical' ? mm2px(210) : mm2px(297);
    const a4h = layoutDirection === 'vertical' ? mm2px(297) : mm2px(210);
    let rowsPerPage, colsPerPage;
    if (layoutDirection === 'vertical') {
        let try3 = a4h / 3, try4 = a4h / 4;
        let score3 = Math.abs((try3 / (a4w / columnNum)) - (4/3));
        let score4 = Math.abs((try4 / (a4w / columnNum)) - (4/3));
        rowsPerPage = score3 < score4 ? 3 : 4;
        colsPerPage = columnNum;
    } else {
        rowsPerPage = 2;
        colsPerPage = columnNum;
    }
    const cellW = a4w / colsPerPage;
    const cellH = a4h / rowsPerPage;
    const imgsPerPage = rowsPerPage * colsPerPage;
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
                const img = document.createElement('img');
                div.className = 'cell';
                div.style.width = cellW + 'px';
                div.style.height = cellH + 'px';
                img.src = allImg[imgIdx];
                img.className = 'image';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
                div.appendChild(img);
                rowDiv.appendChild(div);
            }
            pageDiv.appendChild(rowDiv);
        }
        content.appendChild(pageDiv);
    }
}

document.getElementById('pdf_btn').onclick = function() {
    window.print();
};

window.onload = function() {
    renderImages();
};