// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// User site on GitHub Pages: served from the domain root, so no `base`.
export default defineConfig({
  site: 'https://gativarshney.github.io',
  trailingSlash: 'always',
  // personal projects moved out of /work/ when Work became the page for roles
  redirects: {
    '/work/cidx/': '/projects/cidx/',
    '/work/repoinsight/': '/projects/repoinsight/',
  },
  build: { format: 'directory' },
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/og/') })],
  image: { responsiveStyles: true },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
