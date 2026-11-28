import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { olustur } from '../scripts/olustur.js';
import { SAGLIK_NOTU, COLYAK_NOTU } from '../js/render.js';

const kok = join(dirname(fileURLToPath(import.meta.url)), '..');
const hedef = mkdtempSync(join(tmpdir(), 'af-'));
const sayfalar = await olustur(kok, hedef);
const oku = (s) => readFileSync(join(hedef, s), 'utf8');

test('altı sayfa üretilir', () => {
  for (const s of ['index.html', 'ekmeklerimiz.html', 'keteler.html', 'lezzetler.html', 'fiyatlar.html', 'cizelge.html', 'iletisim.html'])
    assert.ok(sayfalar.includes(s), s);
});

test('hiçbir sayfada doldurulmamış işaret kalmaz, her sayfada tek h1 ve başlık var', () => {
  for (const s of sayfalar) {
    const h = oku(s);
    assert.ok(!h.includes('{{'), s);
    assert.equal((h.match(/<h1[\s>]/g) || []).length, 1, s);
    assert.match(h, /<title>[^<]+Avrupa Fırını|<title>Avrupa Fırını/, s);
    assert.match(h, /<meta name="description" content="[^"]{50,}"/, s);
  }
});

test('ürün sayfalarında çölyak notu var', () => {
  for (const s of ['ekmeklerimiz.html', 'keteler.html', 'lezzetler.html']) assert.ok(oku(s).includes(COLYAK_NOTU), s);
});

test('ekmekler sayfası: tüm ekmek detayları ve sağlık notu', () => {
  const h = oku('ekmeklerimiz.html');
  assert.ok(h.includes('id="siyez"'));
  assert.ok(h.includes(SAGLIK_NOTU));
  assert.ok(h.includes('"@type":"Product"'));
});

test('keteler ve lezzetler kendi ürünlerini içerir', () => {
  assert.ok(oku('keteler.html').includes('id="kete-pazili"'));
  assert.ok(oku('lezzetler.html').includes('id="pazili-borek"'));
  assert.ok(!oku('keteler.html').includes('id="siyez"'));
});

test('çizelge ve iletişim', () => {
  assert.ok(oku('cizelge.html').includes('<table'));
  const i = oku('iletisim.html');
  assert.ok(i.includes('output=embed'));
  assert.ok(i.includes('tel:+905413221316'));
  assert.ok(i.includes('Kapalı'));
});

test('statik dosyalar kopyalanır', () => {
  assert.ok(existsSync(join(hedef, 'css/site.css')));
  assert.ok(existsSync(join(hedef, 'data/site.js')));
});

test('arama motoru dosyaları: robots, sitemap (6 sayfa), 404', () => {
  assert.match(readFileSync(join(hedef, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/avrupafirini\.com\/sitemap\.xml/);
  const sm = readFileSync(join(hedef, 'sitemap.xml'), 'utf8');
  assert.equal((sm.match(/<loc>/g) || []).length, 7);
  assert.ok(sm.includes('https://avrupafirini.com/fiyatlar.html'));
  assert.ok(existsSync(join(hedef, '404.html')));
  assert.ok(!oku('404.html').includes('{{'));
});

test('ana sayfada rozet logo', () => {
  assert.match(oku('index.html'), /<img[^>]+src="img\/logo-rozet\.jpg"/);
});

test('Zeynep Usta bölümü: sessiz, döngülü, satır içi video ve afiş görseli', () => {
  const h = oku('index.html');
  assert.match(h, /<video[^>]+class="usta__video"[^>]*>/);
  const v = h.match(/<video[^>]+class="usta__video"[^>]*>/)[0];
  for (const oz of ['autoplay', 'muted', 'loop', 'playsinline', 'poster="img/zeynep-usta.jpg"']) assert.ok(v.includes(oz), oz);
  assert.ok(h.includes('<source src="img/zeynep-usta.webm" type="video/webm">'));
  assert.ok(h.includes('<source src="img/zeynep-usta.mp4" type="video/mp4">'));
  assert.ok(existsSync(join(hedef, 'img/zeynep-usta.mp4')));
});

test('keteler sayfasında da Zeynep Usta videosu var, ketelere giden düğme yok', () => {
  const h = oku('keteler.html');
  assert.match(h, /<video[^>]+class="usta__video"/);
  assert.ok(!h.includes('Ketelerimizi görün'));
  assert.ok(oku('index.html').includes('Ketelerimizi görün'));
});

test('fiyatlar sayfası: liste, güncelleme tarihi, yazdır düğmesi', () => {
  const h = oku('fiyatlar.html');
  assert.ok(h.includes('class="fiyat-grup"'));
  assert.ok(h.includes('750 ₺ / kg'));
  assert.ok(h.includes('28 Kasım 2026'));
  assert.ok(h.includes('href="ekmeklerimiz.html#tam-bugday"'));
});

test('baskı şablonları: afiş ve broşür fiyatlarla üretilir, bağlantısız', () => {
  for (const d of ['baski/afis-a3.html', 'baski/brosur-a4.html']) {
    const h = oku(d);
    assert.ok(!h.includes('{{'), d);
    assert.ok(h.includes('750 ₺ / kg'), d);
    assert.ok(h.includes('28 Kasım 2026'), d);
    assert.ok(!/<li class="fiyat-satir">[^\n]*<a /.test(h), d + ' bağlantı içermemeli');
    assert.ok(h.includes('qr-instagram.svg'), d);
  }
});
