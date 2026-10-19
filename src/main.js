import '@fontsource/pixelify-sans/700.css';
import './style.css';
import { trackNewsletter } from './js/analytics.js';
import { sendToHubSpot } from './js/hubspot.js';
import logoText from './assets/images/logo-text.png';
document.querySelector('.logo img').src = logoText;
import { games } from './data/games.js';

//  Catálogo 

  const grid = document.getElementById('catalog-grid');
  grid.innerHTML = games.map(g => `
    <a href="#juegos" class="game" data-event="click_juego" data-game="${g.name}">
      <div class="game__thumb" style="background:${g.color}"></div>
      <div class="game__name"><span>${g.name}</span><span aria-hidden="true">›</span></div>
    </a>
  `).join('');


//  FAQ (acordeón)

//  Carrusel de testimonios 

  const track = document.getElementById('track');
  const slides = track.children;
  const dots = document.getElementById('dots');
  let index = 0;

// Cuántas tarjetas se ven a la vez (3 en escritorio, 1 en móvil)
  const perView = () => (window.innerWidth <= 768 ? 1 : 3);
  const maxIndex = () => Math.max(0, slides.length - perView());

  dots.innerHTML = [...slides].map((_, i) =>
    `<button aria-label="Ir al testimonio ${i + 1}" data-i="${i}"></button>`
  ).join('');

  function update() {
    index = Math.min(index, maxIndex());
    const step = slides[0].offsetWidth + 16; // ancho + gap
    track.style.transform = `translateX(-${index * step}px)`;
    [...dots.children].forEach((d, i) => d.classList.toggle('active', i === index));
  }

  document.getElementById('next').addEventListener('click', () => {
    index = index >= maxIndex() ? 0 : index + 1;
    update();
  });
  document.getElementById('prev').addEventListener('click', () => {
    index = index <= 0 ? maxIndex() : index - 1;
    update();
  });
  dots.addEventListener('click', e => {
    if (e.target.dataset.i) { index = Number(e.target.dataset.i); update(); }
  });
  window.addEventListener('resize', update);
  update();

// (los agregamos cuando maquetemos esas secciones)

// ===== Formulario (validación + HubSpot + evento) =====
const form = document.getElementById('newsletter-form');
const msg = document.getElementById('form-msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    msg.textContent = 'Revisa los campos e inténtalo de nuevo.';
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  const data = new FormData(form);
  button.disabled = true;
  msg.textContent = 'Enviando...';

  try {
    await sendToHubSpot({
      firstname: data.get('firstname'),
      email: data.get('email'),
    });
    trackNewsletter();   // evento form_newsletter, solo si HubSpot aceptó el envío
    msg.textContent = '¡Gracias! Te avisaremos de las novedades.';
    form.reset();
  } catch (err) {
    console.error(err);
    msg.textContent = 'No pudimos enviar tus datos. Inténtalo de nuevo.';
  } finally {
    button.disabled = false;
  }
});

