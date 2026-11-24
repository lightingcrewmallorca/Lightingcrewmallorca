/* Traducciones de los añadidos (cartelera, juegos, tiempo).
   El diccionario principal de la web es privado, así que aquí hay uno propio
   que traduce los textos que tengan su clave exacta. Orden: [en, ca, de]. */
(function(){
  var D=window.DICT=window.DICT||{};
  var L=["es","en","ca","de"],ORIG=new WeakMap(),cbs=[],busy=false;
  function lang(){var l=(document.documentElement.lang||"es").slice(0,2);return L.indexOf(l)>-1?l:"es"}
  function tr(s){var l=lang();if(l==="es"||!s)return s;var e=D[s];return e?(e[L.indexOf(l)-1]||s):s}
  function doText(n){
    var p=n.parentElement;if(!p||/SCRIPT|STYLE|TEXTAREA/.test(p.tagName))return;
    var r=ORIG.get(n),cur=n.nodeValue;
    if(!r||cur!==r.out){r={es:cur,out:cur};ORIG.set(n,r)}
    var m=r.es.match(/^(\s*)([\s\S]*?)(\s*)$/),k=m[2];
    if(!D[k]&&r.out===r.es)return;
    var v=m[1]+tr(k)+m[3];
    if(v!==cur){r.out=v;n.nodeValue=v}else r.out=cur;
  }
  function walk(root){
    if(!root)return;
    if(root.nodeType===3){doText(root);return}
    if(root.nodeType!==1||/SCRIPT|STYLE/.test(root.tagName))return;
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),n;
    while((n=w.nextNode()))doText(n);
  }
  var q=[],t=null;
  function flush(){t=null;busy=true;var a=q;q=[];a.forEach(walk);mo.takeRecords();busy=false}
  var mo=new MutationObserver(function(ms){
    if(busy)return;
    ms.forEach(function(m){if(m.type==="childList")m.addedNodes.forEach(function(x){q.push(x)});else if(m.type==="characterData")q.push(m.target)});
    if(!t)t=setTimeout(flush,0);
  });
  function start(){
    mo.observe(document.body,{subtree:true,childList:true,characterData:true});
    new MutationObserver(function(){
      setTimeout(function(){busy=true;walk(document.body);mo.takeRecords();busy=false;cbs.forEach(function(f){try{f(lang())}catch(e){}})},0);
    }).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
    walk(document.body);
  }
  window.LCI={tr:tr,lang:lang,add:function(o){for(var k in o)D[k]=o[k]},onLang:function(f){cbs.push(f)},refresh:function(r){busy=true;walk(r||document.body);mo.takeRecords();busy=false}};
  // orden de los idiomas en la portada: castellano, catalán, inglés, alemán
  function order(){document.querySelectorAll(".lang").forEach(function(g){["es","ca","en","de"].forEach(function(l){var b=g.querySelector('[data-lang="'+l+'"]');if(b)g.appendChild(b)})})}
  if(document.body)order();else document.addEventListener("DOMContentLoaded",order);
  if(document.body)start();else document.addEventListener("DOMContentLoaded",start);
})();
