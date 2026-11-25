import { test } from 'node:test';
import assert from 'node:assert/strict';
import { haritaEmbedUrl, yolTarifiUrl, telLink } from '../js/harita.js';

const adres = 'Kemerkaya Mahallesi, Halkevi Sokak No: 22 B, Ortahisar/Trabzon';

test('harita embed adresi kodlar', () => {
  const u = haritaEmbedUrl(adres);
  assert.ok(u.startsWith('https://www.google.com/maps?q='));
  assert.ok(u.endsWith('&output=embed'));
  assert.ok(u.includes('Halkevi%20Sokak'));
  assert.ok(!u.includes(' '));
});

test('yol tarifi adresi kodlar', () => {
  const u = yolTarifiUrl('Çarşı Sokak');
  assert.equal(u, 'https://www.google.com/maps/dir/?api=1&destination=%C3%87ar%C5%9F%C4%B1%20Sokak');
});

test('telefon bağlantısı +90 ile', () => {
  assert.equal(telLink('0541 322 13 16'), 'tel:+905413221316');
  assert.equal(telLink('0462 322 13 16'), 'tel:+904623221316');
});
