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
  /* El Bar en Camisetas: botón junto a las categorías + cartel dentro de cada galería */
  function goBar(e){if(e){e.preventDefault();e.stopPropagation()}if(typeof showPage==="function")showPage("termos");scrollTo(0,0)}
  if(window.LCI)LCI.add({"El Bar":["The Bar","El Bar","Die Bar"],"Ahora también":["Now also","Ara també","Jetzt auch"],"en taza y termo":["on mugs & flasks","en tassa i termo","auf Tasse & Thermo"],"Prueba cualquier diseño":["Try any design","Prova qualsevol disseny","Probier jedes Design"],"Pasar al bar":["Go to the bar","Passar al bar","Zur Bar"]});
  function addBar(){
    var f=document.getElementById("filters");
    if(f&&!f.querySelector(".br-chip")){var c=document.createElement("button");c.type="button";c.className="br-chip";
      c.innerHTML='<img src="bar-i-taza.webp" alt=""><span>El Bar</span>';c.addEventListener("click",goBar);f.appendChild(c)}
    document.querySelectorAll("#shirts .cat .shirts").forEach(function(row){
      if(row.querySelector(".br-card"))return;var cs=row.querySelectorAll(".shirt");if(cs.length<2)return;
      var k=document.createElement("button");k.type="button";k.className="br-card";
      k.innerHTML='<span class="br-c-img" aria-hidden="true"></span><span class="br-c-tx"><img src="bar-i-taza.webp" alt=""><b><span>Ahora también</span></b><strong><span>en taza y termo</span></strong><em><span>Prueba cualquier diseño</span></em><i><span>Pasar al bar</span></i></span>';
      var CATS=['cine','series','dibujos','anime'],sec=row.closest('.cat'),ci=[].indexOf.call(document.querySelectorAll('#shirts .cat'),sec),cat=(sec&&sec.dataset.cat)||CATS[ci]||'cine';if(CATS.indexOf(cat)<0)cat=CATS[ci%4];
      k.querySelector('.br-c-img').style.backgroundImage='url(br-card-'+cat+'.webp)';
      k.addEventListener("click",goBar);var ref=cs[Math.min(3,cs.length-1)];ref.after(k);
    });
    if(window.LCI)LCI.refresh();
  }
  addBar();setTimeout(addBar,600);
  if(window.LCI)LCI.refresh();
})();
