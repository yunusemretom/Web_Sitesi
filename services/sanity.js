const { createClient } = require('@sanity/client');

const configured = Boolean(process.env.SANITY_PROJECT_ID && process.env.SANITY_DATASET);
const client = configured ? createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION || '2025-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_READ_TOKEN || undefined
}) : null;

async function query(groq, params = {}) {
  if (!client) return null;
  try { return await client.fetch(groq, params); }
  catch (error) {
    console.error('[sanity] Content fetch failed:', error.message);
    return null;
  }
}
module.exports = { client, configured, query };
