(() => {
  // Mobile navigation toggle
  const toggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.desktop-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('mobile-open', !open);
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Interactive parallax & orbital satellites on Hero Visual (.hero-visual)
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.addEventListener('pointermove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      heroVisual.style.setProperty('--mx', `${(nx * 14).toFixed(2)}px`);
      heroVisual.style.setProperty('--my', `${(ny * 14).toFixed(2)}px`);
    });

    heroVisual.addEventListener('pointerleave', () => {
      heroVisual.style.setProperty('--mx', '0px');
      heroVisual.style.setProperty('--my', '0px');
    });

    const satOne = heroVisual.querySelector('.sat-one');
    const satTwo = heroVisual.querySelector('.sat-two');
    const orbitOne = heroVisual.querySelector('.orbit-one');
    const orbitTwo = heroVisual.querySelector('.orbit-two');

    if (satOne && satTwo && orbitOne && orbitTwo) {
      const start = performance.now();
      const tick = (now) => {
        const elapsed = (now - start) / 1000;
        const a1 = elapsed * 0.9;
        const a2 = -elapsed * 0.65 + 1.2;
        const rx1 = orbitOne.offsetWidth / 2;
        const ry1 = orbitOne.offsetHeight / 2;
        const rx2 = orbitTwo.offsetWidth / 2;
        const ry2 = orbitTwo.offsetHeight / 2;

        satOne.style.transform = `translate3d(${(Math.cos(a1) * rx1).toFixed(1)}px, ${(Math.sin(a1) * ry1).toFixed(1)}px, 0)`;
        satTwo.style.transform = `translate3d(${(Math.cos(a2) * rx2).toFixed(1)}px, ${(Math.sin(a2) * ry2).toFixed(1)}px, 0)`;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  // Fallback for scroll progress indicator
  if (typeof CSS !== 'undefined' && !CSS.supports('animation-timeline', 'scroll()')) {
    const progress = document.querySelector('#progress');
    if (progress) {
      window.addEventListener(
        'scroll',
        () => {
          const scrollable = document.documentElement.scrollHeight - window.innerHeight;
          const progressPercentage = scrollable > 0 ? window.scrollY / scrollable : 0;
          progress.style.transform = `scaleX(${progressPercentage})`;
        },
        { passive: true }
      );
    }
  }

  // Fallback for browsers without CSS Scroll-Driven Animations support
  if (
    typeof CSS !== 'undefined' &&
    !CSS.supports('(animation-timeline: view()) and (animation-range: entry)') &&
    'IntersectionObserver' in window
  ) {
    const targets = document.querySelectorAll(
      '.focus-card, .project-tile, .closing-cta, .competition-row, .contact-card, .detail-panel'
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    targets.forEach((el, idx) => {
      el.classList.add('v2-reveal-fallback');
      el.style.transitionDelay = `${(idx % 4) * 0.07}s`;
      observer.observe(el);
    });
  }
})();
