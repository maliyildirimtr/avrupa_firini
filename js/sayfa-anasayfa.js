import { site } from '../data/site.js';
import { bugunFirinda } from './takvim.js';
import { bugunFirindaHTML } from './render.js';

const kap = document.getElementById('bugun-firinda');
if (kap) kap.innerHTML = bugunFirindaHTML(bugunFirinda(site, new Date()), site);
import { instagramYukle } from './instagram.js';

const ig = document.getElementById('instagram');
if (ig) instagramYukle(ig, site.instagramAkisi, site.firma.instagram);

// Hareket azaltma tercih edilmişse usta videosu durur, afiş görseli kalır.
const ustaVideo = document.querySelector('.usta__video');
if (ustaVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  ustaVideo.removeAttribute('autoplay'); ustaVideo.pause();
}
