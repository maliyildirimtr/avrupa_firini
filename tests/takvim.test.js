import { test } from 'node:test';
import assert from 'node:assert/strict';
import { istanbulZamani, bugunFirinda } from '../js/takvim.js';

const saat = { acilis: '07:00', kapanis: '20:00' };
const fixture = {
  saatler: {
    pazartesi: saat, sali: saat, carsamba: saat, persembe: saat, cuma: saat,
    cumartesi: { acilis: '07:00', kapanis: '17:00' }, pazar: null,
  },
  urunler: [
    { id: 'ekmek', gunler: 'hergun' },
    { id: 'hamsili-ekmek', gunler: ['sali', 'cuma'] },
    { id: 'grecka', gunler: ['sali'] },
  ],
};
const ids = (l) => l.map((u) => u.id);

test('UTC Cumartesi 21:30 İstanbul’da Pazar 00:30’dur', () => {
  assert.deepEqual(istanbulZamani(new Date('2026-11-28T21:30:00Z')), { gun: 'pazar', saat: '00:30' });
});

test('Salı 10:00 açık, bugüne özel ürünler var', () => {
  const r = bugunFirinda(fixture, new Date('2026-12-01T07:00:00Z'));
  assert.equal(r.durum, 'acik');
  assert.equal(r.gun, 'sali');
  assert.deepEqual(ids(r.ozel), ['hamsili-ekmek', 'grecka']);
  assert.deepEqual(ids(r.herGun), ['ekmek']);
  assert.deepEqual(r.saatler, saat);
});

test('Çarşamba 06:00 henüz açılmadı, özel ürün yok', () => {
  const r = bugunFirinda(fixture, new Date('2026-12-02T03:00:00Z'));
  assert.equal(r.durum, 'acilacak');
  assert.equal(r.gun, 'carsamba');
  assert.deepEqual(r.ozel, []);
});

test('Pazartesi 21:00 kapandı, Salı gösterilir', () => {
  const r = bugunFirinda(fixture, new Date('2026-11-30T18:00:00Z'));
  assert.equal(r.durum, 'kapandi');
  assert.equal(r.gun, 'sali');
  assert.deepEqual(ids(r.ozel), ['hamsili-ekmek', 'grecka']);
});

test('Cumartesi 18:00 kapandı, Pazar atlanır, Pazartesi gösterilir', () => {
  const r = bugunFirinda(fixture, new Date('2026-11-28T15:00:00Z'));
  assert.equal(r.durum, 'kapandi');
  assert.equal(r.gun, 'pazartesi');
});

test('Pazar 12:00 kapalı, Pazartesi gösterilir', () => {
  const r = bugunFirinda(fixture, new Date('2026-11-29T09:00:00Z'));
  assert.equal(r.durum, 'kapali');
  assert.equal(r.gun, 'pazartesi');
  assert.deepEqual(r.saatler, saat);
});
