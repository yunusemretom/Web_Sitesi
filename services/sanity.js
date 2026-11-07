const { createClient } = require('@sanity/client');

const projectId = process.env.SANITY_PROJECT_ID || '0j1jarsg';
const dataset = process.env.SANITY_DATASET || 'production';
const configured = Boolean(projectId && dataset && process.env.SANITY_DISABLED !== 'true');

const client = configured
  ? createClient({
      projectId,
      dataset,
      apiVersion: process.env.SANITY_API_VERSION || '2025-01-01',
      useCdn: process.env.SANITY_USE_CDN === 'true',
      token: process.env.SANITY_API_READ_TOKEN || undefined
    })
  : null;

async function query(groq, params = {}) {
  if (!client || process.env.SANITY_DISABLED === 'true') return null;
  try {
    return await client.fetch(groq, params);
  } catch (error) {
    console.error('[sanity] Content fetch failed:', error.message);
    return null;
  }
}

module.exports = { client, configured, projectId, dataset, query };
