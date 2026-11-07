const { query } = require('./sanity');
const {
  DEFAULT_USERNAME,
  fetchGitHubRepos,
  filterGitHubRepos,
  extractRepoNameFromUrl
} = require('./github');

// Manual engineering projects (also used as fallback when no Sanity project documents exist yet)
const manualSampleProjects = [
  {
    _id: 'flight-controller-pcb',
    slug: 'flight-controller-pcb',
    sourceType: 'manual',
    status: 'published',
    stage: 'prototype',
    featured: true,
    order: 10,
    category: { tr: 'Gömülü Sistemler & PCB', en: 'Embedded Systems & PCB' },
    title: { tr: 'Uçuş Kontrol Kartı', en: 'Flight Controller Board' },
    summary: {
      tr: 'STM32/AT32 tabanlı uçuş kontrol kartı için şematik tasarım, PCB yerleşimi ve iki katmanlı prototipleme çalışması.',
      en: 'Schematic design, PCB layout and two-layer prototyping for an STM32/AT32-based flight controller board.'
    },
    description: {
      tr: 'İnsansız hava araçlarında kullanılmak üzere geliştirilen bu uçuş kontrol kartı çalışmasında; mikrodenetleyici seçimi, sensör entegrasyonu (IMU, barometre, manyetometre), güç dağıtımı ve sinyal bütünlüğü kriterleri dikkate alınarak şematik ve PCB yerleşimi gerçekleştirilmiştir.',
      en: 'Developed for unmanned aerial vehicles, this flight controller project covers microcontroller selection, sensor integration (IMU, barometer, magnetometer), power regulation and signal-integrity-oriented schematic and PCB layout design.'
    },
    technologies: ['STM32', 'AT32', 'PCB Design', 'KiCad / Altium', 'PX4 / ArduPilot'],
    contribution: {
      tr: 'Kart mimarisi, bileşen seçimi ve üretilebilirlik odaklı PCB uyarlamaları üzerinde çalışıyorum.',
      en: 'Working on board architecture, component selection and manufacturability-focused PCB adaptations.'
    }
  },
  {
    _id: 'nobetci-gnss',
    slug: 'nobetci-gnss-parazit-tespit-agi',
    sourceType: 'manual',
    status: 'published',
    stage: 'research',
    featured: true,
    order: 20,
    category: { tr: 'GNSS / RF Sistemleri', en: 'GNSS / RF Systems' },
    title: { tr: 'NÖBETÇİ — GNSS Parazit Tespit Ağı', en: 'NÖBETÇİ — GNSS Interference Detection Network' },
    summary: {
      tr: 'GNSS karıştırma (jamming) ve yanıltma (spoofing) etkilerini tespit etmeye yönelik dağıtık izleme ağı konsepti.',
      en: 'A distributed monitoring network concept for detecting GNSS jamming and spoofing interference.'
    },
    description: {
      tr: 'Kritik navigasyon ve otonom İHA görevlerinde uydu sinyallerinin güvenilirliğini izlemek amacıyla geliştirilen NÖBETÇİ; sahadaki düğümlerden alınan sinyal kalitesi, SNR ve konum tutarlılığı verilerini analiz ederek parazit kaynaklarını erken aşamada tespit etmeyi hedefler.',
      en: 'Designed to monitor satellite navigation reliability in critical autonomous UAV missions, NÖBETÇİ analyzes signal quality, SNR and position consistency metrics across distributed nodes to detect interference early.'
    },
    technologies: ['GNSS', 'Signal Processing', 'RF Monitoring', 'Embedded Systems', 'Data Analysis'],
    contribution: {
      tr: 'Problem tanımı, sistem yaklaşımı ve çözüm mimarisi üzerine konsept geliştirme.',
      en: 'Concept development covering problem framing, system approach and solution architecture.'
    }
  },
  {
    _id: 'uav-systems',
    slug: 'iha-sistemleri',
    sourceType: 'manual',
    status: 'published',
    stage: 'active',
    featured: true,
    order: 30,
    category: { tr: 'İHA Sistemleri', en: 'UAV Systems' },
    title: { tr: 'İHA Sistemleri ve Yarışma Projeleri', en: 'UAV Systems & Competition Projects' },
    summary: {
      tr: 'Sabit kanat ve döner kanat platformları etrafında mekanik, elektronik ve otonom yazılım disiplinlerini bir araya getiren takım çalışmaları.',
      en: 'Team projects bringing mechanical, electronics and autonomous software disciplines together around fixed-wing and rotary-wing platforms.'
    },
    description: {
      tr: 'TEKNOFEST ve üniversite teknik takımları bünyesinde yürütülen sabit ve döner kanatlı İHA çalışmalarında; uçuş kontrol donanımı, telemetri, yer istasyonu ve görev otonomisi bileşenlerinin uçtan uca entegrasyonu ve saha testleri gerçekleştirilmektedir.',
      en: 'End-to-end integration and field testing of flight control hardware, telemetry, ground control station and mission autonomy components across fixed-wing and rotary-wing UAV platforms.'
    },
    technologies: ['UAV', 'Flight Control', 'Embedded Systems', 'ROS2', 'Systems Integration'],
    contribution: {
      tr: 'Yarışma çalışmaları ve teknik koordinasyon kapsamında sistem geliştirme süreçlerine katkı.',
      en: 'Contributing to system development and technical coordination within competition projects.'
    }
  }
];

