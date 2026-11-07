const { query } = require('./sanity');

const sampleProjects = [
  { _id: 'flight-controller-pcb', slug: 'flight-controller-pcb', status: 'prototype', stage: 'prototype', category: 'Embedded Systems',
    title: { tr: 'Uçuş Kontrol Kartı', en: 'Flight Controller Board' },
    summary: { tr: 'STM32/AT32 tabanlı uçuş kontrol kartı için şematik, PCB yerleşimi ve iki katmanlı prototipleme üzerine çalışma.', en: 'Work on schematics, PCB layout and two-layer prototyping for an STM32/AT32-based flight controller.' },
    technologies: ['STM32', 'AT32', 'PCB Design', 'PX4 / ArduPilot'],
    contribution: { tr: 'Kart mimarisi, bileşen seçimi ve üretilebilirlik odaklı PCB uyarlamaları üzerinde çalışıyorum.', en: 'Working on board architecture, component selection and manufacturability-focused PCB adaptations.' } },
  { _id: 'nobetci-gnss', slug: 'nobetci-gnss-parazit-tespit-agi', status: 'research', stage: 'research', category: 'GNSS / RF',
    title: { tr: 'NÖBETÇİ — GNSS Parazit Tespit Ağı', en: 'NÖBETÇİ — GNSS Interference Detection Network' },
    summary: { tr: 'GNSS karıştırma ve yanıltma etkilerini tespit etmeye yönelik dağıtık izleme ağı konsepti.', en: 'A distributed monitoring network concept for detecting GNSS jamming and spoofing effects.' },
    technologies: ['GNSS', 'Signal Processing', 'RF Monitoring', 'Data Analysis'],
    contribution: { tr: 'Problem tanımı, sistem yaklaşımı ve çözüm mimarisi üzerine konsept geliştirme.', en: 'Concept development covering problem framing, system approach and solution architecture.' } },
  { _id: 'uav-systems', slug: 'iha-sistemleri', status: 'active', stage: 'active', category: 'UAV',
    title: { tr: 'İHA Sistemleri ve Yarışma Projeleri', en: 'UAV Systems & Competition Projects' },
    summary: { tr: 'Sabit kanat ve döner kanat platformları etrafında mekanik, elektronik ve yazılım disiplinlerini bir araya getiren takım çalışmaları.', en: 'Team projects bringing mechanical, electronics and software disciplines together around fixed-wing and rotary-wing platforms.' },
    technologies: ['UAV', 'Flight Control', 'Embedded Systems', 'Systems Integration'],
    contribution: { tr: 'Yarışma çalışmaları ve teknik koordinasyon kapsamında sistem geliştirme süreçlerine katkı.', en: 'Contributing to system development and technical coordination within competition projects.' } }
];
const sampleCompetitions = [
  { _id: 'savasan-iha', title: { tr: 'TEKNOFEST Savaşan İHA', en: 'TEKNOFEST Fighter UAV' }, description: { tr: 'Otonom görev, algılama ve uçuş kontrolü odaklı takım çalışması.', en: 'Team work focused on autonomous missions, perception and flight control.' } },
  { _id: 'celik-kubbe', title: { tr: 'TEKNOFEST Çelik Kubbe Hava Savunma', en: 'TEKNOFEST Steel Dome Air Defence' }, description: { tr: 'Hava savunma senaryoları ve sistem entegrasyonu üzerine yarışma çalışması.', en: 'Competition work around air-defence scenarios and system integration.' } },
  { _id: 'savasan-drone', title: { tr: 'TEKNOFEST Savaşan Drone', en: 'TEKNOFEST Fighting Drone' }, description: { tr: 'Drone platformları, kontrol ve otonom kabiliyetler üzerine takım çalışması.', en: 'Team work on drone platforms, control and autonomous capabilities.' } }
];

