import { GUNLER } from './veri-dogrula.js';

const INGILIZCE = {
  Monday: 'pazartesi', Tuesday: 'sali', Wednesday: 'carsamba', Thursday: 'persembe',
  Friday: 'cuma', Saturday: 'cumartesi', Sunday: 'pazar',
};

const bicim = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Istanbul', weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

/** Ziyaretçinin cihaz saatinden bağımsız olarak İstanbul'daki gün ve saat. */
export function istanbulZamani(date) {
  const p = Object.fromEntries(bicim.formatToParts(date).map((x) => [x.type, x.value]));
  return { gun: INGILIZCE[p.weekday], saat: `${p.hour}:${p.minute}` };
}

function sonrakiAcikGun(site, gun) {
  let i = GUNLER.indexOf(gun);
  for (let n = 0; n < 7; n++) {
    i = (i + 1) % 7;
    if (site.saatler[GUNLER[i]]) return GUNLER[i];
  }
  return null;
}

function gununUrunleri(site, gun) {
  return {
    herGun: site.urunler.filter((u) => u.gunler === 'hergun'),
    ozel: site.urunler.filter((u) => Array.isArray(u.gunler) && u.gunler.includes(gun)),
  };
}

export function bugunFirinda(site, date = new Date()) {
  const { gun, saat } = istanbulZamani(date);
  const bugun = site.saatler[gun];
  let durum;
  let gosterilen = gun;
  if (!bugun) {
    durum = 'kapali';
    gosterilen = sonrakiAcikGun(site, gun);
  } else if (saat < bugun.acilis) durum = 'acilacak';
  else if (saat < bugun.kapanis) durum = 'acik';
  else {
    durum = 'kapandi';
    gosterilen = sonrakiAcikGun(site, gun);
  }
  return { durum, gun: gosterilen, saatler: site.saatler[gosterilen], ...gununUrunleri(site, gosterilen) };
}