// Default curated GitHub repositories shown when Sanity has no project documents yet
const defaultCuratedGitHubConfigs = [
  {
    githubRepo: 'Yer-Istasyonu',
    slug: 'yer-istasyonu',
    order: 40,
    featured: false,
    stage: 'active',
    category: { tr: 'İHA & Yer İstasyonu', en: 'UAV & Ground Station' },
    title: { tr: 'Yer İstasyonu Yazılımı', en: 'Ground Control Station Software' },
    summary: {
      tr: 'TEKNOFEST ve benzeri yarışmalardaki İHA, roket ve model uydu takımları için geliştirilen açık kaynaklı yer istasyonu yazılımı.',
      en: 'Open-source ground control station software built for UAV, rocket and model satellite competition teams.'
    }
  },
  {
    githubRepo: 'DogFight',
    slug: 'dogfight-uav-vision',
    order: 50,
    featured: false,
    stage: 'research',
    category: { tr: 'Otonom İHA & Görüntü İşleme', en: 'Autonomous UAV & Computer Vision' },
    title: { tr: 'DogFight — Otonom Hedef Takibi ve Kontrol', en: 'DogFight — Autonomous Target Tracking & Control' },
    summary: {
      tr: 'ROS2 ve PX4 altyapısı üzerinde YOLO tabanlı görsel hedef takibi, GPS telemetri analizi ve offboard drone kontrol denemeleri.',
      en: 'Research project combining YOLO-based visual target tracking, GPS telemetry analysis and offboard drone control over ROS2 and PX4.'
    }
  },
  {
    githubRepo: 'Celik_Kubbe',
    slug: 'celik-kubbe',
    order: 60,
    featured: false,
    stage: 'prototype',
    category: { tr: 'Hava Savunma & Otonomi', en: 'Air Defense & Autonomy' },
    title: { tr: 'Çelik Kubbe Hava Savunma Sistemi', en: 'Steel Dome Air Defense System' },
    summary: {
      tr: 'Pars takımı kapsamında geliştirilen hava savunma senaryo ve hedef angajman yazılım sistemi.',
      en: 'Air defense scenario and target engagement software system developed for the Pars competition team.'
    }
  },
  {
    githubRepo: 'Gazebo-Simulation',
    slug: 'gazebo-simulation',
    order: 70,
    featured: false,
    stage: 'completed',
    category: { tr: 'Simülasyon & Otopilot', en: 'Simulation & Autopilot' },
    title: { tr: 'Gazebo & PX4/ArduPilot Simülasyon Altyapısı', en: 'Gazebo & PX4/ArduPilot Simulation Setup' },
    summary: {
      tr: 'PX4 ve ArduPilot otopilot sistemleri için Gazebo ortamında İHA simülasyon kurulumu ve test rehberi.',
      en: 'UAV simulation setup and testing guide in Gazebo for PX4 and ArduPilot autopilot stacks.'
    }
  },
  {
    githubRepo: 'TOM_AI',
    slug: 'tom-ai',
    order: 80,
    featured: false,
    stage: 'prototype',
    category: { tr: 'Yapay Zeka & Sesli Asistan', en: 'AI & Voice Assistant' },
    title: { tr: 'TOM AI — Yapay Zeka Destekli Sesli Asistan', en: 'TOM AI — AI-Powered Voice Assistant' },
    summary: {
      tr: 'Doğal dil işleme ve sesli etkileşim yeteneklerine sahip yapay zeka destekli masaüstü asistan projesi.',
      en: 'AI-powered voice assistant project featuring natural language interaction and speech processing.'
    }
  },
  {
    githubRepo: 'Underwater_Vehicle',
    slug: 'underwater-vehicle',
    order: 90,
    featured: false,
    stage: 'research',
    category: { tr: 'Sualtı Sistemleri & Görüntü İşleme', en: 'Underwater Systems & Vision' },
    title: { tr: 'İnsansız Sualtı Aracı Görüntü İşleme', en: 'Unmanned Underwater Vehicle Computer Vision' },
    summary: {
      tr: 'Sualtı araçları için Python ve OpenCV tabanlı algılama ve görüntü işleme çalışmaları.',
      en: 'Python and OpenCV-based perception and computer vision algorithms for underwater vehicles.'
    }
  }
];

