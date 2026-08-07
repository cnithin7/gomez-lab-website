# Website Maintenance Guide

This guide is written for lab members who may not be web developers.

## The safest way to make a change

For small text-only edits, you can edit a file directly on GitHub. For larger edits or image changes, GitHub Desktop + VS Code is easier.

For production work, use a branch instead of editing `main` directly:

1. Create a branch with a descriptive name, e.g. `update-charlz-bio`.
2. Make the edit.
3. Commit the change with a short explanation.
4. Push the branch to GitHub.
5. Review the Vercel preview URL.
6. Merge the pull request into `main` when it looks correct.

## Add or edit a lab member

Files live in `src/content/people/`.

Each person has one Markdown file. Copy `docs/templates/person.md` and rename it, for example:

`src/content/people/jane-doe.md`

Put the portrait in `public/images/team/`, then update the `image` path in the member file.

`order` controls the display order. Use `1` for the PI and larger numbers for subsequent members.

## Add a publication

Files live in `src/content/publications/`.

Copy `docs/templates/publication.md`. A useful filename is:

`2026-short-paper-title.md`

Set `featured: true` only when you specifically want a publication eligible for prominent display. Publications are otherwise sorted automatically by date.

## Add a research project

Files live in `src/content/projects/`.

Copy `docs/templates/project.md`. Add the project image under `public/images/` and update the image path.

## Add lab news or a gallery item

Files live in `src/content/updates/`.

Copy `docs/templates/update.md`, add the image under `public/images/`, and write the update in normal Markdown below the front matter.

## Edit the homepage text

The homepage is `src/pages/index.astro`.

Most of the homepage lists (people, recent publications, lab updates) are generated automatically from the content folders. The introductory paragraphs and current-directions text are edited directly in this file.

## Change navigation

Navigation is defined in `src/layouts/BaseLayout.astro` in the `nav` list near the top of the file.

## Change colors or typography

Site-wide styles live in `src/styles/global.css`.

The Gomez Lab brand currently uses navy `#1e3a5f` and blue `#3b82f6`. Make global visual changes carefully and always review a Vercel preview on desktop and mobile before merging.

## Images

Store site images under `public/images/` and reference them from content files beginning with `/images/`.

Example:

`/images/team/jane-doe.jpg`

Use descriptive filenames. Avoid spaces when possible.

## Before publishing

Check:

- desktop and phone layout
- links work
- names/titles are correct
- images have useful alt text where page code provides it
- no private/unpublished scientific information is included
- `npm run build` succeeds (or the GitHub build check passes)
- the Vercel preview looks correct

## Reverting a mistake

Because the website is version-controlled in GitHub, every commit is retained. Use GitHub's commit history or revert a pull request instead of manually trying to reconstruct an older version.

## Handoff checklist

A future maintainer should receive access to:

- GitHub repository / organization
- Vercel project/team
- domain registrar/DNS account
- any institutional analytics/Search Console accounts

They should read this file and the root `README.md` first.
