# Portfolio CMS setup

The public website remains Express + EJS on Vercel. The private content-management application is a separate Sanity Studio under `studio/`; it is not exposed as an unauthenticated route on the public Express server.

## Sanity project and website

1. Create or select a project at https://www.sanity.io/manage and a dataset named `production`.
2. Set these variables in the website's Vercel project:
   - `SANITY_PROJECT_ID`
   - `SANITY_DATASET=production`
   - optional `SANITY_API_VERSION=2025-01-01`
   - `SANITY_API_READ_TOKEN` only if the dataset is private. Use a read-only token and keep it server-side.

## Run the management panel locally

```bash
cd studio
npm install
SANITY_STUDIO_PROJECT_ID=your_project_id SANITY_STUDIO_DATASET=production npm run dev
```

Sign in with your Sanity account. Access is controlled by Sanity project membership and roles, not by a shared password in the website.

## Deploy the management panel

```bash
cd studio
npm install
SANITY_STUDIO_PROJECT_ID=your_project_id SANITY_STUDIO_DATASET=production npm run build
SANITY_STUDIO_PROJECT_ID=your_project_id SANITY_STUDIO_DATASET=production npm run deploy
```

Sanity CLI provides a hosted `*.sanity.studio` URL. Configure `studio.yunusemretom.me` as a custom Studio hostname in Sanity hosting/domain settings, then add the exact CNAME target shown by Sanity to your DNS provider. Do not guess the DNS target.

## Draft -> review -> publish

Documents start as drafts. Review Turkish and English content, imagery, technical details and links in Studio; publish only when ready. The public website queries published documents only. The first implementation uses Sanity's built-in draft/publish workflow. A visual on-site draft preview is a follow-up: it requires a signed preview endpoint and draft-aware Sanity queries, and is deliberately not exposed without that security layer.

## Content types

- Projects: bilingual title, summary, description, contribution, technologies, stage, images, links, featured flag and ordering.
- Competitions: bilingual title, description and role, year, result and ordering.
- Profile: bilingual headline and biography, portrait, CV, skills and education.

Until Sanity credentials are configured in Vercel, the website uses local sample content. Review every claim before publishing. Never commit API tokens or secrets.
