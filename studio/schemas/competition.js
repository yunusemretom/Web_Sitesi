import { defineType, defineField } from 'sanity';

const bilingual = (name, title, type = 'text') => defineField({
  name, title, type: 'object',
  fields: [
    defineField({ name: 'tr', title: 'Türkçe', type, validation: Rule => Rule.required() }),
    defineField({ name: 'en', title: 'English', type, validation: Rule => Rule.required() })
  ]
});

export default defineType({
  name: 'competition',
  title: 'Yarışmalar',
  type: 'document',
  fields: [
    bilingual('title', 'Yarışma adı', 'string'),
    bilingual('description', 'Açıklama'),
    defineField({ name: 'year', title: 'Yıl', type: 'number', validation: Rule => Rule.min(2000).max(2100) }),
    bilingual('role', 'Takımdaki / kişisel rolüm', 'string'),
    defineField({ name: 'result', title: 'Sonuç / derece', type: 'string' }),
    defineField({ name: 'status', title: 'Yayın durumu', type: 'string', options: { list: [{ title: 'Taslak', value: 'draft' }, { title: 'Yayında', value: 'published' }] }, initialValue: 'draft', validation: Rule => Rule.required() }),
    defineField({ name: 'order', title: 'Sıralama', type: 'number', initialValue: 100 })
  ],
  preview: { select: { title: 'title.tr', subtitle: 'year' } }
});
