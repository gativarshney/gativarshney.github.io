// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Phones keep a saved copy of /resume.pdf. Linking to it with a fingerprint of the file
// gives every new résumé a new address, so nobody is shown an old one.
const resumeVersion = createHash('sha256').update(readFileSync('public/resume.pdf')).digest('hex').slice(0, 10);

// User site on GitHub Pages: served from the domain root, so no `base`.
export default defineConfig({
  site: 'https://gativarshney.github.io',
  trailingSlash: 'always',
  // personal projects moved out of /work/ when Work became the page for roles
  redirects: {
    '/work/cidx/': '/projects/cidx/',
    '/work/repoinsight/': '/projects/contributable/',
    // RepoInsight was renamed Contributable
    '/projects/repoinsight/': '/projects/contributable/',
  },
  build: { format: 'directory' },
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/og/') })],
  image: { responsiveStyles: true },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  vite: { define: { __RESUME_VERSION__: JSON.stringify(resumeVersion) } },
});
