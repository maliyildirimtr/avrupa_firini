import { kacis } from './render.js';

export const YEDEK_SURE_MS = 8000;
const BEHOLD_BETIK = 'https://w.behold.so/widget.js';

/** Akış yalnızca ayar açık VE feedId doluysa görünür. */
export function instagramModu(ayar = {}) {
  return ayar.acik && typeof ayar.feedId === 'string' && ayar.feedId.trim() ? 'akis' : 'gizli';
}

const yedek = (url) =>
  `<p class="instagram__yedek"><a class="dugme" href="${kacis(url)}" rel="noopener" target="_blank">Instagram'da bizi takip edin</a></p>`;

export function instagramHTML(mod, ayar, instagramUrl) {
  if (mod !== 'akis') return '';
  return `<div class="kap">
  <div class="bolum__ust"><h2>Fırından son paylaşımlar</h2>
  <a href="${kacis(instagramUrl)}" rel="noopener" target="_blank">@avrupafirini</a></div>
  <div class="instagram__akis"><behold-widget feed-id="${kacis(ayar.feedId.trim())}"></behold-widget></div>
  <noscript>${yedek(instagramUrl)}</noscript>
</div>`;
}

/** Tarayıcıda: bölümü doldurur; betik yüklenmez ya da içerik gelmezse yedek bağlantıyı gösterir. */
export function instagramYukle(kap, ayar, instagramUrl) {
  const mod = instagramModu(ayar);
  if (mod === 'gizli') { kap.remove(); return; }
  kap.hidden = false;
  kap.innerHTML = instagramHTML(mod, ayar, instagramUrl);
  const yedegeGec = () => {
    const akis = kap.querySelector('.instagram__akis');
    if (akis) akis.outerHTML = yedek(instagramUrl);
  };
  const betik = document.createElement('script');
  betik.type = 'module';
  betik.src = BEHOLD_BETIK;
  betik.onerror = yedegeGec;
  document.head.appendChild(betik);
  setTimeout(() => {
    const w = kap.querySelector('behold-widget');
    const dolu = w && (w.shadowRoot?.childElementCount || w.childElementCount || w.offsetHeight > 40);
    if (!dolu) yedegeGec();
  }, YEDEK_SURE_MS);
}
