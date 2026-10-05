/* Core script: navigation, capability detection, hero tilt, reveal.
   Everything heavier lives in js/modules/* and is loaded only when its
   section is about to scroll into view. */

const root = document.documentElement;
const mq = (q) => window.matchMedia(q);
const reduceMotion = mq('(prefers-reduced-motion: reduce)');
const coarsePointer = mq('(pointer: coarse)');
const connection = navigator.connection || {};

/* ---------- Capability detection: simplify expensive effects on weaker devices ---------- */
function isLite() {
  return (
    reduceMotion.matches ||
    coarsePointer.matches ||
    connection.saveData === true ||
    (navigator.hardwareConcurrency || 8) <= 4 ||
    (navigator.deviceMemory || 8) <= 4 ||
    window.innerWidth < 768
  );
}
function applyCapabilities() {
  root.classList.toggle('lite', isLite());
  root.classList.toggle('reduced', reduceMotion.matches);
}
applyCapabilities();
reduceMotion.addEventListener('change', applyCapabilities);
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(applyCapabilities, 200);
}, { passive: true });

/* ---------- Header + mobile menu ---------- */
const hdr = document.getElementById('hdr');
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
});
mq('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

let stuckTick = false;
window.addEventListener('scroll', () => {
  if (stuckTick) return;
  stuckTick = true;
  requestAnimationFrame(() => {
    hdr.classList.toggle('is-stuck', window.scrollY > 8);
    stuckTick = false;
  });
}, { passive: true });

/* ---------- Current-section highlight in nav ---------- */
const navLinks = new Map(
  [...document.querySelectorAll('.nav__link')].map((a) => [a.getAttribute('href').slice(1), a])
);
if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.removeAttribute('aria-current'));
      const link = navLinks.get(entry.target.id);
      if (link) link.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
}

/* ---------- Hero: pointer tilt (desktop mouse only) + pause float when off-screen ---------- */
const hero = document.getElementById('top');
const stage = document.querySelector('.hero__stage');
const deck = document.querySelector('.deck');

if (stage && deck) {
  let raf = 0;
  stage.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || root.classList.contains('lite')) return;
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      deck.style.setProperty('--ry', `${-12 + x * 14}deg`);
      deck.style.setProperty('--rx', `${6 - y * 10}deg`);
    });
  });
  stage.addEventListener('pointerleave', () => {
    deck.style.removeProperty('--ry');
    deck.style.removeProperty('--rx');
  });
}
if (hero && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    hero.classList.toggle('is-live', entry.isIntersecting);
  }, { threshold: 0.05 }).observe(hero);
} else if (hero) {
  hero.classList.add('is-live');
}

/* ---------- Hero pipeline links jump to a stage of the interactive visual ---------- */
document.querySelectorAll('[data-stage-link]').forEach((a) => {
  a.addEventListener('click', () => {
    const n = Number(a.dataset.stageLink);
    import('./modules/approach.js').then((m) => m.goTo(n)).catch(() => {});
  });
});

/* ---------- One-time reveal for before/after bars ---------- */
const revealEls = document.querySelectorAll('[data-reveal]');
if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('in'));
} else {
  const rio = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.25 });
  revealEls.forEach((el) => rio.observe(el));
}

/* ---------- Lazy-load section modules shortly before they are needed ---------- */
function loadModule(el) {
  return import(`./modules/${el.dataset.module}.js`)
    .then((m) => m.init && m.init(el))
    .catch(() => { /* the section still works as static content */ });
}
const lazy = document.querySelectorAll('[data-module]');
if ('IntersectionObserver' in window) {
  const lio = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      loadModule(entry.target);
    });
  }, { rootMargin: '600px 0px' });
  lazy.forEach((el) => lio.observe(el));
} else {
  lazy.forEach(loadModule);
}

/* ---------- Footer year ---------- */
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
