/* ===== Juego: siempre dentro del hueco visible, pantalla completa donde se pueda ===== */
(function(){
  var ov=document.getElementById("game-ov");if(!ov)return;
  var root=document.documentElement;
  var ios=/iP(hone|od|ad)/.test(navigator.platform)||(/Mac/.test(navigator.platform)&&navigator.maxTouchPoints>1)||/iPhone|iPad|iPod/.test(navigator.userAgent);
  var standalone=navigator.standalone===true||matchMedia("(display-mode: standalone)").matches||matchMedia("(display-mode: fullscreen)").matches;
  // Safari de iOS 26 o superior: la barra de abajo flota ENCIMA de la web, hay que dejarle sitio
  var m=/Version\/(\d+)/.exec(navigator.userAgent),floatBar=ios&&!standalone&&m&&+m[1]>=26;
  if(ios&&!standalone&&!m)floatBar=true; // Chrome/otros en iPhone también usan barra flotante
  function fit(){
    var vv=window.visualViewport,h=vv?vv.height:innerHeight,t=vv?vv.offsetTop:0;
    ov.style.top=t+"px";ov.style.height=h+"px";ov.style.bottom="auto";
    // si ya se ha deslizado (barra de Safari encogida) basta con menos hueco
    ov.style.paddingBottom=floatBar?((scrollY>root._y0+20)?"44px":"74px"):"";
  }
  function onOpen(){
    root.classList.add("game-on");if(!floatBar)root.classList.add("game-lock");
    if(floatBar){root.classList.add("game-swipe");root._y0=scrollY;var h=ov.querySelector(".zg-swipe");
      if(!h){h=document.createElement("span");h.className="zg-swipe";h.innerHTML="<span>⇡ Desliza aquí hacia arriba para esconder la barra de Safari</span>";var bar=ov.querySelector(".game-bar span");if(bar)bar.after(h);if(window.LCI){LCI.add({"⇡ Desliza aquí hacia arriba para esconder la barra de Safari":["⇡ Swipe up here to hide Safari's bar","⇡ Llisca aquí cap amunt per amagar la barra de Safari","⇡ Hier nach oben wischen, um die Safari-Leiste auszublenden"]});LCI.refresh(h)}}}
    fit();
    // Android y ordenador: pantalla completa real
    if(!ios&&!document.fullscreenElement&&ov.requestFullscreen){ov.requestFullscreen({navigationUI:"hide"}).catch(function(){})}
  }
  function onClose(){root.classList.remove("game-on","game-lock","game-swipe");if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(function(){})}
  new MutationObserver(function(){ov.hidden?onClose():onOpen()}).observe(ov,{attributes:true,attributeFilter:["hidden"]});
  if(window.visualViewport){visualViewport.addEventListener("resize",function(){if(!ov.hidden)fit()});addEventListener("scroll",function(){if(!ov.hidden)fit()},{passive:true});visualViewport.addEventListener("scroll",function(){if(!ov.hidden)fit()})}
  addEventListener("resize",function(){if(!ov.hidden)fit()});addEventListener("scroll",function(){if(!ov.hidden)fit()},{passive:true});addEventListener("orientationchange",function(){setTimeout(fit,300)});
  // si se sale de pantalla completa con el botón del sistema, se queda el juego abierto en la ventana
  // aviso para iPhone en Safari: añadir a pantalla de inicio = pantalla completa
  if(ios&&!standalone){
    if(window.LCI)LCI.add({"📲 Para jugar a pantalla completa en iPhone: Compartir → Añadir a pantalla de inicio":["📲 For full screen on iPhone: Share → Add to Home Screen","📲 Per jugar a pantalla completa a l'iPhone: Compartir → Afegir a la pantalla d'inici","📲 Für Vollbild auf dem iPhone: Teilen → Zum Home-Bildschirm"]});
    var host=document.querySelector("#juegos .zg-facts")||document.querySelector("#juegos .zg-ticket")||document.querySelector("#juegos");
    if(host&&!document.querySelector(".zg-a2hs")){var p=document.createElement("p");p.className="zg-a2hs";p.innerHTML="<span>📲 Para jugar a pantalla completa en iPhone: Compartir → Añadir a pantalla de inicio</span>";
      if(host.id==="juegos")host.appendChild(p);else host.after(p);if(window.LCI)LCI.refresh(p)}
  }
})();
