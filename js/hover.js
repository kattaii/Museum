const iw = 1920; //pic zoma, const
const aspect = 0.3; //aspect ratio, rom ar dairgves image zoma
const wrapper = document.getElementById('image-wrapper'); //vqmnit constantas, vnaxulobt da vanichebt elements romlis id aris image-wrapper
const image = document.getElementById('image');
const sc = wrapper.clientWidth / iw; //momxmareblis ekranis siganis mixedvit ratios ardasargvevad constant
image.style.width = wrapper.clientWidth + "px"; //vawert px (pixels) rom gaiazros ricxvi procentia tu ra aris. sigane clientis mixedvit.
image.style.height = wrapper.clientWidth * aspect + "px"; //clientis siganis mixedvit aspect ratioze vyopt rom proporcia ar dairgves. simagle siganis mixedvit.
const magnifier = document.getElementById('magnifier'); //?constanta magnifier, romelic gets element by id "magnifier" from css.
magnifier.style.backgroundSize = wrapper.clientWidth + "px auto"; //backgroundze nawilobriv rom chans zomashi igive.
image.style.backgroundSize = wrapper.clientWidth + "px auto";//same ^^
const infoBox = document.getElementById('info'); // ??? pirvels documents rato vwert ???
const nextBtn = document.getElementById('next');
let layers = []; //layerebis masivi. roca let-s wer cvladis win iq xdeba am cvladis gansazgvra. shignit ar aqvs arcerti elementi am masivs. anu viyeneb funqciebs romlebic miemarteba obieqts - masivs.
let lid = 0; //layer id (lid) 0
let st = true;

