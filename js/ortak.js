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
