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

  // las tarjetas guardan su propia copia de las vistas: corregir cada imagen que pinten
  var byName={};designs.forEach(function(d){byName[d.name]=d});
  function fix(st){
    var c=st.closest(".shirt"),h=c&&c.querySelector("h3"),d=h&&byName[h.textContent.trim()],k=st.dataset.side,img=st.querySelector("img");
    if(!d||!img||!k||!d.views[k])return;
    if(img.getAttribute("src")!==d.views[k].src){img.setAttribute("src",d.views[k].src);img.style.objectPosition=d.views[k].pos||"50% 50%"}
  }
  var mo=new MutationObserver(function(ms){ms.forEach(function(m){var st=m.target.closest&&m.target.closest(".stage");if(st)fix(st)})});
  document.querySelectorAll(".shirt .stage").forEach(function(st){fix(st);mo.observe(st,{childList:true})});
  // "Ver en grande" también con las fotos nuevas
  if(typeof window.openZoom==="function"){var oz=window.openZoom;window.openZoom=function(d,st){return oz(d&&byName[d.name]||d,st)};try{openZoom=window.openZoom}catch(e){}}
})();
