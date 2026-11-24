/* ===== Tiempo y localización del set (pantalla de neón) ===== */
(function(){
  if(window.LCI)LCI.add({
    "Tiempo en el set":["Weather on set","Temps al set","Wetter am Set"],
    "Cambiar localización":["Change location","Canviar localització","Ort ändern"],
    "Busca un pueblo, cala o playa":["Search a town, cove or beach","Cerca un poble, cala o platja","Ort, Bucht oder Strand suchen"],
    "Últimas localizaciones":["Recent locations","Darreres localitzacions","Letzte Orte"],
    "Pega la ubicación de Google Maps":["Paste the Google Maps location","Enganxa la ubicació de Google Maps","Google-Maps-Standort einfügen"],
    "Coordenadas o enlace de Google Maps":["Coordinates or Google Maps link","Coordenades o enllaç de Google Maps","Koordinaten oder Google-Maps-Link"],
    "Listo":["Done","Fet","Fertig"],
    "Día de rodaje":["Shooting day","Dia de rodatge","Drehtag"],
    "Hoy":["Today","Avui","Heute"],
    "Mañana":["Tomorrow","Demà","Morgen"],
    "Horario de luz":["Light schedule","Horari de llum","Lichtplan"],
    "Hora azul":["Blue hour","Hora blava","Blaue Stunde"],
    "Hora dorada":["Golden hour","Hora daurada","Goldene Stunde"],
    "Salida del sol":["Sunrise","Sortida del sol","Sonnenaufgang"],
    "Puesta del sol":["Sunset","Posta de sol","Sonnenuntergang"],
    "Mediodía solar":["Solar noon","Migdia solar","Sonnenmittag"],
    "Luz de día":["Daylight","Llum de dia","Tageslicht"],
    "mañana":["morning","matí","Morgen"],
    "tarde":["evening","vespre","Abend"],
    "Ahora":["Now","Ara","Jetzt"],
    "De día":["Daytime","De dia","Tag"],
    "Noche":["Night","Nit","Nacht"],
    "Sol":["Sun","Sol","Sonne"],
    "Previsión por horas":["Hourly forecast","Previsió per hores","Stündliche Vorhersage"],
    "Máx.":["High","Màx.","Max."],
    "Mín.":["Low","Mín.","Min."],
    "Lluvia":["Rain","Pluja","Regen"],
    "Viento":["Wind","Vent","Wind"],
    "Rachas":["Gusts","Ràfegues","Böen"],
    "Cargando previsión…":["Loading forecast…","Carregant previsió…","Vorhersage wird geladen…"],
    "No se ha podido cargar la previsión.":["The forecast could not be loaded.","No s'ha pogut carregar la previsió.","Die Vorhersage konnte nicht geladen werden."],
    "En esta vista previa no se puede; en lightingcrewmallorca.com sí funciona.":["It doesn't work in this preview; it works on lightingcrewmallorca.com.","En aquesta vista prèvia no es pot; a lightingcrewmallorca.com sí que funciona.","In dieser Vorschau geht es nicht; auf lightingcrewmallorca.com schon."],
    "Todavía no hay previsión para este día.":["No forecast for this day yet.","Encara no hi ha previsió per a aquest dia.","Für diesen Tag gibt es noch keine Vorhersage."],
    "Viento en Windy":["Wind on Windy","Vent a Windy","Wind auf Windy"],
    "Cómo llegar":["Directions","Com arribar","Route"],
    "Bares cerca":["Bars nearby","Bars a prop","Bars in der Nähe"],
    "Horas en hora peninsular. Previsión de Open-Meteo.":["Times in Spanish mainland time. Forecast by Open-Meteo.","Hores en hora peninsular. Previsió d'Open-Meteo.","Zeiten in spanischer Festlandzeit. Vorhersage von Open-Meteo."],
    "No encuentro ese sitio. Prueba con el pueblo más cercano o pega la ubicación de Google Maps.":["I can't find that place. Try the nearest town or paste the Google Maps location.","No trobo aquest lloc. Prova amb el poble més proper o enganxa la ubicació de Google Maps.","Ort nicht gefunden. Versuch den nächsten Ort oder füge den Google-Maps-Standort ein."],
    "Ese enlace corto no lleva las coordenadas. En Google Maps mantén pulsado el punto y copia los números que salen arriba.":["That short link has no coordinates. In Google Maps, press and hold the spot and copy the numbers shown at the top.","Aquest enllaç curt no porta les coordenades. A Google Maps mantén premut el punt i copia els números que surten a dalt.","Dieser Kurzlink enthält keine Koordinaten. Halte in Google Maps den Punkt gedrückt und kopiere die Zahlen oben."],
    "Ubicación de Google Maps":["Google Maps location","Ubicació de Google Maps","Google-Maps-Standort"],
    "bajo el horizonte":["below the horizon","sota l'horitzó","unter dem Horizont"],
    "hacia el":["towards","cap al","Richtung"],
    "Temperatura":["Temperature","Temperatura","Temperatur"],
    "Viento / rachas (km/h)":["Wind / gusts (km/h)","Vent / ràfegues (km/h)","Wind / Böen (km/h)"]
  });

  var $=function(s,r){return (r||document).querySelector(s)};
  var sec=document.getElementById("sol");
  if(!sec||typeof sunTimes!=="function"||typeof madridInstant!=="function")return;
  var TR=function(s){return window.LCI?LCI.tr(s):s};
  var TN=function(s){return window.T?window.T(s):s};
  var lang=function(){return window.LCI?LCI.lang():"es"};
  var hm=function(d){return (d instanceof Date&&!isNaN(d))?t(d):"—"};
  var I=function(n){return '<img class="tw-ic" src="tw-i-'+n+'.webp" alt="" loading="lazy">'};
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};

  /* ---------- estado ---------- */
  var st={name:"",lat:0,lng:0,day:todayStr()};
  try{var sv=JSON.parse(localStorage.getItem("lcm-loc")||"null");if(sv&&isFinite(sv.lat)&&isFinite(sv.lng)){st.name=sv.name||"";st.lat=+sv.lat;st.lng=+sv.lng}}catch(e){}
  if(!st.name&&!st.lat){st.name=LOCS[0][0];st.lat=LOCS[0][1];st.lng=LOCS[0][2]}
  function recent(){try{return JSON.parse(localStorage.getItem("lcm-recent")||"[]")}catch(e){return[]}}
  function pushRecent(){
    var r=recent().filter(function(x){return Math.abs(x.lat-st.lat)>1e-4||Math.abs(x.lng-st.lng)>1e-4});
    r.unshift({name:st.name,lat:st.lat,lng:st.lng});r=r.slice(0,6);
    try{localStorage.setItem("lcm-recent",JSON.stringify(r))}catch(e){}
  }
  function setLocation(name,lat,lng){
    st.name=name;st.lat=+lat;st.lng=+lng;
    try{localStorage.setItem("lcm-loc",JSON.stringify({name:name,lat:st.lat,lng:st.lng}))}catch(e){}
    pushRecent();wx=null;render();loadWx();
  }

  /* ---------- maqueta ---------- */
  Array.prototype.forEach.call(sec.children,function(c){c.classList.add("tw-hide")});
  var w=document.createElement("div");w.className="tw";w.id="tw";
  w.innerHTML=
    '<div class="sec-head tw-sh"><h2 class="tw-title"><img class="tw-ti" src="tw-sun.webp" alt=""><span>Tiempo en el set</span></h2></div>'+
    '<div class="tw-screen" id="tw-screen"><svg id="tw-dial" viewBox="0 0 600 330" role="img" aria-label="Sun path"></svg></div>'+
    '<div class="tw-head">'+
      '<h2 class="tw-loc">'+I("pin")+'<span id="tw-name"></span></h2>'+
      '<p class="tw-state"><span id="tw-now"></span></p>'+
      '<button class="tw-btn ghost" id="tw-change" type="button" aria-expanded="false"><span>Cambiar localización</span></button>'+
    '</div>'+
    '<div class="tw-panel" id="tw-panel" hidden>'+
      '<input id="tw-q" type="search" list="loc-list" autocomplete="off" placeholder="Busca un pueblo, cala o playa">'+
      '<p class="tw-sub"><span>Últimas localizaciones</span></p>'+
      '<div class="tw-recent" id="tw-recent"></div>'+
      '<p class="tw-sub"><span>Pega la ubicación de Google Maps</span></p>'+
      '<input id="tw-g" type="text" autocomplete="off" placeholder="Coordenadas o enlace de Google Maps">'+
      '<p class="tw-msg" id="tw-msg" aria-live="polite"></p>'+
      '<button class="tw-btn" id="tw-done" type="button"><span>Listo</span></button>'+
    '</div>'+
    '<div class="tw-days" id="tw-days"></div>'+
    '<h3 class="tw-h3"><img class="tw-ti" src="tw-i-rise.webp" alt=""><span>Horario de luz</span></h3>'+
    '<div class="tw-times" id="tw-times"></div>'+
    '<h3 class="tw-h3"><img class="tw-ti" src="tw-i-rain.webp" alt=""><span>Previsión por horas</span></h3>'+
    '<div class="tw-sum" id="tw-sum"></div>'+
    '<div class="tw-hours" id="tw-hours"></div>'+
    '<div class="tw-links">'+
      '<a class="tw-btn" id="tw-windy" target="_blank" rel="noopener">'+I("wind")+'<span>Viento en Windy</span></a>'+
      '<a class="tw-btn" id="tw-route" target="_blank" rel="noopener">'+I("route")+'<span>Cómo llegar</span></a>'+
      '<a class="tw-btn" id="tw-food" target="_blank" rel="noopener">'+I("food")+'<span>Bares cerca</span></a>'+
    '</div>'+
    '<p class="tw-note"><span>Horas en hora peninsular. Previsión de Open-Meteo.</span></p>';
  sec.appendChild(w);

  /* ---------- panel de localización ---------- */
  var panel=$("#tw-panel"),bChange=$("#tw-change"),q=$("#tw-q"),g=$("#tw-g"),msg=$("#tw-msg");
  function setMsg(s){msg.innerHTML=s?"<span>"+esc(s)+"</span>":""}
  function openPanel(o){panel.hidden=!o;bChange.setAttribute("aria-expanded",o);if(o){q.value="";g.value="";setMsg("");drawRecent()}}
  bChange.addEventListener("click",function(){openPanel(panel.hidden)});
  $("#tw-done").addEventListener("click",function(){openPanel(false)});
  function drawRecent(){
    var r=recent();
    $("#tw-recent").innerHTML=r.length?r.map(function(x,i){return '<button type="button" class="tw-pill" data-i="'+i+'">'+esc(TN(x.name))+'</button>'}).join(""):
      LOCS.slice(0,6).map(function(x,i){return '<button type="button" class="tw-pill" data-l="'+i+'">'+esc(TN(x[0]))+'</button>'}).join("");
  }
  $("#tw-recent").addEventListener("click",function(e){
    var b=e.target.closest(".tw-pill");if(!b)return;
    if(b.dataset.i!=null){var x=recent()[+b.dataset.i];if(x)setLocation(x.name,x.lat,x.lng)}
    else{var l=LOCS[+b.dataset.l];setLocation(l[0],l[1],l[2])}
    openPanel(false);
  });
  function pick(){
    var v=norm(q.value);if(!v)return;
    var hit=LOCS.find(function(l){return norm(l[0])===v||norm(TN(l[0]))===v})||LOCS.find(function(l){return norm(l[0]).indexOf(v)===0})||LOCS.find(function(l){return norm(l[0]).indexOf(v)>-1});
    if(hit){setLocation(hit[0],hit[1],hit[2]);openPanel(false)}
    else setMsg("No encuentro ese sitio. Prueba con el pueblo más cercano o pega la ubicación de Google Maps.");
  }
  q.addEventListener("change",pick);
  q.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();pick()}});
  g.addEventListener("input",function(){
    var c=typeof parseCoords==="function"?parseCoords(g.value):null;
    if(c){setLocation("Ubicación de Google Maps",c[0],c[1]);openPanel(false)}
    else if(g.value.trim()&&/goo\.gl|maps\.app/.test(g.value))setMsg("Ese enlace corto no lleva las coordenadas. En Google Maps mantén pulsado el punto y copia los números que salen arriba.");
  });

  /* ---------- días ---------- */
  function addDays(s,n){var p=s.split("-").map(Number),d=new Date(Date.UTC(p[0],p[1]-1,p[2]+n));return d.toISOString().slice(0,10)}
  function dayLabel(ds){
    var loc={es:"es-ES",en:"en-GB",ca:"ca-ES",de:"de-DE"}[lang()],p=ds.split("-").map(Number),d=new Date(Date.UTC(p[0],p[1]-1,p[2],12));
    var i=Math.round((d-new Date(Date.UTC.apply(null,todayStr().split("-").map(function(v,j){return j===1?v-1:+v}))))/864e5-0.5);
    if(ds===addDays(todayStr(),1))return TR("Mañana");
    var s=new Intl.DateTimeFormat(loc,{weekday:"short",day:"numeric",timeZone:"UTC"}).format(d).replace(".","");return s.charAt(0).toUpperCase()+s.slice(1);
  }
  function drawDays(){
    var base=todayStr(),loc={es:"es-ES",en:"en-GB",ca:"ca-ES",de:"de-DE"}[lang()],h="";
    for(var i=0;i<7;i++){
      var ds=addDays(base,i),p=ds.split("-").map(Number),d=new Date(Date.UTC(p[0],p[1]-1,p[2],12));
      var top=i===0?"Hoy":i===1?"Mañana":new Intl.DateTimeFormat(loc,{weekday:"short",timeZone:"UTC"}).format(d).replace(".","");
      var num=new Intl.DateTimeFormat(loc,{day:"numeric",month:"short",timeZone:"UTC"}).format(d).replace(".","");
      h+='<button type="button" class="tw-day'+(ds===st.day?" on":"")+'" data-d="'+ds+'"><b>'+esc(top)+'</b><small>'+esc(num)+'</small></button>';
    }
    $("#tw-days").innerHTML=h;
  }
  $("#tw-days").addEventListener("click",function(e){var b=e.target.closest(".tw-day");if(!b)return;st.day=b.dataset.d;render();drawHours()});

  /* ---------- cielo ---------- */
  var SKY=[[-90,"#020308","#060a18"],[-12,"#03050d","#0a1430"],[-6,"#0a1838","#1f3c78"],[-3,"#152c66","#4f5fa8"],[1,"#2a2858","#d0733a"],[5,"#1f3a78","#e0a050"],[12,"#123d80","#3f86cc"],[90,"#0c3a80","#3a8ad8"]];
  function hex(h){return [1,3,5].map(function(i){return parseInt(h.substr(i,2),16)})}
  function mix(a,b,k){a=hex(a);b=hex(b);return "rgb("+a.map(function(v,i){return Math.round(v+(b[i]-v)*k)}).join(",")+")"}
  function sky(alt){
    for(var i=0;i<SKY.length-1;i++){var a=SKY[i],b=SKY[i+1];if(alt<=b[0]){var k=(alt-a[0])/(b[0]-a[0]);return [mix(a[1],b[1],k),mix(a[2],b[2],k)]}}
    return [SKY[SKY.length-1][1],SKY[SKY.length-1][2]];
  }
  function phase(alt){return alt<-6?"Noche":alt<-4?"Hora azul":alt<6?(alt<0?"Hora azul":"Hora dorada"):"De día"}

  function tempAt(d){
    if(!wx||!(d instanceof Date)||isNaN(d))return null;
    var p=madridParts(new Date(d.getTime()+30*6e4)),k=p.year+"-"+p.month+"-"+p.day+"T"+p.hour+":00";
    var i=wx.hourly.time.indexOf(k);if(i<0)return null;
    var v=wx.hourly.temperature_2m[i];return v==null?null:Math.round(v);
  }
  /* ---------- arco del sol ---------- */
  function drawDial(T,at,pos,peak){
    var svg=document.getElementById("tw-dial");if(!svg)return;
    var HZ=228,TOP=40,L=34,R=566,MIN=-9,k=(HZ-TOP)/peak;
    var ok=function(d){return d instanceof Date&&!isNaN(d)};
    var a0=ok(T.sun.rise)?T.sun.rise.getTime()-90*6e4:T.noon.getTime()-8*36e5;
    var a1=ok(T.sun.set)?T.sun.set.getTime()+90*6e4:T.noon.getTime()+8*36e5;
    var X=function(ms){return L+(ms-a0)/(a1-a0)*(R-L)};
    var Y=function(alt){return alt>=0?HZ-alt*k:HZ-Math.max(MIN,alt)*2.2};
    var col=function(alt){return alt<-6?"night":alt<-4?"blue":alt<6?(alt<0?"blue":"gold"):"day"};
    var segs=[],cur=null,step=5*6e4,today=st.day===todayStr(),nowMs=Date.now();
    for(var ms=a0;ms<=a1+1;ms+=step){
      var al=sunPos(new Date(ms),st.lat,st.lng).alt,c=col(al)+(today&&ms>nowMs?" fut":""),pt=X(ms).toFixed(1)+","+Y(al).toFixed(1);
      if(!cur||cur.c!==c){if(cur)cur.p.push(pt);cur={c:c,p:[pt]};segs.push(cur)}else cur.p.push(pt);
    }
    var h='<defs><radialGradient id="tw-glow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>';
    h+='<line class="tw-hz" x1="'+L+'" x2="'+R+'" y1="'+HZ+'" y2="'+HZ+'"/>';
    segs.forEach(function(sg){h+='<polyline class="tw-arc '+sg.c+'" points="'+sg.p.join(" ")+'"/>'});
    [[T.sun.rise,"rise"],[T.noon,"noon"],[T.sun.set,"set"]].forEach(function(m){
      if(!ok(m[0]))return;var x=X(m[0].getTime());
      h+='<line class="tw-tick" x1="'+x.toFixed(1)+'" x2="'+x.toFixed(1)+'" y1="'+(HZ-7)+'" y2="'+(HZ+7)+'"/>'+
         '<image href="tw-i-'+m[1]+'.webp" x="'+(x-17).toFixed(1)+'" y="'+(HZ+28)+'" width="34" height="30" preserveAspectRatio="xMidYMid meet"/>'+
         '<text class="tw-tt" x="'+x.toFixed(1)+'" y="'+(HZ+80)+'" text-anchor="middle">'+hm(m[0])+'</text>';
    });
    var tm=at.getTime(),mx=X(Math.min(a1,Math.max(a0,tm))),my=Y(pos.alt),night=pos.alt<-5;
    var isToday=st.day===todayStr();
    if(isToday)h+='<text class="tw-ph'+(night?' n':'')+'" x="300" y="'+(HZ-112)+'" text-anchor="middle">'+esc(TR(phase(pos.alt)).toUpperCase())+'</text>';
    h+='<text class="tw-big" x="300" y="'+(HZ-50)+'" text-anchor="middle">'+(isToday?hm(new Date()):esc(dayLabel(st.day)))+'</text>';
    if(night){var sd=7;for(var q=0;q<26;q++){sd=(sd*9301+49297)%233280;var sx=20+sd/233280*560;sd=(sd*9301+49297)%233280;var sy=10+sd/233280*150;sd=(sd*9301+49297)%233280;h+='<circle class="tw-star" cx="'+sx.toFixed(0)+'" cy="'+sy.toFixed(0)+'" r="'+(0.8+sd/233280*1.4).toFixed(1)+'"/>'}}
    if(night)h+='<image href="tw-i-blue.webp" x="'+(R-58)+'" y="18" width="48" height="48" preserveAspectRatio="xMidYMid meet"/>';
    else h+='<circle cx="'+mx.toFixed(1)+'" cy="'+my.toFixed(1)+'" r="46" fill="url(#tw-glow)"/><image href="tw-sun.webp" x="'+(mx-24).toFixed(1)+'" y="'+(my-24).toFixed(1)+'" width="48" height="48" preserveAspectRatio="xMidYMid meet"/>';
    svg.innerHTML=h;
  }

  /* ---------- pintar ---------- */
  var T0=null;
  function render(){
    var p=st.day.split("-").map(Number),noon=madridInstant(p[0],p[1],p[2],12,0);
    var T=sunTimes(noon,st.lat,st.lng);T0=T;
    var isToday=st.day===todayStr(),now=new Date();
    var at=isToday?now:T.noon,pos=sunPos(at,st.lat,st.lng),peak=Math.max(5,sunPos(T.noon,st.lat,st.lng).alt);
    $("#tw-name").textContent=TN(st.name);
    // cielo y sol
    var scr=$("#tw-screen"),c=sky(pos.alt);
    scr.style.setProperty("--s1",c[0]);scr.style.setProperty("--s2",c[1]);
    drawDial(T,at,pos,peak);
    scr.classList.toggle("night",pos.alt<-5);
    // estado
    var tn=tempAt(isToday?now:T.noon);
    $("#tw-now").innerHTML=(tn!=null?tn+" °C · ":"")+(isToday?
      (pos.alt<0?"<span>Sol</span> <span>bajo el horizonte</span>":"<span>Sol</span> <span>hacia el</span> "+compass(pos.az)):
      "<span>Mediodía solar</span> "+hm(T.noon));
    // horario
    var az=function(d){var v=tempAt(d);return v!=null?" · "+v+" °C":""};
    var mins=Math.round((T.sun.set-T.sun.rise)/6e4);
    var cells=[
      ["rise","Salida del sol","",hm(T.sun.rise)+az(T.sun.rise),T.sun.rise,T.sun.rise],
      ["set","Puesta del sol","",hm(T.sun.set)+az(T.sun.set),T.sun.set,T.sun.set],
      ["noon","Mediodía solar","",hm(T.noon)+az(T.noon),T.noon,T.noon],
      ["sun","Luz de día","",isNaN(mins)?"—":Math.floor(mins/60)+" h "+(mins%60)+" min",null,null],
      ["gold","Hora dorada","mañana",hm(T.sun.rise)+"–"+hm(T.gold.rise),T.sun.rise,T.gold.rise],
      ["gold","Hora dorada","tarde",hm(T.gold.set)+"–"+hm(T.sun.set),T.gold.set,T.sun.set],
      ["blue","Hora azul","mañana",hm(T.civil.rise)+"–"+hm(T.blue.rise),T.civil.rise,T.blue.rise],
      ["blue","Hora azul","tarde",hm(T.blue.set)+"–"+hm(T.civil.set),T.blue.set,T.civil.set]];
    $("#tw-times").innerHTML=cells.map(function(c){
      var on=isToday&&c[4]&&c[5]&&c[4]!==c[5]&&now>=c[4]&&now<=c[5];
      var ic=c[0]==="sun"?'<img class="tw-ic" src="tw-sun.webp" alt="">':I(c[0]);
      return '<div class="tw-t'+(on?" on":"")+(c[0]==="gold"?" g":c[0]==="blue"?" b":c[0]==="rise"||c[0]==="set"?" h":" n")+'">'+ic+
        '<span class="tw-tl"><span>'+c[1]+'</span>'+(c[2]?' <small><span>'+c[2]+'</span></small>':'')+'</span>'+
        '<b class="tw-tv">'+c[3]+'</b></div>';
    }).join("");
    // enlaces
    var la=st.lat.toFixed(4),lo=st.lng.toFixed(4);
    $("#tw-windy").href="https://www.windy.com/"+la+"/"+lo+"?wind,"+la+","+lo+",11";
    $("#tw-route").href="https://www.google.com/maps/dir/?api=1&destination="+la+","+lo;
    $("#tw-food").href="https://www.google.com/maps/search/bares+y+restaurantes/@"+la+","+lo+",15z";
    drawDays();
    if(window.LCI)LCI.refresh(w);
  }

  /* ---------- previsión (Open-Meteo) ---------- */
  var wx=null,wxKey="",wxErr=false;
  function loadWx(){
    var key=st.lat.toFixed(3)+","+st.lng.toFixed(3);
    if(wx&&wxKey===key){drawHours();return}
    wxKey=key;wx=null;wxErr=false;drawHours();
    var u="https://api.open-meteo.com/v1/forecast?latitude="+st.lat.toFixed(4)+"&longitude="+st.lng.toFixed(4)+
      "&hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_10m,wind_gusts_10m,wind_direction_10m,cloud_cover"+
      "&timezone=Europe%2FMadrid&forecast_days=7&wind_speed_unit=kmh";
    var ctl=window.AbortController?new AbortController():null;var to=setTimeout(function(){if(ctl)ctl.abort()},9000);
    fetch(u,ctl?{signal:ctl.signal}:{}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){
      clearTimeout(to);if(wxKey!==key)return;wx=j;render();drawHours();
    }).catch(function(){clearTimeout(to);if(wxKey!==key)return;wxErr=true;drawHours()});
  }
  function arrow(dir){return '<svg class="tw-arr" viewBox="0 0 24 24" style="transform:rotate('+((dir+180)%360)+'deg)" aria-hidden="true"><path d="M12 3l6 15-6-4-6 4z" fill="currentColor"/></svg>'}
  function drawHours(){
    var sum=$("#tw-sum"),box=$("#tw-hours");
    if(!wx){
      sum.innerHTML="";
      box.innerHTML='<p class="tw-empty">'+(wxErr?'<span>No se ha podido cargar la previsión.</span><br><small><span>En esta vista previa no se puede; en lightingcrewmallorca.com sí funciona.</span></small>':'<span>Cargando previsión…</span>')+'</p>';
      if(window.LCI)LCI.refresh(w);return;
    }
    var H=wx.hourly,idx=[],nowH=madridParts(new Date()),nowKey=nowH.year+"-"+nowH.month+"-"+nowH.day+"T"+nowH.hour+":00";
    for(var i=0;i<H.time.length;i++){if(H.time[i].slice(0,10)===st.day){var hh=+H.time[i].slice(11,13);if(hh>=5)idx.push(i)}}
    if(!idx.length){sum.innerHTML="";box.innerHTML='<p class="tw-empty"><span>Todavía no hay previsión para este día.</span></p>';if(window.LCI)LCI.refresh(w);return}
    var tmax=-99,tmin=99,pmax=0,gmax=0;
    idx.forEach(function(i){tmax=Math.max(tmax,H.temperature_2m[i]);tmin=Math.min(tmin,H.temperature_2m[i]);pmax=Math.max(pmax,H.precipitation_probability[i]||0);gmax=Math.max(gmax,H.wind_gusts_10m[i]||0)});
    sum.innerHTML=
      '<div class="tw-s">'+I("temp")+'<span class="tw-sl"><span>Máx.</span> / <span>Mín.</span></span><b>'+Math.round(tmax)+'° / '+Math.round(tmin)+'°</b></div>'+
      '<div class="tw-s">'+I("rain")+'<span class="tw-sl"><span>Lluvia</span></span><b>'+Math.round(pmax)+' %</b></div>'+
      '<div class="tw-s">'+I("wind")+'<span class="tw-sl"><span>Rachas</span></span><b>'+Math.round(gmax)+' km/h</b></div>';
    var C=50,n=idx.length,W=n*C,Ht=300,T1=66,T2=150,R1=186,R2=236,nowX=null;
    var tv=idx.map(function(i){return H.temperature_2m[i]}),lo=Math.min.apply(null,tv),hi=Math.max.apply(null,tv);if(hi-lo<4){hi+=2;lo-=2}
    var px=function(k){return k*C+C/2},py=function(v){return T2-(v-lo)/(hi-lo)*(T2-T1)};
    var pts=tv.map(function(v,k){return [px(k),py(v)]});
    var path="M"+pts[0][0]+","+pts[0][1];
    for(var k=0;k<pts.length-1;k++){var p0=pts[k-1]||pts[k],p1=pts[k],p2=pts[k+1],p3=pts[k+2]||p2;
      path+=" C"+(p1[0]+(p2[0]-p0[0])/6).toFixed(1)+","+(p1[1]+(p2[1]-p0[1])/6).toFixed(1)+" "+(p2[0]-(p3[0]-p1[0])/6).toFixed(1)+","+(p2[1]-(p3[1]-p1[1])/6).toFixed(1)+" "+p2[0]+","+p2[1]}
    var g='<defs><linearGradient id="tw-tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6b24c" stop-opacity=".35"/><stop offset="1" stop-color="#e6b24c" stop-opacity="0"/></linearGradient></defs>';
    idx.forEach(function(i,k){if(H.time[i]===nowKey)nowX=px(k)});
    if(nowX!=null)g+='<rect class="tw-cnow" x="'+(nowX-C/2)+'" y="0" width="'+C+'" height="'+Ht+'" rx="10"/>';
    idx.forEach(function(i,k){if(k%2===0&&H.time[i]!==nowKey)g+='<line class="tw-cgrid" x1="'+px(k)+'" x2="'+px(k)+'" y1="34" y2="'+(R2)+'"/>'});
    g+='<path d="'+path+' L'+pts[pts.length-1][0]+','+T2+' L'+pts[0][0]+','+T2+' Z" fill="url(#tw-tg)"/>';
    g+='<path class="tw-cline" d="'+path+'"/>';
    idx.forEach(function(i,k){
      var x=px(k),v=tv[k],pr=H.precipitation_probability[i]||0,bh=pr/100*(R2-R1),isNow=H.time[i]===nowKey;
      g+='<text class="tw-chh'+(isNow?' on':'')+'" x="'+x+'" y="22">'+(isNow?esc(TR("Ahora")):H.time[i].slice(11,13)+'h')+'</text>';
      g+='<circle class="tw-cdot" cx="'+x+'" cy="'+pts[k][1].toFixed(1)+'" r="3.5"/>';
      g+='<text class="tw-ctv" x="'+x+'" y="'+(pts[k][1]-11).toFixed(1)+'">'+Math.round(v)+'°</text>';
      g+='<rect class="tw-crb'+(pr>=40?' hi':'')+'" x="'+(x-11)+'" y="'+(R2-Math.max(2,bh)).toFixed(1)+'" width="22" height="'+Math.max(2,bh).toFixed(1)+'" rx="4"/>';
      g+='<text class="tw-crt'+(pr>=40?' hi':'')+'" x="'+x+'" y="'+(R2+18)+'">'+pr+'%</text>';
      g+='<g transform="translate('+x+','+(R2+40)+') rotate('+(((H.wind_direction_10m[i]||0)+180)%360)+')"><path class="tw-carr" d="M0,-8 L5,6 L0,3 L-5,6 Z"/></g>';
      g+='<text class="tw-cw" x="'+x+'" y="'+(R2+62)+'">'+Math.round(H.wind_speed_10m[i])+'<tspan class="tw-cg"> / '+Math.round(H.wind_gusts_10m[i])+'</tspan></text>';
    });
    box.innerHTML='<div class="tw-chart"><svg width="'+W+'" height="'+Ht+'" viewBox="0 0 '+W+' '+Ht+'">'+g+'</svg></div>'+
      '<div class="tw-legend"><span>'+I("temp")+'<span>Temperatura</span></span><span>'+I("rain")+'<span>Lluvia</span></span><span>'+I("wind")+'<span>Viento / rachas (km/h)</span></span></div>';
    var ch=box.querySelector(".tw-chart");
    if(nowX!=null)ch.scrollLeft=nowX-ch.clientWidth/2;else ch.scrollLeft=0;
    if(window.LCI)LCI.refresh(w);
  }

  render();loadWx();
  setInterval(function(){if(!document.hidden&&w.offsetParent&&st.day===todayStr())render()},60000);
  if(window.LCI)LCI.onLang(function(){render();drawHours()});
})();
