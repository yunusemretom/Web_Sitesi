import { defineType, defineField } from 'sanity';

const bilingual = (name, title, type = 'text', group = 'content') => defineField({
  name, title, type: 'object', group,
  fields: [
    defineField({ name: 'tr', title: 'Türkçe', type, validation: Rule => Rule.required() }),
    defineField({ name: 'en', title: 'English', type, validation: Rule => Rule.required() })
  ]
});

export default defineType({
  name: 'project',
  title: 'Projeler',
  type: 'document',
  groups: [
    { name: 'content', title: 'İçerik', default: true },
    { name: 'technical', title: 'Teknik bilgiler' },
    { name: 'media', title: 'Görseller' },
    { name: 'publishing', title: 'Yayınlama' }
  ],
  fields: [
    bilingual('title', 'Proje başlığı', 'string'),
    defineField({ name: 'slug', title: 'URL kısa adı', type: 'slug', group: 'content', options: { source: 'title.tr', maxLength: 96 }, validation: Rule => Rule.required() }),
    bilingual('summary', 'Kısa açıklama'),
    bilingual('description', 'Proje detayları'),
    bilingual('contribution', 'Benim katkım'),
    defineField({ name: 'category', title: 'Kategori', type: 'string', group: 'technical' }),
    defineField({ name: 'technologies', title: 'Kullanılan teknolojiler', type: 'array', of: [{ type: 'string' }], group: 'technical' }),
    defineField({ name: 'stage', title: 'Proje aşaması', type: 'string', group: 'technical', options: { list: ['research','prototype','active','completed'].map(value => ({ title: value, value })) }, validation: Rule => Rule.required() }),
    defineField({ name: 'coverImage', title: 'Kapak görseli', type: 'image', options: { hotspot: true }, group: 'media' }),
    defineField({ name: 'gallery', title: 'Proje galerisi', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], group: 'media' }),
    defineField({ name: 'repositoryUrl', title: 'Kod deposu bağlantısı', type: 'url', group: 'technical' }),
    defineField({ name: 'demoUrl', title: 'Demo bağlantısı', type: 'url', group: 'technical' }),
    defineField({ name: 'status', title: 'Yayın durumu', type: 'string', group: 'publishing', options: { list: [{ title: 'Taslak', value: 'draft' }, { title: 'Yayında', value: 'published' }] }, initialValue: 'draft', validation: Rule => Rule.required() }),
    defineField({ name: 'featured', title: 'Ana sayfada göster', type: 'boolean', group: 'publishing', initialValue: false }),
    defineField({ name: 'order', title: 'Sıralama', type: 'number', group: 'publishing', initialValue: 100 })
  ],
  preview: { select: { title: 'title.tr', subtitle: 'category', media: 'coverImage' } }
});