const sampleCompetitions = [
  {
    _id: 'savasan-iha',
    title: { tr: 'TEKNOFEST Savaşan İHA', en: 'TEKNOFEST Fighter UAV' },
    description: {
      tr: 'Otonom görev, algılama ve uçuş kontrolü odaklı takım çalışması.',
      en: 'Team work focused on autonomous missions, perception and flight control.'
    }
  },
  {
    _id: 'celik-kubbe',
    title: { tr: 'TEKNOFEST Çelik Kubbe Hava Savunma', en: 'TEKNOFEST Steel Dome Air Defence' },
    description: {
      tr: 'Hava savunma senaryoları ve sistem entegrasyonu üzerine yarışma çalışması.',
      en: 'Competition work around air-defence scenarios and system integration.'
    }
  },
  {
    _id: 'savasan-drone',
    title: { tr: 'TEKNOFEST Savaşan Drone', en: 'TEKNOFEST Fighting Drone' },
    description: {
      tr: 'Drone platformları, kontrol ve otonom kabiliyetler üzerine takım çalışması.',
      en: 'Team work on drone platforms, control and autonomous capabilities.'
    }
  }
];

// Known Turkish-to-English translations for single-string profile fields stored in Sanity
const FOCUS_AREA_TRANSLATIONS = {
  'İnsansız Hava Araçları ve Otonom Sistemler': 'Unmanned Aerial Vehicles & Autonomous Systems',
  'Gömülü Sistemler ve Mikrodenetleyiciler': 'Embedded Systems & Microcontrollers',
  'Elektronik ve PCB Tasarımı': 'Electronics & PCB Design',
  'Robotik ve Mekanik Sistemler': 'Robotics & Mechanical Systems',
  'Yazılım ve Sistem Entegrasyonu': 'Software & System Integration'
};

const UNIVERSITY_TRANSLATIONS = {
  'Ankara Yıldırım Beyazıt Üniversitesi': 'Ankara Yıldırım Beyazıt University'
};

function localized(value, locale) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value[locale] || value.tr || value.en || '';
  }
  return typeof value === 'string' ? value : '';
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function computeHotspotObjectPosition(hotspot, fallback = '50% 22%') {
  if (
    hotspot &&
    typeof hotspot.x === 'number' &&
    typeof hotspot.y === 'number' &&
    !Number.isNaN(hotspot.x) &&
    !Number.isNaN(hotspot.y)
  ) {
    const x = Math.max(0, Math.min(100, Math.round(hotspot.x * 100)));
    const y = Math.max(0, Math.min(100, Math.round(hotspot.y * 100)));
    return `${x}% ${y}%`;
  }
  return fallback;
}

