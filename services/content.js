const { query } = require('./sanity');

const sampleProjects = [
  {
    _id: 'flight-controller-pcb', slug: 'flight-controller-pcb', status: 'prototype', category: 'Embedded Systems',
    title: { tr: 'Uçuş Kontrol Kartı', en: 'Flight Controller Board' },
    summary: { tr: 'STM32/AT32 tabanlı uçuş kontrol kartı için şematik, PCB yerleşimi ve iki katmanlı prototipleme üzerine çalışma.', en: 'Work on schematics, PCB layout and two-layer prototyping for an STM32/AT32-based flight controller.' },
    technologies: ['STM32', 'AT32', 'PCB Design', 'PX4 / ArduPilot'],
    contribution: { tr: 'Kart mimarisi, bileşen seçimi ve üretilebilirlik odaklı PCB uyarlamaları üzerinde çalışıyorum.', en: 'Working on board architecture, component selection and manufacturability-focused PCB adaptations.' }
  },
  {
    _id: 'nobetci-gnss', slug: 'nobetci-gnss-parazit-tespit-agi', status: 'research', category: 'GNSS / RF',
    title: { tr: 'NÖBETÇİ — GNSS Parazit Tespit Ağı', en: 'NÖBETÇİ — GNSS Interference Detection Network' },
    summary: { tr: 'GNSS karıştırma ve yanıltma etkilerini tespit etmeye yönelik dağıtık izleme ağı konsepti.', en: 'A distributed monitoring network concept for detecting GNSS jamming and spoofing effects.' },
    technologies: ['GNSS', 'Signal Processing', 'RF Monitoring', 'Data Analysis'],
    contribution: { tr: 'Problem tanımı, sistem yaklaşımı ve çözüm mimarisi üzerine konsept geliştirme.', en: 'Concept development covering problem framing, system approach and solution architecture.' }
  },
  {
    _id: 'uav-systems', slug: 'iha-sistemleri', status: 'active', category: 'UAV',
    title: { tr: 'İHA Sistemleri ve Yarışma Projeleri', en: 'UAV Systems & Competition Projects' },
    summary: { tr: 'Sabit kanat ve döner kanat platformları etrafında mekanik, elektronik ve yazılım disiplinlerini bir araya getiren takım çalışmaları.', en: 'Team projects bringing mechanical, electronics and software disciplines together around fixed-wing and rotary-wing platforms.' },
    technologies: ['UAV', 'Flight Control', 'Embedded Systems', 'Systems Integration'],
    contribution: { tr: 'Yarışma çalışmaları ve teknik koordinasyon kapsamında sistem geliştirme süreçlerine katkı.', en: 'Contributing to system development and technical coordination within competition projects.' }
  }
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
  return { ...item, title: localized(item.title, locale), summary: localized(item.summary, locale), description: localized(item.description, locale), contribution: localized(item.contribution, locale) };
}
async function getProjects(locale, featuredOnly) {
  const filter = featuredOnly ? ' && featured == true' : '';
  const remote = await query(`*[_type == "project" && status == "published"${filter}] | order(order asc, _createdAt desc) { _id, "slug": slug.current, title, summary, description, contribution, category, technologies, status, featured, coverImage }`);
  const items = Array.isArray(remote) && remote.length ? remote : sampleProjects;
  return items.map(item => normalize(item, locale));
}
async function getCompetitions(locale) {
  const remote = await query('*[_type == "competition" && status == "published"] | order(order asc) { _id, title, description, year, role }');
  return (Array.isArray(remote) && remote.length ? remote : sampleCompetitions).map(item => normalize(item, locale));
}
async function getProfile(locale) {
  const remote = await query('*[_type == "profile"][0] { name, headline, biography, email, location, portrait }');
  return remote ? { ...remote, headline: localized(remote.headline, locale), biography: localized(remote.biography, locale) } : {
    name: 'Yunus Emre Tom',
    headline: locale === 'en' ? 'Engineering, software and robotics' : 'Mühendislik, yazılım ve robotik',
    email: 'yunusemretom@gmail.com'
  };
}
async function getHomeContent(locale) { return { title: locale === 'en' ? 'Selected engineering work' : 'Seçili mühendislik çalışmaları' }; }
module.exports = { getHomeContent, getProjects, getCompetitions, getProfile };
