/* =============================================
   MAIN.JS — Global scripts
   ============================================= */

// ── Custom Cursor ──────────────────────────────
(function () {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .teaser-card, .project-card, .stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
})();

// ── Nav scroll shrink ─────────────────────────
(function () {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

// ── Mobile menu ───────────────────────────────
(function () {
  const toggle = document.getElementById('mobile-toggle');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

// ── Page transition ────────────────────────────
(function () {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('http') || a.hasAttribute('download')) return;

    a.addEventListener('click', e => {
      e.preventDefault();
      overlay.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1)';
      overlay.style.transformOrigin = 'bottom';
      overlay.style.transform = 'scaleY(1)';
      setTimeout(() => { window.location.href = href; }, 420);
    });
  });

  // Reveal on load — önce transition'sız tam göster, sonra yavaşça kaldır
  overlay.style.transition = 'none';
  overlay.style.transformOrigin = 'top';
  overlay.style.transform = 'scaleY(1)';
  setTimeout(() => {
    overlay.style.transition = 'transform 0.65s cubic-bezier(0.4,0,0.2,1)';
    overlay.style.transform = 'scaleY(0)';
  }, 80);
})();
