const DEFAULT_USERNAME = process.env.GITHUB_USERNAME || 'yunusemretom';
const DEFAULT_TTL_SECONDS = Number(process.env.GITHUB_CACHE_TTL_SECONDS) || 900;

// Fallback snapshot used when GitHub API is unreachable or rate-limited on cold start
const FALLBACK_REPOS = [
  {
    name: 'Yer-Istasyonu',
    fullName: 'yunusemretom/Yer-Istasyonu',
    description: 'Açık kaynaklı yer istasyonu yazılımı – TEKNOFEST ve benzeri yarışmalardaki İHA, roket ve model uydu takımları için geliştirildi.',
    repositoryUrl: 'https://github.com/yunusemretom/Yer-Istasyonu',
    homepage: '',
    language: 'Python',
    stars: 6,
    forks: 0,
    updatedAt: '2026-01-15T00:00:00Z',
    topics: ['ground-station', 'iha', 'open-source', 'roket', 'teknofest', 'uav', 'yer-istasyonu'],
    fork: false,
    archived: false
  },
  {
    name: 'DogFight',
    fullName: 'yunusemretom/DogFight',
    description: 'ROS2 ve PX4 altyapısı üzerinde YOLO tabanlı görsel hedef takibi, GPS telemetri analizi ve offboard drone kontrol denemelerini bir araya getiren araştırma odaklı bir proje.',
    repositoryUrl: 'https://github.com/yunusemretom/DogFight',
    homepage: '',
    language: 'Python',
    stars: 3,
    forks: 0,
    updatedAt: '2026-02-10T00:00:00Z',
    topics: ['rf-detr', 'ros2', 'yolo'],
    fork: false,
    archived: false
  },
  {
    name: 'Celik_Kubbe',
    fullName: 'yunusemretom/Celik_Kubbe',
    description: 'Pars takımı için çelik kubbe hava savunma sistemi',
    repositoryUrl: 'https://github.com/yunusemretom/Celik_Kubbe',
    homepage: '',
    language: 'Python',
    stars: 1,
    forks: 0,
    updatedAt: '2026-01-20T00:00:00Z',
    topics: [],
    fork: false,
    archived: false
  },
  {
    name: 'TOM_AI',
    fullName: 'yunusemretom/TOM_AI',
    description: 'AI-Powered Voice Assistant Project',
    repositoryUrl: 'https://github.com/yunusemretom/TOM_AI',
    homepage: '',
    language: 'Python',
    stars: 3,
    forks: 0,
    updatedAt: '2025-11-10T00:00:00Z',
    topics: [],
    fork: false,
    archived: false
  },
  {
    name: 'Gazebo-Simulation',
    fullName: 'yunusemretom/Gazebo-Simulation',
    description: 'Gazebo ortamında simülasyon nasıl yapılır?',
    repositoryUrl: 'https://github.com/yunusemretom/Gazebo-Simulation',
    homepage: '',
    language: '',
    stars: 0,
    forks: 0,
    updatedAt: '2025-10-05T00:00:00Z',
    topics: ['ardupilot', 'gazebo', 'gazebo-ros', 'gazebo-simulator', 'px4', 'px4-autopilot'],
    fork: false,
    archived: false
  },
  {
    name: 'Underwater_Vehicle',
    fullName: 'yunusemretom/Underwater_Vehicle',
    description: 'Denizaltı yapay zeka kodları, Python, OpenCV',
    repositoryUrl: 'https://github.com/yunusemretom/Underwater_Vehicle',
    homepage: '',
    language: 'Python',
    stars: 0,
    forks: 0,
    updatedAt: '2025-09-12T00:00:00Z',
    topics: [],
    fork: false,
    archived: false
  }
];

const cache = {
  repos: null,
  fetchedAt: 0,
  etag: null,
  inFlight: null
};

function normalizeRepo(raw) {
  if (!raw || typeof raw !== 'object') return null;
  return {
    name: String(raw.name || '').trim(),
    fullName: String(raw.full_name || raw.fullName || '').trim(),
    description: raw.description ? String(raw.description).trim() : '',
    repositoryUrl: raw.html_url || raw.repositoryUrl || '',
    homepage: raw.homepage ? String(raw.homepage).trim() : '',
    language: raw.language ? String(raw.language).trim() : '',
    stars: Number(raw.stargazers_count ?? raw.stars ?? 0),
    forks: Number(raw.forks_count ?? raw.forks ?? 0),
    updatedAt: raw.updated_at || raw.updatedAt || null,
    topics: Array.isArray(raw.topics) ? raw.topics.filter(Boolean).map(String) : [],
    fork: Boolean(raw.fork),
    archived: Boolean(raw.archived)
  };
}

async function fetchGitHubRepos(options = {}) {
  const username = options.username || DEFAULT_USERNAME;
  const ttlMs = (options.ttlSeconds ?? DEFAULT_TTL_SECONDS) * 1000;
  const now = Date.now();

  if (options.forceDisableNetwork || process.env.GITHUB_API_DISABLED === 'true') {
    return cache.repos || FALLBACK_REPOS;
  }

  if (cache.repos && now - cache.fetchedAt < ttlMs) {
    return cache.repos;
  }

  if (cache.inFlight) {
    return cache.inFlight;
  }

  cache.inFlight = (async () => {
    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'yunusemretom-portfolio',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    if (cache.etag) {
      headers['If-None-Match'] = cache.etag;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5500);

    try {
      const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`;
      const response = await fetch(url, { headers, signal: controller.signal });

      if (response.status === 304 && cache.repos) {
        cache.fetchedAt = Date.now();
        return cache.repos;
      }

      if (!response.ok) {
        console.warn(`[github] API returned status ${response.status}; using cached/fallback repositories.`);
        return cache.repos || FALLBACK_REPOS;
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        return cache.repos || FALLBACK_REPOS;
      }

      const normalized = data.map(normalizeRepo).filter(Boolean);
      const etag = response.headers.get('etag');
      if (etag) cache.etag = etag;
      cache.repos = normalized;
      cache.fetchedAt = Date.now();
      return normalized;
    } catch (error) {
      console.warn('[github] Could not fetch repositories:', error.message);
      return cache.repos || FALLBACK_REPOS;
    } finally {
      clearTimeout(timer);
      cache.inFlight = null;
    }
  })();

  return cache.inFlight;
}

function filterGitHubRepos(repos, { includeForks = false, includeArchived = false, explicitlyIncludedNames = [] } = {}) {
  const allowedSet = new Set(explicitlyIncludedNames.map(n => String(n).toLowerCase()));
  return (Array.isArray(repos) ? repos : []).filter(repo => {
    if (!repo || !repo.name) return false;
    if (allowedSet.has(repo.name.toLowerCase())) return true;
    if (!includeForks && repo.fork) return false;
    if (!includeArchived && repo.archived) return false;
    return true;
  });
}

function extractRepoNameFromUrl(url, username = DEFAULT_USERNAME) {
  if (!url || typeof url !== 'string') return '';
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.toLowerCase().endsWith('github.com')) return '';
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0].toLowerCase() === username.toLowerCase()) {
      return parts[1].replace(/\.git$/i, '');
    }
  } catch (_) {
    return '';
  }
  return '';
}

function clearGitHubCache() {
  cache.repos = null;
  cache.fetchedAt = 0;
  cache.etag = null;
}

module.exports = {
  DEFAULT_USERNAME,
  FALLBACK_REPOS,
  fetchGitHubRepos,
  filterGitHubRepos,
  extractRepoNameFromUrl,
  clearGitHubCache
};
