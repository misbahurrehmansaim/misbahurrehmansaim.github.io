/* Interactive audit / strategy visual.
   Eight stages. Each stage turns layers of the SVG on or off and rewrites the legend. */

const LEGEND = {
  1: { kind: 'lime', dot: true, items: ['What the business sells and who buys it', 'How people find it today', 'Where leads and sales come from'] },
  2: { kind: 'lime', dot: true, items: ['SEO and site structure', 'Content and messaging', 'Speed and mobile experience', 'Ads and the path to conversion'] },
  3: { kind: 'flag', items: ['Slow hero image', 'Missing title and meta description', 'Thin product copy', 'Weak call to action'] },
  4: { kind: 'ghost', letters: true, items: ['They publish guides for the same searches', 'They show proof next to the call to action', 'They have a page for a topic this site skips'] },
  5: { kind: 'lime', items: ['A topic page that does not exist yet', 'A call to action that could convert better', 'A local search gap competitors ignore'] },
  6: { kind: 'lime', square: true, items: ['Fix what blocks growth first', 'Fill the content gaps', 'Test what converts'] },
  7: { kind: 'lime', check: true, items: ['Hero image optimized', 'Title and meta description rewritten', 'Product copy expanded', 'Call to action clarified'] },
  8: { kind: 'lime', up: true, items: ['Organic traffic', 'Rankings', 'Leads', 'Conversions'] }
};
const NAMES = ['', 'Research', 'Audit', 'Problems found', 'Competitor analysis', 'Growth opportunities', 'Strategy', 'Implementation', 'Results'];
const TOTAL = 8;

const state = { stage: 1, pending: null, ready: false, timer: 0 };
let els = {};

function parseRange(value) {
  if (!value) return null;
  const [a, b] = value.split('-').map(Number);
  return { a, b };
}

function paintLayers(n) {
  els.layers.forEach((layer) => {
    const show = parseRange(layer.dataset.show);
    const dim = parseRange(layer.dataset.dim);
    layer.classList.toggle('on', !!show && n >= show.a && n <= show.b);
    layer.classList.toggle('dim', !!dim && n >= dim.a && n <= dim.b);
  });
  /* restart the scan animation each time stage 2 is selected */
  const scanLayer = els.svg.querySelector('[data-show="2-2"]');
  if (scanLayer && n === 2) {
    scanLayer.classList.remove('on');
    void scanLayer.getBoundingClientRect();
    scanLayer.classList.add('on');
  }
}

function paintLegend(n) {
  const cfg = LEGEND[n];
  els.legend.textContent = '';
  cfg.items.forEach((text, i) => {
    const li = document.createElement('li');
    li.className = 'legend__i';
    const k = document.createElement('span');
    k.className = 'legend__k';
    if (cfg.kind === 'flag') k.classList.add('legend__k--flag');
    if (cfg.kind === 'ghost') k.classList.add('legend__k--ghost');
    if (cfg.square) k.classList.add('legend__k--sq');
    k.setAttribute('aria-hidden', 'true');
    if (cfg.dot) k.classList.add('legend__k--dot');
    else if (cfg.letters) k.textContent = String.fromCharCode(65 + i);
    else if (cfg.check) k.textContent = '✓';
    else if (cfg.up) k.textContent = '↑';
    else k.textContent = String(i + 1);
    const span = document.createElement('span');
    span.textContent = text;
    li.append(k, span);
    els.legend.append(li);
  });
}

function paintStages(n) {
  els.buttons.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.stage) === n)));
  els.prev.disabled = n === 1;
  els.next.disabled = n === TOTAL;
  els.live.textContent = `Stage ${n} of ${TOTAL}: ${NAMES[n]}`;
}

export function setStage(n, { fromUser = true } = {}) {
  n = Math.min(TOTAL, Math.max(1, n));
  if (fromUser) stopPlay();
  state.stage = n;
  paintLayers(n);
  paintLegend(n);
  paintStages(n);
}

export function goTo(n) {
  state.pending = n;
  if (state.ready) { setStage(n); state.pending = null; }
}

function stopPlay() {
  clearInterval(state.timer);
  state.timer = 0;
  if (els.play) {
    els.play.setAttribute('aria-pressed', 'false');
    els.play.textContent = state.stage === TOTAL ? 'Replay walkthrough' : 'Play walkthrough';
  }
}

function startPlay() {
  if (state.stage === TOTAL) setStage(1, { fromUser: false });
  els.play.setAttribute('aria-pressed', 'true');
  els.play.textContent = 'Pause walkthrough';
  state.timer = setInterval(() => {
    if (state.stage >= TOTAL) { stopPlay(); return; }
    setStage(state.stage + 1, { fromUser: false });
    if (state.stage >= TOTAL) stopPlay();
  }, 2800);
}

function keepVisualInView() {
  if (window.innerWidth >= 960 || !els.frame) return;
  const r = els.frame.getBoundingClientRect();
  const headerH = 68;
  if (r.top < headerH || r.bottom > window.innerHeight) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    els.frame.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
  }
}

export function init(container) {
  if (state.ready) return;
  els = {
    svg: container.querySelector('svg'),
    frame: container.querySelector('#frame'),
    layers: [...container.querySelectorAll('[data-show]')],
    legend: container.querySelector('#legend'),
    buttons: [...container.querySelectorAll('.stage')],
    prev: container.querySelector('#prev'),
    next: container.querySelector('#next'),
    play: container.querySelector('#play'),
    ctrl: container.querySelector('#ctrl'),
    live: container.querySelector('#stage-live')
  };

  els.ctrl.hidden = false;
  els.buttons.forEach((b) => b.addEventListener('click', () => { setStage(Number(b.dataset.stage)); keepVisualInView(); }));
  els.prev.addEventListener('click', () => setStage(state.stage - 1));
  els.next.addEventListener('click', () => setStage(state.stage + 1));
  els.play.addEventListener('click', () => (state.timer ? stopPlay() : startPlay()));

  /* arrow keys move between stages while a stage button has focus */
  container.querySelector('#stages').addEventListener('keydown', (e) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    const next = state.stage + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1);
    setStage(next);
    const target = els.buttons[Math.min(TOTAL, Math.max(1, next)) - 1];
    if (target) target.focus();
  });

  state.ready = true;
  setStage(state.pending || 1, { fromUser: false });
  state.pending = null;
}
