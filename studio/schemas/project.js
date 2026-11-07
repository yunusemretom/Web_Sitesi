import { defineType, defineField } from 'sanity';
const bilingual = (name, title, type = 'text') => defineField({ name, title, type: 'object', fields: [
  { name: 'tr', title: 'Türkçe', type },
  { name: 'en', title: 'English', type }
] });
export default defineType({
  name: 'project', title: 'Projeler', type: 'document',
  fields: [
    bilingual('title', 'Proje başlığı', 'string'),
    defineField({ name: 'slug', title: 'URL kısa adı', type: 'slug', options: { source: 'title.tr', maxLength: 96 } }),
    bilingual('summary', 'Kısa açıklama'),
    bilingual('description', 'Detaylı açıklama'),
    bilingual('contribution', 'Projede yaptığım çalışma'),
    defineField({ name: 'category', title: 'Kategori', type: 'string' }),
    defineField({ name: 'technologies', title: 'Teknolojiler / yetkinlikler', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'status', title: 'Yayın durumu', type: 'string', options: { list: [{ title: 'Taslak', value: 'draft' }, { title: 'Yayında', value: 'published' }] }, initialValue: 'draft' }),
    defineField({ name: 'stage', title: 'Proje aşaması', type: 'string', options: { list: ['research','prototype','active','completed'].map(value => ({ title: value, value })) } }),
    defineField({ name: 'featured', title: 'Ana sayfada göster', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Görüntülenme sırası', type: 'number', initialValue: 100 }),
    defineField({ name: 'coverImage', title: 'Kapak görseli', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'gallery', title: 'Proje galeri görselleri', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'repositoryUrl', title: 'Kod deposu bağlantısı', type: 'url' }),
    defineField({ name: 'demoUrl', title: 'Demo bağlantısı', type: 'url' })
  ],
  preview: { select: { title: 'title.tr', subtitle: 'category', media: 'coverImage' } }
});
