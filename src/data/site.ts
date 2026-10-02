export const site = {
  name: 'Gati Varshney',
  url: 'https://gativarshney.github.io',
  title: 'Gati Varshney',
  description:
    'Gati Varshney is a final-year CS student and Google Summer of Code 2026 contributor at OpenPrinting (The Linux Foundation). Developer tools and data systems, measured honestly.',
  email: 'gativarshney01@gmail.com',
  location: 'India · IST · open to relocation',
  updated: '2026-09-30',
  links: {
    github: 'https://github.com/gativarshney',
    linkedin: 'https://www.linkedin.com/in/gativarshney/',
    leetcode: 'https://leetcode.com/u/GatiVarshney/',
    medium: 'https://medium.com/@gativarshney',
    resume: '/resume.pdf',
    source: 'https://github.com/gativarshney/gativarshney.github.io',
    gsocReport:
      'https://medium.com/@gativarshney/gsoc-2026-final-report-ai-driven-printer-compatibility-recommendation-portal-9283d6fe2a5c',
    gsocProject: 'https://summerofcode.withgoogle.com/programs/2026/projects/k0bZOR1y',
    commits: 'https://github.com/OpenPrinting/openprinting.github.io/commits?author=gativarshney',
    hallOfFame: 'https://openprinting.github.io/hall-of-fame',
    openprintingSite: 'https://openprinting.github.io/',
    openprintingRepo: 'https://github.com/OpenPrinting/openprinting.github.io',
    cidxRepo: 'https://github.com/gativarshney/cidx',
    cidxPypi: 'https://pypi.org/project/cidx/',
    cidxSite: 'https://cidx.vercel.app',
    repoinsightApp: 'https://repoinsight-app.vercel.app',
    repoinsightRepo: 'https://github.com/gativarshney/repoinsight',
    wocVerify: 'https://verification.givemycertificate.com/v/74e4dfe9-cda1-4508-9b55-c815e35a3749',
  },
};

