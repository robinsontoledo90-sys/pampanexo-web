import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const file = name => readFileSync(new URL("../" + name, import.meta.url), "utf8");
const embedded = file("asistente-embebido.js");
const full = file("demo-chatbot.html");
const sw = file("sw.js");
const index = file("index.html");
const manifest = JSON.parse(file("manifest.webmanifest"));

function section(src, start, end) {
  const from = src.indexOf(start);
  const to = src.indexOf(end, from + start.length);
  assert.ok(from !== -1 && to > from, "No se encontró sección: " + start);
  return src.slice(from, to);
}

function localAnswers() {
  const rules = section(embedded, "const KB=", "const style=");
  const fn = section(embedded, "function normalize(", "function updateConnectivity()");
  return vm.runInNewContext(rules + fn + "\nanswer;", {});
}

function fullAnswers() {
  const rules = section(full, "const KB = ", "const heading = ");
  const fn = section(full, "function detect(t)", "function addBubble(");
  return vm.runInNewContext(rules + fn + "\ndiagnose;", {});
}

test("el asistente flotante responde sin red ni acceso a Supabase", () => {
  const answer = localAnswers();
  assert.match(answer("mi notebook no enciende"), /no enciende/i);
  assert.match(answer("reutilizar un computador"), /segunda vida/i);
  assert.match(answer("revisar el estado de mi orden"), /seguimiento/i);
  assert.match(answer("cómo usar sin internet"), /uso sin internet/i);
  assert.doesNotMatch(section(embedded, "function answer(", "function updateConnectivity()"), /fetch\s*\(|supabase\.co/i);
});

test("el aviso de seguridad tiene prioridad sobre reciclaje y seguimiento", () => {
  const compact = localAnswers();
  const expanded = fullAnswers();
  for (const fn of [compact, expanded]) {
    assert.match(fn("mi notebook echa humo, ¿se puede reciclar?"), /seguridad|riesgo eléctrico/i);
    assert.match(fn("chispa eléctrica y quiero seguimiento"), /seguridad|riesgo eléctrico/i);
    assert.match(fn("mi computador está lento"), /lento/i);
  }
});

test("la demostración completa sigue siendo una herramienta local", () => {
  const diagnose = fullAnswers();
  assert.match(diagnose("usar sin internet"), /sin internet/i);
  assert.match(diagnose("reutilización de equipos"), /PAMPANEXO/i);
  assert.match(diagnose("consultar pasaporte QR"), /Seguimiento/i);
  assert.match(full, /datos ficticios/);
  assert.match(full, /updateDemoConnectivity/);
});

test("el chatbot muestra estados sin conexión y permite borrar su conversación", () => {
  assert.match(embedded, /addEventListener\("offline",updateConnectivity\)/);
  assert.match(embedded, /Borrar conversación/);
  assert.match(embedded, /actions\.addEventListener\("click"/);
  assert.match(embedded, /net\.hidden=!offline/);
});

test("la PWA incluye todos los recursos públicos compartidos", () => {
  const assets = section(sw, "const ASSETS = [", "];");
  const pages = section(sw, "const PUBLIC_PAGES = new Set([", "]);");
  for (const name of ["index.html", "demo-chatbot.html", "asistente-embebido.js", "actualizacion.js", "sin-conexion.html", "manifest.webmanifest", "offline.html"]) {
    assert.ok(assets.includes(name), name + " no está precargado");
  }
  for (const name of ["index.html", "demo-chatbot.html", "sin-conexion.html"]) {
    assert.ok(pages.includes(name), name + " no es página offline");
  }
  for (const privatePage of ["gestion.html", "seguimiento.html"]) {
    assert.ok(!assets.includes(privatePage), "No cachear " + privatePage);
    assert.ok(!pages.includes(privatePage), "No autorizar " + privatePage);
  }
  assert.match(sw, /isNavigation && !PUBLIC_PAGES\.has/);
  assert.match(sw, /PX_REFRESH_OFFLINE_ASSETS/);
  assert.ok(index.includes("asistente-embebido.js"), "La portada no carga el asistente");
  assert.ok(index.includes("data-px-open-assistant"), "La portada no abre el asistente");
  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.scope, "./");
  assert.ok(manifest.shortcuts.some(x => x.url === "./demo-chatbot.html"));
});
