/* Cartelera tipo plataforma + ficha de cada camiseta */
(function(){
  try{if(typeof DICT!=="undefined")Object.assign(DICT,{
    "Comprar":["Buy","Comprar","Kaufen"],
    "Disponible muy pronto":["Available soon","Disponible molt aviat","Bald erhältlich"],
    "Desliza para ver más":["Swipe to see more","Llisca per veure'n més","Wischen für mehr"],"Juego":["Game","Joc","Spiel"],"Pruébala en termo o taza":["Try it on a flask or mug","Prova-la en termo o tassa","Auf Flasche oder Tasse testen"]})}catch(e){}
  var root=document.getElementById("shirts");
  if(!root||typeof designs==="undefined")return;
  var LBL={diseno:"Diseño",delante:"Delante",detras:"Detrás"},ORDER=["detras","delante","diseno"],pass=false;

  function mark(row){
    var r=row.getBoundingClientRect(),cx=r.left+r.width/2,best=null,bd=1e9;
    row.querySelectorAll(".shirt").forEach(function(c){var b=c.getBoundingClientRect(),d=Math.abs(b.left+b.width/2-cx);if(d<bd){bd=d;best=c}});
    row.querySelectorAll(".shirt").forEach(function(c){c.classList.toggle("is-c",c===best)});
  }
  function addVer(){
    root.querySelectorAll(".shirt").forEach(function(c){
      if(c.querySelector(".r-ver"))return;var box=c.querySelector(".info>div[style]")||c.querySelector(".info");if(!box)return;
      var b=document.createElement("button");b.type="button";b.className="btn big r-ver";b.textContent="Ver";box.appendChild(b)});
  }
  function rows(){
    addVer();
    root.querySelectorAll(".cat .shirts").forEach(function(row){
      if(row.parentElement.classList.contains("rowwrap"))return;
      var w=document.createElement("div");w.className="rowwrap";row.parentNode.insertBefore(w,row);w.appendChild(row);
      var pv=document.createElement("button"),nx=document.createElement("button");
      pv.type=nx.type="button";pv.className="r-nav r-prev";nx.className="r-nav r-next";pv.textContent="‹";nx.textContent="›";
      pv.setAttribute("aria-label","Anterior");nx.setAttribute("aria-label","Siguiente");w.appendChild(pv);w.appendChild(nx);
      var hint=document.createElement("p");hint.className="r-hint";hint.textContent="Desliza para ver más";w.appendChild(hint);
      function step(d){var c=row.querySelector(".shirt");row.scrollBy({left:d*(c?c.getBoundingClientRect().width/0.84*0.84+14:260),behavior:"smooth"})}
      pv.addEventListener("click",function(){step(-1)});nx.addEventListener("click",function(){step(1)});
      var raf=0;row.addEventListener("scroll",function(){cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){mark(row)})},{passive:true});
      mark(row);
      // al entrar, empezar en la tercera camiseta para que haya carteles a los dos lados
      var ctr=function(){if(row.dataset.ctr||!row.clientWidth)return;var cs=row.querySelectorAll(".shirt"),c=cs[Math.min(2,Math.floor((cs.length-1)/2))];if(!c)return;
        row.style.scrollSnapType="none";row.scrollLeft=c.offsetLeft+c.offsetWidth/2-row.clientWidth/2;row.dataset.ctr="1";mark(row);
        requestAnimationFrame(function(){row.style.scrollSnapType=""})};
      ctr();if(window.ResizeObserver)new ResizeObserver(ctr).observe(row);
    });
  }
  rows();setTimeout(rows,300);
  new MutationObserver(function(){rows()}).observe(root,{childList:true});
  addEventListener("resize",function(){root.querySelectorAll(".cat .shirts").forEach(mark)});
  document.querySelectorAll("#filters button").forEach(function(b){b.addEventListener("click",function(){setTimeout(function(){root.querySelectorAll(".cat .shirts").forEach(mark)},60)})});

  root.addEventListener("touchstart",function(e){if(e.target.closest&&e.target.closest(".shirt"))e.stopPropagation()},{capture:true,passive:true});
  root.addEventListener("click",function(e){
    if(pass)return;
    var c=e.target.closest&&e.target.closest(".shirt");if(!c)return;
    e.stopImmediatePropagation();e.preventDefault();
    if(e.target.closest(".r-ver")){openFicha(c);return}
    if(!c.classList.contains("is-c")){var row=c.closest(".shirts"),r=row.getBoundingClientRect(),b=c.getBoundingClientRect();row.scrollBy({left:(b.left+b.width/2)-(r.left+r.width/2),behavior:"smooth"});return}
    openFicha(c);
  },true);

  var f=document.createElement("div");f.id="ficha";f.className="ficha";f.hidden=true;f.setAttribute("role","dialog");f.setAttribute("aria-modal","true");
  f.innerHTML='<div class="f-bg"></div><div class="f-scroll"><button type="button" class="f-x" aria-label="Cerrar">✕</button>'+
    '<div class="f-media"><img class="f-img" alt=""><button type="button" class="f-nav f-prev" aria-label="Anterior">‹</button><button type="button" class="f-nav f-next" aria-label="Siguiente">›</button></div>'+
    '<div class="f-thumbs"></div><div class="f-body"><p class="f-pre"></p><div class="f-title" role="heading" aria-level="2"></div><p class="f-code"></p>'+
    '<p class="f-syn-l">Sinopsis</p><p class="f-syn"></p><div class="f-btns"><button type="button" class="btn big f-buy" disabled>Comprar</button><button type="button" class="btn ghost f-zoom">Ver en grande</button></div>'+
    '<p class="f-soon">Disponible muy pronto</p><div class="f-to"></div></div></div>';
  document.body.appendChild(f);
  function q(s){return f.querySelector(s)}
  var list=[],i=0,cur=null,last=null;
  function show(n){if(!list.length)return;i=(n+list.length)%list.length;q(".f-img").src=list[i].src;q(".f-img").alt=cur.name+" · "+list[i].l;
    f.querySelectorAll(".f-thumbs button").forEach(function(b,k){b.setAttribute("aria-current",String(k===i))});
    q(".f-prev").hidden=q(".f-next").hidden=list.length<2}
  function openFicha(c){
    var h=c.querySelector("h3"),nm=h?h.textContent.trim():"";
    cur=null;for(var k=0;k<designs.length;k++){if(designs[k].name===nm){cur=designs[k];break}}
    if(!cur)return;last=document.activeElement;
    list=ORDER.filter(function(k){return cur.views&&cur.views[k]}).map(function(k){return{src:cur.views[k].src,l:LBL[k],k:k}});
    var cat=c.closest(".cat"),sala=cat&&cat.querySelector(".sala"),ct=cat&&cat.querySelector(".cat-t");
    q(".f-pre").textContent=(sala?sala.textContent.replace(/\s+/g," ").trim():"")+(ct?" · "+ct.textContent.trim():"");
    q(".f-title").textContent=cur.name;q(".f-code").textContent=cur.code||"";q(".f-syn").textContent=cur.desc||"";q(".f-syn-l").hidden=!cur.desc;if(window.lcShopFicha)window.lcShopFicha(cur,f);
    q(".f-bg").style.backgroundImage='url("'+list[0].src+'")';
    q(".f-thumbs").innerHTML=list.map(function(x){return '<button type="button"><img src="'+x.src+'" alt=""><span>'+x.l+'</span></button>'}).join("");
    f.querySelectorAll(".f-thumbs button").forEach(function(b,k){b.addEventListener("click",function(){show(k)})});
    var to=q(".f-to");to.innerHTML="";
    var tb=c.querySelector(".to-row .to-bottle");
    if(tb){var n=document.createElement("button");n.type="button";n.className="f-link f-bar";
      n.innerHTML='<img src="bar-i-taza.webp" alt=""><span>Pruébala en termo o taza</span>';
      n.addEventListener("click",function(){close();pass=true;try{tb.click()}finally{pass=false};scrollTo(0,0)});to.appendChild(n)}
    show(0);f.hidden=false;document.documentElement.style.overflow="hidden";q(".f-scroll").scrollTop=0;
    requestAnimationFrame(function(){f.classList.add("open")});setTimeout(function(){try{q(".f-x").focus({preventScroll:true})}catch(e){}},60);
  }
  function close(){f.classList.remove("open");f.hidden=true;document.documentElement.style.overflow="";if(last&&last.focus){try{last.focus({preventScroll:true})}catch(e){}}}
  q(".f-x").addEventListener("click",close);
  q(".f-prev").addEventListener("click",function(){show(i-1)});q(".f-next").addEventListener("click",function(){show(i+1)});
  q(".f-zoom").addEventListener("click",function(){if(window.openZoom&&cur)window.openZoom(cur,{dataset:{side:list[i]&&list[i].k}})});
  var x0=null,m=q(".f-media");
  m.addEventListener("touchstart",function(e){x0=e.touches[0].clientX},{passive:true});
  m.addEventListener("touchend",function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40)show(i+(dx<0?1:-1))});
  document.addEventListener("keydown",function(e){if(f.hidden)return;var z=document.getElementById("zoom");if(z&&!z.hidden)return;
    if(e.key==="Escape")close();if(e.key==="ArrowRight")show(i+1);if(e.key==="ArrowLeft")show(i-1)});
  /* la camiseta del centro va pasando su galería */
  setInterval(function(){
    if(document.hidden||!f.hidden)return;var z=document.getElementById("zoom");if(z&&!z.hidden)return;
    var sec=document.getElementById("camisetas");if(sec&&sec.hidden)return;
    root.querySelectorAll(".shirt.is-c").forEach(function(c){
      var r=c.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
      if(c.matches(":hover"))return;
      var bs=[].slice.call(c.querySelectorAll(".tabs button:not(:disabled)"));if(bs.length<2)return;
      var k=bs.findIndex(function(b){return b.getAttribute("aria-selected")==="true"});
      pass=true;try{bs[(k+1)%bs.length].click()}finally{pass=false}
    });
  },2600);
  window.openFicha=openFicha;
  /* barra de abajo: «Más» pasa a ser el juego */
  (function(){var mb=document.getElementById("more-btn");if(!mb)return;
    var a=document.createElement("a");a.href="#juegos";a.setAttribute("data-page","juegos");a.id="game-tab";
    a.innerHTML='<img class="neo" src="neo-game.webp" alt=""><span>Juego</span>';
    a.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();
      if(typeof enter==="function"&&document.getElementById("site")&&document.getElementById("site").hidden){enter("juegos")}
      else if(typeof showPage==="function"){showPage("juegos")}else{location.hash="#juegos"}
      scrollTo(0,0);
      setTimeout(function(){if(window.lcAlignZombies)window.lcAlignZombies()},120)});
    mb.replaceWith(a)})();
})();
