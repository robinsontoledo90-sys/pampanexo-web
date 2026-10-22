// Comprobación real con Chromium de la portada instalada, chatbot y caché offline.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:8765";
const browser = await chromium.launch({headless:true});
const context = await browser.newContext({serviceWorkers:"allow"});
const page = await context.newPage();
try {
  await page.goto(base + "/index.html", {waitUntil:"domcontentloaded"});
  await page.locator("#pxbot-root").waitFor({timeout:30000});
  await page.waitForFunction(async () =>
    (await caches.keys()).some(name => name === "pampanexo-public-v7-chat-20261022")
    && !!navigator.serviceWorker.controller, null, {timeout:45000});
  console.log("✓ SW activo y archivos públicos cacheados");

  await page.locator("[data-px-open-assistant]").first().evaluate(el => el.click());
  assert.equal(await page.locator("#pxbot-window").isVisible(), true);
  await page.locator(".pxbot-input").fill("mi computador echa humo y quiero reciclarlo");
  await page.locator(".pxbot-input").press("Enter");
  assert.match(await page.locator(".pxbot-message--assistant").last().innerText(), /seguridad|riesgo eléctrico/i);

  await page.locator(".pxbot-clear").click();
  assert.equal(await page.locator(".pxbot-message--user").count(), 0);
  console.log("✓ Respuesta de seguridad y borrado de conversación");

  await context.setOffline(true);
  await page.waitForFunction(() => document.querySelector("#pxbot-root")?.dataset.offline === "true");
  assert.match(await page.locator(".pxbot-net").innerText(), /sin conexión/i);
  const previousUrl = page.url();
  await page.locator('.pxbot-actions a[href*="seguimiento"]').click();
  assert.equal(page.url(), previousUrl);
  assert.match(await page.locator(".pxbot-message--assistant").last().innerText(), /necesita internet/i);

  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator("#pxbot-root").waitFor();
  await page.locator(".pxbot-toggle").click();
  await page.locator(".pxbot-input").fill("mi notebook no enciende");
  await page.locator(".pxbot-input").press("Enter");
  assert.match(await page.locator(".pxbot-message--assistant").last().innerText(), /no enciende/i);
  console.log("✓ Portada offline: chatbot utilizable tras recarga");

  await page.goto(base + "/demo-chatbot.html", {waitUntil:"domcontentloaded"});
  assert.match(await page.locator("#demo-connectivity").innerText(), /Sin conexión/i);
  await page.locator("#chat-input").fill("quiero reutilizar un equipo");
  await page.locator("#chat-input").press("Enter");
  assert.match(await page.locator(".bubble.assistant").last().innerText(), /PAMPANEXO/i);
  console.log("✓ Demo completa accesible sin internet");

  await page.goto(base + "/sin-conexion.html", {waitUntil:"domcontentloaded"});
  assert.equal(await page.locator("#locked").count(), 1);
  await page.goto(base + "/seguimiento.html", {waitUntil:"domcontentloaded"});
  assert.match(await page.locator("body").innerText(), /Sin conexión|Estás sin internet/i);
  console.log("✓ Borradores locales disponibles; seguimiento privado sin caché");

  await context.setOffline(false);
  await page.goto(base + "/index.html", {waitUntil:"domcontentloaded"});
  await page.locator("#pxbot-root").waitFor();
  await page.waitForFunction(() => document.querySelector("#pxbot-root")?.dataset.offline === "false", null, {timeout:15000});
  console.log("✓ Reconexión: orientación online disponible");
} finally {
  await browser.close();
}
