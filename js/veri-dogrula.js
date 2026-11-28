export const GUNLER = ['pazartesi', 'sali', 'carsamba', 'persembe', 'cuma', 'cumartesi', 'pazar'];

const KATEGORILER = ['ekmek', 'kete', 'lezzet'];
const ZORUNLU = ['id', 'ad', 'kategori', 'gunler', 'kisa', 'aciklama', 'icerik', 'lezzet', 'saglik', 'foto'];
const YASAK = ['tedavi', 'iyileştir', 'şifa', 'hastalığa iyi', 'önler', 'glütensiz', 'glutensiz'];
const IZINLI = new Set([...ZORUNLU, 'glutenIcerir', 'onecikan', 'dogrulandi', 'fotolar']);
// "karabuğday" glüten tahılı değildir; önünde harf olmayan buğday/çavdar/siyez/arpa/yulaf aranır.
const GLUTEN_TAHILI = /(?<![a-zçğıöşü])(buğday|çavdar|siyez|arpa|yulaf)/;
const SAAT = /^([01]\d|2[0-3]):[0-5]\d$/;

const metinler = (u) =>
  [u.ad, u.kisa, u.aciklama, u.lezzet, ...(u.icerik || []), ...(u.saglik || [])]
    .filter((m) => typeof m === 'string')
    .join(' ')
    .toLocaleLowerCase('tr');

export function veriyiDogrula(site) {
  const hatalar = [];
  const idler = new Set();

  for (const [i, u] of (site.urunler || []).entries()) {
    const ad = u.id || `#${i}`;
    for (const alan of ZORUNLU) {
      if (u[alan] === undefined || u[alan] === '') hatalar.push(`${ad}: eksik alan "${alan}"`);
    }
    if (u.id !== undefined && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(u.id)) hatalar.push(`${ad}: id ASCII kebab-case olmalı`);
    if (u.id !== undefined) {
      if (idler.has(u.id)) hatalar.push(`${ad}: yinelenen id`);
      idler.add(u.id);
    }
    if (u.kategori !== undefined && !KATEGORILER.includes(u.kategori)) hatalar.push(`${ad}: geçersiz kategori "${u.kategori}"`);
    if (u.gunler !== undefined && u.gunler !== 'hergun') {
      if (!Array.isArray(u.gunler) || u.gunler.length === 0) hatalar.push(`${ad}: gunler 'hergun' ya da gün dizisi olmalı`);
      else for (const g of u.gunler) if (!GUNLER.includes(g) || g === 'pazar') hatalar.push(`${ad}: geçersiz gün "${g}"`);
    }
    for (const k of Object.keys(u)) if (!IZINLI.has(k)) hatalar.push(`${ad}: bilinmeyen alan "${k}" (yazım hatası olabilir)`);
    if (Array.isArray(u.icerik) && u.glutenIcerir !== true
      && u.icerik.some((x) => GLUTEN_TAHILI.test(String(x).toLocaleLowerCase('tr')))) {
      hatalar.push(`${ad}: içerikte glüten tahılı var, glutenIcerir true olmalı`);
    }
    if (u.fotolar !== undefined && !(Array.isArray(u.fotolar) && u.fotolar.every((f) => typeof f === 'string' && f))) hatalar.push(`${ad}: fotolar dosya yolu listesi olmalı`);
    if (u.glutenIcerir !== true && u.glutenIcerir !== null) hatalar.push(`${ad}: glüten bilgisi true ya da null olmalı`);
    const metin = metinler(u);
    for (const y of YASAK) if (metin.includes(y)) hatalar.push(`${ad}: yasak ifade "${y}"`);
  }

  for (const alan of ['ad', 'sokakAdresi', 'ilce', 'il']) {
    if (!site.firma || !site.firma[alan]) hatalar.push(`firma: eksik alan "${alan}"`);
  }

  const urunIdleri = new Set((site.urunler || []).map((u) => u.id));
  const fl = site.fiyatListesi;
  if (!fl || !Array.isArray(fl.gruplar) || fl.gruplar.length === 0) hatalar.push('fiyatListesi: en az bir grup olmalı');
  else for (const g of fl.gruplar) {
    if (!g.baslik) hatalar.push('fiyatListesi: grup başlığı eksik');
    for (const k of g.kalemler || []) {
      const ad = k.ad || '(adsız)';
      if (!k.ad) hatalar.push(`fiyat: kalem ad eksik (${g.baslik})`);
      if (k.fiyat !== null && !(Number.isInteger(k.fiyat) && k.fiyat > 0)) hatalar.push(`fiyat: ${ad} için fiyat pozitif tam sayı ya da null olmalı`);
      if (k.urun !== undefined && !urunIdleri.has(k.urun)) hatalar.push(`fiyat: ${ad} bilinmeyen ürün "${k.urun}"`);
      if (k.birim !== undefined && !['kg', 'adet', 'paket'].includes(k.birim)) hatalar.push(`fiyat: ${ad} geçersiz birim "${k.birim}"`);
    }
  }

  const s = site.saatler || {};
  if (s.pazar !== null) hatalar.push('saatler: pazar null (kapalı) olmalı');
  for (const g of GUNLER.slice(0, 6)) {
    const h = s[g];
    if (!h || !SAAT.test(h.acilis) || !SAAT.test(h.kapanis)) hatalar.push(`saatler: ${g} için geçerli acilis/kapanis yok`);
    else if (h.acilis >= h.kapanis) hatalar.push(`saatler: ${g} açılış kapanıştan önce olmalı`);
  }
  if (s.cumartesi && s.cuma && s.cumartesi.kapanis >= s.cuma.kapanis) hatalar.push('saatler: cumartesi hafta içinden erken kapanmalı');

  return hatalar;
}
