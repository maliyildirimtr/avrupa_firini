// Şablonları (sayfalar/*.html) data/site.js ile doldurup dist/ klasörüne yazar.
// Kullanım: npm run build
import { readFileSync, writeFileSync, mkdirSync, cpSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  urunKarti, urunDetay, cizelgeTablosu, saatlerListesi, ustKisim, altKisim, kacis, SAGLIK_NOTU,
} from '../js/render.js';
import { haritaEmbedUrl, yolTarifiUrl, telLink } from '../js/harita.js';
import { veriyiDogrula } from '../js/veri-dogrula.js';
import { yapilandirilmisVeri, urunVerisi } from '../js/seo.js';

export function sablonuDoldur(sablon, p) {
  return sablon.replace(/\{\{\s*([\w:.-]+)\s*\}\}/g, (_, ad) => {
    if (!(ad in p)) throw new Error(`Bilinmeyen şablon işareti: {{${ad}}}`);
    return p[ad];
  });
}

const BAS_ORTAK = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:type" content="website">
<meta property="og:locale" content="tr_TR">
<meta property="og:site_name" content="Avrupa Fırını">
<meta name="theme-color" content="#1F3A6E">
<link rel="icon" href="img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,700;0,800;1,500&family=Figtree:wght@400;500;600;700&display=swap&subset=latin-ext">
<link rel="stylesheet" href="css/tema.css">
<link rel="stylesheet" href="css/site.css">`;

const jsonld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

export function parcalar(site, sayfa) {
  const p = {
    ust: ustKisim(site, sayfa),
    alt: altKisim(site),
    saatler: saatlerListesi(site),
    cizelge: cizelgeTablosu(site),
    saglikNotu: SAGLIK_NOTU,
    adres: kacis(site.firma.adres),
    tel1: kacis(site.firma.telefonlar[0]),
    tel1Link: telLink(site.firma.telefonlar[0]),
    telefonlar: site.firma.telefonlar.map((t) => `<a href="${telLink(t)}">${kacis(t)}</a>`).join(' · '),
    whatsapp: site.firma.whatsapp
      ? `<a class="dugme dugme--ikincil" href="https://wa.me/90${site.firma.whatsapp.replace(/\D/g, '').replace(/^0/, '')}" rel="noopener">WhatsApp'tan yaz</a>`
      : '',
    instagram: kacis(site.firma.instagram),
    haritaEmbed: kacis(haritaEmbedUrl(site.firma.adres)),
    yolTarifi: kacis(yolTarifiUrl(site.firma.adres)),
    onecikanlar: site.urunler.filter((u) => u.onecikan).map(urunKarti).join('\n'),
    ekmekOnizleme: site.urunler.filter((u) => u.kategori === 'ekmek').slice(0, 6).map(urunKarti).join('\n'),
    isletmeVerisi: jsonld(yapilandirilmisVeri(site)),
    yil: String(new Date().getFullYear()),
    basOrtak: BAS_ORTAK,
  };
  for (const k of ['ekmek', 'kete', 'lezzet']) {
    const liste = site.urunler.filter((u) => u.kategori === k);
    p[`kartlar:${k}`] = liste.map(urunKarti).join('\n');
    p[`detaylar:${k}`] = liste.map(urunDetay).join('\n');
    p[`urunVerisi:${k}`] = liste.map((u) => jsonld(urunVerisi(u, site))).join('\n');
  }
  return p;
}

export async function olustur(kok, hedef) {
  const { site } = await import(pathToFileURL(join(kok, 'data/site.js')).href + `?t=${Date.now()}`);
  const hatalar = veriyiDogrula(site);
  if (hatalar.length) throw new Error('Veri hataları:\n- ' + hatalar.join('\n- '));
  if (existsSync(hedef)) rmSync(hedef, { recursive: true });
  mkdirSync(hedef, { recursive: true });
  for (const klasor of ['css', 'js', 'data', 'img']) cpSync(join(kok, klasor), join(hedef, klasor), { recursive: true });
  for (const d of ['robots.txt', 'sitemap.xml']) if (existsSync(join(kok, d))) cpSync(join(kok, d), join(hedef, d));
  const sayfalar = readdirSync(join(kok, 'sayfalar')).filter((d) => d.endsWith('.html'));
  for (const sayfa of sayfalar) {
    const html = sablonuDoldur(readFileSync(join(kok, 'sayfalar', sayfa), 'utf8'), parcalar(site, sayfa));
    writeFileSync(join(hedef, sayfa), html);
  }
  return sayfalar;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const kok = join(dirname(fileURLToPath(import.meta.url)), '..');
  const sayfalar = await olustur(kok, join(kok, 'dist'));
  console.log(`dist/ hazır: ${sayfalar.join(', ')}`);
}