function buildSanityImageUrl(baseUrl, { width, height, hotspot, crop, dimensions, quality = 85 } = {}) {
  if (!baseUrl || typeof baseUrl !== 'string') return null;
  if (!baseUrl.includes('cdn.sanity.io')) return baseUrl;

  try {
    const url = new URL(baseUrl);
    if (
      crop &&
      dimensions &&
      typeof dimensions.width === 'number' &&
      typeof dimensions.height === 'number' &&
      (crop.left || crop.right || crop.top || crop.bottom)
    ) {
      const left = Math.round((crop.left || 0) * dimensions.width);
      const top = Math.round((crop.top || 0) * dimensions.height);
      const rectW = Math.max(1, Math.round((1 - (crop.left || 0) - (crop.right || 0)) * dimensions.width));
      const rectH = Math.max(1, Math.round((1 - (crop.top || 0) - (crop.bottom || 0)) * dimensions.height));
      url.searchParams.set('rect', `${left},${top},${rectW},${rectH}`);
    }

    if (width) url.searchParams.set('w', String(width));
    if (height) url.searchParams.set('h', String(height));

    if (width && height) {
      url.searchParams.set('fit', 'crop');
      if (hotspot && typeof hotspot.x === 'number' && typeof hotspot.y === 'number') {
        url.searchParams.set('crop', 'focalpoint');
        url.searchParams.set('fp-x', Number(hotspot.x).toFixed(4));
        url.searchParams.set('fp-y', Number(hotspot.y).toFixed(4));
      }
    }

    url.searchParams.set('auto', 'format');
    url.searchParams.set('q', String(quality));
    return url.toString();
  } catch (_) {
    return baseUrl;
  }
}

function normalizeCompetition(item, locale) {
  return {
    ...item,
    title: localized(item.title, locale),
    description: localized(item.description, locale),
    role: localized(item.role, locale),
    team: localized(item.team, locale),
    result: localized(item.result, locale),
    competitionStage: localized(item.competitionStage, locale),
    coverImageUrl: item.coverImageUrl
      ? buildSanityImageUrl(item.coverImageUrl, {
          width: 960,
          height: 540,
          hotspot: item.coverImageHotspot,
          crop: item.coverImageCrop,
          dimensions: item.coverImageDimensions
        })
      : null
  };
}

function mergeProjectWithGitHub(item, repoMap, locale) {
  const repoName = (
    item.githubRepo ||
    item.githubData?.repoName ||
    extractRepoNameFromUrl(item.repositoryUrl) ||
    ''
  ).trim();
  const ghRepo = repoName ? repoMap.get(repoName.toLowerCase()) : null;

  // If this project is linked to a GitHub repo that is a fork/archived, only include if explicitly allowed
  if (ghRepo && (ghRepo.fork || ghRepo.archived) && !item.includeIfForkOrArchived && !item.githubRepo) {
    return null;
  }

  const customTitle = localized(item.title, locale).trim();
  const title = customTitle || item.githubData?.repoName || ghRepo?.name || '';
  if (!title) return null;

  const slug = item.slug || slugify(repoName || title);
  const customSummary = localized(item.summary, locale).trim();
  const customDescription = localized(item.description, locale).trim();
  const ghDescription = (ghRepo?.description || item.githubData?.description || '').trim();

  const summary = customSummary || customDescription || ghDescription || '';
  const description = customDescription || customSummary || ghDescription || '';
  const contribution = localized(item.contribution, locale).trim();

  const customCategory = localized(item.category, locale).trim();
  const category = customCategory || ghRepo?.language || item.githubData?.language || '';

  const customTech = Array.isArray(item.technologies) ? item.technologies.filter(Boolean) : [];
  const ghTopics = ghRepo?.topics || item.githubData?.topics || [];
  const ghLang = ghRepo?.language || item.githubData?.language || '';
  const technologies = customTech.length
    ? customTech
    : Array.from(new Set([ghLang, ...ghTopics].filter(Boolean)));

  const coverImageUrl = item.coverImageUrl
    ? buildSanityImageUrl(item.coverImageUrl, {
        width: 900,
        height: 540,
        hotspot: item.coverImageHotspot,
        crop: item.coverImageCrop,
        dimensions: item.coverImageDimensions
      })
    : null;
  const coverObjectPosition = computeHotspotObjectPosition(item.coverImageHotspot, '50% 50%');

  const showGithubLink = item.showGithubLink !== false;
  const resolvedRepoUrl =
    item.repositoryUrl ||
    ghRepo?.repositoryUrl ||
    item.githubData?.htmlUrl ||
    (repoName ? `https://github.com/${DEFAULT_USERNAME}/${repoName}` : null);
  const repositoryUrl = showGithubLink ? resolvedRepoUrl : null;

  const demoUrl = item.demoUrl || ghRepo?.homepage || item.githubData?.homepage || null;
  const stage = item.stage || (item.status && item.status !== 'published' ? item.status : 'active');
  const sourceType = item.sourceType || (repoName ? 'github' : 'manual');

  const githubMeta =
    ghRepo || item.githubData || repoName
      ? {
          repoName: ghRepo?.name || item.githubData?.repoName || repoName,
          language: ghRepo?.language || item.githubData?.language || '',
          stars: Number(ghRepo?.stars ?? item.githubData?.stars ?? 0),
          forks: Number(ghRepo?.forks ?? item.githubData?.forks ?? 0),
          updatedAt: ghRepo?.updatedAt || item.githubData?.updatedAt || null,
          topics: Array.isArray(ghTopics) ? ghTopics : []
        }
      : null;

  return {
    _id: item._id || slug,
    slug,
    sourceType,
    status: stage,
    stage,
    featured: Boolean(item.featured),
    order: typeof item.order === 'number' ? item.order : 100,
    title,
    summary,
    description,
    contribution,
    category,
    technologies,
    coverImageUrl,
    coverObjectPosition,
    galleryUrls: Array.isArray(item.galleryUrls) ? item.galleryUrls.filter(Boolean) : [],
    repositoryUrl,
    demoUrl,
    githubMeta
  };
}

