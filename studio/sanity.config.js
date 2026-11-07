import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID. Configure the Studio environment before starting or building.');
}

export default defineConfig({
  name: 'yunusemretom-portfolio',
  title: 'Yunus Emre Tom | Portfolio Yönetimi',
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  basePath: '/',
  plugins: [structureTool()],
  schema: { types: schemaTypes }
});
