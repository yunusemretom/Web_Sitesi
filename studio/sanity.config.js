import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas';
import GitHubProjectManagerTool from './components/GitHubProjectManagerTool';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '0j1jarsg';
if (!projectId) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID. Configure the Studio environment before starting or building.');
}

const deskStructure = S =>
  S.list()
    .title('Portfolyo İçerik Yönetimi')
    .items([
      S.documentTypeListItem('profile').title('Profil ve Fotoğraf Yönetimi'),
      S.documentTypeListItem('siteSettings').title('Ana Sayfa, Metinler ve İletişim'),
      S.divider(),
      S.documentTypeListItem('project').title('Projeler (Tümü)'),
      S.listItem()
        .id('published-projects')
        .title('Yayındaki Projeler')
        .schemaType('project')
        .child(
          S.documentList()
            .title('Yayındaki Projeler')
            .filter('_type == "project" && status == "published" && hidden != true')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),
      S.listItem()
        .id('featured-projects')
        .title('Ana Sayfada Öne Çıkan Projeler')
        .schemaType('project')
        .child(
          S.documentList()
            .title('Öne Çıkan Projeler')
            .filter('_type == "project" && featured == true && hidden != true')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),
      S.listItem()
        .id('hidden-projects')
        .title('Gizlenen Projeler')
        .schemaType('project')
        .child(
          S.documentList()
            .title('Gizlenen Projeler')
            .filter('_type == "project" && (hidden == true || status == "hidden")')
        ),
      S.divider(),
      S.documentTypeListItem('competition').title('Yarışmalar')
    ]);

export default defineConfig({
  name: 'yunusemretom-portfolio',
  title: 'Yunus Emre Tom | Portfolyo Yönetimi',
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  basePath: '/',
  plugins: [
    structureTool({
      structure: deskStructure
    })
  ],
  tools: prev => [
    ...prev,
    {
      name: 'github-manager',
      title: 'GitHub & Proje Seçimi',
      component: GitHubProjectManagerTool
    }
  ],
  schema: { types: schemaTypes }
});
