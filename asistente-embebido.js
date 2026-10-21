/* Asistente REBOTECH.IA 3.2 adaptado a PAMPANEXO.
   Orientación local con base de reglas, no IA generativa ni asistencia humana.
   No registra conversaciones, no envía datos de chat ni abre acceso a Supabase. */
(()=>{
"use strict";
if(document.getElementById("pxbot-root"))return;
const KB={"no_enciende":{"nombre":"El computador no enciende","palabras":["no enciende","no prende","no arranca","no hace nada","muerto"],"causas":["Fuente de alimentación defectuosa","Cargador defectuoso","Batería descargada o deteriorada","Botón de encendido defectuoso","Problema en placa madre"],"acciones":["Verificar alimentación eléctrica","Probar cargador o fuente","Desconectar periféricos","Realizar descarga eléctrica","Revisar placa madre"]},"sin_imagen":{"nombre":"El computador enciende pero no muestra imagen","palabras":["sin imagen","no da imagen","pantalla negra","sin señal","no da video","enciende pero no muestra"],"causas":["Cable de video defectuoso","Monitor defectuoso","Memoria RAM con problemas","Tarjeta gráfica defectuosa","Problema en placa madre"],"acciones":["Probar otro cable de video","Probar otro monitor","Retirar y reinstalar memoria RAM","Probar un módulo RAM a la vez","Comprobar tarjeta gráfica"]},"lento":{"nombre":"Computador lento","palabras":["lento","lentitud","se pega","se demora","muy lento"],"causas":["Disco HDD lento o deteriorado","Poca memoria RAM","Poco espacio disponible","Malware","Demasiados programas en segundo plano"],"acciones":["Revisar uso de CPU","Revisar memoria RAM","Comprobar estado del disco","Eliminar programas innecesarios","Evaluar cambio de HDD a SSD"]},"temperatura":{"nombre":"Sobrecalentamiento","palabras":["caliente","se calienta","sobrecalienta","temperatura alta","se apaga por calor"],"causas":["Acumulación de polvo","Pasta térmica deteriorada","Ventilador defectuoso","Mala ventilación","Alta carga del procesador"],"acciones":["Limpiar ventiladores","Limpiar disipador","Comprobar temperaturas","Cambiar pasta térmica","Revisar flujo de aire"]},"reinicios":{"nombre":"Reinicios inesperados","palabras":["reinicia","se reinicia","reinicia solo","pantalla azul","se apaga solo"],"causas":["Sobrecalentamiento","Fuente defectuosa","Memoria RAM defectuosa","Problema de Windows","Controladores defectuosos"],"acciones":["Revisar temperaturas","Comprobar memoria RAM","Revisar fuente de alimentación","Revisar eventos de Windows","Actualizar controladores"]},"windows":{"nombre":"Windows no inicia correctamente","palabras":["windows no inicia","windows no arranca","no entra a windows","error windows","reparación automática","reparacion automatica"],"causas":["Archivos del sistema dañados","Actualización defectuosa","Disco con errores","Problemas de arranque","Controladores defectuosos"],"acciones":["Intentar reparación automática","Iniciar en modo seguro","Comprobar almacenamiento","Reparar archivos del sistema","Evaluar restauración del sistema"]},"internet":{"nombre":"Problema de conexión a Internet","palabras":["sin internet","wifi","wi-fi","no conecta","sin conexión","sin conexion"],"causas":["Router con problemas","Adaptador Wi-Fi","Controlador de red","Configuración IP","Problema del proveedor"],"acciones":["Reiniciar router","Reiniciar adaptador de red","Probar conexión por cable","Actualizar controlador","Revisar configuración IP"]},"bateria":{"nombre":"Problema de batería","palabras":["bateria","batería","no carga","dura poco","problema cargador"],"causas":["Batería deteriorada","Cargador defectuoso","Puerto de carga dañado","Circuito de carga","Problema de software"],"acciones":["Revisar cargador","Comprobar batería","Revisar puerto de carga","Generar informe de batería","Evaluar reemplazo"]},"usb":{"nombre":"Problema con USB","palabras":["usb","pendrive","no reconoce usb","puerto usb","usb no funciona"],"causas":["Puerto USB defectuoso","Controlador USB","Dispositivo USB defectuoso","Problema de alimentación","Problema del sistema"],"acciones":["Probar otro puerto","Probar otro dispositivo","Reiniciar computador","Revisar Administrador de dispositivos","Actualizar controladores"]}};
const style=document.createElement("style");
style.id="pxbot-styles";
style.textContent="\n:where(.pxbot-root,.pxbot-root *){box-sizing:border-box}\n.pxbot-root{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));z-index:2147483000;font:14px/1.5 system-ui,-apple-system,\"Segoe UI\",sans-serif;color:#15354b;pointer-events:none}\n.pxbot-root button,.pxbot-root input{font:inherit;cursor:pointer}\n.pxbot-root button:focus-visible,.pxbot-root input:focus-visible,.pxbot-root a:focus-visible{outline:3px solid #eeb887;outline-offset:2px}\n.pxbot-toggle{pointer-events:auto;display:flex;align-items:center;justify-content:center;gap:10px;border:1px solid #d69b68;border-radius:999px;background:#0f3049;color:#fff;box-shadow:0 8px 26px #04162670;padding:13px 18px;min-height:56px;font-weight:800!important;letter-spacing:.01em;transition:transform .15s}\n.pxbot-toggle:hover{transform:translateY(-2px);background:#16465e}\n.pxbot-toggle span:first-child{font-size:23px;line-height:1}\n.pxbot-toggle small{display:inline-flex;width:8px;height:8px;border-radius:50%;background:#8de2bb;box-shadow:0 0 0 4px #8de2bb25}\n.pxbot-root[data-open=\"true\"] .pxbot-toggle{border-radius:50%;width:52px;height:52px;padding:0;margin:10px 0 0 auto}\n.pxbot-root[data-open=\"true\"] .pxbot-toggle .pxbot-toggle-text,.pxbot-root[data-open=\"true\"] .pxbot-toggle small{display:none}\n.pxbot-window{pointer-events:auto;width:min(398px,calc(100vw - 28px));height:min(584px,calc(100dvh - 100px));max-height:calc(100dvh - 102px);border:1px solid #bccfda;border-radius:17px;overflow:hidden;box-shadow:0 18px 70px #061b3080;background:#fff;display:flex;flex-direction:column}\n.pxbot-window[hidden]{display:none!important}\n.pxbot-head{flex:none;display:flex;align-items:center;gap:11px;padding:17px 15px;background:linear-gradient(110deg,#0b2c45,#13425b);color:white;border-bottom:3px solid #c48759}\n.pxbot-monogram{width:45px;height:45px;display:grid;place-items:center;border:1px solid #b18e6e;border-radius:11px;background:#ffffff0c;color:#f4bf92;font-size:17px;font-weight:900;letter-spacing:-.02em}\n.pxbot-head-title{flex:1;min-width:0}\n.pxbot-head-title strong{display:block;font-size:15px;font-weight:850;letter-spacing:.02em}\n.pxbot-head-title small{color:#bed7df;font-size:10px;letter-spacing:.02em}\n.pxbot-close{border:1px solid #ffffff43;background:#ffffff12;color:white;border-radius:9px;width:33px;height:33px;font-size:22px;line-height:1;padding:0;display:grid;place-items:center}\n.pxbot-disclaimer{flex:none;margin:0;background:#f8f6f1;border-bottom:1px solid #ebdfd0;padding:9px 14px;font-size:11px;color:#795c42;line-height:1.4}\n.pxbot-feed{flex:1;min-height:0;overflow-y:auto;background:linear-gradient(180deg,#f6f9fb,#fbfdfe);padding:14px 12px;display:flex;flex-direction:column;gap:11px;overscroll-behavior:contain}\n.pxbot-message{max-width:91%;border-radius:13px;padding:11px 13px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;line-height:1.57}\n.pxbot-message--assistant{align-self:flex-start;border:1px solid #dce7ef;background:#fff;border-bottom-left-radius:4px;color:#234258}\n.pxbot-message--user{align-self:flex-end;background:#0e3e57;color:#fff;border-bottom-right-radius:4px}\n.pxbot-shortcuts{flex:none;display:flex;gap:7px;padding:9px 12px 0;overflow-x:auto;background:white;scrollbar-width:thin}\n.pxbot-shortcuts button{flex:none;border:1px solid #d5e4e9;color:#245268;background:#f4f9fb;font-size:11px;font-weight:750;border-radius:999px;padding:8px 10px;white-space:nowrap}\n.pxbot-shortcuts button:hover{background:#e5f5ee;border-color:#97cdbb}\n.pxbot-compose{flex:none;display:flex;gap:8px;padding:11px 12px;border-top:1px solid #e4edf3;background:#fff}\n.pxbot-input{flex:1;min-width:0;border:1px solid #c6d7e1;border-radius:9px;padding:11px!important;font-size:13px!important;color:#18394c;background:#fff;line-height:1.4}\n.pxbot-send{border:0;border-radius:9px;background:#0d354d;color:#fff;padding:9px 14px;font-weight:800!important}\n.pxbot-send:hover{background:#19516b}\n.pxbot-actions{padding:0 12px 12px;background:#fff;display:flex;justify-content:space-between;gap:8px}\n.pxbot-actions a{font-size:11px;color:#2e596c;font-weight:750;text-decoration:underline;text-underline-offset:3px}\n.pxbot-actions a:hover{color:#a76b3f}\n@media(max-width:620px){\n.pxbot-root{right:12px;bottom:max(12px,env(safe-area-inset-bottom))}\n.pxbot-toggle{min-height:52px;padding:11px 14px;font-size:13px!important}\n.pxbot-root[data-open=\"true\"]{left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;align-items:end}\n.pxbot-window{width:100%;height:min(610px,calc(100dvh - 85px));max-height:calc(100dvh - 84px)}\n.pxbot-feed{padding:12px 10px}\n}\n@media(prefers-reduced-motion:reduce){.pxbot-toggle{transition:none}}\n";
document.head.append(style);
const wrap=document.createElement("aside");
wrap.id="pxbot-root";wrap.className="pxbot-root";wrap.dataset.open="false";wrap.setAttribute("aria-label","Asistente técnico PAMPANEXO");
const button=document.createElement("button");
button.className="pxbot-toggle";button.type="button";button.setAttribute("aria-expanded","false");button.setAttribute("aria-controls","pxbot-window");
const ico=document.createElement("span");ico.textContent="◉";ico.setAttribute("aria-hidden","true");
const bt=document.createElement("span");bt.className="pxbot-toggle-text";bt.textContent="Asistente técnico";
const status=document.createElement("small");status.setAttribute("aria-label","Disponible");
button.append(ico,bt,status);
const panel=document.createElement("section");panel.id="pxbot-window";panel.className="pxbot-window";panel.hidden=true;
panel.setAttribute("role","region");panel.setAttribute("aria-label","Chat de orientación informática");
const head=document.createElement("header");head.className="pxbot-head";
const badge=document.createElement("span");badge.className="pxbot-monogram";badge.textContent="PX";
const ident=document.createElement("div");ident.className="pxbot-head-title";
const name=document.createElement("strong");name.textContent="PAMPANEXO";
const sub=document.createElement("small");sub.textContent="ASISTENTE TÉCNICO · DEMOSTRACIÓN";
ident.append(name,sub);
const close=document.createElement("button");close.type="button";close.className="pxbot-close";close.setAttribute("aria-label","Cerrar chat");close.textContent="×";
head.append(badge,ident,close);
const disclaimer=document.createElement("p");disclaimer.className="pxbot-disclaimer";
disclaimer.textContent="Orientación automática básica. No equivale a un diagnóstico presencial. No compartas información personal ni contraseñas.";
const feed=document.createElement("div");feed.className="pxbot-feed";feed.setAttribute("role","log");feed.setAttribute("aria-label","Conversación de orientación");
feed.setAttribute("aria-live","polite");
const shortcuts=document.createElement("div");shortcuts.className="pxbot-shortcuts";
const promptButtons=[
["No enciende","Mi notebook no enciende"],
["Está lento","Mi computador está muy lento"],
["No da imagen","Mi PC enciende pero no da imagen"],
["Recuperar equipo","Quiero reparar o reutilizar un computador"],
["Seguimiento","Cómo puedo ver el estado de mi equipo"]
];
const form=document.createElement("form");form.className="pxbot-compose";
const input=document.createElement("input");input.className="pxbot-input";input.type="text";input.placeholder="¿Qué problema tiene tu equipo?";input.autocomplete="off";input.maxLength=600;input.setAttribute("aria-label","Escribe tu consulta");
const send=document.createElement("button");send.className="pxbot-send";send.type="submit";send.textContent="Enviar";form.append(input,send);
const actions=document.createElement("nav");actions.className="pxbot-actions";actions.setAttribute("aria-label","Más información");
for(const [label,href] of [["Consultar orden","./seguimiento.html"],["Evaluar equipo","./index.html#contacto"],["Asistente completo","./demo-chatbot.html"]]){
const a=document.createElement("a");a.href=href;a.textContent=label;actions.append(a);
}
panel.append(head,disclaimer,feed,shortcuts,form,actions);
wrap.append(panel,button);document.body.append(wrap);
function message(isUser,text){
const m=document.createElement("div");
m.className="pxbot-message "+(isUser?"pxbot-message--user":"pxbot-message--assistant");
m.textContent=text;feed.append(m);
while(feed.children.length>50)feed.firstElementChild.remove();
feed.scrollTop=feed.scrollHeight;
}
function normalize(text){return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim()}
function detect(text){
const lower=normalize(text);let best=null,scoreMax=0;
for(const topic of Object.values(KB)){
let score=0;
for(const term of topic.palabras){if(lower.includes(normalize(term)))score+=term.length;}
if(score>scoreMax){scoreMax=score;best=topic}
}
return best;
}
function answer(text){
const t=normalize(text);
if(!t)return "Cuéntame qué ocurre con tu equipo y te daré una orientación inicial.";
if(/(recicl|reutiliz|reacondicion|segunda vida|recuper|en desuso|desechar|chatarra|electronico)/.test(t))
return "♻ Segunda vida tecnológica\n\nEn PAMPANEXO evaluamos si un computador, periférico o componente puede repararse o reutilizarse antes de desecharlo.\n\n1. Cuéntanos qué equipo tienes y cuál es su estado.\n2. Podemos evaluar opciones de reparación, actualización o aprovechamiento de piezas cuando sea seguro.\n3. Si ya no se puede recuperar, orientamos sobre disposición con gestores autorizados.\n\nPuedes solicitar una evaluación en la sección Contacto. La recuperación depende de cada caso.";
if(/(seguimiento|estado.*orden|estado.*pedido|codigo|código|pasaporte|qr\b)/.test(t))
return "▤ Seguimiento y Pasaporte Tecnológico\n\nSi ya recibiste un código de servicio, entra en «Consultar orden» y escríbelo para ver el estado publicado. El QR de tu orden abre esa misma consulta.\n\nEn el Pasaporte Tecnológico podrás consultar únicamente las intervenciones que PAMPANEXO haya compartido.";
if(/(contacto|contactar|cotiz|precio|presupuesto|hablar.*tecnic|atenci[oó]n)/.test(t))
return "Puedo orientarte con problemas informáticos habituales, pero no envío mensajes ni cotizaciones.\n\nPara solicitar una evaluación o consultar por un servicio, utiliza «Evaluar equipo» y completa los medios de contacto disponibles en la página.";
if(/(hum[oó]|chisp|fuego|quemad|electric|descarga)/.test(t))
return "⚠️ Por seguridad, deja de utilizar el equipo si desprende humo, chispas, olor a quemado o presenta un riesgo eléctrico. Desconéctalo solo si puedes hacerlo sin peligro. No abras la fuente de alimentación ni manipules componentes energizados. Solicita revisión técnica.";
const d=detect(text);
if(!d)return "Para orientarte mejor, dime:\n\n• ¿El equipo enciende?\n• ¿Aparece imagen?\n• ¿Se reinicia o se calienta?\n• ¿Windows inicia correctamente?\n\nPuedes elegir una consulta rápida arriba. Esto es una orientación preliminar.";
const avoid=/descarga electrica|revisar placa madre|revisar fuente|revisar fuentes|abrir equipo/i;
const steps=d.acciones.filter(s=>!avoid.test(normalize(s))).slice(0,3);
return "🔧 "+d.nombre+"\n\nPosibles causas:\n"+d.causas.slice(0,3).map(x=>"• "+x).join("\n")+
"\n\nPrimeras comprobaciones:\n"+steps.map(x=>"✓ "+x).join("\n")+
"\n\nNo reemplaces componentes sin confirmar la causa. Si el problema persiste, solicita una evaluación técnica.";
}
let primed=false;
function openPanel(){
wrap.dataset.open="true";panel.hidden=false;button.setAttribute("aria-expanded","true");button.setAttribute("aria-label","Cerrar asistente");
ico.textContent="×";
if(!primed){
 message(false,"¡Hola! 👋 Soy el asistente técnico de PAMPANEXO.\n\nPuedo ayudarte con fallas comunes, seguimiento y segunda vida tecnológica, incluso sin internet.\n\nCuéntame qué le ocurre a tu equipo.");
 primed=true;
}
input.focus({preventScroll:true});
}
function closePanel(){
wrap.dataset.open="false";panel.hidden=true;button.setAttribute("aria-expanded","false");button.setAttribute("aria-label","Abrir asistente técnico");ico.textContent="◉";button.focus({preventScroll:true})
}
button.addEventListener("click",()=>panel.hidden?openPanel():closePanel());
close.addEventListener("click",closePanel);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)closePanel()});
form.addEventListener("submit",e=>{
e.preventDefault();const t=input.value.trim();if(!t)return;
message(true,t);input.value="";message(false,answer(t));input.focus({preventScroll:true});
});
for(const [label,prompt] of promptButtons){
const b=document.createElement("button");b.type="button";b.textContent=label;
b.addEventListener("click",()=>{input.value=prompt;form.requestSubmit()});shortcuts.append(b);
}
button.setAttribute("aria-label","Abrir asistente técnico");
})();