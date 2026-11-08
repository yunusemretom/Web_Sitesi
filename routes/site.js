const express = require('express');
const router = express.Router();
const { getSiteContent, getProjects, getCompetitions, getProfile, getBlogPosts } = require('../services/content');
const { localeFrom, copy, routeFor } = require('../config/i18n');

const pageMap = {
  home: { tr: '', en: '' },
  about: { tr: 'hakkimda', en: 'about' },
  projects: { tr: 'projeler', en: 'projects' },
  competitions: { tr: 'yarismalar', en: 'competitions' },
  blog: { tr: 'blog', en: 'blog' },
  contact: { tr: 'iletisim', en: 'contact' }
};

router.get('/', (req, res) => res.redirect(302, '/tr'));
router.get('/:locale(tr|en)', async (req, res, next) => {
  try {
    const locale = localeFrom(req.params.locale);
    const [site, projects, profile] = await Promise.all([getSiteContent(locale), getProjects(locale, true), getProfile(locale)]);
    res.render('pages/home', { locale, t: copy(locale), site, page: 'home', routeFor, projects, profile });
  } catch (error) { next(error); }
});

router.get('/:locale(tr|en)/:section', async (req, res, next) => {
  try {
    const locale = localeFrom(req.params.locale);
    const section = req.params.section;
    const sectionKey = Object.keys(pageMap).find(key => pageMap[key][locale] === section);
    if (!sectionKey || sectionKey === 'home') return next();
    const [site, profile] = await Promise.all([getSiteContent(locale), getProfile(locale)]);
    const common = { locale, t: copy(locale), site, profile, page: sectionKey, routeFor };
    if (sectionKey === 'about') return res.render('pages/about', common);
    if (sectionKey === 'projects') return res.render('pages/projects', { ...common, projects: await getProjects(locale, false) });
    if (sectionKey === 'competitions') return res.render('pages/competitions', { ...common, competitions: await getCompetitions(locale) });
    if (sectionKey === 'blog') return res.render('pages/blog', { ...common, posts: await getBlogPosts(locale) });
    if (sectionKey === 'contact') return res.render('pages/contact', common);
    return next();
  } catch (error) { next(error); }
});

router.get('/:locale(tr|en)/:section/:slug', async (req, res, next) => {
  const locale = localeFrom(req.params.locale);
  const section = req.params.section;
  try {
    if (['projeler', 'projects'].includes(section)) {
      const [projects, site, profile] = await Promise.all([getProjects(locale, false), getSiteContent(locale), getProfile(locale)]);
      const project = projects.find(item => item.slug === req.params.slug);
      if (!project) return next();
      return res.render('pages/project-detail', { locale, t: copy(locale), site, profile, page: 'projects', routeFor, project });
    }
    if (section === 'blog') {
      const [posts, site, profile] = await Promise.all([getBlogPosts(locale), getSiteContent(locale), getProfile(locale)]);
      const post = posts.find(item => item.slug === req.params.slug);
      if (!post) return next();
      const relatedPosts = posts.filter(item => item.slug !== post.slug).slice(0, 2);
      return res.render('pages/blog-detail', { locale, t: copy(locale), site, profile, page: 'blog', routeFor, post, relatedPosts });
    }
    return next();
  } catch (error) { next(error); }
});

module.exports = router;
