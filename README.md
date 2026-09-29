# gativarshney.github.io

Personal site of Gati Varshney: https://gativarshney.github.io

Built with Astro 7 as a fully static site and deployed to GitHub Pages by GitHub Actions on every push to `main`. No backend, no analytics, no client-side framework; motion is GSAP + Lenis in vanilla TypeScript.

## Develop

```bash
npm install
npm run dev      # http://127.0.0.1:4321
npm run build    # dist/
```

Node 22.12 or newer.

## Where content lives

| What | File |
|---|---|
| Name, links, hero strip, journey milestones, cidx entry, PR groups, writing | `src/data/site.ts` |
| Open-source timeline, ledger, recognition | `src/pages/open-source.astro` |
| About page text | `src/pages/about.astro` |
| Résumé PDF | `public/resume.pdf` |
| Logos, certificates, photo, page snapshots | `src/assets/` |

Rules: every number carries its context and links to where it can be verified. Unmerged work is labelled "under upstream review". Private internship work shows a public outline only.

## Regenerating the social image and icons

`public/og-default.png`, `icon-512.png` and `apple-touch-icon.png` are rendered from `/og/` and `favicon.svg` with headless Chrome. Re-run the generator after changing the hero copy or favicon.
