/* ===== Tienda: comprar los diseños de la sección Camisetas ===== */
(function(){
  // diseños con archivo de impresión listo (print/LCM-xx.png). Se añaden a medida que llegan.
  var DISPONIBLES=["LCM-01","LCM-02","LCM-03","LCM-04","LCM-05","LCM-06","LCM-07","LCM-08","LCM-09","LCM-10","LCM-11","LCM-12","LCM-13","LCM-14","LCM-15","LCM-16","LCM-17","LCM-18","LCM-19","LCM-20","LCM-21","LCM-22","LCM-23","LCM-24","LCM-25","LCM-26","LCM-27","LCM-28","LCM-29","LCM-30","LCM-31","LCM-32","LCM-33","LCM-34","LCM-35","LCM-36","LCM-37","LCM-38","LCM-39","LCM-40","LCM-41","LCM-42","LCM-43","LCM-44","LCM-45"];
  var LINK="https://buy.stripe.com/9B69ASbkF3K9efn36D6oo00", PRECIO="29 €";
  var SIZES=["S","M","L","XL","XXL","3XL"];
  if(window.LCI)LCI.add({"Elige tu talla":["Choose your size","Tria la teva talla","Wähle deine Größe"],
    "Envío a España incluido · Llega en 1–2 semanas":["Shipping to Spain included · Arrives in 1–2 weeks","Enviament a Espanya inclòs · Arriba en 1–2 setmanes","Versand nach Spanien inklusive · Lieferung in 1–2 Wochen"],
    "Disponible muy pronto":["Available very soon","Disponible molt aviat","Bald erhältlich"]});
  window.lcShopFicha=function(d,f){
    var buy=f.querySelector(".f-buy"),soon=f.querySelector(".f-soon"),btns=f.querySelector(".f-btns");
    var box=f.querySelector(".lt-buy");
    if(!box){box=document.createElement("div");box.className="lt-buy";btns.parentNode.insertBefore(box,btns)}
    var ok=DISPONIBLES.indexOf(d.code)>=0;
    box.hidden=!ok;soon.hidden=ok;
    if(!ok){buy.disabled=true;buy.onclick=null;return}
    box.innerHTML='<div class="lt-price">'+PRECIO+'</div><p class="lt-lbl"><span>Elige tu talla</span></p>'+
      '<div class="cr-sizes lt-sizes" role="group">'+SIZES.map(function(s){return '<button type="button" aria-pressed="false" data-s="'+s+'">'+s+'</button>'}).join("")+'</div>'+
      '<p class="lt-note"><span>Envío a España incluido · Llega en 1–2 semanas</span></p>';
    var size=null,lbl=box.querySelector(".lt-lbl");
    buy.disabled=false;buy.setAttribute("aria-disabled","true");
    box.querySelector(".lt-sizes").onclick=function(e){var b=e.target.closest("button");if(!b)return;size=b.dataset.s;
      box.querySelectorAll(".lt-sizes button").forEach(function(x){x.setAttribute("aria-pressed",x===b)});buy.removeAttribute("aria-disabled");lbl.classList.remove("cr-warn")};
    buy.onclick=function(){
      if(!size){lbl.classList.remove("cr-warn");void lbl.offsetWidth;lbl.classList.add("cr-warn");return}
      window.open(LINK+"?client_reference_id=d-"+d.code+"_talla-"+size,"_blank","noopener");
    };
    if(window.LCI)LCI.refresh(f);
  };
})();
