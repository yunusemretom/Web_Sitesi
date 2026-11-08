import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'blogPost',
  title: 'Blog Yazıları',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Yazı Başlığı (TR / EN)',
      type: 'object',
      fields: [
        { name: 'tr', title: 'Türkçe', type: 'string' },
        { name: 'en', title: 'English', type: 'string' }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'URL Kısa Adı (Slug)',
      type: 'slug',
      options: {
        source: doc => doc?.title?.tr || doc?.title?.en || 'blog-post',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'status',
      title: 'Yayın Durumu',
      type: 'string',
      options: {
        list: [
          { title: 'Yayında', value: 'published' },
          { title: 'Taslak', value: 'draft' },
          { title: 'Gizli', value: 'hidden' }
        ],
        layout: 'radio'
      },
      initialValue: 'published'
    }),
    defineField({
      name: 'featured',
      title: 'Öne Çıkan Yazı',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'publishedAt',
      title: 'Yayın Tarihi',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10)
    }),
    defineField({
      name: 'readingTime',
      title: 'Tahmini Okuma Süresi (Dakika)',
      type: 'number',
      initialValue: 6
    }),
    defineField({
      name: 'category',
      title: 'Kategori (TR / EN)',
      type: 'object',
      fields: [
        { name: 'tr', title: 'Türkçe', type: 'string' },
        { name: 'en', title: 'English', type: 'string' }
      ]
    }),
    defineField({
      name: 'excerpt',
      title: 'Kısa Özet (Kartlarda Görünür - TR / EN)',
      type: 'object',
      fields: [
        { name: 'tr', title: 'Türkçe', type: 'text', rows: 3 },
        { name: 'en', title: 'English', type: 'text', rows: 3 }
      ]
    }),
    defineField({
      name: 'content',
      title: 'Yazı İçeriği (TR / EN — Alt başlık için satır başına ## koyabilirsiniz)',
      type: 'object',
      fields: [
        { name: 'tr', title: 'Türkçe İçerik', type: 'text', rows: 14 },
        { name: 'en', title: 'English Content', type: 'text', rows: 14 }
      ]
    }),
    defineField({
      name: 'coverImage',
      title: 'Kapak Görseli',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alternatif Metin (Alt)',
          type: 'string'
        }
      ]
    }),
    defineField({
      name: 'tags',
      title: 'Etiketler / Teknolojiler',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    }),
    defineField({
      name: 'order',
      title: 'Sıralama (Küçük sayı önce görünür)',
      type: 'number',
      initialValue: 50
    })
  ],
  preview: {
    select: {
      title: 'title.tr',
      category: 'category.tr',
      publishedAt: 'publishedAt',
      status: 'status',
      media: 'coverImage'
    },
    prepare({ title, category, publishedAt, status, media }) {
      const badge = status === 'published' ? '🟢 Yayında' : status === 'draft' ? '🟡 Taslak' : '⚪ Gizli';
      return {
        title: title || 'Blog Yazısı',
        subtitle: [badge, category, publishedAt].filter(Boolean).join(' · '),
        media
      };
    }
  }
});