function resolveProjectsList({ sanityProjects, githubRepos, locale = 'tr', featuredOnly = false }) {
  const allRepos = Array.isArray(githubRepos) ? githubRepos : [];
  const sanityList = Array.isArray(sanityProjects) ? sanityProjects : [];

  // Track explicitly included or hidden GitHub repository names in Sanity
  const hiddenRepoNames = new Set();
  const explicitlyIncludedRepoNames = [];

  for (const doc of sanityList) {
    const rName = (
      doc.githubRepo ||
      doc.githubData?.repoName ||
      extractRepoNameFromUrl(doc.repositoryUrl) ||
      ''
    )
      .trim()
      .toLowerCase();

    if (doc.hidden === true || doc.status === 'hidden' || doc.status === 'draft') {
      if (rName) hiddenRepoNames.add(rName);
    } else if (doc.status === 'published' && rName) {
      explicitlyIncludedRepoNames.push(rName);
    }
  }

  const filteredRepos = filterGitHubRepos(allRepos, {
    includeForks: false,
    includeArchived: false,
    explicitlyIncludedNames: explicitlyIncludedRepoNames
  });

  const repoMap = new Map(filteredRepos.map(r => [r.name.toLowerCase(), r]));
  // Also allow explicit per-project fork/archive override
  for (const r of allRepos) {
    if (r && r.name && !repoMap.has(r.name.toLowerCase())) {
      const matchingDoc = sanityList.find(
        d =>
          d.status === 'published' &&
          !d.hidden &&
          d.includeIfForkOrArchived &&
          String(d.githubRepo || '').toLowerCase() === r.name.toLowerCase()
      );
      if (matchingDoc) repoMap.set(r.name.toLowerCase(), r);
    }
  }

  const publishedSanityDocs = sanityList.filter(
    doc => doc && doc.status === 'published' && doc.hidden !== true
  );

  let sourceItems;
  if (publishedSanityDocs.length > 0) {
    sourceItems = publishedSanityDocs;
  } else {
    // Fallback mode when Sanity has no published project documents yet:
    // Combine manual engineering projects + curated GitHub repositories (excluding any hidden in Sanity)
    const fallbackGitHubItems = defaultCuratedGitHubConfigs
      .filter(cfg => !hiddenRepoNames.has(cfg.githubRepo.toLowerCase()))
      .map(cfg => ({
        _id: `gh-${cfg.slug}`,
        sourceType: 'github',
        status: 'published',
        ...cfg
      }));
    sourceItems = [...manualSampleProjects, ...fallbackGitHubItems];
  }

  const merged = sourceItems
    .map(item => mergeProjectWithGitHub(item, repoMap, locale))
    .filter(Boolean)
    .sort((a, b) => (a.order ?? 100) - (b.order ?? 100));

  if (featuredOnly) {
    const featuredItems = merged.filter(item => item.featured);
    return featuredItems.length > 0 ? featuredItems : merged.slice(0, 3);
  }

  return merged;
}

