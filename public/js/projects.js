/* =============================================
   PROJECTS.JS — GitHub API fetch & render
   ============================================= */

const GITHUB_USER = 'yunusemretom';
const GITHUB_API  = `https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&direction=desc&per_page=100&type=public`;

// Language → colour mapping (GitHub official colours)
const LANG_COLORS = {
  'Python':     '#3572A5',
  'JavaScript': '#f1e05a',
  'TypeScript': '#2b7489',
  'C++':        '#f34b7d',
  'C':          '#555555',
  'C#':         '#178600',
  'Java':       '#b07219',
  'HTML':       '#e34c26',
  'CSS':        '#563d7c',
  'Shell':      '#89e051',
  'Go':         '#00ADD8',
  'Rust':       '#dea584',
  'default':    '#8a8880'
};

let allRepos = [];
let activeFilter = 'all';
let showForks = false;

// ── Fetch repos ──────────────────────────────
async function loadProjects() {
  const grid  = document.getElementById('projects-grid');
  const errEl = document.getElementById('projects-error');
  if (!grid) return;

  // show skeletons
  grid.style.display = 'grid';
  errEl.style.display = 'none';

  try {
    const res = await fetch(GITHUB_API, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!res.ok) throw new Error('API error: ' + res.status);

    allRepos = await res.json();
    renderProjects();
  } catch (err) {
    console.error(err);
    grid.style.display = 'none';
    errEl.style.display = 'flex';
  }
}

// ── Render projects ───────────────────────────
function renderProjects() {
  const grid     = document.getElementById('projects-grid');
  const noResult = document.getElementById('no-results');
  if (!grid) return;

  let repos = allRepos.filter(r => {
    if (!showForks && r.fork) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'other') {
      return !['Python','JavaScript','TypeScript','C++','C#'].includes(r.language);
    }
    return r.language === activeFilter;
  });

  grid.innerHTML = '';

  if (!repos.length) {
    noResult.style.display = 'block';
    return;
  }
  noResult.style.display = 'none';

  repos.forEach((repo, i) => {
    const card = buildCard(repo, i);
    grid.appendChild(card);
    // Trigger reveal animation
    setTimeout(() => card.classList.add('visible'), i * 60);
  });
}

// ── Build a single project card ───────────────
function buildCard(repo, index) {
  const card = document.createElement('div');
  card.className = 'project-card reveal';
  card.style.transitionDelay = (index * 0.04) + 's';

  const langColor = LANG_COLORS[repo.language] || LANG_COLORS.default;
  const updated   = new Date(repo.pushed_at).toLocaleDateString('tr-TR', { year:'numeric', month:'short' });

  // Description: show nothing if empty (user will add via GitHub)
  const descHtml = repo.description
    ? `<p class="project-desc">${escHtml(repo.description)}</p>`
    : '';

  // Fork badge
  const forkBadge = repo.fork
    ? `<span class="project-fork-badge">fork</span>`
    : '';

  // Website link
  const websiteHtml = repo.homepage && repo.homepage.trim()
    ? `<a href="${escHtml(repo.homepage)}" target="_blank" rel="noopener" class="project-link website-link" title="Web Sitesi">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        Demo
      </a>`
    : '';

  card.innerHTML = `
    <div class="project-num">// ${String(index + 1).padStart(3, '0')}</div>
    <div class="project-title">${escHtml(repo.name.replace(/-/g,' '))}</div>
    ${descHtml}
    ${repo.language ? `
    <div class="project-lang">
      <span class="lang-dot" style="background:${langColor}"></span>
      ${escHtml(repo.language)}
    </div>` : ''}
    <div class="project-meta">
      <span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        ${repo.stargazers_count}
      </span>
      <span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
        ${repo.forks_count}
      </span>
      <span>${updated}</span>
      ${forkBadge}
    </div>
    <div class="project-links">
      <a href="${escHtml(repo.html_url)}" target="_blank" rel="noopener" class="project-link">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        GitHub
      </a>
      ${websiteHtml}
    </div>
  `;
  return card;
}

// ── HTML escape ───────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Filter buttons ────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProjects();
  });
});

const forkToggle = document.getElementById('show-forks');
if (forkToggle) {
  forkToggle.addEventListener('change', () => {
    showForks = forkToggle.checked;
    renderProjects();
  });
}

// ── Init ──────────────────────────────────────
loadProjects();
