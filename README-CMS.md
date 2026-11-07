# Portfolio CMS setup

The public website remains Express + EJS on the existing Vercel deployment. Sanity Studio is a separate application in `studio/`.

## Configure Sanity
1. Create a project at https://www.sanity.io/manage and a dataset named `production`.
2. Set these variables in the website's Vercel project:
   - `SANITY_PROJECT_ID`
   - `SANITY_DATASET=production`
   - optional `SANITY_API_VERSION=2025-01-01`
   - optional `SANITY_API_READ_TOKEN` only for a private dataset (read-only token only).

## Run Studio locally
```bash
cd studio
npm install
SANITY_STUDIO_PROJECT_ID=your_project_id SANITY_STUDIO_DATASET=production npm run dev
```
Deploy Studio separately with those two `SANITY_STUDIO_*` variables. Do not expose an unauthenticated admin route on the public Express site.

## Content
Create Project, Competition and Profile documents. Set publication status to `published`; select `featured` to show a project on the homepage. Project stage: `research`, `prototype`, `active`, or `completed`. Turkish and English fields are paired in the Studio.

Until Sanity credentials are configured, the website uses local sample content. Review role, biography and competition wording before publishing; only publish claims you can substantiate. Never commit API tokens or secrets.
