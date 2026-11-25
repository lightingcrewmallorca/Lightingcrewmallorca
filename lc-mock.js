/* ===== Galería: fotos de delante y detrás montadas sobre 10 modelos distintos ===== */
(function(){
  if(typeof designs==="undefined")return;
  var POS="50% 42%";
  designs.forEach(function(d){
    var m=/^LCM-(\d+)$/.exec(d.code||"");if(!m||+m[1]>44)return;
    d.views=d.views||{};
    d.views.detras={src:"d/"+d.code+"-detras.webp",pos:POS};
    d.views.delante={src:"d/"+d.code+"-delante.webp",pos:POS};
  });
  // tarjetas ya pintadas: actualizar la imagen visible y activar las pestañas
  document.querySelectorAll(".shirt").forEach(function(c){
    var h=c.querySelector("h3"),nm=h&&h.textContent.trim(),d=null;
    for(var i=0;i<designs.length;i++)if(designs[i].name===nm){d=designs[i];break}
    if(!d)return;
    c.querySelectorAll(".tabs button").forEach(function(b){if(d.views[b.dataset.s])b.disabled=false});
    var st=c.querySelector(".stage"),k=st&&st.dataset.side,img=st&&st.querySelector("img");
    if(img&&k&&d.views[k]){img.src=d.views[k].src;img.style.objectPosition=d.views[k].pos}
  });
})();