function localized(value, locale) {
  if (value && typeof value === 'object') return value[locale] || value.tr || value.en || '';
  return value || '';
}
function normalize(item, locale) {
  return {
    ...item,
    status: item.stage || item.status,
    title: localized(item.title, locale),
    summary: localized(item.summary, locale),
    description: localized(item.description, locale),
    contribution: localized(item.contribution, locale),
    role: localized(item.role, locale)
  };
}
async function getProjects(locale, featuredOnly) {
  const filter = featuredOnly ? ' && featured == true' : '';
  const remote = await query(`*[_type == "project" && status == "published"${filter}] | order(order asc, _createdAt desc) {
    _id, "slug": slug.current, title, summary, description, contribution, category, technologies, status, stage, featured,
    "coverImageUrl": coverImage.asset->url, "galleryUrls": gallery[].asset->url, repositoryUrl, demoUrl
  }`);
  const items = Array.isArray(remote) && remote.length ? remote : sampleProjects;
  return items.map(item => normalize(item, locale));
}
async function getCompetitions(locale) {
  const remote = await query('*[_type == "competition" && status == "published"] | order(order asc, year desc) { _id, title, description, year, role, result, team, link, "coverImageUrl": coverImage.asset->url }');
  return (Array.isArray(remote) && remote.length ? remote : sampleCompetitions).map(item => normalize(item, locale));
}
async function getProfile(locale) {
  const remote = await query('*[_type == "profile"][0] { name, headline, biography, additionalBiography, email, location, university, focusAreas, skills, education, "portraitUrl": portrait.asset->url, "cvUrl": cv.asset->url }');
  if (remote) return {
    ...remote,
    headline: localized(remote.headline, locale),
    biography: localized(remote.biography, locale),
    additionalBiography: localized(remote.additionalBiography, locale)
  };
  return {
    name: 'Yunus Emre Tom',
    headline: locale === 'en' ? 'Engineering, software and robotics' : 'Mühendislik, yazılım ve robotik',
    email: 'yunusemretom@gmail.com',
    location: 'Ankara, Türkiye',
    university: 'Ankara Yıldırım Beyazıt Üniversitesi',
    focusAreas: ['UAV', 'Embedded', 'Electronics']
  };
}
async function getSiteContent(locale) {
  const remote = await query('*[_type == "siteSettings"][0] { heroEyebrow, heroTitle, heroText, homeFocus, focusTitle, focusIntro, featuredTitle, featuredIntro, aboutTitle, approachTitle, approachSteps, competitionsTitle, competitionsIntro, contactTitle, contactText, collaborationLabel, githubUrl, linkedinUrl }');
  if (!remote) return {
    approachTitle: locale === 'tr' ? 'Nasıl çalışıyorum?' : 'How I work',
    approachSteps: locale === 'tr' ? [
      { title: 'Araştır', text: 'Problemi, gereksinimleri ve kısıtları anlamlandır.' },
      { title: 'Prototiple', text: 'Fikirleri ölçülebilir ve test edilebilir sistemlere dönüştür.' },
      { title: 'İyileştir', text: 'Test sonuçları ve dokümantasyonla tasarımı geliştir.' }
    ] : [
      { title: 'Research', text: 'Understand the problem, requirements and constraints.' },
      { title: 'Prototype', text: 'Turn ideas into measurable and testable systems.' },
      { title: 'Iterate', text: 'Improve the design through test results and documentation.' }
    ]
  };
  return {
    ...remote,
    heroEyebrow: localized(remote.heroEyebrow, locale),
    heroTitle: localized(remote.heroTitle, locale),
    heroText: localized(remote.heroText, locale),
    focusTitle: localized(remote.focusTitle, locale),
    focusIntro: localized(remote.focusIntro, locale),
    featuredTitle: localized(remote.featuredTitle, locale),
    featuredIntro: localized(remote.featuredIntro, locale),
    aboutTitle: localized(remote.aboutTitle, locale),
    approachTitle: localized(remote.approachTitle, locale),
    competitionsTitle: localized(remote.competitionsTitle, locale),
    competitionsIntro: localized(remote.competitionsIntro, locale),
    contactTitle: localized(remote.contactTitle, locale),
    contactText: localized(remote.contactText, locale),
    collaborationLabel: localized(remote.collaborationLabel, locale),
    homeFocus: (remote.homeFocus || []).map(item => ({ title: localized(item.title, locale), text: localized(item.text, locale) })),
    approachSteps: (remote.approachSteps || []).map(item => ({ title: localized(item.title, locale), text: localized(item.text, locale) }))
  };
}
module.exports = { getSiteContent, getProjects, getCompetitions, getProfile };
