import { defineType, defineField } from 'sanity';
const bilingual = (name, title, type = 'text') => defineField({ name, title, type: 'object', fields: [
  { name: 'tr', title: 'Türkçe', type },
  { name: 'en', title: 'English', type }
] });
export default defineType({
  name: 'project', title: 'Projects', type: 'document',
  fields: [
    bilingual('title', 'Title', 'string'),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.tr', maxLength: 96 } }),
    bilingual('summary', 'Summary'),
    bilingual('description', 'Description'),
    bilingual('contribution', 'My contribution'),
    defineField({ name: 'category', title: 'Category', type: 'string' }),
    defineField({ name: 'technologies', title: 'Technologies', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'status', title: 'Publication status', type: 'string', options: { list: [{ title: 'Draft', value: 'draft' }, { title: 'Published', value: 'published' }] }, initialValue: 'draft' }),
    defineField({ name: 'stage', title: 'Project stage', type: 'string', options: { list: ['research','prototype','active','completed'].map(value => ({ title: value, value })) } }),
    defineField({ name: 'featured', title: 'Show on homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 100 }),
    defineField({ name: 'coverImage', title: 'Cover image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'gallery', title: 'Gallery', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'repositoryUrl', title: 'Repository URL', type: 'url' }),
    defineField({ name: 'demoUrl', title: 'Demo URL', type: 'url' })
  ],
  preview: { select: { title: 'title.tr', subtitle: 'category', media: 'coverImage' } }
});
