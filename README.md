# Gomez Lab Website

Production website source for **https://feliciagomezlab.org**.

The site is built with [Astro](https://astro.build), stored in GitHub for version history and collaboration, and intended to be deployed on [Vercel](https://vercel.com).

## How the site is organized

Most routine website edits do **not** require changing page code.

| What you want to edit | Folder |
|---|---|
| Lab members | `src/content/people/` |
| Publications | `src/content/publications/` |
| Research projects | `src/content/projects/` |
| Lab news / gallery items | `src/content/updates/` |
| Tutorial pages | `src/pages/tutorial/` |
| Images | `public/images/` |
| Main page layouts | `src/pages/` |
| Site-wide styling | `src/styles/global.css` |
| Header/footer/SEO shell | `src/layouts/BaseLayout.astro` |

See **[docs/MAINTENANCE.md](docs/MAINTENANCE.md)** for step-by-step editing instructions.

## Local preview

Requirements: Node.js 22 LTS or later.

```bash
npm install
npm run dev
```

Astro will print a local URL, normally `http://localhost:4321`.

## Production build

```bash
npm run build
```

The generated static website is written to `dist/`.

## Deployment model

- `main` branch = production website
- feature/edit branches = Vercel preview deployments
- merge to `main` only after reviewing the preview
- `feliciagomezlab.org` should be attached to the Vercel Production environment

Vercel should detect Astro automatically. The project root is the repository root (`./`).

## Recommended publishing workflow

1. Create a branch such as `add-new-publication`.
2. Make the content change.
3. Commit and push the branch.
4. Open the Vercel preview deployment and review it.
5. Open a GitHub pull request.
6. Merge the pull request into `main`.
7. Vercel automatically deploys the new production version.

## Ownership and handoff

Keep the repository under a lab-owned GitHub organization when possible. Give maintainers repository access rather than sharing personal credentials. Keep the domain registrar account and Vercel project ownership documented separately.

## Technology

- Astro 5
- Static site generation
- Markdown-based content collections
- Vercel hosting
- GitHub version control and CI
- No database required

