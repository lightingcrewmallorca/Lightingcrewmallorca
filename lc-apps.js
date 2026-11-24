/* ===== Apps para el set: pantallas de móvil + ficha ===== */
(function(){
  if(window.LCI)LCI.add({
    "Toca una app para ver para qué la usamos y descargarla.":["Tap an app to see what we use it for and download it.","Toca una app per veure per a què la fem servir i descarregar-la.","Tippe auf eine App, um zu sehen, wofür wir sie nutzen, und sie zu laden."],
    "Todas":["All","Totes","Alle"],
    "La favorita del crew":["The crew's favourite","La preferida del crew","Der Liebling der Crew"],
    "Para qué la usamos":["What we use it for","Per a què la fem servir","Wofür wir sie nutzen"],
    "Web oficial":["Official website","Web oficial","Offizielle Website"],
    "Ver ficha":["See details","Veure fitxa","Details ansehen"],
    "Cerrar":["Close","Tancar","Schließen"],
    "Ninguna app de este grupo está disponible para tu móvil.":["No app in this group is available for your phone.","Cap app d'aquest grup està disponible per al teu mòbil.","Keine App dieser Gruppe gibt es für dein Handy."]
  });
  var sec=document.getElementById("apps");
  if(!sec||typeof GROUPS==="undefined")return;
  var IMG=typeof APP_IMG!=="undefined"?APP_IMG:{};
  var GIC={"Sol y luz":"tw-sun.webp","Tiempo":"tw-i-rain.webp","Viento":"tw-i-wind.webp","Útiles en el set":"ic-cat-cine.webp"};
  var FAV="Sun Tracker";
  var esc=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
  var all=[];GROUPS.forEach(function(g){g.apps.forEach(function(a){all.push({n:a[0],web:a[1],st:a[2]||{},d:a[3],u:a[4],g:g})})});
  var find=function(n){return all.find(function(x){return x.n===n})};
  function ico(a,cls){
    if(IMG[a.n])return '<img class="'+cls+'" src="'+IMG[a.n]+'" alt="" loading="lazy">';
    return '<span class="'+cls+' ap-svg">'+(typeof icoSVG==="function"?icoSVG(a.n,a.g.col):"")+'</span>';
  }
  var os="all";
  try{os=localStorage.getItem("lcm-os")||""}catch(e){}
  if(["all","ios","android"].indexOf(os)<0){var ua=navigator.userAgent||"";os=/iPhone|iPad|iPod/.test(ua)?"ios":/Android/.test(ua)?"android":"all"}

  Array.prototype.forEach.call(sec.children,function(c){c.classList.add("ap-hide")});
  var w=document.createElement("div");w.className="ap";w.id="ap";
  var fav=find(FAV);
  w.innerHTML=
    '<div class="sec-head ap-sh"><h2 class="tw-title"><span>Apps para el set</span></h2><p><span>Toca una app para ver para qué la usamos y descargarla.</span></p></div>'+
    '<div class="ap-os" role="group">'+
      '<button type="button" data-os="all"><span>Todas</span></button>'+
      '<button type="button" data-os="ios">iPhone</button>'+
      '<button type="button" data-os="android">Android</button>'+
    '</div>'+
    (fav?'<button type="button" class="ap-fav" data-n="'+esc(fav.n)+'">'+ico(fav,"ap-fav-ic")+
      '<span class="ap-fav-tx"><small><span>La favorita del crew</span></small><b>'+esc(fav.n)+'</b><span class="ap-fav-u">'+esc(fav.u)+'</span>'+
      '<span class="ap-fav-go"><span>Ver ficha</span></span></span></button>':'')+
    '<div class="ap-groups">'+GROUPS.map(function(g){
      return '<section class="ap-g">'+
        '<h3 class="tw-h3 ap-h3">'+(GIC[g.name]?'<img class="tw-ti" src="'+GIC[g.name]+'" alt="" onerror="this.remove()">':'')+'<span>'+esc(g.name)+'</span></h3>'+
        '<div class="ap-phone"><div class="ap-grid">'+g.apps.map(function(a){var x=find(a[0]);
          return '<button type="button" class="ap-app" data-n="'+esc(x.n)+'" data-ios="'+(x.st.ios?1:0)+'" data-and="'+(x.st.android?1:0)+'">'+ico(x,"ap-ic")+'<span class="ap-nm">'+esc(x.n)+'</span></button>';
        }).join("")+'</div><p class="ap-none" hidden><span>Ninguna app de este grupo está disponible para tu móvil.</span></p></div>'+
      '</section>';
    }).join("")+'</div>'+
    '<div class="ap-ov" id="ap-ov" hidden><div class="ap-bk" data-x></div>'+
      '<div class="ap-card" role="dialog" aria-modal="true" aria-labelledby="ap-cn">'+
        '<button type="button" class="ap-x" data-x aria-label="Cerrar">×</button>'+
        '<div class="ap-ch"><span id="ap-cic"></span><div><small id="ap-cg"></small><h3 id="ap-cn"></h3></div></div>'+
        '<p class="ap-cd" id="ap-cd"></p>'+
        '<div class="ap-cu"><small><span>Para qué la usamos</span></small><p id="ap-cu"></p></div>'+
        '<div class="ap-st" id="ap-st"></div>'+
        '<a class="ap-web" id="ap-web" target="_blank" rel="noopener"><span>Web oficial</span> ↗</a>'+
      '</div></div>';
  sec.appendChild(w);

  /* filtro iPhone / Android */
  function setOs(v){
    os=v;try{localStorage.setItem("lcm-os",v)}catch(e){}
    w.querySelectorAll(".ap-os button").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.os===v)});
    w.querySelectorAll(".ap-g").forEach(function(g){
      var n=0;g.querySelectorAll(".ap-app").forEach(function(b){
        var ok=v==="all"||(v==="ios"?b.dataset.ios==="1":b.dataset.and==="1");b.hidden=!ok;if(ok)n++});
      g.querySelector(".ap-none").hidden=n>0;
    });
  }
  w.querySelector(".ap-os").addEventListener("click",function(e){var b=e.target.closest("button");if(b)setOs(b.dataset.os)});
  setOs(os);

  /* ficha */
  var ov=w.querySelector("#ap-ov"),last=null;
  var SVG_A='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.6-1-2.6-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z"/></svg>';
  var SVG_G='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3.6 2.3c-.2.2-.3.5-.3.9v17.6c0 .4.1.7.3.9l9.9-9.7-9.9-9.7zm11 8.6 2.8-2.7L5.2 1.3c-.3-.2-.7-.2-1 0l10.4 9.6zm0 2.2L4.2 22.7c.3.2.7.2 1 0l12.2-6.9-2.8-2.7zm5.9-2.9-2.6-1.5-3 2.9 3 2.9 2.6-1.5c.8-.5.8-1.4 0-1.8z"/></svg>';
  function open(n){
    var a=find(n);if(!a)return;last=document.activeElement;
    w.querySelector("#ap-cic").innerHTML=ico(a,"ap-cic");
    w.querySelector("#ap-cg").innerHTML="<span>"+esc(a.g.name)+"</span>";
    w.querySelector("#ap-cn").textContent=a.n;
    w.querySelector("#ap-cd").innerHTML="<span>"+esc(a.d)+"</span>";
    w.querySelector("#ap-cu").innerHTML="<span>"+esc(a.u)+"</span>";
    w.querySelector("#ap-st").innerHTML=
      (a.st.ios?'<a class="ap-sb" href="'+esc(a.st.ios)+'" target="_blank" rel="noopener">'+SVG_A+'App Store</a>':'<span class="ap-sb off"><span>No hay app para iPhone</span></span>')+
      (a.st.android?'<a class="ap-sb" href="'+esc(a.st.android)+'" target="_blank" rel="noopener">'+SVG_G+'Google Play</a>':'<span class="ap-sb off"><span>No hay app para Android</span></span>');
    var web=w.querySelector("#ap-web");web.href=a.web;
    ov.hidden=false;document.documentElement.classList.add("ap-lock");
    requestAnimationFrame(function(){ov.classList.add("on");w.querySelector(".ap-x").focus()});
  }
  function close(){
    if(ov.hidden)return;ov.classList.remove("on");document.documentElement.classList.remove("ap-lock");
    setTimeout(function(){ov.hidden=true},220);if(last&&last.focus)last.focus();
  }
  w.addEventListener("click",function(e){
    if(e.target.closest("[data-x]")){close();return}
    var b=e.target.closest(".ap-app,.ap-fav");if(b)open(b.dataset.n);
  });
  document.addEventListener("keydown",function(e){if(e.key==="Escape")close()});

  /* el buscador de la web marca la app antigua con "flash": abrimos su ficha */
  var old=document.getElementById("groups");
  if(old)new MutationObserver(function(ms){ms.forEach(function(m){
    var el=m.target;if(el.classList&&el.classList.contains("app")&&el.classList.contains("flash")){
      var nm=el.querySelector(".name");if(!nm)return;var t=nm.textContent.replace(/\s*↗\s*$/,"");
      var a=all.find(function(x){return t.indexOf(x.n)===0||t===(window.T?T(x.n):x.n)});
      if(a){w.scrollIntoView({block:"start"});open(a.n)}
    }})}).observe(old,{subtree:true,attributes:true,attributeFilter:["class"]});
  if(window.LCI)LCI.refresh(w);
})();
