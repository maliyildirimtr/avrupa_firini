import { GUNLER } from './veri-dogrula.js';
import { yolTarifiUrl, tamAdres } from './harita.js';

const INGILIZCE = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const kok = (site) => `https://${site.firma.alanAdi}`;
const telIntl = (t) => `+90 ${t.replace(/^0/, '')}`;

export function yapilandirilmisVeri(site) {
  const f = site.firma;
  return {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: f.ad,
    description: `${f.slogan} ${f.il} ${f.ilce}'da taş fırın. ${f.aciklama}`,
    foundingDate: String(f.kurulus),
    url: kok(site),
    telephone: telIntl(f.telefonlar[0]),
    address: {
      '@type': 'PostalAddress',
      streetAddress: f.sokakAdresi,
      addressLocality: f.ilce,
      addressRegion: f.il,
      addressCountry: 'TR',
    },
    hasMap: yolTarifiUrl(tamAdres(f)),
    servesCuisine: 'Karadeniz',
    sameAs: [f.instagram],
    openingHoursSpecification: GUNLER.map((g, i) => [g, i])
      .filter(([g]) => site.saatler[g])
      .map(([g, i]) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [INGILIZCE[i]],
        opens: site.saatler[g].acilis,
        closes: site.saatler[g].kapanis,
      })),
  };
}

export function urunVerisi(urun, site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: urun.ad,
    description: urun.aciklama,
    image: `${kok(site)}/${urun.foto || 'img/yer-tutucu.svg'}`,
    brand: { '@type': 'Brand', name: site.firma.ad },
    url: `${kok(site)}/${{ ekmek: 'ekmeklerimiz', kete: 'keteler', lezzet: 'lezzetler' }[urun.kategori]}.html#${urun.id}`,
  };
}
