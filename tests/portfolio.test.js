const assert = require('assert');
const app = require('../server');
const {
  resolveProjectsList,
  buildSanityImageUrl,
  computeHotspotObjectPosition
} = require('../services/content');
const { fetchGitHubRepos, FALLBACK_REPOS } = require('../services/github');

async function runTests() {
  // 1. Sanity portrait URL & Hotspot focalpoint calculation
  const rawPortraitUrl = 'https://cdn.sanity.io/images/0j1jarsg/production/sample123-1200x1500.jpg';
  const hotspotUrl = buildSanityImageUrl(rawPortraitUrl, {
    width: 1200,
    height: 1500,
    hotspot: { x: 0.48, y: 0.26 },
    crop: { top: 0.05, bottom: 0.05, left: 0, right: 0 },
    dimensions: { width: 1200, height: 1500 }
  });
  assert(hotspotUrl.includes('crop=focalpoint'), 'Hotspot focalpoint crop must be applied');
  assert(hotspotUrl.includes('fp-x=0.4800'), 'Hotspot fp-x must be set');
  assert(hotspotUrl.includes('fp-y=0.2600'), 'Hotspot fp-y must be set');
  assert.strictEqual(computeHotspotObjectPosition({ x: 0.48, y: 0.26 }), '48% 26%');
  console.log('PASS: Sanity portrait image URL & Hotspot focalpoint');

  // 2. Hidden projects filtering, ordering, and Sanity custom overrides over GitHub
  const mockSanityProjects = [
    {
      _id: 'p1',
      sourceType: 'github',
      githubRepo: 'DogFight',
      status: 'published',
      hidden: false,
      featured: true,
      order: 20,
      title: { tr: 'Özel DogFight Başlığı', en: 'Custom DogFight Title' },
      summary: { tr: 'Sanity özel açıklaması', en: 'Sanity custom summary' }
    },
    {
      _id: 'p2',
      sourceType: 'manual',
      slug: 'nobetci-gnss',
      status: 'published',
      hidden: false,
      featured: true,
      order: 5,
      title: { tr: 'NÖBETÇİ', en: 'NÖBETÇİ EN' },
      summary: { tr: 'GNSS tespit ağı', en: 'GNSS network' },
      technologies: ['GNSS', 'RF']
    },
    {
      _id: 'p3',
      sourceType: 'github',
      githubRepo: 'Yer-Istasyonu',
      status: 'published',
      hidden: true,
      order: 1
    },
    {
      _id: 'p4',
      sourceType: 'github',
      githubRepo: 'TOM_AI',
      status: 'draft',
      hidden: false,
      order: 2
    }
  ];

  const resolvedTr = resolveProjectsList({
    sanityProjects: mockSanityProjects,
    githubRepos: FALLBACK_REPOS,
    locale: 'tr',
    featuredOnly: false
  });

  assert.strictEqual(resolvedTr.length, 2, 'Hidden and draft projects must be excluded');
  assert.strictEqual(resolvedTr[0]._id, 'p2', 'Order=5 must precede Order=20');
  assert.strictEqual(resolvedTr[1]._id, 'p1');
  assert.strictEqual(resolvedTr[1].title, 'Özel DogFight Başlığı');
  assert.strictEqual(resolvedTr[1].summary, 'Sanity özel açıklaması');
  assert.strictEqual(resolvedTr[1].repositoryUrl, 'https://github.com/yunusemretom/DogFight');
  assert(resolvedTr[1].technologies.includes('Python'));
  console.log('PASS: Project ordering, hidden/draft filtering, and Sanity override priority');

  // 3. GitHub API offline fallback
  const offlineRepos = await fetchGitHubRepos({ forceDisableNetwork: true });
  assert(Array.isArray(offlineRepos) && offlineRepos.length > 0);
  console.log('PASS: GitHub API offline fallback');

  // 4. Express routes (/tr & /en) with Sanity live data and fallback mode
  const server = app.listen(0);
  try {
    const port = server.address().port;
    const base = 'http://127.0.0.1:' + port;

    const routesToCheck = [
      '/tr',
      '/en',
      '/tr/hakkimda',
      '/en/about',
      '/tr/projeler',
      '/en/projects',
      '/tr/projeler/flight-controller-pcb',
      '/en/projects/yer-istasyonu',
      '/tr/yarismalar',
      '/en/competitions',
      '/tr/blog',
      '/en/blog',
      '/tr/blog/stm32-ucus-kontrol-karti-pcb-tasarimi',
      '/en/blog/stm32-ucus-kontrol-karti-pcb-tasarimi',
      '/tr/iletisim',
      '/en/contact'
    ];

    for (const path of routesToCheck) {
      const res = await fetch(base + path);
      assert.strictEqual(res.status, 200, 'Expected 200 on ' + path);
    }
    console.log('PASS: Express routes in live mode');

    const homeHtml = await (await fetch(base + '/tr')).text();
    assert(homeHtml.includes('class="engineering-word"'), 'ENGINEERING animated wrapper present');
    assert(homeHtml.includes('class="eng-char"'), 'ENGINEERING letter spans present');

    const enAboutHtml = await (await fetch(base + '/en/about')).text();
    assert(!enAboutHtml.includes('İnsansız Hava Araçları ve Otonom Sistemler'));
    assert(enAboutHtml.includes('Ankara Yıldırım Beyazıt University'));
    console.log('PASS: Bilingual content & ENGINEERING animation markup');

    process.env.SANITY_DISABLED = 'true';
    process.env.GITHUB_API_DISABLED = 'true';
    for (const path of routesToCheck) {
      const res = await fetch(base + path);
      assert.strictEqual(res.status, 200, 'Fallback mode expected 200 on ' + path);
    }
    console.log('PASS: Express routes when Sanity and GitHub API are both offline');
  } finally {
    server.close();
  }
}

runTests().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
