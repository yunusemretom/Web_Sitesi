import { defineType, defineField } from 'sanity';

const bilingual = (name, title, type = 'text') => defineField({
  name, title, type: 'object',
  fields: [
    defineField({ name: 'tr', title: 'Türkçe', type, validation: Rule => Rule.required() }),
    defineField({ name: 'en', title: 'English', type, validation: Rule => Rule.required() })
  ]
});

export default defineType({
  name: 'profile',
  title: 'Profil ve özgeçmiş',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Ad soyad', type: 'string', validation: Rule => Rule.required() }),
    bilingual('headline', 'Kısa başlık', 'string'),
    bilingual('biography', 'Hakkımda'),
    defineField({ name: 'email', title: 'E-posta', type: 'string', validation: Rule => Rule.email() }),
    defineField({ name: 'location', title: 'Konum', type: 'string' }),
    defineField({ name: 'portrait', title: 'Profil fotoğrafı', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'cv', title: 'CV dosyası', type: 'file' }),
    defineField({ name: 'skills', title: 'Yetkinlikler', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'education', title: 'Eğitim', type: 'array', of: [{ type: 'object', fields: [
      { name: 'institution', title: 'Kurum', type: 'string' },
      { name: 'program', title: 'Program / bölüm', type: 'string' },
      { name: 'startYear', title: 'Başlangıç yılı', type: 'number' },
      { name: 'endYear', title: 'Bitiş yılı', type: 'number' }
    ] }] })
  ]
});
