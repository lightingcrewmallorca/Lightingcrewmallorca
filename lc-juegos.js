/* ===== Juegos: "Sesi\u00f3n de medianoche" ===== */
(function(){
  try{if(typeof DICT!=="undefined")Object.assign(DICT,{
    "Sesi\u00f3n de medianoche":["Midnight screening","Sessi\u00f3 de mitjanit","Mitternachtsvorstellung"],
    "Zombies en el set":["Zombies on Set","Zombis al set","Zombies am Set"],
    "Jugar":["Play","Jugar","Spielen"],
    "Partidas r\u00e1pidas":["Quick rounds","Partides r\u00e0pides","Schnelle Runden"],
    "Sobrevive a la horda":["Survive the horde","Sobreviu a l'horda","\u00dcberlebe die Horde"],
    "Salva el rodaje":["Save the shoot","Salva el rodatge","Rette den Dreh"],
    "Tu r\u00e9cord":["Your best","El teu r\u00e8cord","Dein Rekord"]
  })}catch(e){}

  function launch(){
    var j=document.getElementById("juegos");if(!j)return;
    var p=j.querySelector(".game-cover")||j.querySelector(".game-copy .btn.big")||j.querySelector(".btn.big")||j.querySelector('a[href*="zombies"]');
    if(p){p.click()}else{location.href="zombies.html"}
  }
  window.lcPlayZombies=launch;

  function prune(){
    var j=document.getElementById("juegos"),ov=document.getElementById("game-ov");if(!j)return;
    (function walk(node){
      Array.prototype.forEach.call(node.children,function(c){
        if(c.id==="zg"||c===ov)return;
        if(ov&&c.contains(ov)){c.classList.remove("zg-hide");walk(c)}
        else c.classList.add("zg-hide");
      });
    })(j);
  }

  function best(){
    var b=0;
    try{for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      if(!/best|record|r[e\u00e9]cord|high|max|top|puntu|score/i.test(k))continue;
      var v=String(localStorage.getItem(k)||"").trim();
      if(/^\d{1,9}$/.test(v)){v=+v;if(v>b)b=v}
    }}catch(e){}
    return b;
  }
  function showBest(){
    var r=document.querySelector("#zg .zg-rec");if(!r)return;
    var b=best();
    if(b>0){r.querySelector("b").textContent=b.toLocaleString("es-ES");r.hidden=false}else r.hidden=true;
  }

  function visible(){
    var z=document.getElementById("zg");
    if(!z||document.hidden||!z.offsetParent)return false;
    var ov=document.getElementById("game-ov");
    return !(ov&&!ov.hidden&&ov.offsetParent!==null);
  }

  function build(){
    var j=document.getElementById("juegos");
    if(!j||document.getElementById("zg"))return;
    var s=document.createElement("section");
    s.id="zg";s.className="zg";
    s.innerHTML=
      '<div class="zg-bg" aria-hidden="true"></div>'+
      '<div class="zg-stage">'+
        '<img class="zg-poster" src="zg-poster.webp" alt="" loading="lazy" decoding="async">'+
        '<img class="zg-peek" src="zg-peek.webp" alt="" loading="lazy" decoding="async">'+
        '<div class="zg-top">'+
          
          '<h2 class="zg-title"><span>Zombies en el set</span></h2>'+
        '</div>'+
      '</div>'+
      '<div class="zg-play-wrap">'+
        '<button class="zg-play" type="button"><span>Jugar</span></button>'+
        '<p class="zg-rec" hidden><span>Tu r\u00e9cord</span><b></b></p>'+
      '</div>'+
      '<ul class="zg-facts">'+
        '<li><img src="zg-ic-time.webp" alt="" loading="lazy"><span>Partidas r\u00e1pidas</span></li>'+
        '<li><img src="zg-ic-hand.webp" alt="" loading="lazy"><span>Sobrevive a la horda</span></li>'+
        '<li><img src="zg-ic-clap.webp" alt="" loading="lazy"><span>Salva el rodaje</span></li>'+
      '</ul>';
    j.insertBefore(s,j.firstChild);
    j.classList.add("zg-on");
    prune();
    new MutationObserver(prune).observe(j,{childList:true});

    s.querySelector(".zg-play").addEventListener("click",function(e){e.preventDefault();e.stopPropagation();launch()});

    var peek=s.querySelector(".zg-peek"),busy=false,lastTop=-99;
    function boo(){
      if(busy||!visible())return;busy=true;
      peek.style.transition="none";
      peek.classList.toggle("l",Math.random()<.5);
      var t,n=0;do{t=14+Math.random()*50;n++}while(Math.abs(t-lastTop)<14&&n<10);lastTop=t;
      peek.style.top=t.toFixed(1)+"%";
      void peek.offsetWidth;
      peek.style.transition="";
      requestAnimationFrame(function(){requestAnimationFrame(function(){peek.classList.add("on")})});
      setTimeout(function(){peek.classList.remove("on");setTimeout(function(){busy=false},800)},2300);
    }
    peek.addEventListener("click",function(e){e.stopPropagation();peek.classList.remove("on")});
    setTimeout(boo,2500);
    setInterval(function(){if(Math.random()<.6)boo()},7000);

    showBest();
    setInterval(function(){if(visible())showBest()},3000);
    window.addEventListener("focus",showBest);
  }

  function fixedH(el){if(!el)return 0;var p=getComputedStyle(el).position;return (p==="fixed"||p==="sticky")?el.getBoundingClientRect().height:0}
  function bars(){
    var h=document.querySelector("#site header")||document.querySelector("header");
    var t=document.getElementById("game-tab");t=t&&(t.closest("nav")||t.parentElement);
    var hh=fixedH(h),th=0;
    if(t){var cs=getComputedStyle(t);if(cs.position==="fixed")th=t.getBoundingClientRect().height}
    return {top:hh,bot:th};
  }
  function fit(){
    var z=document.getElementById("zg");if(!z)return;
    var b=bars(),avail=innerHeight-b.top-b.bot-14;
    var w=Math.min(z.parentElement.clientWidth||innerWidth,520,avail/1.72);
    z.style.setProperty("--zgw",Math.max(260,Math.floor(w))+"px");
  }
  function align(){
    var z=document.getElementById("zg");if(!z||!z.offsetParent)return;
    var y=z.getBoundingClientRect().top+scrollY-bars().top;
    scrollTo(0,Math.max(0,y));
  }
  window.lcAlignZombies=align;
  var wasVis=false;
  setInterval(function(){
    var z=document.getElementById("zg"),v=!!(z&&z.offsetParent);
    if(v&&!wasVis){fit();setTimeout(align,60);setTimeout(align,260)}
    wasVis=v;
  },150);
  addEventListener("resize",fit);

  build();fit();
  if(!document.getElementById("zg")){
    document.addEventListener("DOMContentLoaded",build);
    setTimeout(build,600);
  }
})();
