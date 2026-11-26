import { site } from '../data/site.js';
import { bugunFirinda } from './takvim.js';
import { bugunFirindaHTML } from './render.js';

const kap = document.getElementById('bugun-firinda');
if (kap) kap.innerHTML = bugunFirindaHTML(bugunFirinda(site, new Date()), site);
import { instagramYukle } from './instagram.js';

const ig = document.getElementById('instagram');
if (ig) instagramYukle(ig, site.instagramAkisi, site.firma.instagram);

