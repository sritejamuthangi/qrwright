import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";

const root = fileURLToPath(new URL("../", import.meta.url));
const artifacts = path.join(root, ".artifacts", "browser");
await mkdir(artifacts, { recursive: true });
const port = Number(process.env.TEST_PORT || 3100);
const origin = `http://localhost:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
  cwd: root, stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, TOKEN_SECRET: "browser-test-secret-not-for-production-0123456789", COUNT_STORE: "memory", TURSO_DATABASE_URL: "", CRON_SECRET: "browser-test-cron" },
});
let logs = "";
server.stdout.on("data", (data) => { logs += data; });
server.stderr.on("data", (data) => { logs += data; });
let browser;
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Server did not start: ${logs}`)), 30_000);
    server.once("exit", (code) => { clearTimeout(timer); reject(new Error(`Server exited ${code}: ${logs}`)); });
    server.stdout.on("data", (data) => { if (/Ready in/.test(String(data))) { clearTimeout(timer); resolve(); } });
  });
  let executablePath = process.env.BROWSER_PATH || chromium.executablePath();
  if (!existsSync(executablePath) && process.platform === "win32") {
    const dir = path.join(homedir(), "AppData", "Local", "ms-playwright");
    const folders = existsSync(dir) ? readdirSync(dir).filter((n) => /^chromium-\d+$/.test(n)).sort().reverse() : [];
    executablePath = folders.map((n) => path.join(dir, n, "chrome-win64", "chrome.exe")).find(existsSync);
  }
  browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const page = await context.newPage();
  page.setDefaultTimeout(20_000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("404")) errors.push(m.text()); });
  const xml = await (await fetch(`${origin}/sitemap.xml`)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(urls.length, 61);
  // Check every public route's response, canonical and title.
  for (let i = 0; i < urls.length; i += 6) {
    await Promise.all(urls.slice(i, i + 6).map(async (url) => {
      const pathname = new URL(url).pathname;
      const response = await fetch(`${origin}${pathname}`);
      assert.equal(response.status, 200, pathname);
      const html = await response.text();
      assert.match(html, /<title>[^<]+<\/title>/, pathname);
      assert.match(html, /<meta name="description" content="[^"]+"/, pathname);
      const canonical = /<link\s+rel="canonical"\s+href="([^"]*)"/.exec(html)?.[1];
      assert.ok(canonical, `Canonical tag missing: ${pathname}`);
      // Next normalises the root path to the bare origin; compare parsed URLs.
      assert.equal(new URL(canonical).href, new URL(url).href, `Canonical: ${pathname}`);
    }));
  }
  for (const route of ["/my-codes", "/p"]) {
    const response = await fetch(`${origin}${route}`);
    assert.match(response.headers.get("x-robots-tag"), /noindex/);
  }
  assert.equal((await fetch(`${origin}/a-page-that-does-not-exist`)).status, 404);
  assert.equal((await fetch(`${origin}/qr-code-generator/not-a-type`)).status, 404);
  assert.equal((await fetch(`${origin}/api/cron/prune`)).status, 401);
  console.log("61 public pages, canonical metadata, noindex and 404 checks passed.");

  await page.goto(origin);
  await page.getByRole("heading", { name: /Make it yours/ }).waitFor();
  await page.screenshot({ path: path.join(artifacts, "home-desktop.png"), fullPage: true });
  await page.goto(`${origin}/qr-code-generator?template=forest`);
  await page.getByLabel("Website address").fill("https://example.com/qrwright-test");
  await page.locator("aside .qr-preview svg").waitFor();
  await page.waitForFunction(() => document.querySelector("aside .qr-preview svg")?.innerHTML.includes("#14532d"));
  await page.getByRole("button", { name: "Scan check", exact: true }).click();
  await page.getByText("Decoded in this browser").waitFor();
  assert.equal(await page.locator("aside .text-danger").count(), 0, "Scan check failure");
  const pngPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG", exact: true }).click();
  const png = await pngPromise;
  const pngPath = path.join(artifacts, "generated-qr.png");
  await png.saveAs(pngPath);
  assert.equal((await readFile(pngPath)).subarray(1, 4).toString(), "PNG");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.getByText("Saved to My codes, in this browser.").waitFor();
  await page.screenshot({ path: path.join(artifacts, "studio-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Mobile studio overflow");
  await page.screenshot({ path: path.join(artifacts, "studio-mobile.png"), fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });

  await page.goto(`${origin}/qr-code-scanner`);
  await page.locator('input[type="file"]').setInputFiles(pngPath);
  await page.getByText("https://example.com/qrwright-test", { exact: true }).waitFor();
  console.log("Template deep-link, live QR rendering, scan checks, PNG export and file scanner passed.");

  await page.goto(`${origin}/my-codes`);
  await page.getByRole("button", { name: "Details & export" }).click();
  await page.getByLabel("Name", { exact: true }).fill("Café नमस्ते");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByText("Changes saved in this browser.").waitFor();
  const pdfPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Print sheet", exact: true }).click();
  const pdf = await pdfPromise;
  const pdfPath = path.join(artifacts, "print-sheet.pdf");
  await pdf.saveAs(pdfPath);
  const document = await PDFDocument.load(await readFile(pdfPath));
  assert.equal(document.getPageCount(), 1);
  const backupPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Backup", exact: true }).click();
  const backup = await backupPromise;
  const backupPath = path.join(artifacts, "backup.json");
  await backup.saveAs(backupPath);
  assert.equal(JSON.parse(await readFile(backupPath, "utf8")).codes[0].title, "Café नमस्ते");
  await page.getByRole("button", { name: "Delete Café नमस्ते", exact: true }).click();
  await page.getByRole("heading", { name: "Your collection starts here." }).waitFor();
  await page.locator('input[type="file"]').setInputFiles(backupPath);
  await page.getByText("1 codes imported. Existing codes kept.").waitFor();
  console.log("IndexedDB save, rename, Unicode print sheets, JSON backup, delete and import passed.");

  await page.goto(`${origin}/barcode-generator/upc-e`);
  await page.getByLabel("Data", { exact: false }).fill("425261");
  await page.locator("aside svg[viewBox]").first().waitFor();
  await page.getByText(/Encoded as UPC-E:.*04252614/).waitFor();
  const barcodePromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "PNG", exact: true }).click();
  const barcode = await barcodePromise;
  await barcode.saveAs(path.join(artifacts, "barcode.png"));
  await page.goto(`${origin}/bulk-qr-code-generator`);
  await page.getByRole("button", { name: "Validate rows" }).click();
  const zipPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download ZIP" }).click();
  const zipDownload = await zipPromise;
  const zipPath = path.join(artifacts, "bulk.zip");
  await zipDownload.saveAs(zipPath);
  const zip = await JSZip.loadAsync(await readFile(zipPath));
  assert.equal(Object.keys(zip.files).filter((n) => n.endsWith(".svg")).length, 2);
  console.log("UPC-E browser rendering/export and bulk CSV-to-ZIP passed.");

  const signing = await fetch(`${origin}/api/sign`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ target: { kind: "url", url: "https://example.com/count-test" } }) });
  assert.equal(signing.status, 200);
  const tracked = await signing.json();
  const trackedPath = new URL(tracked.url).pathname;
  const humanUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1";
  const redirect = await fetch(`${origin}${trackedPath}`, { redirect: "manual", headers: { "user-agent": humanUA } });
  assert.equal(redirect.status, 302); assert.equal(redirect.headers.get("location"), "https://example.com/count-test");
  assert.match(redirect.headers.get("x-robots-tag"), /noindex/);
  await page.waitForFunction(async (id) => (await (await fetch(`/api/count/${id}`)).json()).total === 1, tracked.countId);
  for (const headers of [{ "user-agent": humanUA }, { "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" }, { "user-agent": humanUA, purpose: "prefetch" }]) await fetch(`${origin}${trackedPath}`, { redirect: "manual", headers });
  const stats = await (await fetch(`${origin}/api/stats?id=${tracked.countId}`)).json();
  assert.equal(stats.total, 1); assert.equal(stats.daily.length, 30);
  console.log("Signed redirects, real counters, duplicate suppression, bot/prefetch filtering and daily stats passed.");
  assert.deepEqual(errors, [], "Browser console/page errors");
  console.log(`Browser checks complete. Screenshots and exports: ${artifacts}`);
} catch (e) {
  console.error(logs);
  throw e;
} finally {
  await browser?.close();
  server.kill();
}
