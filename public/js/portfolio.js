(() => {
  // Mobile navigation toggle
  const toggle = document.querySelector('.mobile-nav-toggle');
  const toggleIcon = document.querySelector('.mobile-nav-icon');
  const nav = document.querySelector('.desktop-nav');

  const setMobileMenuOpen = (isOpen) => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(isOpen));
    nav.classList.toggle('mobile-open', isOpen);
    document.body.classList.toggle('mobile-menu-active', isOpen);
    if (toggleIcon) {
      toggleIcon.textContent = isOpen ? '✕' : '☰';
    }
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      setMobileMenuOpen(!open);
    });

    // Close mobile menu when clicking a navigation link
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMobileMenuOpen(false));
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      if (
        nav.classList.contains('mobile-open') &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('mobile-open')) {
        setMobileMenuOpen(false);
        toggle.focus();
      }
    });

    // Reset mobile menu state if viewport resizes to desktop
    const desktopMedia = window.matchMedia('(min-width: 769px)');
    if (desktopMedia.addEventListener) {
      desktopMedia.addEventListener('change', (e) => {
        if (e.matches) setMobileMenuOpen(false);
      });
    }
  }

  // Profile portrait graceful fallback chain:
  // 1) Sanity image URL -> 2) Local fallback (/imgs/profile.png) -> 3) Styled monogram placeholder
  const portraitImg = document.querySelector('.portrait-img');
  if (portraitImg) {
    const container = portraitImg.closest('.portrait-placeholder');
    const handlePortraitError = () => {
      const fallbackSrc = portraitImg.getAttribute('data-fallback-src');
      const currentSrc = portraitImg.getAttribute('src') || '';
      if (fallbackSrc && currentSrc !== fallbackSrc && !portraitImg.dataset.triedFallback) {
        portraitImg.dataset.triedFallback = 'true';
        portraitImg.setAttribute('src', fallbackSrc);
        return;
      }
      if (container) {
        container.classList.add('is-fallback');
      }
    };

    portraitImg.addEventListener('error', handlePortraitError);
    if (portraitImg.complete && portraitImg.naturalWidth === 0) {
      handlePortraitError();
    }
  }

  // Scroll progress fallback for browsers without CSS scroll() timeline support
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (
    !prefersReducedMotion &&
    typeof CSS !== 'undefined' &&
    !CSS.supports('animation-timeline', 'scroll()')
  ) {
    const progress = document.querySelector('#progress');
    if (progress) {
      window.addEventListener(
        'scroll',
        () => {
          const scrollable = document.documentElement.scrollHeight - window.innerHeight;
          const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
          progress.style.transform = `scaleX(${ratio})`;
        },
        { passive: true }
      );
    }
  }
})();
