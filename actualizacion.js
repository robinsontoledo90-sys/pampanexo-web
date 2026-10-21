/* PAMPANEXO · actualización compartida de contenidos públicos.
   Se ejecuta solo al abrir la web con conexión. No recopila ni transmite datos
   de clientes, credenciales, órdenes ni borradores locales. */
(()=>{
  "use strict";
  if(!("serviceWorker" in navigator))return;
  let running=false, lastCheck=0, timer=null;
  const updateInfo=document.createElement("span");
  updateInfo.id="pxOfflineUpdateInfo";
  updateInfo.setAttribute("role","status");
  updateInfo.setAttribute("aria-live","polite");
  updateInfo.style.cssText="font:600 11px/1.4 system-ui,sans-serif;letter-spacing:.015em;color:inherit;opacity:.8";
  function show(msg){updateInfo.textContent=msg}
  function installLabel(){
    const place=document.getElementById("pxOfflineBar")||document.getElementById("status")||document.querySelector("footer");
    if(place){place.appendChild(updateInfo);return;}
    const footer=document.createElement("div");footer.style.cssText="padding:9px 16px;background:#10334b;color:white;text-align:center";
    footer.appendChild(updateInfo);document.body.appendChild(footer);
  }
  function askRefresh(worker){
    return new Promise((resolve,reject)=>{
      const mc=new MessageChannel();
      const timeout=setTimeout(()=>{mc.port1.close();reject(new Error("La actualización tardó demasiado"));},25000);
      mc.port1.onmessage=e=>{
        clearTimeout(timeout);mc.port1.close();
        if(e.data&&e.data.ok)resolve(e.data);
        else reject(new Error((e.data&&e.data.error)||"No se completó la actualización"));
      };
      worker.postMessage({type:"PX_REFRESH_OFFLINE_ASSETS"},[mc.port2]);
    });
  }
  async function check(force=false){
    if(running||!navigator.onLine)return;
    const now=Date.now();
    if(!force&&now-lastCheck<30000)return;
    lastCheck=now;running=true;show("Actualizando contenido para uso sin internet…");
    try{
      const reg=await navigator.serviceWorker.register("./sw.js",{scope:"./"});
      await reg.update();
      const ready=await navigator.serviceWorker.ready;
      const worker=ready.active||reg.active||navigator.serviceWorker.controller;
      if(!worker)throw new Error("Servicio sin conexión no disponible");
      await askRefresh(worker);
      show("Versión online y sin conexión actualizada en este dispositivo");
    }catch(err){
      show("Versión online disponible · Actualización sin conexión pendiente");
    }finally{running=false}
  }
  function schedule(){
    clearTimeout(timer);
    timer=setTimeout(()=>check(true),750);
  }
  function init(){
    installLabel();
    if(navigator.onLine)check(true);
    else show("Sin conexión · Usando la última versión guardada");
    window.addEventListener("online",schedule);
    window.addEventListener("offline",()=>show("Sin conexión · Usando la última versión guardada"));
    document.addEventListener("visibilitychange",()=>{if(!document.hidden&&navigator.onLine)check()});
    window.addEventListener("pageshow",()=>{if(navigator.onLine)check()});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();