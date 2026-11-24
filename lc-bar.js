/* ===== Termos y Tazas: el bar del cine ===== */
(function(){
  if(window.LCI)LCI.add({"El Bar":["The Bar","El Bar","Die Bar"],"Bar":["Bar","Bar","Bar"],"Termo":["Flask","Termo","Flasche"],"Taza":["Mug","Tassa","Tasse"],
    "¿La quieres en taza o termo?":["Want it on a mug or flask?","La vols en tassa o termo?","Lieber auf Tasse oder Flasche?"],
    "Pásate por el bar y prueba cualquier diseño.":["Drop by the bar and try any design.","Passa pel bar i prova qualsevol disseny.","Schau an der Bar vorbei und probier jedes Design aus."],
    "Pasar al bar":["Go to the bar","Anar al bar","Zur Bar"],"Ver en taza →":["See on a mug →","Veure en tassa →","Auf der Tasse ansehen →"],"Ver en termo →":["See on a flask →","Veure en termo →","Auf der Flasche ansehen →"]});
  [["termos","Termos","bar-i-termo.webp","b","Ver en taza →","bar-i-taza.webp","tazas","mugSelect"],
   ["tazas","Tazas","bar-i-taza.webp","m","Ver en termo →","bar-i-termo.webp","termos","bottleSelect"]].forEach(function(c){
    var sec=document.getElementById(c[0]);if(!sec)return;
    var head=sec.querySelector(".sec-head");
    if(head&&!head.querySelector(".tw-title")){
      var h=document.createElement("h2");h.className="tw-title";
      h.innerHTML='<img class="tw-ti" src="bar-i-taza.webp" alt=""><span>El Bar</span>';
      var soon=document.createElement("span");soon.className="br-soon";soon.innerHTML="<span>Próximamente</span>";
      var pk=document.createElement("div");pk.className="cr-pick br-pick";pk.setAttribute("role","group");
      pk.innerHTML='<button type="button" data-p="termos" aria-pressed="'+(c[0]==="termos")+'"><span>Termo</span></button><button type="button" data-p="tazas" aria-pressed="'+(c[0]==="tazas")+'"><span>Taza</span></button>';
      pk.addEventListener("click",function(e){var b=e.target.closest("button");if(!b||b.dataset.p===c[0])return;
        var n=(document.getElementById(c[3]+"-name")||{}).textContent||"";if(window[c[7]]&&n)window[c[7]](n);
        if(typeof showPage==="function")showPage(b.dataset.p)});
      head.insertBefore(pk,head.firstChild);head.insertBefore(soon,head.firstChild);head.insertBefore(h,head.firstChild);
    }
    var ctl=sec.querySelector(".bottle-ctl");
    if(ctl&&!ctl.querySelector(".br-swap")){
      var sw=document.createElement("div");sw.className="br-swap";
      sw.innerHTML='<button type="button"><img src="'+c[5]+'" alt=""><span>'+c[4]+'</span></button>';
      ctl.appendChild(sw);
      sw.querySelector("button").addEventListener("click",function(){
        var n=(document.getElementById(c[3]+"-name")||{}).textContent||"";
        if(window[c[7]]&&n)window[c[7]](n);
        if(typeof showPage==="function")showPage(c[6]);scrollTo(0,0);
      });
    }
  });
  /* cartel al final de Camisetas */
  var cam=document.getElementById("camisetas");
  if(cam&&!document.getElementById("br-banner")){
    var bn=document.createElement("div");bn.id="br-banner";bn.className="br-banner";
    bn.innerHTML='<div class="br-b-tx"><img src="bar-i-taza.webp" alt=""><h3><span>¿La quieres en taza o termo?</span></h3><p><span>Pásate por el bar y prueba cualquier diseño.</span></p><button type="button"><span>Pasar al bar</span></button></div>';
    var hd=cam.querySelector(".sec-head");
    if(hd)hd.after(bn);else cam.insertBefore(bn,cam.firstChild);
    bn.querySelector("button").addEventListener("click",function(){if(typeof showPage==="function")showPage("termos");scrollTo(0,0)});
  }
  if(window.LCI)LCI.refresh();
})();
