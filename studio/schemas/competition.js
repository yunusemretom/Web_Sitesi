import { defineType, defineField } from 'sanity';
export default defineType({
  name: 'competition', title: 'Yarışmalar', type: 'document',
  fields: [
    { name: 'title', title: 'Başlık (TR / EN)', type: 'object', fields: [{ name: 'tr', title: 'Türkçe', type: 'string' }, { name: 'en', title: 'English', type: 'string' }] },
    { name: 'description', title: 'Açıklama (TR / EN)', type: 'object', fields: [{ name: 'tr', title: 'Türkçe', type: 'text' }, { name: 'en', title: 'English', type: 'text' }] },
    { name: 'year', title: 'Yıl', type: 'number' },
    { name: 'role', title: 'Kişisel rol (TR / EN)', type: 'object', fields: [{ name: 'tr', title: 'Türkçe', type: 'string' }, { name: 'en', title: 'English', type: 'string' }] },
    defineField({ name: 'team', title: 'Takım / organizasyon', type: 'string' }),
    defineField({ name: 'result', title: 'Sonuç / başarı', type: 'string' }),
    defineField({ name: 'link', title: 'Yarışma bağlantısı', type: 'url' }),
    defineField({ name: 'coverImage', title: 'Görsel', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'status', title: 'Yayın durumu', type: 'string', options: { list: [{ title: 'Taslak', value: 'draft' }, { title: 'Yayında', value: 'published' }] }, initialValue: 'draft' }),
    defineField({ name: 'order', title: 'Sıralama', type: 'number', initialValue: 100 })
  ],
  preview: { select: { title: 'title.tr', subtitle: 'year', media: 'coverImage' } }
});
