import { readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const icon = readFileSync(new URL("../public/icon.svg", import.meta.url), "utf8");
for (const [name, size] of [["apple-icon", 180], ["icon-192", 192], ["icon-512", 512]]) {
  writeFileSync(new URL(`../public/${name}.png`, import.meta.url), new Resvg(icon, { fitTo: { mode: "width", value: size } }).render().asPng());
}
const png = new Resvg(icon, { fitTo: { mode: "width", value: 32 } }).render().asPng();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header[6] = 32; header[7] = 32;
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
writeFileSync(new URL("../src/app/favicon.ico", import.meta.url), Buffer.concat([header, png]));
const mark = icon.replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">', '<svg x="912" y="175" width="200" height="200" viewBox="0 0 32 32">');
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f6f4ee"/><path d="M0 550h1200" stroke="#e2ded3"/><rect x="64" y="78" width="155" height="30" rx="15" fill="#d4f53c"/><g font-family="Arial,sans-serif" fill="#0d0d0e"><text x="81" y="99" font-size="16" font-weight="700">QRWRIGHT</text><text x="64" y="235" font-size="78" font-weight="700">Make it yours.</text><text x="64" y="327" font-size="78" font-weight="700">Make it scan.</text><text x="64" y="400" font-size="27" fill="#57544d">Free QR codes and barcodes.</text><text x="64" y="446" font-size="24" fill="#57544d">No sign-up. No watermark. Made in your browser.</text><text x="64" y="590" font-size="20">qrcode.sritejam.com</text><text x="890" y="590" font-size="20">20 TYPES / 36 DESIGNS</text></g>${mark}</svg>`;
writeFileSync(new URL("../public/og.png", import.meta.url), new Resvg(og).render().asPng());
console.log("Brand icons, favicon and Open Graph image generated.");
