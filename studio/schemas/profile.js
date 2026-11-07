import { defineType, defineField } from 'sanity';

const bilingual = (name, title, type = 'text', required = false) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'tr',
        title: 'Türkçe',
        type,
        validation: required ? Rule => Rule.required() : undefined
      }),
      defineField({
        name: 'en',
        title: 'English',
        type,
        validation: required ? Rule => Rule.required() : undefined
      })
    ]
  });

export default defineType({
  name: 'profile',
  title: 'Profil ve Özgeçmiş',
  type: 'document',
  groups: [
    { name: 'general', title: '1. Genel Bilgiler ve Biyografi', default: true },
    { name: 'media', title: '2. Profil Fotoğrafı ve Özgeçmiş (CV)' },
    { name: 'details', title: '3. Üniversite, İlgi Alanları ve Eğitim' }
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Ad soyad',
      type: 'string',
      group: 'general',
      validation: Rule => Rule.required()
    }),
    { ...bilingual('headline', 'Kısa tanıtım başlığı (TR / EN)', 'string', true), group: 'general' },
    { ...bilingual('biography', 'Hakkımda ana metni (TR / EN)', 'text', true), group: 'general' },
    { ...bilingual('additionalBiography', 'Ek biyografi paragrafı (TR / EN)', 'text', false), group: 'general' },
    defineField({
      name: 'portrait',
      title: 'Profil Fotoğrafı (Hakkımda Sayfası)',
      description:
        'Önerilen kaynak görsel: 1200 × 1500 px (4:5 dikey oran, JPG, PNG veya WebP). Fotoğrafı yükledikten sonra sağ üstteki "Crop / Hotspot" simgesine tıklayarak yuvarlak odak noktasını yüz hizasına getirin; böylece masaüstü ve mobilde yüzünüz kırpılmaz.',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
        accept: 'image/jpeg,image/png,image/webp'
      },
      fields: [
        bilingual('alt', 'Görsel alternatif metni (Opsiyonel)', 'string', false)
      ]
    }),
    defineField({
      name: 'cv',
      title: 'Özgeçmiş (CV) Dosyası (PDF)',
      description: 'Doğrudan PDF özgeçmiş dosyası yükleyebilirsiniz.',
      type: 'file',
      group: 'media'
    }),
    defineField({
      name: 'cvExternalUrl',
      title: 'Özgeçmiş Harici Bağlantısı (Opsiyonel)',
      description: 'Dosya yüklemek yerine harici bir PDF/Drive bağlantısı kullanmak isterseniz buraya girebilirsiniz.',
      type: 'url',
      group: 'media'
    }),
    defineField({
      name: 'email',
      title: 'E-posta adresi',
      type: 'string',
      group: 'general',
      validation: Rule => Rule.email()
    }),
    defineField({
      name: 'location',
      title: 'Konum (TR)',
      type: 'string',
      group: 'details'
    }),
    defineField({
      name: 'locationEn',
      title: 'Konum (EN - Opsiyonel)',
      type: 'string',
      group: 'details'
    }),
    defineField({
      name: 'university',
      title: 'Üniversite / Kurum (TR)',
      type: 'string',
      group: 'details'
    }),
    defineField({
      name: 'universityEn',
      title: 'Üniversite / Kurum (EN - İngilizce sayfa için)',
      type: 'string',
      group: 'details'
    }),
    defineField({
      name: 'focusAreas',
      title: 'Teknik ilgi ve odak alanları (TR)',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'focusAreasEn',
      title: 'Teknik ilgi ve odak alanları (EN - İngilizce sayfa için)',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'skills',
      title: 'Yetkinlikler ve araçlar',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'education',
      title: 'Eğitim bilgileri',
      type: 'array',
      group: 'details',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'institution', title: 'Kurum / Üniversite', type: 'string' },
            { name: 'program', title: 'Program / Bölüm', type: 'string' },
            { name: 'startYear', title: 'Başlangıç yılı', type: 'number' },
            { name: 'endYear', title: 'Bitiş yılı', type: 'number' }
          ]
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'university',
      media: 'portrait'
    }
  }
});
