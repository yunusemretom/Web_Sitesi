import { defineType, defineField } from 'sanity';

const bilingual = (name, title, type = 'string') => defineField({
  name, title, type: 'object',
  fields: [
    defineField({ name: 'tr', title: 'Türkçe', type }),
    defineField({ name: 'en', title: 'English', type })
  ]
});

const bilingualItems = (name, title) => defineField({
  name, title, type: 'array',
  of: [{ type: 'object', fields: [
    bilingual('title', 'Başlık', 'string'),
    bilingual('text', 'Açıklama', 'text')
  ] }]
});

export default defineType({
  name: 'siteSettings',
  title: 'Site metinleri ve ayarları',
  type: 'document',
  fields: [
    bilingual('heroEyebrow', 'Ana sayfa üst etiketi'),
    bilingual('heroTitle', 'Ana sayfa ana başlığı'),
    bilingual('heroText', 'Ana sayfa kısa açıklaması', 'text'),
    bilingual('collaborationLabel', 'İş birliği etiketi'),
    bilingual('focusTitle', 'Çalışma alanları başlığı'),
    bilingual('focusIntro', 'Çalışma alanları açıklaması', 'text'),
    bilingualItems('homeFocus', 'Ana sayfa çalışma alanı kartları'),
    bilingual('featuredTitle', 'Öne çıkan projeler başlığı'),
    bilingual('featuredIntro', 'Öne çıkan projeler açıklaması', 'text'),
    bilingual('aboutTitle', 'Hakkımda sayfası başlığı'),
    bilingual('approachTitle', 'Yaklaşım bölümü başlığı'),
    bilingualItems('approachSteps', 'Yaklaşım adımları'),
    bilingual('competitionsTitle', 'Yarışmalar sayfası başlığı'),
    bilingual('competitionsIntro', 'Yarışmalar sayfası açıklaması', 'text'),
    bilingual('contactTitle', 'İletişim başlığı'),
    bilingual('contactText', 'İletişim açıklaması', 'text'),
    defineField({ name: 'githubUrl', title: 'GitHub bağlantısı', type: 'url' }),
    defineField({ name: 'linkedinUrl', title: 'LinkedIn bağlantısı', type: 'url' })
  ],
  preview: { prepare: () => ({ title: 'Site metinleri ve ayarları' }) }
});