async function getProjects(locale = 'tr', featuredOnly = false) {
  const [remoteProjects, githubRepos] = await Promise.all([
    query(`*[_type == "project" && !(_id in path("drafts.**"))] | order(order asc, _createdAt desc) {
      _id,
      "slug": slug.current,
      sourceType,
      githubRepo,
      githubData,
      includeIfForkOrArchived,
      showGithubLink,
      hidden,
      status,
      stage,
      featured,
      order,
      title,
      summary,
      description,
      contribution,
      category,
      technologies,
      "coverImageUrl": coverImage.asset->url,
      "coverImageHotspot": coverImage.hotspot,
      "coverImageCrop": coverImage.crop,
      "coverImageDimensions": coverImage.asset->metadata.dimensions,
      "galleryUrls": gallery[].asset->url,
      repositoryUrl,
      demoUrl
    }`),
    fetchGitHubRepos()
  ]);

  return resolveProjectsList({
    sanityProjects: remoteProjects,
    githubRepos,
    locale,
    featuredOnly
  });
}

async function getCompetitions(locale = 'tr') {
  const remote = await query(`*[_type == "competition" && status == "published" && !(_id in path("drafts.**"))] | order(order asc, year desc) {
    _id,
    title,
    description,
    year,
    role,
    result,
    competitionStage,
    team,
    link,
    order,
    "coverImageUrl": coverImage.asset->url,
    "coverImageHotspot": coverImage.hotspot,
    "coverImageCrop": coverImage.crop,
    "coverImageDimensions": coverImage.asset->metadata.dimensions
  }`);
  return (Array.isArray(remote) && remote.length ? remote : sampleCompetitions).map(item =>
    normalizeCompetition(item, locale)
  );
}

async function getProfile(locale = 'tr') {
  const remote = await query(`*[_type == "profile" && !(_id in path("drafts.**"))][0] {
    name,
    headline,
    biography,
    additionalBiography,
    email,
    location,
    locationEn,
    university,
    universityEn,
    focusAreas,
    focusAreasEn,
    skills,
    education,
    "portraitAssetUrl": portrait.asset->url,
    "portraitHotspot": portrait.hotspot,
    "portraitCrop": portrait.crop,
    "portraitDimensions": portrait.asset->metadata.dimensions,
    "portraitAlt": portrait.alt,
    "cvFileUrl": cv.asset->url,
    cvExternalUrl
  }`);

  const defaultProfile = {
    name: 'Yunus Emre Tom',
    headline: locale === 'en' ? 'Engineering, software and robotics' : 'Mühendislik, yazılım ve robotik',
    email: 'yunusemretom@gmail.com',
    location: 'Ankara, Türkiye',
    university:
      locale === 'en'
        ? 'Ankara Yıldırım Beyazıt University'
        : 'Ankara Yıldırım Beyazıt Üniversitesi',
    focusAreas:
      locale === 'en'
        ? ['Unmanned Aerial Vehicles', 'Embedded Systems', 'Electronics & PCB Design']
        : ['İnsansız Hava Araçları', 'Gömülü Sistemler', 'Elektronik ve PCB Tasarımı'],
    portraitUrl: null,
    portraitObjectPosition: '50% 22%',
    portraitAlt: 'Yunus Emre Tom'
  };

  if (!remote) return defaultProfile;

  const rawUniversity = remote.university || defaultProfile.university;
  const resolvedUniversity =
    locale === 'en'
      ? remote.universityEn || UNIVERSITY_TRANSLATIONS[rawUniversity] || rawUniversity
      : rawUniversity;

  const rawFocusAreas = Array.isArray(remote.focusAreas) ? remote.focusAreas : defaultProfile.focusAreas;
  const resolvedFocusAreas =
    locale === 'en'
      ? Array.isArray(remote.focusAreasEn) && remote.focusAreasEn.length
        ? remote.focusAreasEn
        : rawFocusAreas.map(area => FOCUS_AREA_TRANSLATIONS[area] || area)
      : rawFocusAreas;

  const portraitUrl = remote.portraitAssetUrl
    ? buildSanityImageUrl(remote.portraitAssetUrl, {
        width: 1200,
        height: 1500,
        hotspot: remote.portraitHotspot,
        crop: remote.portraitCrop,
        dimensions: remote.portraitDimensions
      })
    : null;

  const portraitObjectPosition = computeHotspotObjectPosition(remote.portraitHotspot, '50% 22%');

  return {
    ...defaultProfile,
    ...remote,
    name: remote.name || defaultProfile.name,
    email: remote.email || defaultProfile.email,
    location: locale === 'en' ? remote.locationEn || remote.location || defaultProfile.location : remote.location || defaultProfile.location,
    university: resolvedUniversity,
    focusAreas: resolvedFocusAreas,
    headline: localized(remote.headline, locale) || defaultProfile.headline,
    biography: localized(remote.biography, locale),
    additionalBiography: localized(remote.additionalBiography, locale),
    portraitUrl,
    portraitObjectPosition,
    portraitAlt: localized(remote.portraitAlt, locale) || remote.name || defaultProfile.name,
    cvUrl: remote.cvFileUrl || remote.cvExternalUrl || null
  };
}

