// Canlı önizleme: `npm run dev` → http://localhost:3000
// Dosya kaydedildiğinde siteyi yeniden derler ve açık sayfayı kendiliğinden yeniler.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { olustur } from './olustur.js';

const kok = join(dirname(fileURLToPath(import.meta.url)), '..');
const hedef = join(kok, 'dist');
const PORT = Number(process.env.PORT) || 3000;
const TUR = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4', '.webm': 'video/webm' };
const YENILE = `<script>new EventSource('/__yenile').onmessage=()=>location.reload()</script>`;
const dinleyiciler = new Set();

async function derle() {
  try {
    await olustur(kok, hedef, { taslakGoster: process.env.TASLAK === '1' });
    console.log(`✓ derlendi ${new Date().toLocaleTimeString('tr-TR')}`);
    for (const r of dinleyiciler) r.write('data: yenile\n\n');
  } catch (e) {
    console.error('✗ derleme hatası:\n' + e.message);
  }
}

await derle();
let zamanlayici;
for (const klasor of ['css', 'js', 'data', 'img', 'sayfalar']) {
  watch(join(kok, klasor), { recursive: true }, () => { clearTimeout(zamanlayici); zamanlayici = setTimeout(derle, 150); });
}

createServer(async (istek, yanit) => {
  if (istek.url === '/__yenile') {
    yanit.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    dinleyiciler.add(yanit); istek.on('close', () => dinleyiciler.delete(yanit)); return;
  }
  let yol = decodeURIComponent(istek.url.split('?')[0]);
  if (yol.endsWith('/')) yol += 'index.html';
  let dosya = join(hedef, yol);
  if (!dosya.startsWith(hedef)) { yanit.writeHead(403).end(); return; }
  try { if ((await stat(dosya)).isDirectory()) dosya = join(dosya, 'index.html'); } catch { dosya = join(hedef, '404.html'); yanit.statusCode = 404; }
  try {
    let icerik = await readFile(dosya);
    const tur = TUR[extname(dosya)] || 'application/octet-stream';
    if (tur.startsWith('text/html')) icerik = icerik.toString().replace('</body>', YENILE + '</body>');
    yanit.setHeader('Content-Type', tur); yanit.setHeader('Cache-Control', 'no-store'); yanit.end(icerik);
  } catch { yanit.writeHead(404).end('Bulunamadı'); }
}).listen(PORT, () => console.log(`Önizleme: http://localhost:${PORT}  (durdurmak için Ctrl+C)`));
