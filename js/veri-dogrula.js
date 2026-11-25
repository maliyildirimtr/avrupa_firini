export const GUNLER = ['pazartesi', 'sali', 'carsamba', 'persembe', 'cuma', 'cumartesi', 'pazar'];

const KATEGORILER = ['ekmek', 'kete', 'lezzet'];
const ZORUNLU = ['id', 'ad', 'kategori', 'gunler', 'kisa', 'aciklama', 'icerik', 'lezzet', 'saglik', 'foto'];
const YASAK = ['tedavi', 'iyileştir', 'şifa', 'hastalığa iyi', 'önler', 'glütensiz', 'glutensiz'];
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
    if (u.glutenIcerir !== true && u.glutenIcerir !== null) hatalar.push(`${ad}: glüten bilgisi true ya da null olmalı`);
    const metin = metinler(u);
    for (const y of YASAK) if (metin.includes(y)) hatalar.push(`${ad}: yasak ifade "${y}"`);
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
