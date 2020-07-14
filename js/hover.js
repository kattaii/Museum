const iw = 1920;
const aspect = 0.3;
const wrapper = document.getElementById('image-wrapper');
const image = document.getElementById('image');
const sc = wrapper.clientWidth / iw;
image.style.width = wrapper.clientWidth + "px";
image.style.height = wrapper.clientWidth * aspect + "px";
const magnifier = document.getElementById('magnifier');
magnifier.style.backgroundSize = wrapper.clientWidth + "px auto";
image.style.backgroundSize = wrapper.clientWidth + "px auto";
const infoBox = document.getElementById('info');
const nextBtn = document.getElementById('next');
let layers = [];
let lid = 0;
let st = true;

$.get("data.json", function (data) {
    for (let i = 0; i < data.length; i++) {
        let layerId = -1;
        for (let j = 0; j < layers.length; j++) {
            if (layers[j].src === data[i].src) {
                layerId = j;
            }
        }
        if (layerId > -1) {
            layers[layerId].points.push({
                x: data[i].x * sc / 1.6765625,
                y: data[i].y * sc / 1.6765625,
                r: data[i].r * sc,
            });
        } else {
            layers.push({
                src: data[i].src,
                text: data[i].text,
                question: data[i].question,
                points: [{
                    x: data[i].x * sc / 1.6765625,
                    y: data[i].y * sc / 1.6765625,
                    r: data[i].r * sc,
                }]
            });
        }
    }
    console.log(layers);
    image.style.backgroundImage = 'url(' + layers[lid].src + ')';
    infoBox.innerHTML = document.getElementById(layers[lid].question).innerHTML;
    magnifier.style.backgroundImage = 'url(' + layers[lid + 1].src + ')';

    image.addEventListener('mousemove', function (ev) {
        let bcr = image.getBoundingClientRect();
        magnifier.style.top = ev.y - bcr.top - 39 + 'px';
        magnifier.style.left = ev.x - bcr.left - 39 + 'px';
        magnifier.style.backgroundPositionX = -ev.x + 38 + bcr.left + 'px';
        magnifier.style.backgroundPositionY = -ev.y + 38 + bcr.top + 'px';
    });

    image.addEventListener('click', function (ev) {
        if (st) {
            let bcr = image.getBoundingClientRect();
            let points = layers[lid].points;
            for (let p = 0; p < points.length; p++) {
                let r = points[p].r;
                if (Math.abs(ev.x - bcr.left - points[p].x) < r && Math.abs(ev.y - bcr.top - points[p].y) < r && lid < layers.length - 1) {
                    infoBox.innerHTML = document.getElementById(layers[lid].text).innerHTML;
                    lid = lid + 1;
                    image.style.backgroundImage = 'url(' + layers[lid].src + ')';
                    if (lid < layers.length - 1) {
                        magnifier.style.backgroundImage = 'url(' + layers[lid + 1].src + ')';
                        nextBtn.classList.remove("disabled");
                    }
                    st = false;
                    magnifier.style.display = 'none';
                    return;
                }
            }
        }
    });

    nextBtn.addEventListener('click', function () {
        if (!this.classList.contains("disabled")) {
            infoBox.innerHTML = document.getElementById(layers[lid].question).innerHTML;
            magnifier.style.display = 'block';
            st = true;
            this.classList.add("disabled");
        }
    });
});
