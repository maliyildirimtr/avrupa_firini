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
  for (const s of ['index.html', 'ekmeklerimiz.html', 'keteler.html', 'lezzetler.html', 'cizelge.html', 'iletisim.html'])
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
  assert.equal((sm.match(/<loc>/g) || []).length, 6);
  assert.ok(existsSync(join(hedef, '404.html')));
  assert.ok(!oku('404.html').includes('{{'));
});

test('ana sayfada rozet logo', () => {
  assert.match(oku('index.html'), /<img[^>]+src="img\/logo-rozet\.jpg"/);
});
