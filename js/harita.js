export const haritaEmbedUrl = (adres) => `https://www.google.com/maps?q=${encodeURIComponent(adres)}&output=embed`;
export const yolTarifiUrl = (adres) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(adres)}`;
/** '0541 322 13 16' → 'tel:+905413221316' */
export const telLink = (no) => `tel:+90${no.replace(/\D/g, '').replace(/^0/, '')}`;