$(".select-project .dropdown-item").click(function () { // $=jQuery (mza biblioteka) agmnishvneli.
    // wertili(.) aris class, mere - class-is saxeli (eseni brchyalebshi). funqcia iwyeba roca ixsneba figuruli prchxili.

    layers = [];
    lid = 0;
    st = true;
    image.style.backgroundImage = "";// brchyalebi shuashi arafrit "" = araferia
    infoBox.innerHTML = "";
    magnifier.style.backgroundImage = "";
    $("#project-title").html(""); //# diezi = id, mere - id name (project-title).
    $("#templates").html("");
    let btn = this;
    let urlPref = "projects/" + btn.dataset.museumProject + "/"; //

    $.get(urlPref + "templates.html", function (data) {
        $("#templates").html(data);
        $.get(urlPref + "data.json", function (data) {
            $("#project-title").html(data.title);
            $("#prologue").html("");//
            let pnts = data.points;
            for (let i = 0; i < pnts.length; i++) { //iwyebs atvlas pirvelidan (0) pointebis raodenobaze naklebamde, yoveli moqmedebis ganxorcielebisas imatebs ragacit (aq: ertit=i++, i++2 orit, etc) (inkrementi).
                let layerId = -1; //vanichebt minus erts for later use.
                for (let j = 0; j < layers.length; j++) { //pirvelidan (0) layerebis masivshi raodenobaze naklebamde. j++ every time. vnaxulobt/vitvlit yovel matgans.
                    if (layers[j].src === pnts[i].src) { //am oris src-s vadarebt tu emtxveva zustad tipic da mnishvnelobac. tu gvinda rom imena emtxveodes ori rame jobs === gamoviyenot.
                        layerId = j; //tu ^ udris ertmanets, layerId = j. amistvis vanichebt layerId-s -1-s, rom tu sheicvala mnishvneloba, eseigi vipove, tu ar - indeqsi ver iqneba am mnishvnelobis da shesabamisad ar arsebobs.
                    }                //-1 dzaan mosaxerxebelia magitom masivebistvis.
                }
                if (layerId > -1) { //tu layerId arsebobs (metia -1ze), im shemtxvevashi:
                    layers[layerId].points.push({ //.push moqmedeba masivebistvis - masivshi amatebs axal elements, aq - points.
                        x: pnts[i].x * sc, // momxmareblis ekranis mixedvit pnts-ebis da r-ebis cvlileba.
                        y: pnts[i].y * sc, //aq mxolod pointebs vamatebt boloshi (push).
                        r: pnts[i].r * sc,
                    });
                } else { //tu -1is tolia = ar arsebobs
                    layers.push({ //aq gadavcem (vpushav) boloshi yvela nawils elementis: src, text, q, pnts. layers.push
                        src: pnts[i].src,
                        text: pnts[i].text,
                        question: pnts[i].question,
                        points: [{ //es masivia, magram aq mxolod erti elementia.
                            x: pnts[i].x * sc, //gardaqmna xdeba shignitve sc-s mier.
                            y: pnts[i].y * sc,
                            r: pnts[i].r * sc,
                        }]
                    });
                } //^ gaviget layerebi raebia, rogoraa da axla viwyebt mat gamoyenebas. and that's on the ~rigi~.
            }
            image.style.backgroundImage = 'url(' + urlPref + layers[lid].src + ')';
            let tmpl = document.getElementById(layers[lid].question); //tmpl, romelicaa layerebze mibmuli question templatebidan.
            if (tmpl) {
                infoBox.innerHTML = tmpl.innerHTML; //innerHTML-shi rac weria is chans infoBox-shi.
            }
            magnifier.style.backgroundImage = 'url(' + urlPref + layers[lid + 1].src + ')';//magnifieris img aris zemot, amjamad myopi layeris shemdegi romelicaa.
                                           // ^vutiteb sad aris es img. aq gvaqvs ukve rogorc unda gamoiyurebodes. ?? urlPref ra aris ??
            image.addEventListener('mousemove', function (ev) { //mousemoveze rom nawilobriv gamochndes cursoris garshemo meore img. magnifier. addEventListener (ganmarteba, ra tipisaa, ra events warmoshobs).
                let bcr = image.getBoundingClientRect(); //img-is koordinatebs da yvelanair infos gvadzlevs getboundingclientrect. chven gvchirdeba marto img zeda marcxena wertilis koordinati.
                magnifier.style.top = ev.y - bcr.top - 29 + 'px'; //tviton magnifier cursoris shesabamisad. -29, rata cursor magnifieris centrshi iyos.
                magnifier.style.left = ev.x - bcr.left - 29 + 'px'; //ev.x da ev.y gansazgvravs ra adgilasaa im momentshi mausi.
                magnifier.style.backgroundPositionX = -ev.x + 28 + bcr.left + 'px'; //img fixed pozicia cursoris miuxedavad.
                magnifier.style.backgroundPositionY = -ev.y + 28 + bcr.top + 'px'; //ramdenitac gadaadgildeba cursor img gadaadgildeba ukan img, so it's fixed.
            });

            image.addEventListener('click', function (ev) {
                if (st) {
                    let bcr = image.getBoundingClientRect();
                    let points = layers[lid + 1].points;
                    for (let p = 0; p < points.length; p++) {
                        let r = points[p].r; //qveda xazze: pointis garshemo r-ze naklebshi tu iqneba clicked, it will work. vutitebt magas.
                        if (Math.abs(ev.x - bcr.left - points[p].x) < r && Math.abs(ev.y - bcr.top - points[p].y) < r && lid < layers.length - 1) {
                            let tmpl = document.getElementById(layers[lid].text);
                            if (tmpl) {
                                infoBox.innerHTML = tmpl.innerHTML;
                            }
                            lid = lid + 1; //lid ar unda iyos bolo layer, thus lid + 1.
                            image.style.backgroundImage = 'url(' + urlPref + layers[lid].src + ')';
                            if (lid < layers.length - 1) {
                                magnifier.style.backgroundImage = 'url(' + urlPref + layers[lid + 1].src + ')';
                                nextBtn.classList.remove("disabled"); // ?? token ras nishnavs ??
                            }
                            st = false;
                            magnifier.style.display = 'none'; // magnifier qreba
                            return;
                        }
                    }
                }
            });

            nextBtn.addEventListener('click', function () { //nextis btn-s davamatet eventlistener daklikvis dros rom gaaketos:
                if (!this.classList.contains("disabled")) { //?? aq vaprtxilebt rom "disabled"-s sheicavs ??
                    let tmpl = document.getElementById(layers[lid].question);
                    if (tmpl) {
                        infoBox.innerHTML = tmpl.innerHTML;
                    }
                    magnifier.style.display = 'block'; //am dros dablokilia magnifier
                    st = true;
                    this.classList.add("disabled");
                }
            });
        });
    });


});


