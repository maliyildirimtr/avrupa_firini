import { kacis, KATEGORI_SAYFASI } from './render.js';

/** 150 → "150 ₺", (750, 'kg') → "750 ₺ / kg", null → "" */
export function fiyatYaz(tl, birim) {
  if (tl === null || tl === undefined) return '';
  const sayi = new Intl.NumberFormat('tr-TR').format(tl);
  return birim === 'kg' ? `${sayi} ₺ / kg` : `${sayi} ₺`;
}

/** Tüm kalemler düz liste olarak (grup adıyla). */
export function fiyatSatirlari(site) {
  return site.fiyatListesi.gruplar.flatMap((g) => g.kalemler.map((k) => ({ grup: g.baslik, ...k })));
}

export function guncellemeTarihi(site) {
  const [y, a, g] = site.fiyatListesi.guncelleme.split('-').map(Number);
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(y, a - 1, g)));
}

/** Gruplu fiyat listesi. baglanti: ürün adları ürün sayfasına bağlansın mı (sitede evet, baskıda hayır). */
export function fiyatListesiHTML(site, { baglanti = false } = {}) {
  const urunler = new Map(site.urunler.map((u) => [u.id, u]));
  return site.fiyatListesi.gruplar.map((g) => {
    const satirlar = g.kalemler.map((k) => {
      const u = k.urun && urunler.get(k.urun);
      const ad = baglanti && u ? `<a href="${KATEGORI_SAYFASI[u.kategori]}#${kacis(u.id)}">${kacis(k.ad)}</a>` : kacis(k.ad);
      const not = k.not ? ` <span class="fiyat-not">${kacis(k.not)}</span>` : '';
      const bos = k.fiyat === null;
      return `<li class="fiyat-satir"><span class="fiyat-ad">${ad}${not}</span><span class="fiyat-cizgi" aria-hidden="true"></span><span class="fiyat-tutar${bos ? ' fiyat-tutar--bos' : ''}">${fiyatYaz(k.fiyat, k.birim)}</span></li>`;
    }).join('\n');
    return `<section class="fiyat-grup">\n<h2 class="fiyat-grup__baslik">${kacis(g.baslik)}</h2>\n<ul class="fiyat-liste">\n${satirlar}\n</ul>\n</section>`;
  }).join('\n');
}