async function getSiteContent(locale = 'tr') {
  const remote = await query(`*[_type == "siteSettings" && !(_id in path("drafts.**"))][0] {
    heroEyebrow,
    heroTitle,
    heroText,
    primaryButtonText,
    secondaryButtonText,
    homeFocus,
    focusTitle,
    focusIntro,
    featuredTitle,
    featuredIntro,
    aboutTitle,
    approachTitle,
    approachSteps,
    competitionsTitle,
    competitionsIntro,
    contactTitle,
    contactText,
    collaborationLabel,
    contactEmail,
    githubUrl,
    linkedinUrl,
    socialLinks
  }`);

  const defaultApproachSteps =
    locale === 'tr'
      ? [
          { title: 'Araştır', text: 'Problemi, gereksinimleri ve kısıtları anlamlandır.' },
          { title: 'Prototiple', text: 'Fikirleri ölçülebilir ve test edilebilir sistemlere dönüştür.' },
          { title: 'İyileştir', text: 'Test sonuçları ve dokümantasyonla tasarımı geliştir.' }
        ]
      : [
          { title: 'Research', text: 'Understand the problem, requirements and constraints.' },
          { title: 'Prototype', text: 'Turn ideas into measurable and testable systems.' },
          { title: 'Iterate', text: 'Improve the design through test results and documentation.' }
        ];

  const defaults = {
    approachTitle: locale === 'tr' ? 'Nasıl çalışıyorum?' : 'How I work',
    approachSteps: defaultApproachSteps,
    githubUrl: 'https://github.com/yunusemretom',
    linkedinUrl: 'https://linkedin.com/in/yunusemretom',
    socialLinks: []
  };

  if (!remote) return defaults;

  return {
    ...defaults,
    ...remote,
    heroEyebrow: localized(remote.heroEyebrow, locale),
    heroTitle: localized(remote.heroTitle, locale),
    heroText: localized(remote.heroText, locale),
    primaryButtonText: localized(remote.primaryButtonText, locale),
    secondaryButtonText: localized(remote.secondaryButtonText, locale),
    focusTitle: localized(remote.focusTitle, locale),
    focusIntro: localized(remote.focusIntro, locale),
    featuredTitle: localized(remote.featuredTitle, locale),
    featuredIntro: localized(remote.featuredIntro, locale),
    aboutTitle: localized(remote.aboutTitle, locale),
    approachTitle: localized(remote.approachTitle, locale) || defaults.approachTitle,
    competitionsTitle: localized(remote.competitionsTitle, locale),
    competitionsIntro: localized(remote.competitionsIntro, locale),
    contactTitle: localized(remote.contactTitle, locale),
    contactText: localized(remote.contactText, locale),
    collaborationLabel: localized(remote.collaborationLabel, locale),
    githubUrl: remote.githubUrl || defaults.githubUrl,
    linkedinUrl: remote.linkedinUrl || defaults.linkedinUrl,
    socialLinks: Array.isArray(remote.socialLinks) ? remote.socialLinks.filter(s => s && s.url) : [],
    homeFocus: (remote.homeFocus || []).map(item => ({
      title: localized(item.title, locale),
      text: localized(item.text, locale)
    })),
    approachSteps:
      Array.isArray(remote.approachSteps) && remote.approachSteps.length
        ? remote.approachSteps.map(item => ({
            title: localized(item.title, locale),
            text: localized(item.text, locale)
          }))
        : defaultApproachSteps
  };
}

module.exports = {
  getSiteContent,
  getProjects,
  getCompetitions,
  getProfile,
  resolveProjectsList,
  buildSanityImageUrl,
  computeHotspotObjectPosition
};
