import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  kacis, GUN_ADLARI, SAGLIK_NOTU, COLYAK_NOTU, urunKarti, urunDetay, bugunFirindaHTML, cizelgeTablosu, saatlerListesi,
} from '../js/render.js';

const temel = {
  id: 'cavdar', ad: 'Çavdar & "Siyez" <Özel>', kategori: 'ekmek', gunler: 'hergun',
  kisa: 'kısa', aciklama: 'açıklama', icerik: ['Un'], lezzet: 'güzel', saglik: [],
  glutenIcerir: true, foto: 'img/urunler/cavdar.jpg', dogrulandi: true,
};
const saat = { acilis: '07:00', kapanis: '20:00' };
const site = {
  saatler: { pazartesi: saat, sali: saat, carsamba: saat, persembe: saat, cuma: saat, cumartesi: { acilis: '07:00', kapanis: '17:00' }, pazar: null },
  urunler: [temel, { ...temel, id: 'hamsili-ekmek', ad: 'Hamsili Ekmek', gunler: ['sali', 'cuma'] }],
};

test('kacis özel karakterleri kaçırır', () => {
  assert.equal(kacis('A & <b>'), 'A &amp; &lt;b&gt;');
  assert.equal(kacis(`"'`), '&quot;&#39;');
});

test('GUN_ADLARI Türkçe', () => {
  assert.equal(GUN_ADLARI.sali, 'Salı');
  assert.equal(GUN_ADLARI.carsamba, 'Çarşamba');
});

test('kartta ham özel karakter kalmaz', () => {
  const h = urunKarti(temel);
  assert.ok(h.includes('Çavdar &amp; &quot;Siyez&quot; &lt;Özel&gt;'));
  assert.ok(!h.includes('<Özel>'));
  assert.ok(h.includes('class="urun-karti"'));
});

test('kart yer tutucuya düşer', () => {
  assert.ok(urunKarti(temel).includes('img/yer-tutucu.svg'));
  assert.ok(urunKarti({ ...temel, foto: '' }).includes('src="img/yer-tutucu.svg"'));
});

test('belirli günlü ürünün kartında gün rozeti var', () => {
  assert.ok(urunKarti({ ...temel, gunler: ['sali', 'cuma'] }).includes('Salı, Cuma'));
  assert.ok(!urunKarti(temel).includes('rozet'));
});

test('sağlık bilgisi varsa not birebir eklenir, yoksa eklenmez', () => {
  assert.ok(urunDetay({ ...temel, saglik: ['Lif yüksek'] }).includes(SAGLIK_NOTU));
  assert.ok(!urunDetay(temel).includes(SAGLIK_NOTU));
  assert.equal(SAGLIK_NOTU, 'Bu bilgiler genel bilgilendirme amaçlıdır. Sağlık durumunuza uygun beslenme için doktorunuza veya diyetisyeninize danışın.');
});

test('glüten satırı', () => {
  assert.ok(urunDetay(temel).includes('Glüten içerir'));
  assert.ok(urunDetay({ ...temel, glutenIcerir: null }).includes('glütensiz ürünümüz yoktur'));
});

test('bugün fırında durum mesajları', () => {
  const r = { gun: 'sali', saatler: saat, herGun: [temel], ozel: [] };
  assert.ok(bugunFirindaHTML({ ...r, durum: 'acik' }, site).includes('Şu an açığız · Kapanış 20:00'));
  assert.ok(bugunFirindaHTML({ ...r, durum: 'acilacak' }, site).includes('Henüz açılmadık · Açılış 07:00'));
  assert.ok(bugunFirindaHTML({ ...r, durum: 'kapandi' }, site).includes('Bugün kapandık · Salı açılış 07:00'));
  assert.ok(bugunFirindaHTML({ ...r, gun: 'pazartesi', durum: 'kapali' }, site).includes('Bugün (Pazar) kapalıyız · Pazartesi açılış 07:00'));
  const sonraki = bugunFirindaHTML({ ...r, durum: 'acik', saatler: { acilis: '06:30', kapanis: '18:00' } }, site);
  assert.ok(!/'(ye|de|da|a|e) /.test(sonraki), 'saat sonrası Türkçe ek kullanılmamalı');
});

test('bugüne özel vurgusu yalnızca bugün için', () => {
  const h = bugunFirindaHTML({ durum: 'acik', gun: 'sali', saatler: saat, herGun: [], ozel: [temel] }, site);
  assert.ok(h.includes('Bugüne özel'));
  const yarin = bugunFirindaHTML({ durum: 'kapandi', gun: 'sali', saatler: saat, herGun: [], ozel: [temel] }, site);
  assert.ok(!yarin.includes('Bugüne özel'));
  assert.ok(yarin.includes('Yalnızca Salı'));
});

test('doğrulanmamış ürünün sağlık ve içindekiler bilgisi yayınlanmaz', () => {
  const t = { ...temel, dogrulandi: false, saglik: ['Lif yüksek'] };
  const h = urunDetay(t);
  assert.ok(!h.includes('Lif yüksek'));
  assert.ok(!h.includes('İçindekiler'));
  assert.ok(!h.includes(SAGLIK_NOTU));
});

test('taslak önizleme modunda doğrulanmamış bilgi "taslak" etiketiyle görünür', () => {
  const t = { ...temel, dogrulandi: false, saglik: ['Lif yüksek'] };
  const h = urunDetay(t, { taslakGoster: true });
  assert.ok(h.includes('Lif yüksek'));
  assert.ok(h.includes('Taslak'));
});

test('glüten bilgisi belirsizse çölyak uyarısı verilir', () => {
  const h = urunDetay({ ...temel, glutenIcerir: null });
  assert.ok(h.includes(COLYAK_NOTU));
  assert.ok(COLYAK_NOTU.includes('glütensiz ürünümüz yoktur'));
});

test('çizelge tablosu', () => {
  const h = cizelgeTablosu(site);
  assert.ok(h.includes('<table'));
  assert.ok(h.includes('Kapalı'));
  assert.ok(h.includes('Salı'));
  assert.ok(h.includes('Hamsili Ekmek'));
  assert.ok(h.includes('Diğer tüm ürünlerimiz her gün'));
});

test('saatler listesi', () => {
  const h = saatlerListesi(site);
  assert.ok(h.includes('07:00–17:00'));
  assert.ok(h.includes('Kapalı'));
});

test('ürün albümü: ek fotoğraflar detayda galeri olarak görünür', () => {
  const h = urunDetay({ ...temel, fotolar: ['img/urunler/albüm/a.jpg', 'img/urunler/albüm/b.jpg'] });
  assert.ok(h.includes('class="urun-galeri"'));
  assert.equal((h.match(/class="urun-galeri__foto"/g) || []).length, 2);
  assert.ok(!urunDetay(temel).includes('urun-galeri'));
});
