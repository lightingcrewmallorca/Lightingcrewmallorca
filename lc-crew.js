/* ===== Camisetas Crew: título de neón + un solo bloque con selector ===== */
(function(){
  if(window.LCI)LCI.add({"Sudadera":["Hoodie","Dessuadora","Hoodie"],"Camiseta":["T-shirt","Samarreta","T-Shirt"],
    "Dar la vuelta":["Turn around","Girar","Umdrehen"],"Toca o desliza para darle la vuelta":["Tap or swipe to turn it around","Toca o llisca per girar-la","Tippen oder wischen zum Umdrehen"],
    "El uniforme":["The crew's","L'uniforme","Die Uniform"],"del crew.":["uniform.","del crew.","der Crew."],
    "La sudadera y la camiseta oficiales de Lighting Crew Mallorca, edición 2027.":["The official Lighting Crew Mallorca hoodie and t-shirt, 2027 edition.","La dessuadora i la samarreta oficials de Lighting Crew Mallorca, edició 2027.","Der offizielle Hoodie und das T-Shirt von Lighting Crew Mallorca, Edition 2027."]});
  var sec=document.getElementById("crew");if(!sec)return;
  var head=sec.querySelector(".sec-head");
  if(head&&!head.querySelector(".cr-title")){
    var h=document.createElement("h2");
    h.className="tw-title cr-title";
    h.innerHTML='<img class="tw-ti cr-ic" src="cr-icon.webp" alt="">'+"<span>Camisetas Crew</span>";
    head.insertBefore(h,head.firstChild);
    var tl=head.querySelector(".tagline");
    if(tl)tl.innerHTML='<span class="tag-big"><span>El uniforme</span> <span><span>del crew.</span></span></span><span>La sudadera y la camiseta oficiales de Lighting Crew Mallorca, edición 2027.</span>';
  }
  var drops=[].slice.call(sec.querySelectorAll(".drop"));
  if(drops.length<1)return;
  // la imagen debajo del título y el interruptor debajo de la imagen
  // prenda grande con el interruptor al lado
  drops.forEach(function(d){
    var copy=d.querySelector(".drop-copy"),stage=d.querySelector(".drop-stage"),title=d.querySelector(".drop-title"),
        plate=d.querySelector(".plate"),hint=d.querySelector(".drop-hint");
    if(!copy||!stage||!title||!plate||d.querySelector(".cr-row"))return;
    var row=document.createElement("div");row.className="cr-row";
    var side=document.createElement("div");side.className="cr-side";
    side.appendChild(plate);if(hint)side.appendChild(hint);
    var beams=d.querySelector(".drop-beams");if(beams)row.appendChild(beams);
    row.appendChild(side);row.appendChild(stage);
    title.after(row);
  });
  // con la luz encendida: dar la vuelta para ver delante y detrás
  drops.forEach(function(d){
    var hood=d.querySelector(".hoodie"),hint=d.querySelector(".drop-hint"),row=d.querySelector(".cr-row");if(!hood)return;
    var btn=document.createElement("button");btn.type="button";btn.className="cr-flip";btn.hidden=true;
    btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Dar la vuelta</span>';
    (row||hood).after(btn);
    var on=function(){return d.dataset.on==="true"};
    var flip=function(){d.classList.toggle("cr-front")};
    hood.addEventListener("click",function(e){if(on()){e.stopImmediatePropagation();e.preventDefault();flip()}},true);
    btn.addEventListener("click",flip);
    var x0=null;
    hood.addEventListener("touchstart",function(e){x0=e.touches[0].clientX},{passive:true});
    hood.addEventListener("touchend",function(e){if(x0==null||!on())return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40)flip()},{passive:true});
    new MutationObserver(function(){
      var o=on();btn.hidden=!o;
      if(!o)d.classList.remove("cr-front");
      else if(hint)setTimeout(function(){hint.textContent="Toca o desliza para darle la vuelta"},0);
    }).observe(d,{attributes:true,attributeFilter:["data-on"]});
  });

  // comprar: enlaces de pago de Stripe (envío a España incluido)
  var BUY=[{u:"https://buy.stripe.com/5kQ8wOewR1C1fjr6iP6oo01",p:"43 €",r:"crew-sudadera"},
           {u:"https://buy.stripe.com/9B69ASbkF3K9efn36D6oo00",p:"29 €",r:"crew-camiseta"}];
  if(window.LCI)LCI.add({"Comprar":["Buy","Comprar","Kaufen"],"Tallas S a 3XL · Envío a España incluido":["Sizes S to 3XL · Shipping to Spain included","Talles S a 3XL · Enviament a Espanya inclòs","Größen S bis 3XL · Versand nach Spanien inklusive"],
    "Elige tu talla":["Choose your size","Tria la teva talla","Wähle deine Größe"],"Envío a España incluido":["Shipping to Spain included","Enviament a Espanya inclòs","Versand nach Spanien inklusive"],
    "Se imprime bajo pedido y llega en 1–2 semanas.":["Printed on demand, arrives in 1–2 weeks.","S'imprimeix sota comanda i arriba en 1–2 setmanes.","Wird auf Bestellung gedruckt, Lieferung in 1–2 Wochen."]});
  drops.forEach(function(d,k){
    var b=BUY[k],copy=d.querySelector(".drop-copy");if(!b||!copy||d.querySelector(".cr-buy"))return;
    var box=document.createElement("div");box.className="cr-buy";
    var SIZES=["S","M","L","XL","XXL","3XL"];
    box.innerHTML='<div class="cr-price">'+b.p+'</div>'+
      '<p class="cr-size-lbl"><span>Elige tu talla</span></p>'+
      '<div class="cr-sizes" role="group">'+SIZES.map(function(s){return '<button type="button" aria-pressed="false" data-s="'+s+'">'+s+'</button>'}).join("")+'</div>'+
      '<a class="cr-buy-btn" aria-disabled="true" href="#" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h13l-1.5 8.5H7.5L6 4H3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="19.5" r="1.4" fill="currentColor"/><circle cx="17" cy="19.5" r="1.4" fill="currentColor"/></svg><span>Comprar</span></a>'+
      '<p class="cr-buy-note"><span>Envío a España incluido</span><br><span>Se imprime bajo pedido y llega en 1–2 semanas.</span></p>';
    var a=box.querySelector(".cr-buy-btn"),lbl=box.querySelector(".cr-size-lbl");
    box.querySelector(".cr-sizes").addEventListener("click",function(e){
      var s=e.target.closest("button");if(!s)return;
      box.querySelectorAll(".cr-sizes button").forEach(function(x){x.setAttribute("aria-pressed",x===s)});
      a.href=b.u+"?client_reference_id="+b.r+"_talla-"+s.dataset.s;
      a.removeAttribute("aria-disabled");lbl.classList.remove("cr-warn");
    });
    a.addEventListener("click",function(e){
      if(a.hasAttribute("aria-disabled")){e.preventDefault();lbl.classList.remove("cr-warn");void lbl.offsetWidth;lbl.classList.add("cr-warn")}
    });
    copy.appendChild(box);
  });
  if(drops.length<2)return;
  var pick=document.createElement("div");pick.className="cr-pick";pick.setAttribute("role","group");
  pick.innerHTML='<button type="button" data-i="0" aria-pressed="true"><span>Sudadera</span></button><button type="button" data-i="1" aria-pressed="false"><span>Camiseta</span></button>';
  drops[0].before(pick);
  function show(i){
    drops.forEach(function(d,k){d.hidden=k!==i});
    pick.querySelectorAll("button").forEach(function(b){b.setAttribute("aria-pressed",+b.dataset.i===i)});
  }
  pick.addEventListener("click",function(e){var b=e.target.closest("button");if(b)show(+b.dataset.i)});
  show(0);
  drops.forEach(function(d,k){new MutationObserver(function(){if(d.classList.contains("flash")&&d.hidden){show(k);d.scrollIntoView({block:"center"})}}).observe(d,{attributes:true,attributeFilter:["class"]})});
  if(window.LCI)LCI.refresh(sec);
})();
