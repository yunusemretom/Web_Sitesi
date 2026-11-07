import { defineType, defineField } from 'sanity';
import GitHubRepoInput from '../components/GitHubRepoInput';

const bilingual = (name, title, type = 'text', description) =>
  defineField({
    name,
    title,
    description,
    type: 'object',
    fields: [
      { name: 'tr', title: 'Türkçe', type },
      { name: 'en', title: 'English', type }
    ]
  });

export default defineType({
  name: 'project',
  title: 'Projeler',
  type: 'document',
  groups: [
    { name: 'visibility', title: '1. Kaynak, Görünürlük ve Sıralama', default: true },
    { name: 'github', title: '2. GitHub Entegrasyonu' },
    { name: 'content', title: '3. Başlık, Açıklama ve İçerik (TR / EN)' },
    { name: 'media', title: '4. Görseller ve Bağlantılar' }
  ],
  fields: [
    defineField({
      name: 'sourceType',
      title: 'Proje kaynağı',
      description: 'GitHub deponuzdan otomatik veri çekmek için "GitHub Deposu", GitHub dışındaki mühendislik projeleriniz için "Manuel Proje" seçin.',
      type: 'string',
      group: 'visibility',
      options: {
        list: [
          { title: 'Manuel Proje (GitHub Dışı / Özel Proje)', value: 'manual' },
          { title: 'GitHub Deposu (yunusemretom)', value: 'github' }
        ],
        layout: 'radio'
      },
      initialValue: 'manual'
    }),
    defineField({
      name: 'status',
      title: 'Yayın durumu',
      description: 'Yalnızca "Yayında" olan ve gizlenmemiş projeler ziyaretçilere gösterilir.',
      type: 'string',
      group: 'visibility',
      options: {
        list: [
          { title: 'Taslak (Ziyaretçiye görünmez)', value: 'draft' },
          { title: 'Yayında (Sitede görünür)', value: 'published' },
          { title: 'Gizli (Sitede gizlenir)', value: 'hidden' }
        ]
      },
      initialValue: 'published'
    }),
    defineField({
      name: 'hidden',
      title: 'Portfolyoda gizle',
      description: 'İşaretlenirse bu proje (veya eşleşen GitHub deposu) sitede ziyaretçilere gösterilmez.',
      type: 'boolean',
      group: 'visibility',
      initialValue: false
    }),
    defineField({
      name: 'featured',
      title: 'Ana sayfada öne çıkar',
      description: 'İşaretlenirse ana sayfadaki "Öne çıkan projeler" bölümünde yer alır.',
      type: 'boolean',
      group: 'visibility',
      initialValue: false
    }),
    defineField({
      name: 'order',
      title: 'Görüntülenme sırası',
      description: 'Küçük sayılar daha önce gösterilir (Örn: 10, 20, 30...).',
      type: 'number',
      group: 'visibility',
      initialValue: 100
    }),
    defineField({
      name: 'githubRepo',
      title: 'GitHub Deposu Seçin',
      description: 'GitHub hesabınızdaki (yunusemretom) depolardan birini seçin. GitHub verileri aşağıdaki özel başlık veya açıklamalarınızın üzerine yazılmaz.',
      type: 'string',
      group: ['visibility', 'github'],
      components: {
        input: GitHubRepoInput
      }
    }),
    defineField({
      name: 'includeIfForkOrArchived',
      title: 'Fork veya arşivlenmiş depo ise yine de dahil et',
      description: 'Varsayılan olarak fork ve arşiv depolar filtrelenir; bu depoyu özellikle göstermek istiyorsanız işaretleyin.',
      type: 'boolean',
      group: 'github',
      initialValue: false
    }),
    defineField({
      name: 'githubData',
      title: 'GitHub Otomatik Verileri (Salt Okunur Yedek)',
      description: 'GitHub API üzerinden otomatik alınan veriler burada ayrı tutulur; kendi başlık ve açıklamalarınızı ezmez.',
      type: 'object',
      group: 'github',
      readOnly: true,
      fields: [
        { name: 'repoName', title: 'Depo Adı', type: 'string' },
        { name: 'description', title: 'GitHub Açıklaması', type: 'text' },
        { name: 'htmlUrl', title: 'GitHub URL', type: 'url' },
        { name: 'homepage', title: 'Ana Sayfa / Demo URL', type: 'url' },
        { name: 'language', title: 'Programlama Dili', type: 'string' },
        { name: 'stars', title: 'Yıldız Sayısı', type: 'number' },
        { name: 'forks', title: 'Fork Sayısı', type: 'number' },
        { name: 'topics', title: 'Etiketler (Topics)', type: 'array', of: [{ type: 'string' }] },
        { name: 'updatedAt', title: 'Son Güncellenme', type: 'string' }
      ]
    }),
    {
      ...bilingual(
        'title',
        'Proje başlığı (TR / EN)',
        'string',
        'Özel başlık girerseniz bu başlık kullanılır; boş bırakırsanız GitHub depo adı kullanılır.'
      ),
      group: 'content'
    },
    defineField({
      name: 'slug',
      title: 'URL kısa adı (Slug)',
      description: 'Proje detay sayfası adresi için kullanılır (Örn: ucus-kontrol-karti).',
      type: 'slug',
      group: 'content',
      options: {
        source: doc => doc?.title?.tr || doc?.githubRepo || 'proje',
        maxLength: 96
      }
    }),
    {
      ...bilingual(
        'summary',
        'Kısa açıklama (TR / EN)',
        'text',
        'Kartlarda görünen özet metin. Boş bırakılırsa GitHub açıklaması otomatik kullanılır.'
      ),
      group: 'content'
    },
    {
      ...bilingual('description', 'Detaylı açıklama (TR / EN)', 'text'),
      group: 'content'
    },
    {
      ...bilingual('contribution', 'Projede yaptığım çalışma / teknik katkı (TR / EN)', 'text'),
      group: 'content'
    },
    defineField({
      name: 'category',
      title: 'Proje kategorisi',
      description: 'Örn: Embedded Systems, UAV, GNSS / RF. Boş bırakılırsa GitHub programlama dili gösterilir.',
      type: 'string',
      group: 'content'
    }),
    defineField({
      name: 'technologies',
      title: 'Kullanılan teknolojiler / yetkinlikler',
      description: 'Boş bırakılırsa GitHub programlama dili ve topic etiketleri kullanılır.',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'stage',
      title: 'Proje aşaması',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Araştırma / Geliştirme (research)', value: 'research' },
          { title: 'Prototipleme (prototype)', value: 'prototype' },
          { title: 'Aktif Çalışma (active)', value: 'active' },
          { title: 'Tamamlandı (completed)', value: 'completed' }
        ]
      },
      initialValue: 'active'
    }),
    defineField({
      name: 'coverImage',
      title: 'Özel kapak görseli',
      description: 'Yüklenirse proje kartında ve detay sayfasında bu görsel gösterilir; yüklenmezse teknik tasarım kartı kullanılır.',
      type: 'image',
      group: 'media',
      options: { hotspot: true }
    }),
    defineField({
      name: 'gallery',
      title: 'Proje galeri görselleri',
      type: 'array',
      group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }]
    }),
    defineField({
      name: 'showGithubLink',
      title: 'GitHub bağlantısını göster',
      type: 'boolean',
      group: 'media',
      initialValue: true
    }),
    defineField({
      name: 'repositoryUrl',
      title: 'GitHub / Kod deposu bağlantısı',
      description: 'GitHub deposu seçtiyseniz otomatik doldurulur; farklı bir bağlantı kullanmak isterseniz buraya yazabilirsiniz.',
      type: 'url',
      group: 'media'
    }),
    defineField({
      name: 'demoUrl',
      title: 'Canlı demo / proje bağlantısı',
      type: 'url',
      group: 'media'
    })
  ],
  orderings: [
    {
      title: 'Görüntülenme Sırası (Küçükten Büyüğe)',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: '_createdAt', direction: 'desc' }
      ]
    }
  ],
  preview: {
    select: {
      titleTr: 'title.tr',
      githubRepo: 'githubRepo',
      category: 'category',
      order: 'order',
      status: 'status',
      hidden: 'hidden',
      featured: 'featured',
      media: 'coverImage'
    },
    prepare({ titleTr, githubRepo, category, order, status, hidden, featured, media }) {
      const title = titleTr || githubRepo || 'İsimsiz Proje';
      const flags = [
        hidden || status === 'hidden' ? 'Gizli' : status === 'published' ? 'Yayında' : 'Taslak',
        featured ? '★ Öne Çıkan' : null,
        typeof order === 'number' ? `Sıra: ${order}` : null,
        category || (githubRepo ? `GitHub: ${githubRepo}` : null)
      ]
        .filter(Boolean)
        .join(' · ');
      return {
        title,
        subtitle: flags,
        media
      };
    }
  }
});
