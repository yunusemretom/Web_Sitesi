const dictionaries = {
  tr: require('../locales/tr.json'),
  en: require('../locales/en.json')
};
const paths = {
  home: { tr: '', en: '' },
  about: { tr: 'hakkimda', en: 'about' },
  projects: { tr: 'projeler', en: 'projects' },
  competitions: { tr: 'yarismalar', en: 'competitions' },
  blog: { tr: 'blog', en: 'blog' },
  contact: { tr: 'iletisim', en: 'contact' }
};
function localeFrom(value) { return value === 'en' ? 'en' : 'tr'; }
function copy(locale) { return dictionaries[localeFrom(locale)]; }
function routeFor(page, locale = 'tr') {
  const lang = localeFrom(locale);
  return '/' + lang + (paths[page] && paths[page][lang] ? '/' + paths[page][lang] : '');
}
module.exports = { localeFrom, copy, routeFor };
