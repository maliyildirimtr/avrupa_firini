import { test } from 'node:test';
import assert from 'node:assert/strict';
import { yapilandirilmisVeri, urunVerisi } from '../js/seo.js';
import { site } from '../data/site.js';

test('işletme verisi Bakery', () => {
  const v = yapilandirilmisVeri(site);
  assert.equal(v['@type'], 'Bakery');
  assert.equal(v.name, 'Avrupa Fırını');
  assert.equal(v.foundingDate, '1977');
  assert.equal(v.url, 'https://avrupafirini.com');
  assert.equal(v.address.addressLocality, 'Ortahisar');
  assert.equal(v.address.addressRegion, 'Trabzon');
  assert.equal(v.address.addressCountry, 'TR');
  assert.ok(v.telephone.startsWith('+90'));
  assert.deepEqual(v.sameAs, ['https://www.instagram.com/avrupafirini/']);
  assert.ok(v.hasMap.startsWith('https://www.google.com/maps/dir/'));
});

test('Pazar açılış saatlerinde yok, Cumartesi veriyle aynı', () => {
  const v = yapilandirilmisVeri(site);
  const gunler = v.openingHoursSpecification.flatMap((s) => s.dayOfWeek);
  assert.ok(!gunler.includes('Sunday'));
  const cmt = v.openingHoursSpecification.find((s) => s.dayOfWeek.includes('Saturday'));
  assert.equal(cmt.closes, site.saatler.cumartesi.kapanis);
});

test('ürün verisi: marka var, fiyat yok', () => {
  const v = urunVerisi(site.urunler[0], site);
  assert.equal(v['@type'], 'Product');
  assert.equal(v.brand.name, 'Avrupa Fırını');
  assert.equal(v.offers, undefined);
  assert.ok(v.image.startsWith('https://avrupafirini.com/img/'));
});
