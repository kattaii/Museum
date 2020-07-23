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

$(".select-project .dropdown-item").click(function () {

    layers = [];
    lid = 0;
    st = true;
    image.style.backgroundImage = "";
    infoBox.innerHTML = "";
    magnifier.style.backgroundImage = "";
    $("#project-title").html("");
    $("#templates").html("");
    let btn = this;
    let urlPref = "projects/" + btn.dataset.museumProject + "/";

    $.get(urlPref + "templates.html", function (data) {
        $("#templates").html(data);
        $.get(urlPref + "data.json", function (data) {
            $("#project-title").html(data.title);
            $("#prologue").html("");
            let pnts = data.points;
            for (let i = 0; i < pnts.length; i++) {
                let layerId = -1;
                for (let j = 0; j < layers.length; j++) {
                    if (layers[j].src === pnts[i].src) {
                        layerId = j;
                    }
                }
                if (layerId > -1) {
                    layers[layerId].points.push({
                        x: pnts[i].x * sc,
                        y: pnts[i].y * sc,
                        r: pnts[i].r * sc,
                    });
                } else {
                    layers.push({
                        src: pnts[i].src,
                        text: pnts[i].text,
                        question: pnts[i].question,
                        points: [{
                            x: pnts[i].x * sc,
                            y: pnts[i].y * sc,
                            r: pnts[i].r * sc,
                        }]
                    });
                }
            }
            image.style.backgroundImage = 'url(' + urlPref + layers[lid].src + ')';
            let tmpl = document.getElementById(layers[lid].question);
            if (tmpl) {
                infoBox.innerHTML = tmpl.innerHTML;
            }
            magnifier.style.backgroundImage = 'url(' + urlPref + layers[lid + 1].src + ')';

            image.addEventListener('mousemove', function (ev) {
                let bcr = image.getBoundingClientRect();
                magnifier.style.top = ev.y - bcr.top - 29 + 'px';
                magnifier.style.left = ev.x - bcr.left - 29 + 'px';
                magnifier.style.backgroundPositionX = -ev.x + 28 + bcr.left + 'px';
                magnifier.style.backgroundPositionY = -ev.y + 28 + bcr.top + 'px';
            });

            image.addEventListener('click', function (ev) {
                if (st) {
                    let bcr = image.getBoundingClientRect();
                    let points = layers[lid+1].points;
                    for (let p = 0; p < points.length; p++) {
                        let r = points[p].r;
                        if (Math.abs(ev.x - bcr.left - points[p].x) < r && Math.abs(ev.y - bcr.top - points[p].y) < r && lid < layers.length - 1) {
                            let tmpl = document.getElementById(layers[lid].text);
                            if (tmpl) {
                                infoBox.innerHTML = tmpl.innerHTML;
                            }
                            lid = lid + 1;
                            image.style.backgroundImage = 'url(' + urlPref + layers[lid].src + ')';
                            if (lid < layers.length - 1) {
                                magnifier.style.backgroundImage = 'url(' + urlPref + layers[lid + 1].src + ')';
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
                    let tmpl = document.getElementById(layers[lid].question);
                    if (tmpl) {
                        infoBox.innerHTML = tmpl.innerHTML;
                    }
                    magnifier.style.display = 'block';
                    st = true;
                    this.classList.add("disabled");
                }
            });
        });
    });


});


