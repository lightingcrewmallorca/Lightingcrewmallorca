/* ===== Tienda cerrada en la web real hasta que se abra =====
   Para abrirla: poner ABIERTA=true (y apuntar el webhook de Stripe a lightingcrewmallorca.com). */
(function(){
  var ABIERTA=false;
  var real=/(^|\.)lightingcrewmallorca\.com$/i.test(location.hostname);
  if(ABIERTA||!real)return;
  document.documentElement.classList.add("shop-closed");
  if(window.LCI)LCI.add({"Muy pronto":["Coming soon","Molt aviat","Demnächst"]});
  function label(){
    document.querySelectorAll(".cr-buy-btn span,#ficha .f-buy").forEach(function(e){if(e.textContent!=="Muy pronto")e.textContent="Muy pronto"});
    document.querySelectorAll(".cr-buy-btn").forEach(function(a){a.removeAttribute("href");a.setAttribute("aria-disabled","true")});
    if(window.LCI)LCI.refresh(document.body);
  }
  label();new MutationObserver(function(){if(!label.t)label.t=setTimeout(function(){label.t=0;label()},50)}).observe(document.body,{subtree:true,childList:true});
  document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".cr-buy-btn,#ficha .f-buy");if(b){e.preventDefault();e.stopImmediatePropagation()}},true);
})();
