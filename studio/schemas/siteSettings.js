import { defineType, defineField } from 'sanity';

const bilingual = (name, title, type = 'string') =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({ name: 'tr', title: 'Türkçe', type }),
      defineField({ name: 'en', title: 'English', type })
    ]
  });

const bilingualItems = (name, title) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [
      {
        type: 'object',
        fields: [
          bilingual('title', 'Başlık', 'string'),
          bilingual('text', 'Açıklama', 'text')
        ]
      }
    ]
  });

export default defineType({
  name: 'siteSettings',
  title: 'Site Metinleri ve İletişim Ayarları',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Ana Sayfa & Hero Alanı', default: true },
    { name: 'focus', title: '2. Çalışma Alanları & Öne Çıkanlar' },
    { name: 'pages', title: '3. Hakkımda & Yarışmalar Başlıkları' },
    { name: 'contact', title: '4. İletişim & Sosyal Bağlantılar' }
  ],
  fields: [
    { ...bilingual('heroEyebrow', 'Ana sayfa üst etiketi (TR / EN)'), group: 'hero' },
    { ...bilingual('heroTitle', 'Ana sayfa ana başlığı (TR / EN)'), group: 'hero' },
    { ...bilingual('heroText', 'Ana sayfa kısa açıklaması (TR / EN)', 'text'), group: 'hero' },
    { ...bilingual('primaryButtonText', 'Ana sayfa birincil buton metni (Örn: Projeleri keşfet)'), group: 'hero' },
    { ...bilingual('secondaryButtonText', 'Ana sayfa ikincil buton metni (Örn: İletişime geç)'), group: 'hero' },
    { ...bilingual('collaborationLabel', 'İş birliği durum etiketi (TR / EN)'), group: 'hero' },

    { ...bilingual('focusTitle', 'Çalışma alanları bölüm başlığı (TR / EN)'), group: 'focus' },
    { ...bilingual('focusIntro', 'Çalışma alanları açıklaması (TR / EN)', 'text'), group: 'focus' },
    { ...bilingualItems('homeFocus', 'Ana sayfa çalışma alanı kartları (TR / EN)'), group: 'focus' },
    { ...bilingual('featuredTitle', 'Öne çıkan projeler başlığı (TR / EN)'), group: 'focus' },
    { ...bilingual('featuredIntro', 'Öne çıkan projeler açıklaması (TR / EN)', 'text'), group: 'focus' },

    { ...bilingual('aboutTitle', 'Hakkımda sayfası başlığı (TR / EN)'), group: 'pages' },
    { ...bilingual('approachTitle', 'Yaklaşım bölümü başlığı (TR / EN)'), group: 'pages' },
    { ...bilingualItems('approachSteps', 'Yaklaşım adımları (TR / EN)'), group: 'pages' },
    { ...bilingual('competitionsTitle', 'Yarışmalar sayfası başlığı (TR / EN)'), group: 'pages' },
    { ...bilingual('competitionsIntro', 'Yarışmalar sayfası açıklaması (TR / EN)', 'text'), group: 'pages' },

    { ...bilingual('contactTitle', 'İletişim sayfası başlığı (TR / EN)'), group: 'contact' },
    { ...bilingual('contactText', 'İletişim sayfası açıklaması (TR / EN)', 'text'), group: 'contact' },
    defineField({
      name: 'contactEmail',
      title: 'İletişim e-posta adresi',
      description: 'Boş bırakılırsa Profil belgesindeki e-posta adresi kullanılır.',
      type: 'string',
      group: 'contact'
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub profil bağlantısı',
      type: 'url',
      group: 'contact'
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn profil bağlantısı',
      type: 'url',
      group: 'contact'
    }),
    defineField({
      name: 'socialLinks',
      title: 'Diğer sosyal bağlantılar',
      description: 'İletişim sayfasına ek sosyal medya veya akademik profil kartları ekleyebilirsiniz.',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Platform adı (Örn: YouTube, X, Google Scholar)', type: 'string' },
            { name: 'handle', title: 'Görünen kullanıcı adı / metin', type: 'string' },
            { name: 'url', title: 'Tam bağlantı (URL)', type: 'url' }
          ]
        }
      ]
    })
  ],
  preview: {
    prepare: () => ({ title: 'Site Metinleri ve İletişim Ayarları' })
  }
});
