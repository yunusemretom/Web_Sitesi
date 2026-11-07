(() => {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.desktop-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('mobile-open', !open);
  });
})();
