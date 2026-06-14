/* =============================================
   ANIMATIONS.JS — Scroll reveals, counters,
   skill bars, typing effect, particles
   ============================================= */

// ── Scroll Reveal ─────────────────────────────
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-left');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();

// ── Count-up Counters ─────────────────────────
(function () {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const dur = 1400;
      const step = 16;
      const inc = target / (dur / step);
      let cur = 0;
      const tick = setInterval(() => {
        cur = Math.min(cur + inc, target);
        el.textContent = Math.round(cur);
        if (cur >= target) clearInterval(tick);
      }, step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
})();

// ── Skill Bars ────────────────────────────────
(function () {
  const fills = document.querySelectorAll('.skill-bar-fill[data-width]');
  if (!fills.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.width = e.target.dataset.width + '%';
      io.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  fills.forEach(f => io.observe(f));
})();

// ── Typing Effect ─────────────────────────────
(function () {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'Full Stack Developer',
    'Drone Engineer',
    'AI Enthusiast',
    'ROS2 Developer',
    'Computer Vision',
    'Problem Solver'
  ];

  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    if (deleting) {
      el.textContent = phrase.substring(0, ci--);
      if (ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 500); return; }
      setTimeout(type, 45);
    } else {
      el.textContent = phrase.substring(0, ci++);
      if (ci > phrase.length) { deleting = true; setTimeout(type, 1800); return; }
      setTimeout(type, 85);
    }
  }
  setTimeout(type, 800);
})();

// ── Particles Canvas ──────────────────────────
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const GOLD = 'rgba(201,168,76,';
  const count = Math.min(60, Math.floor(canvas.width / 20));

  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.3,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    a: Math.random() * 0.4 + 0.05
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = GOLD + p.a + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Project Card 3D Tilt ──────────────────────
(function () {
  document.addEventListener('mousemove', e => {
    document.querySelectorAll('.project-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1.5) {
        card.style.transform = `perspective(600px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
      }
    });
  });

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
