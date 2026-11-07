import { defineType, defineField } from 'sanity';
export default defineType({
  name: 'profile', title: 'Profile', type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    { name: 'headline', title: 'Headline (TR / EN)', type: 'object', fields: [{ name: 'tr', title: 'Türkçe', type: 'string' }, { name: 'en', title: 'English', type: 'string' }] },
    { name: 'biography', title: 'Biography (TR / EN)', type: 'object', fields: [{ name: 'tr', title: 'Türkçe', type: 'text' }, { name: 'en', title: 'English', type: 'text' }] },
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'portrait', title: 'Portrait', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'cv', title: 'CV', type: 'file' })
  ]
});
