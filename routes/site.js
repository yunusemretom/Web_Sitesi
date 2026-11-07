const express = require('express');
const router = express.Router();
const { getHomeContent, getProjects, getCompetitions, getProfile } = require('../services/content');
const { localeFrom, copy, routeFor } = require('../config/i18n');

const pageMap = {
  home: { tr: '', en: '' },
  about: { tr: 'hakkimda', en: 'about' },
  projects: { tr: 'projeler', en: 'projects' },
  competitions: { tr: 'yarismalar', en: 'competitions' },
  contact: { tr: 'iletisim', en: 'contact' }
};

router.get('/', (req, res) => res.redirect(302, '/tr'));
router.get('/:locale(tr|en)', async (req, res, next) => {
  try {
    const locale = localeFrom(req.params.locale);
    const [content, projects, profile] = await Promise.all([getHomeContent(locale), getProjects(locale, true), getProfile(locale)]);
    res.render('pages/home', { locale, t: copy(locale), page: 'home', routeFor, content, projects, profile });
  } catch (error) { next(error); }
});

router.get('/:locale(tr|en)/:section', async (req, res, next) => {
  try {
    const locale = localeFrom(req.params.locale);
    const section = req.params.section;
    const sectionKey = Object.keys(pageMap).find(key => pageMap[key][locale] === section);
    if (!sectionKey || sectionKey === 'home') return next();
    const common = { locale, t: copy(locale), page: sectionKey, routeFor };
    if (sectionKey === 'about') return res.render('pages/about', { ...common, profile: await getProfile(locale) });
    if (sectionKey === 'projects') return res.render('pages/projects', { ...common, projects: await getProjects(locale, false) });
    if (sectionKey === 'competitions') return res.render('pages/competitions', { ...common, competitions: await getCompetitions(locale) });
    if (sectionKey === 'contact') return res.render('pages/contact', common);
    return next();
  } catch (error) { next(error); }
});

router.get('/:locale(tr|en)/:section/:slug', async (req, res, next) => {
  if (!['projeler', 'projects'].includes(req.params.section)) return next();
  const locale = localeFrom(req.params.locale);
  try {
    const projects = await getProjects(locale, false);
    const project = projects.find(item => item.slug === req.params.slug);
    if (!project) return next();
    res.render('pages/project-detail', { locale, t: copy(locale), page: 'projects', routeFor, project });
  } catch (error) { next(error); }
});

module.exports = router;
