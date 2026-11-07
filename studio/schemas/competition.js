import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'competition',
  title: 'Yarışmalar',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Yarışma adı (TR / EN)',
      type: 'object',
      fields: [
        { name: 'tr', title: 'Türkçe', type: 'string' },
        { name: 'en', title: 'English', type: 'string' }
      ]
    },
    {
      name: 'description',
      title: 'Açıklama (TR / EN)',
      type: 'object',
      fields: [
        { name: 'tr', title: 'Türkçe', type: 'text' },
        { name: 'en', title: 'English', type: 'text' }
      ]
    },
    defineField({ name: 'year', title: 'Yıl', type: 'number' }),
    defineField({ name: 'team', title: 'Takım / Organizasyon', type: 'string' }),
    {
      name: 'role',
      title: 'Takım / Kişisel rol bilgisi (TR / EN)',
      type: 'object',
      fields: [
        { name: 'tr', title: 'Türkçe', type: 'string' },
        { name: 'en', title: 'English', type: 'string' }
      ]
    },
    defineField({ name: 'result', title: 'Sonuç / Başarı / Derece', type: 'string' }),
    {
      name: 'competitionStage',
      title: 'Yarışma durumu (TR / EN - Opsiyonel)',
      type: 'object',
      fields: [
        { name: 'tr', title: 'Türkçe', type: 'string' },
        { name: 'en', title: 'English', type: 'string' }
      ]
    },
    defineField({ name: 'link', title: 'Yarışma bağlantısı', type: 'url' }),
    defineField({
      name: 'coverImage',
      title: 'Görsel',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'status',
      title: 'Yayın durumu',
      type: 'string',
      options: {
        list: [
          { title: 'Taslak', value: 'draft' },
          { title: 'Yayında', value: 'published' }
        ]
      },
      initialValue: 'published'
    }),
    defineField({ name: 'order', title: 'Sıralama (Küçük sayı önce görünür)', type: 'number', initialValue: 100 })
  ],
  preview: {
    select: {
      title: 'title.tr',
      year: 'year',
      team: 'team',
      media: 'coverImage'
    },
    prepare({ title, year, team, media }) {
      return {
        title: title || 'Yarışma',
        subtitle: [team, year].filter(Boolean).join(' · '),
        media
      };
    }
  }
});
