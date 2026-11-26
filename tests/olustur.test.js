import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sablonuDoldur, parcalar } from '../scripts/olustur.js';
import { ustKisim, altKisim } from '../js/render.js';
import { site } from '../data/site.js';

test('şablon işaretleri doldurulur', () => {
  assert.equal(sablonuDoldur('<p>{{a}}</p><i>{{ b }}</i>', { a: 'X', b: 'Y' }), '<p>X</p><i>Y</i>');
});

test('bilinmeyen işaret hata verir (yazım hatası yayına çıkmasın)', () => {
  assert.throws(() => sablonuDoldur('{{yok}}', {}), /yok/);
});

test('parçalar: kategoriye göre kart ve detay', () => {
  const p = parcalar(site, 'ekmeklerimiz.html');
  assert.ok(p['kartlar:ekmek'].includes('Tam Buğday Ekmeği'));
  assert.ok(!p['kartlar:ekmek'].includes('Haşhaşlı Kete'));
  assert.ok(p['detaylar:kete'].includes('id="kete-hashasli"'));
  assert.ok(p.onecikanlar.includes('Hamsili Ekmek'));
  assert.ok(p.ust.includes('aria-current="page"'));
});

test('üst kısım menüsü ve aktif sayfa', () => {
  const h = ustKisim(site, 'keteler.html');
  for (const ad of ['Ana Sayfa', 'Ekmeklerimiz', 'Keteler', 'Lezzetler', 'Çizelge', 'İletişim']) assert.ok(h.includes(ad), ad);
  assert.match(h, /href="keteler.html" aria-current="page"/);
});

test('alt kısım telefon, adres, instagram', () => {
  const h = altKisim(site);
  assert.ok(h.includes('tel:+905413221316'));
  assert.ok(h.includes('Halkevi Sokak'));
  assert.ok(h.includes('instagram.com/avrupafirini'));
  assert.ok(h.includes("1977'den beri"));
});

test('404 sayfası için taban yol varsayılanı / ve ayarlanabilir', () => {
  assert.equal(parcalar(site, '404.html').tabanYol, '/');
  assert.equal(parcalar(site, '404.html', { tabanYol: '/avrupa_firini/' }).tabanYol, '/avrupa_firini/');
});

test('üst kısımda logo amblemi, sayfalarda png site simgesi', () => {
  assert.match(ustKisim(site, 'index.html'), /<img[^>]+src="img\/amblem\.png"[^>]+alt=""/);
  assert.ok(parcalar(site, 'index.html').basOrtak.includes('href="img/favicon.png"'));
});
