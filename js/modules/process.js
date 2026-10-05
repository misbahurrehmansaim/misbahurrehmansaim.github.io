/* Process section: the rail fills and the current step lights up as you scroll. */

export function init(list) {
  const steps = [...list.querySelectorAll('.step')];
  if (!steps.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    steps.forEach((s) => s.classList.add('is-done'));
    steps[steps.length - 1].classList.add('is-active');
    return;
  }

  /* A step is "reached" once its top passes the 60% line of the viewport. */
  const reached = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const step = entry.target;
      const above = entry.boundingClientRect.top < window.innerHeight * 0.6;
      if (entry.isIntersecting || above) reached.add(step); else reached.delete(step);
    });
    let last = null;
    steps.forEach((s) => {
      const on = reached.has(s);
      s.classList.toggle('is-done', on);
      if (on) last = s;
    });
    steps.forEach((s) => s.classList.toggle('is-active', s === last));
  }, { rootMargin: '0px 0px -40% 0px', threshold: 0 });

  steps.forEach((s) => io.observe(s));
}
