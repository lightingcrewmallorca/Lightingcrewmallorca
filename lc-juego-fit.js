/* ===== Juego: siempre dentro del hueco visible, pantalla completa donde se pueda ===== */
(function(){
  var ov=document.getElementById("game-ov");if(!ov)return;
  var root=document.documentElement;
  var ios=/iP(hone|od|ad)/.test(navigator.platform)||(/Mac/.test(navigator.platform)&&navigator.maxTouchPoints>1)||/iPhone|iPad|iPod/.test(navigator.userAgent);
  var standalone=navigator.standalone===true||matchMedia("(display-mode: standalone)").matches||matchMedia("(display-mode: fullscreen)").matches;
  function fit(){
    var vv=window.visualViewport,h=vv?vv.height:innerHeight,t=vv?vv.offsetTop:0;
    ov.style.top=t+"px";ov.style.height=h+"px";ov.style.bottom="auto";
  }
  function onOpen(){
    root.classList.add("game-on");fit();
    // Android y ordenador: pantalla completa real
    if(!ios&&!document.fullscreenElement&&ov.requestFullscreen){ov.requestFullscreen({navigationUI:"hide"}).catch(function(){})}
  }
  function onClose(){root.classList.remove("game-on");if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(function(){})}
  new MutationObserver(function(){ov.hidden?onClose():onOpen()}).observe(ov,{attributes:true,attributeFilter:["hidden"]});
  if(window.visualViewport){visualViewport.addEventListener("resize",function(){if(!ov.hidden)fit()});visualViewport.addEventListener("scroll",function(){if(!ov.hidden)fit()})}
  addEventListener("resize",function(){if(!ov.hidden)fit()});addEventListener("orientationchange",function(){setTimeout(fit,300)});
  // si se sale de pantalla completa con el botón del sistema, se queda el juego abierto en la ventana
  // aviso para iPhone en Safari: añadir a pantalla de inicio = pantalla completa
  if(ios&&!standalone){
    if(window.LCI)LCI.add({"📲 Para jugar a pantalla completa en iPhone: Compartir → Añadir a pantalla de inicio":["📲 For full screen on iPhone: Share → Add to Home Screen","📲 Per jugar a pantalla completa a l'iPhone: Compartir → Afegir a la pantalla d'inici","📲 Für Vollbild auf dem iPhone: Teilen → Zum Home-Bildschirm"]});
    var host=document.querySelector("#juegos .zg-facts")||document.querySelector("#juegos .zg-ticket")||document.querySelector("#juegos");
    if(host&&!document.querySelector(".zg-a2hs")){var p=document.createElement("p");p.className="zg-a2hs";p.innerHTML="<span>📲 Para jugar a pantalla completa en iPhone: Compartir → Añadir a pantalla de inicio</span>";
      if(host.id==="juegos")host.appendChild(p);else host.after(p);if(window.LCI)LCI.refresh(p)}
  }
})();