export const nav = [
  { label: 'Work', href: '/work/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Open Source', href: '/open-source/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'About', href: '/about/' },
];

export type Evidence = { value: string; label: string };
export type Link = { label: string; href: string; external?: boolean };
export type VisualKind = 'cidx' | 'printers' | 'openprinting' | 'gsoc' | 'quinque' | 'search' | 'repoinsight';
export type Tone = 'ok' | 'warn' | 'accent' | 'plain';

export type Entry = {
  slug: string;
  title: string;
  kicker: string;
  period: string;
  status?: { label: string; tone: Tone };
  tags: string[];
  summary: string;
  evidence: Evidence[];
  links: Link[];
  visual: VisualKind;
  href?: string;
};

const OP = 'https://github.com/OpenPrinting/openprinting.github.io/pull/';
const STAGING = 'https://github.com/rudra-iitm/openprinting.github.io/pull/';
const OPC = 'https://github.com/OpenPrinting/openprinting.github.io/commit/';

/* ------------------------------------------------------------------ */
/* Professional journey: the three milestones, in order                */
/* ------------------------------------------------------------------ */
export const milestones: Entry[] = [
  {
    slug: 'openprinting',
    title: 'OpenPrinting',
    kicker: 'Open Source Contributor · The Linux Foundation',
    period: 'Nov 2025 – Aug 2026',
    status: { label: 'Hall of Fame', tone: 'accent' },
    tags: ['Next.js', 'TypeScript', 'static generation', 'CI'],
    summary:
      'Where the journey starts. OpenPrinting maintains the printing stack behind every Linux desktop, and its website was being rebuilt from Jekyll into a statically exported Next.js site. I built the author system, migrated 200+ posts, shipped the site’s build-time search with no search server, rebuilt the homepage, and traced a production 404 to a config generated at deploy time.',
    evidence: [
      { value: '14', label: 'pull requests merged' },
      { value: '200+', label: 'posts migrated' },
      { value: '0', label: 'search servers' },
    ],
    links: [
      { label: 'Open source', href: '/open-source/' },
      { label: 'Search case study', href: '/work/openprinting-search/' },
      { label: 'All 14 in production', href: site.links.commits, external: true },
      { label: 'Hall of Fame', href: site.links.hallOfFame, external: true },
    ],
    visual: 'openprinting',
    href: '/open-source/',
  },
  {
    slug: 'gsoc-2026',
    title: 'Google Summer of Code 2026',
    kicker: 'Contributor · OpenPrinting · sponsored by The Linux Foundation',
    period: 'May 25 – Aug 24, 2026',
    status: { label: 'Completed · under upstream review', tone: 'warn' },
    tags: ['engineered similarity pipeline', 'not a trained model', 'build-time', 'natural language'],
    summary:
      'AI-Driven Printer Compatibility & Recommendation Portal. Explainable “what else will work” recommendations across 6,657 printers in the Foomatic database, computed entirely at build time for a static site, plus a deterministic natural-language assistant that reports data gaps instead of inventing capabilities.',
    evidence: [
      { value: '86.8% → 0%', label: 'scores saturating at 1.0' },
      { value: '6,657', label: 'printers indexed' },
      { value: '6 KB', label: 'per page, not 24 MB' },
    ],
    links: [
      { label: 'Case study', href: '/work/printer-recommendations/' },
      { label: 'Final report', href: site.links.gsocReport, external: true },
      { label: 'Project page', href: site.links.gsocProject, external: true },
      { label: 'PR #224 · recommendations', href: `${OP}224`, external: true },
      { label: 'PR #230 · assistant', href: `${OP}230`, external: true },
      { label: 'PR #236 · documentation', href: `${OP}236`, external: true },
    ],
    visual: 'gsoc',
    href: '/work/printer-recommendations/',
  },
  {
    slug: 'quin-que',
    title: 'Quin Que',
    kicker: 'Software Engineer Intern · Quin Que, Kobe, Japan · Remote',
    period: 'Sep 2026',
    status: { label: 'International internship', tone: 'accent' },
    tags: ['Japan', 'Remote', 'Rapilogi', 'warehouse reception management'],
    summary:
      'A first industry role, and an international one: Software Engineer Intern at Quin Que, a Japanese company based in Kobe, working remotely on Rapilogi, a warehouse reception management system. This is private company work, so only the public outline is shown here.',
    evidence: [],
    links: [
      { label: 'CEO’s recommendation', href: '/#recommendation' },
      { label: 'Certificate', href: '/about/' },
    ],
    visual: 'quinque',
  },
];

/* ------------------------------------------------------------------ */
/* Projects: built on my own time, each with a case-study page         */
/* ------------------------------------------------------------------ */
export const projects: Entry[] = [
  {
    slug: 'cidx',
    title: 'cidx',
    kicker: 'Personal project · developer tool',
    period: 'Jul – Sep 2026',
    status: { label: 'Alpha on PyPI', tone: 'accent' },
    tags: ['Python', 'tree-sitter', 'SQLite', 'MCP'],
    summary:
      'A zero-config local code index for AI coding agents. Five read-only MCP tools answer “where is X defined, who uses Y” with locations rather than file dumps, and the incremental index is proven to equal a cold rebuild.',
    evidence: [
      { value: '263', label: 'tests · 3 OS × 3 Python' },
      { value: '30.5 s', label: 'cold index of Django' },
      { value: '22.6 ms', label: 'p95 exact lookup' },
    ],
    links: [
      { label: 'Case study', href: '/projects/cidx/' },
      { label: 'Try it in the browser', href: '/projects/cidx/#try' },
      { label: 'Website', href: site.links.cidxSite, external: true },
      { label: 'Repository', href: site.links.cidxRepo, external: true },
      { label: 'PyPI', href: site.links.cidxPypi, external: true },
    ],
    visual: 'cidx',
    href: '/projects/cidx/',
  },
  {
    slug: 'repoinsight',
    title: 'RepoInsight',
    kicker: 'Personal project · web app for open source contributors',
    period: 'Oct 2026',
    status: { label: 'Live on Vercel', tone: 'ok' },
    tags: ['TypeScript', 'Next.js 16', 'React 19', 'three.js', 'GitHub REST API'],
    summary:
      'Know a repository before your first pull request. Paste a public GitHub repository and it reports where to start, who maintains it, how fast people reply, and whether outside pull requests actually get merged. Every answer is calculated by a fixed rule and shows its evidence; there is no AI and no health score.',
    evidence: [
      { value: '10', label: 'checklist questions, each with its rule' },
      { value: '74', label: 'tests' },
      { value: '0', label: 'databases, paid APIs or AI services' },
    ],
    links: [
      { label: 'Case study', href: '/projects/repoinsight/' },
      { label: 'Open the app', href: site.links.repoinsightApp, external: true },
      { label: 'Example report', href: `${site.links.repoinsightApp}/sample`, external: true },
      { label: 'Repository', href: site.links.repoinsightRepo, external: true },
    ],
    visual: 'repoinsight',
    href: '/projects/repoinsight/',
  },
];

/* ------------------------------------------------------------------ */
/* Case studies of work done in a role (GSoC, OpenPrinting)            */
/* ------------------------------------------------------------------ */
export const workStudies: Entry[] = [
  {
    slug: 'printer-recommendations',
    title: 'Printer recommendations & assistant',
    kicker: 'Google Summer of Code 2026 · OpenPrinting',
    period: 'May – Aug 2026',
    status: { label: 'Under upstream review', tone: 'warn' },
    tags: ['TypeScript', 'Next.js static', 'build-time pipeline'],
    summary:
      'Explainable “what else will work” recommendations across 6,657 printers in OpenPrinting’s Foomatic database, plus a deterministic natural-language assistant. Everything runs at build time; the browser loads a 6 KB shard, not a 24 MB dataset.',
    evidence: [
      { value: '86.8% → 0%', label: 'scores saturating at 1.0' },
      { value: '0.078 → 0.851', label: 'evidence-to-score correlation' },
      { value: '1,470 → 0', label: 'misleading explanations' },
    ],
    links: [
      { label: 'Case study', href: '/work/printer-recommendations/' },
      { label: 'Final report', href: site.links.gsocReport, external: true },
      { label: 'PR #224 · recommendations', href: `${OP}224`, external: true },
      { label: 'PR #230 · assistant', href: `${OP}230`, external: true },
      { label: 'PR #236 · documentation', href: `${OP}236`, external: true },
    ],
    visual: 'printers',
    href: '/work/printer-recommendations/',
  },
  {
    slug: 'openprinting-search',
    title: 'OpenPrinting site search',
    kicker: 'Winter of Code 5.0 · OpenPrinting · in production',
    period: 'Mar 2026',
    status: { label: 'Live in production', tone: 'ok' },
    tags: ['TypeScript', 'unified / remark', 'MiniSearch', 'static export'],
    summary:
      'Site-wide search for a statically exported Next.js site with no backend. A build step parses every post into a JSON index; the browser loads it once and answers queries locally with weighted, fuzzy ranking. Opens with Cmd/Ctrl + K on openprinting.github.io today.',
    evidence: [
      { value: '263', label: 'documents in the live index' },
      { value: '0', label: 'search servers' },
      { value: '2', label: 'PRs, both in production' },
    ],
    links: [
      { label: 'Case study', href: '/work/openprinting-search/' },
      { label: 'Try it live', href: site.links.openprintingSite, external: true },
      { label: 'PR #18', href: `${STAGING}18`, external: true },
      { label: 'PR #22', href: `${STAGING}22`, external: true },
    ],
    visual: 'search',
    href: '/work/openprinting-search/',
  },
];

/* every case study, for the palette and the page-transition labels */
export const studies: Entry[] = [...projects, ...workStudies];

/* ------------------------------------------------------------------ */
/* OpenPrinting pull requests, grouped by what they built              */
/* ------------------------------------------------------------------ */
export type PR = { n: number; title: string; href: string; state: 'merged' | 'open'; repo: 'production' | 'staging' };
export const prGroups: { area: string; note: string; prs: PR[] }[] = [
  {
    area: 'Author system',
    note: 'A reusable AuthorCard component and its integration into every post.',
    prs: [
      { n: 5, title: 'Introduce reusable AuthorCard component', href: `${STAGING}5`, state: 'merged', repo: 'staging' },
      { n: 8, title: 'Add reusable AuthorCard component and fix linting issues', href: `${STAGING}8`, state: 'merged', repo: 'staging' },
      { n: 9, title: 'Integrate AuthorCard into news post layout', href: `${STAGING}9`, state: 'merged', repo: 'staging' },
    ],
  },
  {
    area: 'Content migration',
    note: '200+ Jekyll posts moved into Next.js with frontmatter, media and legacy URLs preserved.',
    prs: [
      { n: 11, title: 'Migrate all posts from old Jekyll site into Next.js setup', href: `${STAGING}11`, state: 'merged', repo: 'staging' },
      { n: 20, title: 'Add automatic redirect support for previous slugs', href: `${STAGING}20`, state: 'merged', repo: 'staging' },
      { n: 21, title: 'Display post publication date on article pages', href: `${STAGING}21`, state: 'merged', repo: 'staging' },
    ],
  },
  {
    area: 'Site search',
    note: 'A build-time AST index queried in-browser by MiniSearch. Live in production, no search server.',
    prs: [
      { n: 18, title: 'Implement build-time indexed client-side search system', href: `${STAGING}18`, state: 'merged', repo: 'staging' },
      { n: 22, title: 'Include generated search index for GitHub Pages deployment', href: `${STAGING}22`, state: 'merged', repo: 'staging' },
    ],
  },
  {
    area: 'Homepage and theme',
    note: 'The rebuilt homepage, author avatars on the front page, light-theme fixes, and the GSoD page.',
    prs: [
      { n: 13, title: 'Make homepage fully functional and align with current OpenPrinting site', href: `${STAGING}13`, state: 'merged', repo: 'staging' },
      { n: 51, title: 'Update author avatars in blog post author boxes', href: `${STAGING}51`, state: 'merged', repo: 'staging' },
      { n: 52, title: 'Add author avatars to front page news boxes', href: `${STAGING}52`, state: 'merged', repo: 'staging' },
      { n: 53, title: 'Improve hero banner appearance in light theme', href: `${STAGING}53`, state: 'merged', repo: 'staging' },
      { n: 58, title: 'Complete and finalize GSoD page with content, routes, and components', href: `${STAGING}58`, state: 'merged', repo: 'staging' },
    ],
  },
  {
    area: 'Trailing-slash root cause',
    note: 'Production 404s, including RSS links consumed by LWN, traced to a deploy-time action generating a config that overrode the repository’s. Fixed, with a CI check that blocks broken internal URLs.',
    prs: [{ n: 231, title: 'Support trailing-slash URLs (fixes #207)', href: `${OP}231`, state: 'merged', repo: 'production' }],
  },
  {
    area: 'Google Summer of Code 2026',
    note: 'The recommendation pipeline, the natural-language assistant, and their documentation. Open for upstream review.',
    prs: [
      { n: 224, title: 'Printer compatibility recommendations for the Foomatic directory', href: `${OP}224`, state: 'open', repo: 'production' },
      { n: 230, title: 'Add a site-wide natural-language printer assistant', href: `${OP}230`, state: 'open', repo: 'production' },
      { n: 236, title: 'Document printer compatibility recommendations for the Foomatic directory', href: `${OP}236`, state: 'open', repo: 'production' },
    ],
  },
];

export const journey = [
  {
    year: '2023',
    title: 'JSS Academy of Technical Education, Noida',
    body: 'B.Tech in Computer Science (Data Science). Started competitive programming; would end up a LeetCode Knight.',
    lesson: 'Hard problems for their own sake.',
  },
  {
    year: '2025',
    title: 'First production code',
    body: 'Joined the OpenPrinting website rebuild: author system, then 200+ posts migrated from Jekyll to Next.js.',
    lesson: 'Maintainer review changes how you write.',
  },
  {
    year: '2026',
    title: 'Winter of Code · GSoC',
    body: 'Top 20 of 2800+ in Winter of Code 5.0. Shipped OpenPrinting’s build-time search, then spent the summer on Google Summer of Code.',
    lesson: 'Do the expensive work before deploy.',
  },
  {
    year: 'Sep 2026',
    title: 'Quin Que, and what’s next',
    body: 'Software Engineer Intern at Quin Que, a Japanese company in Kobe, working remotely. Building new projects worth putting on this page. Graduating 2027, open to relocation.',
    lesson: 'Publish the losses too.',
  },
];

/* ------------------------------------------------------------------ */
/* Writing                                                             */
/* ------------------------------------------------------------------ */
export const featuredArticle = {
  title: 'GSoC 2026 Final Report: AI-Driven Printer Compatibility & Recommendation Portal',
  href: site.links.gsocReport,
  date: '2026-08-22',
  dateLabel: '22 Aug 2026',
  source: 'Medium',
  description:
    'How the recommendation pipeline over OpenPrinting’s Foomatic database was built at build time for a static site, why the first scoring model was wrong (86.8% of scores saturating at 1.0) and what replaced it, and the deterministic assistant that answers “unknown” instead of guessing.',
};

export const writing: { slug: string; title: string; subtitle: string; date: string; tag: string; minutes: number }[] = [];

/* ------------------------------------------------------------------ */
/* Recommendations: quoted verbatim from LinkedIn, newest first        */
/* ------------------------------------------------------------------ */
export type Recommendation = {
  author: string;
  role: string;
  relation: string;
  date: string;
  dateLabel: string;
  photo?: string; // file name in src/assets/people, without extension
  pull: [before: string, emphasis: string, after: string]; // one sentence of the body
  body: string[];
};

export const recommendations: Recommendation[] = [
  {
    author: 'Takumi Yabe',
    role: 'CEO, Quin Que Inc.',
    relation: 'Managed Gati directly',
    date: '2026-10-02',
    dateLabel: '2 Oct 2026',
    photo: 'takumi-yabe',
    pull: ['Gati-san is ', 'an exceptionally talented engineer', ', and we look forward to seeing what she accomplishes in the future.'],
    body: [
      'Gati-san participated in our internship program for one month in September 2026.',
      'Demonstrated strong full-stack development skills by independently implementing six administrative console screens with API integration across frontend and backend. Quickly adapted to the unfamiliar task of building a new admin console and delivered the implementation efficiently. Showed a solid understanding of cross-cutting design concerns, including consistent error responses and Row-Level Security (RLS) to prevent unauthorized cross-tenant access. Accurately diagnosed complex issues, including side-effect-related bugs in DoneScreen and crashes in the React Native environment, and resolved them effectively. Responded carefully to pull request review feedback and maintained comprehensive tests to ensure implementation quality. Took ownership of a broad range of responsibilities, including console development, onboarding a second tenant, and preparing demo procedures and materials. Improved usability through thoughtful input validation and proactively fixed numerous minor bugs alongside feature development. Although less active in posting issues, consistently provided clear pull request descriptions and commit messages that communicated implementation details effectively. Worked reliably under Shruti\'s guidance and demonstrated initiative by identifying and fixing issues beyond assigned tasks, including SSE reconnection problems and status-name persistence. Also handled final polishing tasks with care, contributing to a stable, maintainable, and user-friendly application. Overall, demonstrated technical adaptability, strong problem-solving skills, accountability, and a consistent commitment to quality.',
      'Gati-san is an exceptionally talented engineer, and we look forward to seeing what she accomplishes in the future.',
    ],
  },
  {
    author: 'Rudra Pratap Singh',
    role: 'Software Engineer at Google',
    relation: 'GSoC mentor · OpenPrinting',
    date: '2026-07-16',
    dateLabel: '16 Jul 2026',
    photo: 'rudra-pratap-singh',
    pull: ['Gati has the qualities that make a strong software engineer: ', 'a growth mindset, technical aptitude, and the determination to continuously improve.', ''],
    body: [
      'I had the pleasure of mentoring Gati during Google Summer of Code, where she contributed to the OpenPrinting website. From the outset, she impressed me with her curiosity, focus, and eagerness to learn. She consistently approached challenges with a thoughtful mindset, quickly grasped new concepts, and steadily improved through feedback.',
      'What I appreciated most was her ability to translate guidance into action. She was proactive in asking the right questions, receptive to suggestions, and committed to delivering high-quality contributions. Her discipline and persistence allowed her to navigate the complexities of open source development while maintaining a collaborative and professional attitude.',
      'Gati has the qualities that make a strong software engineer: a growth mindset, technical aptitude, and the determination to continuously improve. I’m confident she will continue to thrive in her career and make valuable contributions to any team she joins. I wholeheartedly recommend her and look forward to following her future accomplishments.',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Hero strip                                                          */
/* ------------------------------------------------------------------ */
export const record = [
  { k: 'Sep 2026 · International · Remote', v: 'Software Engineer Intern · Quin Que, Kobe, Japan', m: 'Rapilogi · warehouse reception management' },
  { k: 'Summer 2026', v: 'Google Summer of Code · OpenPrinting', m: 'printer recommendations + NL assistant · completed' },
  { k: 'Nov 2025 – Aug 2026', v: 'OpenPrinting website contributor', m: '14 pull requests merged · Hall of Fame' },
];
