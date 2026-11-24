/* ===== Descargar los dos archivos grandes de la web (solo dentro de claude.ai) ===== */
(function(){
  var BIG=["index.html","zombies.html"],box=null;
  function ui(){
    if(box)return;
    box=document.createElement("div");
    box.setAttribute("style","position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.75);font-family:system-ui,sans-serif");
    box.innerHTML='<div style="width:min(92vw,420px);padding:24px;border-radius:18px;background:#10131b;border:1px solid #2a3040;color:#eee;text-align:center">'+
      '<h3 style="margin:0 0 8px;font-size:20px">Descargar la web</h3>'+
      '<p id="lx-msg" style="margin:0 0 16px;color:#aab;font-size:14px;line-height:1.4">Descarga los dos archivos y guárdalos en Archivos.</p>'+
      BIG.map(function(f){return '<button data-f="'+f+'" type="button" style="display:block;width:100%;margin:0 0 10px;min-height:48px;border:0;border-radius:999px;background:#e6b24c;color:#151007;font-weight:700;font-size:16px">⬇ '+f+'</button>'}).join("")+
      '<button id="lx-x" type="button" style="min-height:44px;padding:8px 18px;border:1px solid #445;border-radius:999px;background:none;color:#ccd;font-size:15px">Cerrar</button></div>';
    document.body.appendChild(box);
    var msg=box.querySelector("#lx-msg");
    box.querySelector("#lx-x").onclick=function(){box.remove();box=null};
    box.querySelectorAll("[data-f]").forEach(function(b){b.onclick=async function(){
      var f=b.dataset.f;
      try{
        msg.textContent="Preparando "+f+"…";
        var dl=await claude.use("downloads");if(!dl){msg.textContent="Aquí no se puede descargar.";return}
        var r=await fetch(f,{cache:"no-store"});if(!r.ok)throw new Error(r.status);
        var blob=await r.blob();
        await dl.save({filename:f,data:blob});
        b.textContent="✓ "+f;msg.textContent=f+" listo.";
      }catch(e){msg.textContent="Error con "+f+": "+(e&&(e.code||e.message)||e)}
    }});
  }
  if(window.claude&&claude.use)claude.use("downloads").then(function(dl){
    if(!dl)return;var ft=document.querySelector("footer");if(!ft||document.getElementById("lx-link"))return;
    var a=document.createElement("button");a.id="lx-link";a.type="button";a.textContent="⬇ Descargar la web";
    a.setAttribute("style","display:block;margin:10px auto 0;padding:8px 14px;border:1px solid #445;border-radius:999px;background:none;color:#aab;font:13px system-ui,sans-serif;cursor:pointer");
    a.onclick=ui;ft.appendChild(a);
  });
})();
