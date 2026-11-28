import { test } from 'node:test';
import assert from 'node:assert/strict';
import { site } from '../data/site.js';
import { veriyiDogrula, GUNLER } from '../js/veri-dogrula.js';

const kopya = () => structuredClone(site);
const hataIcerir = (hatalar, parca) =>
  assert.ok(hatalar.some((h) => h.includes(parca)), `beklenen hata "${parca}" yok: ${JSON.stringify(hatalar)}`);

test('gerçek veri geçerli', () => {
  assert.deepEqual(veriyiDogrula(site), []);
});

test('GUNLER sırası sabit', () => {
  assert.deepEqual(GUNLER, ['pazartesi', 'sali', 'carsamba', 'persembe', 'cuma', 'cumartesi', 'pazar']);
});

test('yinelenen id yakalanır', () => {
  const s = kopya();
  s.urunler.push({ ...s.urunler[0] });
  hataIcerir(veriyiDogrula(s), 'yinelenen id');
});

test('Türkçe yazılmış gün adı yakalanır', () => {
  const s = kopya();
  s.urunler[0].gunler = ['Salı'];
  hataIcerir(veriyiDogrula(s), 'geçersiz gün');
});

test('eksik ad yakalanır', () => {
  const s = kopya();
  delete s.urunler[0].ad;
  hataIcerir(veriyiDogrula(s), 'ad');
});

test('ASCII olmayan id yakalanır', () => {
  const s = kopya();
  s.urunler[0].id = 'çavdar ekmeği';
  hataIcerir(veriyiDogrula(s), 'id');
});

for (const kelime of ['tedavi eder', 'iyileştirir', 'şifa kaynağı', 'hastalığa iyi gelir', 'kanseri önler', 'glütensizdir']) {
  test(`yasak sağlık ifadesi yakalanır: ${kelime}`, () => {
    const s = kopya();
    s.urunler[0].aciklama += ' ' + kelime;
    hataIcerir(veriyiDogrula(s), 'yasak ifade');
  });
}

test('glutenIcerir false yakalanır', () => {
  const s = kopya();
  s.urunler[0].glutenIcerir = false;
  hataIcerir(veriyiDogrula(s), 'glüten');
});

test('pazar açık girilirse yakalanır', () => {
  const s = kopya();
  s.saatler.pazar = { acilis: '08:00', kapanis: '12:00' };
  hataIcerir(veriyiDogrula(s), 'pazar');
});

test('cumartesi erken kapanmazsa yakalanır', () => {
  const s = kopya();
  s.saatler.cumartesi = { ...s.saatler.cuma };
  hataIcerir(veriyiDogrula(s), 'cumartesi');
});

test('açılış kapanıştan sonra olamaz', () => {
  const s = kopya();
  s.saatler.sali = { acilis: '21:00', kapanis: '07:00' };
  hataIcerir(veriyiDogrula(s), 'sali');
});


test('içerikte buğday/çavdar/siyez/arpa/yulaf varsa glüten true olmalı', () => {
  const s = kopya();
  const u = s.urunler.find((x) => x.id === 'grecka');
  u.glutenIcerir = null;
  u.icerik = ['Karabuğday unu', 'Buğday unu'];
  hataIcerir(veriyiDogrula(s), 'glüten');
});

test('karabuğday tek başına glüten tahılı sayılmaz', () => {
  const s = kopya();
  const u = s.urunler.find((x) => x.id === 'grecka');
  u.glutenIcerir = null;
  u.icerik = ['Karabuğday unu', 'Su'];
  assert.ok(!veriyiDogrula(s).some((h) => h.startsWith('grecka') && h.includes('glüten')));
});

for (const anahtar of ['günler', 'gunlr', 'glutenİcerir']) {
  test(`bilinmeyen alan adı yakalanır: ${anahtar}`, () => {
    const s = kopya();
    s.urunler[0][anahtar] = ['sali'];
    hataIcerir(veriyiDogrula(s), 'bilinmeyen alan');
  });
}

test('firma adres parçaları zorunlu', () => {
  const s = kopya();
  delete s.firma.il;
  hataIcerir(veriyiDogrula(s), 'firma');
});

test('albüm fotoğrafları dizi olmalı ve dosyaları var olmalı', async () => {
  const { existsSync } = await import('node:fs');
  for (const u of site.urunler) for (const f of u.fotolar || []) assert.ok(existsSync(f), f);
  const s = kopya(); s.urunler[0].fotolar = 'tek.jpg';
  hataIcerir(veriyiDogrula(s), 'fotolar');
});
