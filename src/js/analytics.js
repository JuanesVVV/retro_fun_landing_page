window.dataLayer = window.dataLayer || [];

const track = (event, params = {}) => {
  window.dataLayer.push({ event, ...params });
};

// Zona de la página donde está el elemento (header, hero, catalog, prefooter...)
const zone = (el) => {
  const parent = el.closest('header, section, footer');
  return parent ? (parent.classList[0] || parent.tagName.toLowerCase()) : 'desconocido';
};

// click_jugar, click_juego, click_red_social
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-event]');
  if (!el) return;

  switch (el.dataset.event) {
    case 'click_jugar':
      track('click_jugar', { button_location: zone(el) });
      break;
    case 'click_juego':
      track('click_juego', { game_name: el.dataset.game });
      break;
    case 'click_red_social':
      track('click_red_social', { network: el.dataset.network });
      break;
  }
});

// faq_open: "toggle" no burbujea, por eso se usa la fase de captura (true)
document.addEventListener('toggle', (e) => {
  const item = e.target;
  if (item.matches?.('.faq__item') && item.open) {
    track('faq_open', { faq_question: item.querySelector('summary').textContent.trim() });
  }
}, true);

// form_newsletter: se llama desde main.js cuando el envío es correcto
export const trackNewsletter = () => track('form_newsletter', { form_id: 'newsletter' });