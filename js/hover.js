const iw = 300;
const aspect = 0.3;
const wrapper = document.getElementById('image-wrapper');
const image = document.getElementById('image');
const sc = wrapper.clientWidth / iw;
image.style.width = wrapper.clientWidth + "px";
image.style.height = wrapper.clientWidth * aspect + "px";
const magnifier = document.getElementById('magnifier');
magnifier.style.backgroundSize = wrapper.clientWidth + "px auto";
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
                x: data[i].x * sc,
                y: data[i].y * sc,
                r: data[i].r * sc,
            });
        } else {
            layers.push({
                src: data[i].src,
                text: data[i].text,
                question:  data[i].question,
                points: [{
                    x: data[i].x * sc,
                    y: data[i].y * sc,
                    r: data[i].r * sc,
                }]
            });
        }
    }
    image.style.backgroundImage = 'url(' + layers[lid].src + ')';
    infoBox.innerHTML = document.getElementById(layers[lid].question).innerHTML;
    magnifier.style.backgroundImage = 'url(' + layers[lid + 1].src + ')';

    image.addEventListener('mousemove', function (ev) {
        let bcr = image.getBoundingClientRect();
        magnifier.style.top = ev.y - bcr.top - 50 + 'px';
        magnifier.style.left = ev.x - bcr.left - 50 + 'px';
        magnifier.style.backgroundPositionX = -ev.x + 50 + 'px';
        magnifier.style.backgroundPositionY = -ev.y + 50 + 'px';
    });

    image.addEventListener('click', function (ev) {
        if (st) {
            let points = layers[lid].points;
            for (let p = 0; p < points.length; p++) {
                let r = points[p].r;
                if (Math.abs(ev.x - points[p].x) < r && Math.abs(ev.y - points[p].y) < r && lid < layers.length - 1) {
                    lid = lid + 1;
                    image.style.backgroundImage = 'url(' + layers[lid].src + ')';
                    infoBox.innerHTML = document.getElementById(layers[lid].text).innerHTML;
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
        if (!this.classList.contains("disabled")){
            infoBox.innerHTML = document.getElementById(layers[lid].question).innerHTML;
            magnifier.style.display = 'block';
            st = true;
            this.classList.add("disabled");
        }
    });
});
