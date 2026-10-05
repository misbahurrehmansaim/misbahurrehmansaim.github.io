/* Results: count each number up once, when it scrolls into view.
   The final value is already in the HTML, so crawlers, no-JS visitors and
   reduced-motion visitors always see the real figure. */

export function init(container) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = [...container.querySelectorAll('[data-count]')];
  if (reduce || !('IntersectionObserver' in window)) return;

  const format = (el, value) => { el.textContent = `${Math.round(value)}${el.dataset.suffix || ''}`; };

  items.forEach((el) => {
    const target = Number(el.dataset.count);
    format(el, 0);

    new IntersectionObserver((entries, obs) => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const duration = 1200;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        format(el, target * eased);
        if (t < 1) requestAnimationFrame(tick); else format(el, target);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 }).observe(el);
  });
}
