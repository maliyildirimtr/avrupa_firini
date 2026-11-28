import { test } from 'node:test';
import assert from 'node:assert/strict';
import { site } from '../data/site.js';
import { veriyiDogrula } from '../js/veri-dogrula.js';
import { fiyatYaz, fiyatListesiHTML, fiyatSatirlari } from '../js/fiyat.js';

const kopya = () => structuredClone(site);
const hataVar = (s, parca) => assert.ok(veriyiDogrula(s).some((h) => h.includes(parca)), parca);
const satir = (ad) => fiyatSatirlari(site).find((r) => r.ad === ad);

test('fiyat yazımı', () => {
  assert.equal(fiyatYaz(150), '150 ₺');
  assert.equal(fiyatYaz(750, 'kg'), '750 ₺ / kg');
  assert.equal(fiyatYaz(null), '');
});

test('kullanıcının verdiği fiyatlar birebir', () => {
  const beklenen = {
    'Tam Buğday Ekmeği': 50, 'Çavdar Ekmeği': 50, 'Mısır Ekmeği': 100, 'Gümüşhane Ekmeği': 100,
    'Karakılçık Buğday Ekmeği': 75, 'Siyez Buğdaylı Ekmek': 75, 'Yulaf Ekmeği': 75,
    'Hamsili Ekmek – Büyük': 200, 'Hamsili Ekmek – Küçük': 100,
    'Tahinli Kete': 150, 'Cevizli / Fındıklı Kete': 150, 'Haşhaşlı Kete': 150, 'Tereyağlı Unlu Kete': 120, 'Pazılı Kete': 120,
    'Meyveli Kurabiye': 40, 'Acıbadem Kurabiyesi': 75, 'Peksimet': 60, 'Selanik Gevreği': 750,
    'Erişte Çeşitleri': 150, 'Tarhana': 200, 'Sade Beypazarı Kurusu': 150, 'Çikolatalı / Çörek Otlu Beypazarı Kurusu': 200,
  };
  for (const [ad, tl] of Object.entries(beklenen)) assert.equal(satir(ad)?.fiyat, tl, ad);
  assert.equal(satir('Selanik Gevreği').birim, 'kg');
  assert.equal(fiyatSatirlari(site).filter((r) => r.fiyat !== null).length, Object.keys(beklenen).length);
});

test('fiyatı bilinmeyenler boş bırakılır', () => {
  for (const ad of ['Çok Tahıllı Ekmek', 'Greçka Ekmeği', 'Kabaklı Mısır Ekmeği', 'Kurutulmuş Çavdar', 'Pazılı Börek']) {
    assert.equal(satir(ad)?.fiyat, null, ad);
  }
});

test('veri doğrulama: geçersiz fiyat, bilinmeyen ürün, geçersiz birim', () => {
  let s = kopya(); s.fiyatListesi.gruplar[0].kalemler[0].fiyat = -5; hataVar(s, 'fiyat');
  s = kopya(); s.fiyatListesi.gruplar[0].kalemler[0].fiyat = '50'; hataVar(s, 'fiyat');
  s = kopya(); s.fiyatListesi.gruplar[0].kalemler[0].urun = 'yok-boyle-urun'; hataVar(s, 'bilinmeyen ürün');
  s = kopya(); s.fiyatListesi.gruplar[0].kalemler[0].birim = 'ton'; hataVar(s, 'birim');
  s = kopya(); s.fiyatListesi.gruplar[0].kalemler[0].ad = ''; hataVar(s, 'ad');
});

test('fiyat listesi HTML: gruplar, bağlantılar, boş fiyat, kaçış', () => {
  const h = fiyatListesiHTML(site, { baglanti: true });
  for (const b of ['Ekmekler', 'Keteler', 'Kurabiye ve Kurular', 'Beypazarı Ev Ürünleri']) assert.ok(h.includes(b), b);
  assert.ok(h.includes('href="ekmeklerimiz.html#tam-bugday"'));
  assert.ok(h.includes('750 ₺ / kg'));
  assert.match(h, /Greçka Ekmeği[\s\S]*?class="fiyat-tutar fiyat-tutar--bos"/);
  assert.ok(!fiyatListesiHTML(site, { baglanti: false }).includes('<a '));
  const s = kopya(); s.fiyatListesi.gruplar[0].kalemler[0].ad = 'A & <B>';
  assert.ok(fiyatListesiHTML(s).includes('A &amp; &lt;B&gt;'));
});

test('afiş kartları: her kalem fotoğraflı kart, fiyat kutuda', async () => {
  const { fiyatKartlariHTML } = await import('../js/fiyat.js');
  const h = fiyatKartlariHTML(site);
  const n = fiyatSatirlari(site).length;
  assert.equal((h.match(/class="afis-kart"/g) || []).length, n);
  assert.equal((h.match(/class="fiyat-kutu(?: fiyat-kutu--bos)?"/g) || []).length, n);
  assert.ok(h.includes('src="../img/urunler/album/tarhana.jpg"'));
  assert.ok(h.includes('src="../img/urunler/tam-bugday.jpg"'));
  assert.ok(h.includes('afis-kart__foto--bos'), 'fotoğrafı olmayan kalem yer tutucu alır');
});

test('fiyat kalemi foto alanı: dosya var olmalı', async () => {
  const { existsSync } = await import('node:fs');
  for (const r of fiyatSatirlari(site)) if (r.foto) assert.ok(existsSync(r.foto), r.foto);
  const s = kopya(); s.fiyatListesi.gruplar[0].kalemler[0].foto = 5; hataVar(s, 'foto');
});
