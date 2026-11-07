import { defineType, defineField } from 'sanity';
export default defineType({
  name: 'competition', title: 'Competitions', type: 'document',
  fields: [
    { name: 'title', title: 'Title (TR / EN)', type: 'object', fields: [{ name: 'tr', title: 'Türkçe', type: 'string' }, { name: 'en', title: 'English', type: 'string' }] },
    { name: 'description', title: 'Description (TR / EN)', type: 'object', fields: [{ name: 'tr', title: 'Türkçe', type: 'text' }, { name: 'en', title: 'English', type: 'text' }] },
    defineField({ name: 'year', title: 'Year', type: 'number' }),
    defineField({ name: 'role', title: 'Personal role', type: 'string' }),
    defineField({ name: 'status', title: 'Publication status', type: 'string', options: { list: [{ title: 'Draft', value: 'draft' }, { title: 'Published', value: 'published' }] }, initialValue: 'draft' }),
    defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 100 })
  ],
  preview: { select: { title: 'title.tr', subtitle: 'year' } }
});
