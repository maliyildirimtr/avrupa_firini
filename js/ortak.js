// Tüm sayfalarda: mobil menü ve telif yılı.
export function ortakDuzeniKur() {
  const dugme = document.querySelector('.menu-dugme');
  const menu = document.getElementById('ana-menu');
  if (dugme && menu) {
    dugme.addEventListener('click', () => {
      const acik = menu.classList.toggle('acik');
      dugme.setAttribute('aria-expanded', String(acik));
      dugme.textContent = acik ? 'Kapat' : 'Menü';
    });
  }
  document.querySelectorAll('[data-yil]').forEach((el) => { el.textContent = new Date().getFullYear(); });
}

ortakDuzeniKur();

// Hareket azaltma tercih edilmişse usta videosu durur, afiş görseli kalır.
const ustaVideo = document.querySelector('.usta__video');
if (ustaVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  ustaVideo.removeAttribute('autoplay'); ustaVideo.pause();
}
