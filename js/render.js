import { GUNLER } from './veri-dogrula.js';

export const GUN_ADLARI = {
  pazartesi: 'Pazartesi', sali: 'Salı', carsamba: 'Çarşamba', persembe: 'Perşembe',
  cuma: 'Cuma', cumartesi: 'Cumartesi', pazar: 'Pazar',
};

export const SAGLIK_NOTU =
  'Bu bilgiler genel bilgilendirme amaçlıdır. Sağlık durumunuza uygun beslenme için doktorunuza veya diyetisyeninize danışın.';

export const KATEGORI_SAYFASI = { ekmek: 'ekmeklerimiz.html', kete: 'keteler.html', lezzet: 'lezzetler.html' };

const YER_TUTUCU = 'img/yer-tutucu.svg';

export function kacis(metin) {
  return String(metin ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const gunMetni = (gunler) => gunler.map((g) => GUN_ADLARI[g]).join(', ');

function gorsel(urun, sinif) {
  const src = urun.foto ? kacis(urun.foto) : YER_TUTUCU;
  const alt = kacis(`${urun.ad} – Avrupa Fırını Trabzon`);
  return `<img class="${sinif}" src="${src}" alt="${alt}" loading="lazy" decoding="async" width="400" height="300" onerror="this.onerror=null;this.src='${YER_TUTUCU}'">`;
}

export function urunKarti(urun) {
  const rozet = Array.isArray(urun.gunler)
    ? `<span class="rozet" title="Bu ürün yalnızca belirli günlerde çıkar">${kacis(gunMetni(urun.gunler))}</span>`
    : '';
  const href = `${KATEGORI_SAYFASI[urun.kategori] || ''}#${kacis(urun.id)}`;
  return `<article class="urun-karti" data-id="${kacis(urun.id)}">
  <a href="${href}">
    <div class="urun-karti__gorsel">${gorsel(urun, 'urun-karti__img')}${rozet}</div>
    <h3 class="urun-karti__ad">${kacis(urun.ad)}</h3>
    <p class="urun-karti__kisa">${kacis(urun.kisa)}</p>
  </a>
</article>`;
}

function glutenSatiri(g) {
  return g === true ? 'Glüten içerir.' : 'Glüten bilgisi için fırınımıza danışın.';
}

export function urunDetay(urun) {
  const liste = (arr) => `<ul>${arr.map((x) => `<li>${kacis(x)}</li>`).join('')}</ul>`;
  const gunler = Array.isArray(urun.gunler) ? `Yalnızca ${gunMetni(urun.gunler)} günleri` : 'Her gün (Pazar hariç)';
  const saglik = urun.saglik && urun.saglik.length
    ? `<div class="urun-detay__saglik"><h4>Beslenme notları</h4>${liste(urun.saglik)}<p class="saglik-notu">${SAGLIK_NOTU}</p></div>`
    : '';
  const icerik = urun.icerik && urun.icerik.length ? `<h4>İçindekiler</h4>${liste(urun.icerik)}` : '';
  return `<section class="urun-detay" id="${kacis(urun.id)}">
  ${gorsel(urun, 'urun-detay__img')}
  <div class="urun-detay__metin">
    <h3>${kacis(urun.ad)}</h3>
    <p>${kacis(urun.aciklama)}</p>
    ${icerik}
    <p><strong>Lezzet:</strong> ${kacis(urun.lezzet)}</p>
    <p><strong>Ne zaman:</strong> ${gunler}</p>
    <p class="gluten">${glutenSatiri(urun.glutenIcerir)}</p>
    ${saglik}
  </div>
</section>`;
}

export function bugunFirindaHTML(sonuc, site) {
  const { durum, gun, saatler } = sonuc;
  const mesajlar = {
    acik: `Şu an açığız · ${saatler.kapanis}'ye kadar`,
    acilacak: `Bugün ${saatler.acilis}'de açıyoruz`,
    kapandi: `Bugün kapandık · ${GUN_ADLARI[gun]} ${saatler.acilis}'de görüşmek üzere`,
    kapali: `Bugün (Pazar) kapalıyız · ${GUN_ADLARI[gun]} ${saatler.acilis}'de görüşmek üzere`,
  };
  const baslik = durum === 'kapandi' || durum === 'kapali' ? `${GUN_ADLARI[gun]} fırında` : 'Bugün fırında';
  const isim = (u) => `<li><a href="${KATEGORI_SAYFASI[u.kategori] || ''}#${kacis(u.id)}">${kacis(u.ad)}</a></li>`;
  const ozel = sonuc.ozel.length
    ? `<div class="bugun__ozel"><span class="bugun__etiket">Bugüne özel</span><ul>${sonuc.ozel.map(isim).join('')}</ul></div>`
    : '';
  const herGun = `<ul class="bugun__liste">${sonuc.herGun.map(isim).join('')}</ul>`;
  return `<div class="bugun bugun--${durum}">
  <p class="bugun__durum"><span class="nokta" aria-hidden="true"></span>${mesajlar[durum]}</p>
  <h2 class="bugun__baslik">${baslik}</h2>
  ${ozel}
  ${herGun}
</div>`;
}

export function cizelgeTablosu(site) {
  const gunler = GUNLER;
  const belirli = site.urunler.filter((u) => Array.isArray(u.gunler));
  const bas = gunler.map((g) => `<th scope="col">${GUN_ADLARI[g]}</th>`).join('');
  const satirlar = belirli.map((u) => {
    const hucreler = gunler.map((g) => {
      if (!site.saatler[g]) return '<td class="kapali">Kapalı</td>';
      return u.gunler.includes(g) ? '<td class="var"><span aria-label="var">●</span></td>' : '<td class="yok"><span aria-label="yok">–</span></td>';
    }).join('');
    return `<tr><th scope="row">${kacis(u.ad)}</th>${hucreler}</tr>`;
  }).join('');
  return `<div class="cizelge-kap"><table class="cizelge">
  <thead><tr><th scope="col">Ürün</th>${bas}</tr></thead>
  <tbody>${satirlar}</tbody>
</table></div>
<p class="cizelge__not">Diğer tüm ürünlerimiz her gün (Pazar hariç) fırında.</p>`;
}

export function saatlerListesi(site) {
  const satir = (g) => {
    const s = site.saatler[g];
    return `<li><span>${GUN_ADLARI[g]}</span><span>${s ? `${s.acilis}–${s.kapanis}` : 'Kapalı'}</span></li>`;
  };
  return `<ul class="saatler">${GUNLER.map(satir).join('')}</ul>`;
}

export const MENU = [
  ['index.html', 'Ana Sayfa'],
  ['ekmeklerimiz.html', 'Ekmeklerimiz'],
  ['keteler.html', 'Keteler'],
  ['lezzetler.html', 'Lezzetler'],
  ['cizelge.html', 'Çizelge'],
  ['iletisim.html', 'İletişim'],
];

export function ustKisim(site, aktif) {
  const linkler = MENU.map(([href, ad]) =>
    `<li><a href="${href}"${href === aktif ? ' aria-current="page"' : ''}>${ad}</a></li>`).join('');
  return `<header class="ust">
  <a class="marka" href="index.html" aria-label="${kacis(site.firma.ad)} ana sayfa">
    <span class="marka__ad">${kacis(site.firma.ad)}</span>
    <span class="marka__yil">1977'den beri</span>
  </a>
  <button class="menu-dugme" type="button" aria-expanded="false" aria-controls="ana-menu">Menü</button>
  <nav id="ana-menu" class="ana-menu" aria-label="Ana menü"><ul>${linkler}</ul></nav>
</header>`;
}

export function altKisim(site) {
  const f = site.firma;
  const tel = f.telefonlar.map((t) => `<a href="tel:+90${t.replace(/\D/g, '').replace(/^0/, '')}">${kacis(t)}</a>`).join('<br>');
  return `<footer class="alt">
  <div class="alt__ic">
    <div>
      <p class="alt__marka">${kacis(f.ad)}</p>
      <p>1977'den beri Trabzon'da taş fırında. ${kacis(f.aciklama)}</p>
    </div>
    <div><h2>Adres</h2><address>${kacis(f.adres)}</address></div>
    <div><h2>Telefon</h2><p>${tel}</p></div>
    <div><h2>Instagram</h2><p><a href="${kacis(f.instagram)}" rel="noopener" target="_blank">@avrupafirini</a></p></div>
  </div>
  <p class="alt__telif">© ${f.kurulus}–<span data-yil></span> ${kacis(f.ad)}</p>
</footer>`;
}
