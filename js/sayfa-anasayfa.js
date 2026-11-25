import { site } from '../data/site.js';
import { bugunFirinda } from './takvim.js';
import { bugunFirindaHTML } from './render.js';

const kap = document.getElementById('bugun-firinda');
if (kap) kap.innerHTML = bugunFirindaHTML(bugunFirinda(site, new Date()), site);
