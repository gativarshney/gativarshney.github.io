# Portfolio Research & Implementation Blueprint — Gati Varshney

Prepared 17 September 2026. Phase 1 deliverable: research, product thinking, information architecture, and technical planning. No code was written.

Everything in this document was checked against your actual materials: the resume PDF, all 16 public GitHub repositories and their READMEs, the cidx architecture, decision-record and verification documents, the Casefile architecture document, the GSoC final report, the OpenPrinting Hall of Fame page, the state of every pull request you have opened upstream, your LeetCode profile via its GraphQL endpoint, and your mentor's portfolio at rudra-iitm.github.io. Where a claim could not be verified, it is flagged.

---

## 1. Portfolio identity

### Who you are, in evidence rather than adjectives

Reading everything you have built, one trait shows up in every project regardless of domain:

- **cidx** defines a "convergence invariant" (the incremental index must equal a cold rebuild) and proves it with a property-based test suite, a crash-injection test, and a `cidx check` command users can run themselves. It publishes a verification document where every performance number carries the commands to reproduce it, and its benchmark methodology was written *before* the first run "on purpose: the rules must exist before there are numbers to be tempted by."
- **The GSoC recommendation system** was not accepted at "looks right". You noticed 86.8% of similarity scores saturating at 1.0, diagnosed sparse-data cosine similarity as the cause, redesigned the scoring (IDF weighting, evidence damping, conflict penalties), and put an evaluation harness in place that fails the build if any documented metric drifts. The assistant returns explicit data-gap answers ("unknown is not false") instead of inventing capabilities.
- **Casefile** freezes the model, generates a held-out world afterwards, evaluates once, and then publishes a section titled "What it gets wrong" that states plainly: "Both withheld attack mechanisms defeated the system completely." It has a test that parses the source tree with the TypeScript compiler to prove the investigation path cannot import ground-truth labels.
- **The OpenPrinting trailing-slash fix** traced production 404s (including RSS links consumed by LWN) to a deploy-time action generating a config that overrode the repository's, and then added a CI check that blocks any deploy with broken internal URLs.

That is not "passionate about solving real-world problems". It is a specific engineering disposition: **you build systems that can prove their own claims, and you publish the failures alongside the wins.** That is rare at any level and very rare in a final-year student. It is the thing the portfolio should communicate, because it is true, verifiable, and differentiating.

### The identity statement

> **Gati Varshney builds developer tools and data systems that show their working.**
>
> The site is not a résumé rendered in HTML. It is an evidence file: every project on it states what was built, what was measured, what went wrong, and where a reader can verify each claim.

"Show your working" is a phrase you already use in Casefile's README. It is honest, memorable, and it sets the design brief: the site itself must show its working (a colophon, source link, dated "last verified" stamps, cited numbers).

### The five questions

| Question | Answer the site must make obvious |
|---|---|
| Who am I? | Gati Varshney, final-year CS (Data Science) student at JSS Academy of Technical Education, Noida, graduating 2027. GSoC 2026 contributor at OpenPrinting (The Linux Foundation). |
| What kind of engineer? | Systems-and-tooling engineer with an AI-tooling focus: local code indexing for coding agents (MCP), explainable recommendation pipelines, evidence-first verification systems. Comfortable in Python and TypeScript; ships to production with CI. |
| What makes me different? | Verification discipline. Measured numbers with reproduction commands, decision records, evaluation harnesses, honest limitation sections. |
| What proof do I have? | 14 commits in a Linux Foundation production repository (rank 8 contributor), Hall of Fame credit, a PyPI-published tool with a 3-OS × 3-Python CI matrix and 263 tests, a GSoC final report with before/after metrics, LeetCode Knight (top 3.98% of contest participants). |
| What should someone remember? | "The student who publishes what their system gets wrong." And the name cidx. |

**What a recruiter understands immediately:** name, role, GSoC + Linux Foundation, one flagship tool, links to GitHub, LinkedIn, resume, email. All in the first screen.

**What a technical person discovers deeper:** ADR-style decisions (why SQLite and not embeddings; why IRLS logistic regression with sign constraints; why RFC 8785 canonical JSON rejects floats), root-cause debugging narratives, evaluation methodology, and the honest limitation lists.

---

## 2. Key strengths discovered from your materials

Ranked by how much weight each can carry on the site.

### 2.1 cidx (flagship)

The most complete engineering artifact you own. Verified facts:

- Python, tree-sitter, stdlib SQLite (WAL, FTS5), five read-only MCP tools over stdio. Apache-2.0. Published on PyPI as `cidx` 0.1.0a1 (30 July 2026), with 0.1.0a2 in the changelog dated 16 September 2026.
- 16 dated architecture decision records (ADR-001 through ADR-016), a written engineering contract (`AGENTS.md`), milestones, a changelog in Keep-a-Changelog format, `docs/verification.md` with reproduction commands, and a benchmark methodology with explicit honesty rules.
- 263 tests: golden-file extractor tests, a Hypothesis property-based convergence suite, MCP-over-stdio integration tests. CI across Ubuntu, macOS, Windows × Python 3.11, 3.12, 3.13, plus a cross-platform Django fingerprint workflow.
- Django-scale measurements (3,043 files, 76,166 symbols, 206,801 references) with an unusually honest disclosure that the README's 106 ms save-to-queryable figure "does not describe repositories of Django's size" (1.8 s p50 there).
- The 0.1.0a2 changelog is a goldmine of engineering narrative: an O(n²) cold start (Django unfinished after 400 s, now about two minutes), missing foreign-key indexes (re-index from past 11 minutes to 46 s, per-file delete from 361 ms to 1.7 ms), a `SQLITE_BUSY_SNAPSHOT` write-lock race, a silently dying watcher thread, and a multiset-vs-set blind spot in the convergence check.

This deserves the deepest case study on the site.

### 2.2 GSoC 2026 at OpenPrinting (The Linux Foundation)

Verified: mentored by Till Kamppeter and Rudra Pratap Singh; final report published 22 August 2026 on Medium; pull requests #224 (recommendations, 4,013 additions across 34 files, 36 commits) and #230 (natural-language assistant, 11,200 additions across 70 files, 50 commits) plus #236 (documentation, 1,091 additions).

The metrics are strong and, importantly, framed honestly in your own report: score saturation 86.8% → 0%, evidence-to-score correlation 0.078 → 0.851, misleading explanation claims 1,470 → 0, with the caveat that these measure internal consistency, not human-labelled accuracy. 6,657 printers, per-printer JSON shards (median 3.2 KB) instead of a 24 MB aggregate.

**Caveat that shapes how this is presented:** as of 17 September 2026, all three GSoC pull requests are **open, not merged**. See section 3.

### 2.3 OpenPrinting website contributions (Nov 2025 – Aug 2026)

Verified: 14 commits authored by you in `OpenPrinting/openprinting.github.io`, making you the 8th-ranked contributor to that repository. Hall of Fame entry reads exactly: "Author system, content migration, site search, and the homepage." The search system (build-time AST index with unified/remark, MiniSearch in the browser) is live on the production site. PR #231 (trailing-slash fix, 874 additions, 487 deletions, 123 files) was merged directly into the org repository on 13 August 2026 and has an excellent root-cause writeup.

### 2.4 Casefile (not on your resume, should be on the site)

Created 21 August 2026 for the Razorpay AI Buildathon, Track 02. TypeScript, MIT. The README and ARCHITECTURE.md are the best technical writing in your entire GitHub: sixteen evidence probes, a 26-code finding vocabulary, sign-constrained logistic regression fitted by IRLS, Platt calibration, expected-cost policy, hash-chained case artifacts, RFC 8785 canonical JSON that rejects floats, a Merkle construction that avoids CVE-2012-2459, an import-graph boundary test, and a held-out evaluation performed once (precision 0.888, recall 0.831, F1 0.859). There is a 4-minute pitch video.

This is the second-strongest project on the evidence and it is missing from the resume entirely. It also shows range: statistics and evaluation design, not only tooling.

### 2.5 Competitive programming

Verified via LeetCode's GraphQL endpoint on 17 September 2026: Knight badge, contest rating 1925.36, global contest ranking 34,020, top 3.98%, 11 contests attended, 736 problems solved (311 easy, 368 medium, 57 hard). Real, but secondary. It belongs on the About page as one line with a link, not on the home page.

### 2.6 Writing ability

Your READMEs, the changelog, and the GSoC report are written clearly, with numbers, and without hype. Most student portfolios have a "Blog" link with nothing behind it. You already have three publishable technical pieces sitting inside repositories and pull requests (section 13 lists them). Writing is a real strength and should be a real section.

### 2.7 Recognition

- Winter of Code 5.0 (GDG on Campus IIIT Kalyani's GSoC-modelled program): Top 20 of 2800+ participants. Verifiable via your certificate image in the profile repo; the participant count comes from your resume and should be kept only if the program published it.
- OpenPrinting Hall of Fame listing (verified).
- GSoC completion certificate (image in the profile repo).

---

## 3. Weaknesses and gaps to address

Be direct with yourself about these; the site will be read by people who click links.

### 3.1 The GSoC pull requests are unmerged

PR #224, #230 and #236 are open as of today. Your resume says "Designed" and "Engineered", which is accurate, but a site that says "shipped a recommendation system to OpenPrinting" would not be. Present them as: *built during GSoC 2026, evaluated, documented, under upstream review (PR #224, #230)*, with a status field in the content model that you flip to "merged" when it happens. The final report and the PR pages are the verifiable artifacts today. This is not a weakness in the work; it is a presentation constraint, and handling it honestly is itself on-brand.

### 3.2 "14 pull requests merged through maintainer review" needs the precise framing

13 of those 14 PRs were merged into `rudra-iitm/openprinting.github.io`, the lead developer's staging repository for the rebuild, and then landed in the organisation repository as commits carrying the PR numbers. One (#231) was merged directly into the org repo. The cleaner, fully verifiable statement for the site is **"14 commits in OpenPrinting's production website repository"** with a link to the commits filter. Both statements are true; the commits one has a single link that proves it.

### 3.3 Numbers that must travel with their scale

cidx's headline latency numbers (106 ms p95 save-to-queryable, sub-10 ms queries) were measured on a 500-file synthetic corpus; on Django the shape changes (1.8 s p50 for back-to-back saves, ~135 ms p95 ranked search). Your repo already discloses this. The site must never quote a number without its corpus and date. The content model in section 22 makes this structural: every metric has `value`, `context`, `measuredOn`, and `source` fields.

### 3.4 Claims to verify before display

- "7.5K+ routes" restored by the trailing-slash fix: plausible (Foomatic printer pages) but not visible in the PR body excerpt I could read. Confirm the count from the build output before it appears on the site.
- "384 tests over a 187-utterance corpus" for the assistant: lives inside open PR #230. Keep it, but link to the PR's test directory.
- "Top 20 of 2800+ participants": confirm the participant count against a Winter of Code publication.
- "15+ merged PRs" on your GitHub profile info card versus 14 on the resume: pick one number, the verifiable one (14 commits).

### 3.5 Secondary projects that would dilute the site if given equal weight

- **Interview Copilot** (React, Express, MongoDB, Gemini): a competent full-stack app with two genuine decisions (structured outputs with `responseSchema` + Zod; TTL-indexed token blacklist). Fine as a one-line entry with its live link. It is not a case study; its shape is a familiar MERN + LLM app and experienced reviewers will read it that way.
- **Mystery Message** (Next.js, NextAuth, Gemini): this project name and feature set match a widely followed Next.js course project. Engineers will recognise it. Listing it prominently would actively lower credibility. Either omit it or list it at the bottom as a learning project with no claims.
- **Chrono Wall**: a 3D, aurora-glow, magnetic-hover calendar. Well executed for a frontend challenge, but it is the exact aesthetic the brief rejects. Keep it off the home page; an "experiments" line on the work index is enough, or omit.
- **FinSight Dashboard**: a mock-data dashboard from a frontend challenge. One line or omit.
- **Conversational Assessment Recommender**: a RAG pipeline (FastAPI, ChromaDB, sentence-transformers, Gemini) built as a hiring assignment. Has real structure (evaluation replayer, Mean Recall@10). One-line entry is fair.
- **Spotify clone, Tic-Tac-Toe, Currency Converter, Cynthia Ugwu clone, bookstore, DSA practice**: omit from the site entirely. Consider archiving them on GitHub so a visitor who clicks through to your profile sees the same curated picture.

### 3.6 Your GitHub profile README contradicts the brief

The profile README is a fake-terminal theme with an ASCII portrait, `whoami` headers, a snake animation and animated SVG cards. Your own brief lists fake terminal animations and animation for its own sake as anti-patterns, and you are right. The website should not inherit this register. After the site launches, simplify the README to a short paragraph and a link, so the two do not argue with each other. (The self-hosted-SVG, no-third-party-widgets discipline behind it is good and carries over: the site snapshots data at build time.)

### 3.7 Skills lists

The resume's "HTML5, CSS3, Postman, Git" style skills block is filler that every resume has. The site will not have a skills section. Technologies appear in context, attached to the project where they were used, which is the only place a skills claim is credible.

### 3.8 No social-proof numbers

1 star on cidx, 13 followers. Do not display stars, followers, or repository counts anywhere. Display verifiable outcomes instead (commits in production, tests, measurements, PR links).

### 3.9 Material you have not provided yet

Not blocking, but worth collecting before implementation: a photograph you are comfortable with (optional; the design works without one), a two-sentence plain-language bio, the Winter of Code and GSoC certificate images (already in the profile repo), and screenshots or a short recording of the recommendation UI from PR #224 and the assistant from PR #230 (the PR pages already contain both; you can reuse them).

---

## 4. Research findings from 35 portfolios

Method: 35 personal sites of engineers were fetched as text; 30 were also loaded in a real browser to measure computed styles (font family, body size, line-height, paragraph measure, background colour, number of animated elements, framework markers), and four heavier sites were checked at a 375 px viewport. Your mentor's site was analysed separately in the same way. Four candidate sites no longer exist (Sarah Drasner's, Ryan Florence's, jln.dev, cristicretu.com) and were dropped.

Sites studied: rauno.me, paco.me, emilkowal.ski, benji.org, jakub.kr, brittanychiang.com, leerob.com, antfu.me, samuelkraft.com, blog.maximeheckel.com, joshwcomeau.com, overreacted.io, rauchg.com, shud.in, sindresorhus.com, mxstbr.com, delba.dev, linusrogge.com, nan.fyi, swyx.io, manuelmoreale.com, lynnandtonic.com, ishadeed.com, jhey.dev, cassidoo.co, kentcdodds.com, zenorocha.com, ped.ro, sarahdayan.dev, nexxel.dev, alexcarpenter.me, brianlovin.com, taniarascia.com, bruno-simon.com (as a contrast case), plus frankchimero.com, jxnblk.com, paulstamatiou.com, adamwathan.me, hamel.dev, gwern.net, danilafe.com, t3.gg, and the January and July 2026 Hacker News "share your personal site" threads. And rudra-iitm.github.io.

### 4.1 The headline finding

The sites that read as premium and personal in 2026 are almost all the same object: **a single column of well-set text, about 600 px wide; name and role in the first two lines; one paragraph of honest positioning; a dated list of work with one-line outcomes; projects that link to essays or real products; contact as plain text links; and a visible sign the page was touched this year.** Near-black or off-white, one typeface plus one accent, hover-only motion.

The people whose job is animation (Emil Kowalski wrote animations.dev; Rauno Freiberg wrote Vercel's interaction guidelines) have among the *fewest* animated elements on their own sites. Measured counts of animated or transitioning elements on home pages: Cassidy Williams 0, Nanda Syahrasyad 0, Max Stoiber 0, Emil Kowalski 1, Delba de Oliveira 1, Paco Coursey 20, Brittany Chiang 95, Josh Comeau 125, Maxime Heckel 379. Emil's own essay title, visible on his home page, is "You Don't Need Animations".

### 4.2 Competitive analysis

| Portfolio | Strongest idea | UX lesson | Design lesson | Technical lesson | What NOT to copy |
|---|---|---|---|---|---|
| **paco.me** (Paco Coursey, Linear) | Positioning in one paragraph, then only work you'd be proud of in five years | No nav needed when the page is short; "Now" written as prose | 16/28 body, 640 px measure, one italic serif accent | Next.js, forced dark, zero decoration | Three-project sparseness only works when two projects have tens of thousands of dependents |
| **emilkowal.ski** (Emil Kowalski, Linear) | Every list item is title + one sentence saying what it is for | Scannable in 15 seconds; projects and essays use the same row | Name at 14 px, hierarchy from spacing not size | One animated element on the page | 14 px body is the legibility floor |
| **benji.org** (Benji Taylor, SpaceX) | A visible "Updated Aug 22, 2026" date under the name | CV written as a letter, links inline | Inter 14/20, 550 px, black on white | Static Next.js | No nav does not scale past six paragraphs |
| **alexcarpenter.me** (Alex Carpenter, Clerk) | Real merged PR titles listed under "Latest work" | Engineering depth per pixel is highest in the set | Geist Mono 12 px "dashboard" | Astro 7, seven transitions | 12 px mono body; the contribution graph is the weakest element on the page |
| **nexxel.dev** (Shoubhit Dash, 21, student → OpenCode) | Work rows with month-precision dates and one line each; one project with a real metric | Answers the recruiter in ten seconds | JetBrains Mono, near-black | Next.js | Lowercase-everything and shortcut-key nav are affectations; 864 px mono lines are too long |
| **delba.dev** (Delba de Oliveira) | "I'm looking for my next role in X. If you're hiring:" as sentence one | If job-seeking, say so first | Fraunces 18/28, horizontal rules | One animated element | "Portfolio" as the h1 wastes the headline |
| **antfu.me** (Anthony Fu) | OSS grouped by role: Creator of / Core team of / Maintaining | Converts a hundred repos into three honest tiers | Inter 16/28, 656 px, quiet generative canvas | Vite + Vue | Logo strips need recognisable logos |
| **mxstbr.com** (Max Stoiber, OpenAI) | Bullet facts with numbers beat adjectives | Times New Roman, no CSS transitions, still credible | Anti-design that works only because the facts are strong | Zero web fonts | Unstyled default serif reads as unfinished without those facts |
| **sarahdayan.dev** (Sarah Dayan, Algolia) | Four sections, three items each, "view all" links | Home page as a table of contents | Söhne 19/31, 656 px | Next.js | Grey body text under 7:1 contrast |
| **brittanychiang.com** (Brittany Chiang, Klaviyo) | Experience rows: date gutter, title · company, two sentences, archive page | The structure is excellent | The most cloned layout on GitHub | Next.js + Tailwind; colophon in footer | The cursor spotlight, the sidebar, the tag pills: recruiters have seen this template hundreds of times |
| **leerob.com** (Lee Robinson) | Evergreen "Notes" separated from dated "Blog" | Position statements show how a senior thinks | Iowan Old Style 17/27, warm dark | Next.js | Bio-length toggle is a gimmick |
| **rauno.me** (Rauno Freiberg, Vercel) | Show the artefact, not the description of the artefact | A craft entry is title, date, one link | Canvas layout as a signature | Next.js | The canvas: on anyone else it reads as an empty page |
| **cassidoo.co** (Cassidy Williams, GitHub) | Mono as a whole-site voice | Personality through voice, not visuals | iA Writer Mono 16/25.6 | Astro 7, zero animation | Mono body for long-form case studies reads ~15% slower |
| **rudra-iitm.github.io** (Rudra Pratap Singh, Google; your mentor) | One honest positioning sentence plus a three-line proof paragraph | Numbered sections, real pages, prerendered HTML per route, sitemap and robots done | Instrument Serif + Inter + JetBrains Mono on warm cream; large editorial display type | TanStack Start prerendered to GitHub Pages; sitemap and robots present | 631 KB JavaScript bundle (GSAP, Lenis, Motion, SplitType); no custom 404 page; adjective-led project copy; and, for you specifically, the same cream-and-serif register would read as a clone within the OpenPrinting community |
| **bruno-simon.com** (contrast case) | A 3D world you drive through | Every second is spent on the site, not the work; no text fallback; needs a GPU | Perfect for exactly one job | Three.js | Everything, unless the job is Three.js |

### 4.3 Typography and layout measurements that recur

| Site | Body face | Size / leading | Measure |
|---|---|---|---|
| paco.me | Söhne (Inter fallback) | 16 / 28 | 640 px |
| jakub.kr | Inter Variable | 16 / 26 | 644 px |
| leerob.com | Iowan Old Style | 17 / 27 | 600 px |
| sarahdayan.dev | Söhne | 19 / 31 | 656 px |
| shud.in | custom sans | 16 / 28 | 616 px |
| antfu.me | Inter | 16 / 28 | 656 px |
| manuelmoreale.com | Iowan Old Style | 18 / 34 | 639 px |
| cassidoo.co | iA Writer Mono | 16 / 25.6 | 632 px |
| delba.dev | Fraunces | 18 / 28 | 587 px |

Consensus: single column, 550 to 660 px measure, body 16 to 18 px, leading 1.6 to 1.75, headings barely larger than body with hierarchy from spacing and colour, 16 px gutters on mobile, near-black backgrounds between #101010 and #1B1A19 (never pure black), off-whites between #FDFDFC and #EDEDED, body text on dark in grey with white reserved for headings and links, accent colours almost absent.

### 4.4 How the best sites show engineering depth

Earns its place: case-study essays about your own tools (Emil on Sonner and Vaul; Nanda on building a database); real merged PR titles (Alex Carpenter); role-tiered open-source lists (Anthony Fu, Max Stoiber); evergreen notes separated from dated posts (Lee Robinson, for seniors); public site source (Cassidy, Guillermo Rauch, Brian Lovin, Max, Anthony).

Does not earn its place: `/uses` as a nav item; a `/now` page that goes stale (Benji's "Updated" line does the same job with less surface); changelogs of the site itself (none of the 35 have one); architecture diagrams as standalone pages (they belong inside case studies); talk lists without video links; aggregate stats below a credibility threshold (Guillermo's view counts work above 10k; below that they are a confession).

### 4.5 The recruiter in 30 seconds, as the best sites handle it

1. Line one: name. Line two: role at organisation. No scrolling.
2. Lines three to six: one prose paragraph: what you build, where, one specific thing you are known for.
3. Contact as text links above the fold, or embedded in the last sentence of the bio.
4. Then a dated list, one line each. Recruiters scan dates and nouns; they do not read cards.
5. A résumé link in plain text near the work list, not a hero button, not a modal.
6. If job-seeking, say so in the first sentence. Only Delba does this and it is the single highest-leverage line for that audience.

---

## 5. Design patterns worth adopting

Each pattern below is stated as a principle, with the reason it works, so it can be applied without copying anyone.

1. **Job description first, tagline never.** "Final-year CS student · GSoC 2026 contributor at OpenPrinting, The Linux Foundation" is a credibility line. "Turning ideas into reality" is on zero of the strong sites.
2. **One honest paragraph of positioning.** 40 to 80 words of prose under the name reads as a person. Bullet skills read as a form.
3. **Name-drop by proper noun and number.** OpenPrinting, The Linux Foundation, PyPI, Django, 6,657 printers, 263 tests. Adjectives cluster on the weaker sites.
4. **Dated lists with one-line outcomes.** Date, title, organisation, one or two sentences, optional links. Nothing else in the row.
5. **Projects as writing.** Where a project has a narrative, the narrative is the entry. Screenshot grids without prose were the weakest pattern observed.
6. **Home page as table of contents.** Three items per section plus "all", with depth on subpages.
7. **A visible maintenance signal.** An "Updated" date under the name, and dated case studies with a "last verified" stamp. Staleness is the most common failure of otherwise good sites.
8. **One typographic idea, executed precisely.** Measure, leading and one accent, all measured, not eyeballed.
9. **Open source is where the work lives.** Link hard to GitHub, PyPI, PRs. Publish the site's own source.
10. **A colophon.** One line: what it is built with, what it is set in, where the source is. A small taste signal that costs nothing.
11. **Role tiers for open source.** "Built during GSoC 2026 / Contributed to / Author of" rather than a repo dump.
12. **Say what you are looking for.** One sentence on the home page: "Graduating 2027. Open to software engineering internships and new-grad roles." Updated when it changes.

---

## 6. Patterns to avoid

Drawn from the research, from your own brief, and from your current GitHub README.

**Visual**
- 3D and WebGL heroes, particle fields, animated gradients, mesh blobs, aurora glows (this includes the Chrono Wall aesthetic).
- Glassmorphism and neon-accent dark mode. The design engineers who work at Linear and Raycast do not use it on their own sites; they use near-black plus grey.
- Bento-box grids. Nine tiles of unequal importance flatten hierarchy. None of the 35 sites use one.
- Skill bars, percentage rings, technology-logo carousels, "10+ technologies" counters.
- Giant hero text with no substance. Your mentor's 140 px h1 works because the sentence under it is true and specific; without that, it is volume.
- Cursor followers, spotlight effects, custom cursors. Broken on touch, cloned everywhere.
- Body type under 15 px. Several good sites do it; users complain on cheap panels.
- Mascots, illustrations of yourself, inspirational quotes.
- Excessive icons. Text links beat icon rows.

**Motion**
- Typewriter and text-scramble headlines. They delay the one sentence the visitor needs.
- Loading screens and preloaders on a text page.
- Staggered fade-in on page load. Paco, Emil, Benji and Sarah do not do it.
- Scroll-triggered reveals, parallax, smooth-scroll libraries. Lenis alone is a dependency for a feeling.
- Fake terminals, "type a command" landings, "Press ⌘K to start". Your GitHub README is currently in this register; the site should not be.

**Content**
- Generic statements without evidence. "Passionate", "pixel-perfect", "real-world problems".
- Fake or meaningless metrics: stars below a threshold, follower counts, "response time < 24h" widgets, "availability" badges.
- Walls of text. Case studies are long, but every section is short and headed; the mobile version collapses sections.
- Repetitive project cards with identical structure and equal weight.
- Live widgets (now-playing, weather, GitHub heatmap, LeetCode calendar). Charming for a week, first thing to break, and activity is not outcome.
- Contact forms. They need a backend or a third-party service; a mailto link is faster and works on a free static host.

**Engineering**
- Single-page apps on GitHub Pages. A hard load of `/work/cidx` returns a real 404 unless the page is prerendered; the `404.html` redirect trick stops search engines indexing deep pages.
- A JavaScript runtime for zero interactivity. Your mentor's site ships 631 KB of scripts; a text-first site needs under 2 KB.
- Client-side fetching of GitHub or LeetCode data. Rate limits, layout shift, and an API dependency at read time. Snapshot at build.
- Hotlinked Google Fonts. Extra origin, privacy question, slower.
- Third-party analytics scripts by default.
- Over-engineered architecture: a CMS, a database, a serverless function, a design system package. The content is a dozen Markdown files.
- Tailwind for ~300 lines of CSS. Not wrong, just not pulling its weight; custom properties in one file keep the design legible and dependency-free.

---

## 7. Recommended design direction

### The five directions, compared

| Direction | What it looks like | Fits your identity? | Differentiates you? | Risk |
|---|---|---|---|---|
| **A. Minimal editorial / Swiss** | Light, large sans headlines, strict grid, numbered sections | Partly: precise, but it reads "designer" | Medium | Slides into the same register as your mentor's site if a display serif is added |
| **B. Minimal dark developer environment** | Near-black, Inter or Geist, grey body text, small type | Partly: it says "developer" | Low: it is the 2024–26 design-engineer house style (Jakub, Samuel, Paco) | Indistinguishable from a hundred Linear-adjacent sites; also the natural neighbour of your terminal-themed README |
| **C. Premium SaaS** | Gradients, glass cards, product-style hero, CTA buttons | No | No | Reads as marketing; ages fastest |
| **D. Editorial + technical documentation hybrid** | Paper-like light theme, sans body, mono for data and labels, tables and stamps as first-class elements, headed sections, dark mode by system preference | **Yes.** Your work is verification records, ADRs, changelogs and evaluation tables. The medium matches the message. | **High.** Almost no personal sites use tables and data typography as the aesthetic; none in the survey did. | Can look dry if spacing and hierarchy are not precise; mitigated by the type spec in section 14 |
| **E. Minimal with subtle interactive elements** | Any of the above plus a few "craft" interactions | Only if interactions are on-topic | Low on its own | Interaction for its own sake is what the brief rejects |

### Recommendation: Direction D, "the verification record"

The site looks and reads like a well-typeset engineering document: the kind of document you already write (`docs/verification.md`, `DECISIONS.md`, "What it gets wrong"). Concretely:

- **Light by default** ("paper"), with a dark theme that follows the system preference and a small manual toggle. Light-first differentiates you from the roughly 70% of developer sites that are dark, prints and screenshots well, and matches a recruiter's daylight context. Dark exists because engineers reading at night expect it.
- **One sans family for reading, one mono family for data.** The mono is not decoration; it is used exactly where a document would use it: labels, dates, measurements, status stamps, code, the evidence tables. Tabular figures throughout.
- **No display serif.** That is your mentor's signature and the current "editorial portfolio" cliché.
- **Tables, stamps and rules as the visual vocabulary.** The claims-and-evidence table, the status stamp (`alpha · PyPI`, `under upstream review`, `merged`), the "last verified" line, and hairline rules between sections. These carry the personality: precise, honest, slightly austere.
- **One accent colour, used only for meaning:** links, focus rings, and the "verified" state. Never for decoration.
- **Hierarchy from spacing and weight, not size.** Page titles are modest; section labels are small mono capitals; body is generous. The page feels calm because nothing shouts.
- **Zero animation on load and scroll.** Hover and focus states, a theme toggle, a page-transition fade via the native cross-document View Transitions API where supported. Nothing else moves.

Why it is memorable without being loud: nobody expects a student portfolio to cite its sources. A visitor who reads one evidence table remembers "the one with the tables where every number had a link".

---

## 8. Homepage blueprint

The home page is one column, about 640 px wide, seven blocks, roughly 1,100 words of content. It should be readable in full in under two minutes and scannable in thirty seconds.

### What a visitor sees, by time

| Time | What they see | What they conclude |
|---|---|---|
| 0–3 s | Name in the header; below it a two-line identity: "Gati Varshney" / "Final-year CS student · GSoC 2026 contributor at OpenPrinting, The Linux Foundation" and a small mono "Updated 2026-09-XX" | A real, current person with one recognisable credential |
| 3–10 s | The positioning paragraph, with three inline links: cidx, OpenPrinting, Casefile; a row of text links: GitHub · LinkedIn · Email · Résumé (PDF) | What kind of engineer, what they have built, how to reach them |
| 10–30 s | "Selected work": three rows, each with a title, one sentence, one mono evidence figure, and a link to the case study | The work is real and measured |
| 30 s – 2 min | "Open source" (OpenPrinting, dates, Hall of Fame quote, commits link), "Writing" (three titles with one-line subtitles), "Currently" (two dated lines), footer with contact, colophon and source link | Depth exists one click away; the site is maintained; the person writes |

### Section-by-section

**1. Header (all pages).** Left: "Gati Varshney" as a link home. Right: Work · Open Source · Writing · About, and a theme toggle. On desktop a fifth text link, "Résumé", opens the PDF. No hamburger: four short words fit on a 375 px screen in one row at 14 px mono.

**2. Identity block.** Name as the page's single h1, set at body-plus size (about 24 px, weight 600), not a poster. Under it the role line in muted text. Under that, the "Updated" stamp in 13 px mono. Purpose: answer "who" in one glance. Visual treatment: nothing but type and 8 px of spacing. Interaction: none.

**3. Positioning paragraph.** 60 to 80 words. Draft, to be edited in your voice:

> I build developer tools and data systems that show their working. This year that meant [cidx], a zero-config local code index that serves AI coding agents over MCP and proves its incremental index matches a cold rebuild; an explainable printer-recommendation pipeline and natural-language assistant for [OpenPrinting] during Google Summer of Code 2026; and [Casefile], a fraud-alert verifier that publishes exactly what it gets wrong. Graduating 2027; open to software engineering internships and new-grad roles.

Then the links row: `GitHub · LinkedIn · Email · Résumé (PDF)` as plain underlined text. Purpose: positioning and the recruiter path in one block. Interaction: link hover only.

**4. Selected work.** Section label "Selected work" in small mono capitals, then three rows separated by hairlines. Each row: title (link), one sentence, and a right-aligned or below-line mono evidence figure with its context in muted text. Example rows:

- **cidx** — Local code index for AI coding agents: tree-sitter, SQLite, five read-only MCP tools. `263 tests · 3 OS × 3 Python · on PyPI`
- **Printer recommendations & assistant (GSoC 2026)** — Explainable similarity over 6,657 printers, built entirely at build time for a static site. `score saturation 86.8% → 0%`
- **Casefile** — An evidence-first verifier for payment fraud alerts, evaluated once on a held-out world. `precision 0.888 · recall 0.831 · held-out`

Below the rows, a text link: "All work →". Purpose: proof. Visual treatment: table-like rows, no cards, no thumbnails, no chips. Interaction: whole row is the link target on hover with a subtle background change.

**5. Open source.** Section label, then one short paragraph: "Contributor to the OpenPrinting website (The Linux Foundation) since November 2025: author system, migration of 200+ posts, the site's search, the homepage, and the trailing-slash fix that restored RSS links. Credited in the Hall of Fame." Then two mono lines: `14 commits in OpenPrinting/openprinting.github.io →` and `GSoC 2026 final report →`. Purpose: the credential with its proof, in context. Why here and not merged into work: open source is a body of contributions, not a project, and recruiters look for the phrase.

**6. Writing.** Section label, three rows of title + one-line subtitle + date, and "All writing →". At launch these are the three pieces in section 13. Purpose: the depth layer, and the thing that makes the site feel alive over time.

**7. Currently.** Two or three dated lines in prose: what you are working on (cidx 0.1.0a2 and the Django-scale audit; GSoC PRs in upstream review), what you are studying. Purpose: the maintenance signal, written as a person. Replaces a `/now` page.

**8. Footer (all pages).** Contact links repeated, a colophon line ("Built with Astro, set in [font] and [mono], hosted on GitHub Pages. Source →"), and "© Gati Varshney · Updated 2026-09-XX".

### What is deliberately absent from the home page

Photo, skills, education details, LeetCode, certificates, a contact form, project screenshots, any statistic that is a count of things rather than a measurement.

---

## 9. Complete information architecture

### Pages

| URL | Purpose | Visible from | Why it exists as its own page |
|---|---|---|---|
| `/` | Identity, positioning, table of contents | Everywhere | The 30-second answer |
| `/work/` | The full chronological work list (tiers 1 and 3) | Header | Keeps the home page to three items without deleting history |
| `/work/cidx/` | Case study | Home, work index | Deepest artifact; deserves the full skeleton |
| `/work/printer-recommendations/` | Case study (GSoC 2026, PR #224 + #230) | Home, work index, open-source page | The narrative with the best before/after |
| `/work/casefile/` | Case study | Home, work index | Shows range: statistics, evaluation design, integrity |
| `/open-source/` | OpenPrinting contribution story, timeline, generated ledger, recognition | Header, home | A body of contributions over time is not a project; recruiters and maintainers look for this page by name |
| `/writing/` | Index of posts | Header, home | The depth layer that grows |
| `/writing/<slug>/` | Individual posts | Writing index, home | Each is a linkable, indexable article |
| `/about/` | Short bio, education, competitive programming, how I work, experience list (grows later), résumé link | Header | Everything personal that does not belong in the hero |
| `/resume.pdf` | The PDF, versioned in the repo | Header (desktop), home, about, footer | Recruiters want the file |
| `/404/` | Custom not-found page with links home | GitHub Pages serves `404.html` automatically | Your mentor's site shows the GitHub default; yours should not |
| `/rss.xml` | Feed for writing | Footer | Free, expected by engineers, one integration |
| `/sitemap-index.xml`, `/robots.txt` | Search | Not linked in nav | SEO |
| `/og/<slug>.png` | Build-time social preview images | Not linked | Link previews on LinkedIn, X, Slack |

### Navigation

Header: **Work · Open Source · Writing · About** (+ Résumé on desktop, theme toggle). Four items, all real pages. Footer: GitHub · LinkedIn · Email · Résumé · RSS · Source.

### Sections that were considered and rejected

| Candidate | Decision | Reason |
|---|---|---|
| Experience page | Folded into About as a list until there are two or more employer entries; content collection exists from day one | A page with one GSoC entry looks thin; GSoC is already three places |
| GSoC page | Rejected | Duplicates the case study and the open-source timeline |
| Achievements page | Rejected; recognition lives on the Open Source page and About | A page of certificates reads as a student portfolio |
| Skills page or section | Rejected | Unverifiable; technologies appear in context |
| Now page | Folded into a dated "Currently" block on the home page | A separate page goes stale; a dated block on the home page is the maintenance signal |
| Uses page | Rejected | Low signal; none of the strong sites nav to it |
| Playground / labs | Rejected | You have no interaction experiments worth showing, and the brief rejects gimmicks; if cidx gets a web demo later, it lives in the case study |
| Contact page | Rejected | Contact is a mailto link in the header, hero and footer; a form needs a backend |
| Engineering timeline visualisation | Rejected as a visual; kept as the dated timeline list on the Open Source page | A drawn timeline of four points is decoration |
| GitHub activity page or heatmap | Rejected | Activity is not outcome; the contribution ledger of real commits replaces it |
| Site changelog | Rejected | None of the 35 sites have one; the "Updated" stamp and the public source history do the job |
| Case studies as a separate section from Work | Rejected | One Work index with two tiers is simpler to navigate and maintain |

---

## 10. Project presentation strategy

### The rule: projects are presented as evidence, not as cards

The default portfolio pattern (title, blurb, tech chips, GitHub button, repeated in a grid) fails because every project gets the same visual weight and the same zero depth. Your projects are unequal in depth and should look unequal. The site uses three tiers.

### Tier 1: Case studies (three at launch)

Each is its own page at `/work/<slug>/`, written as a technical narrative. All three follow one fixed skeleton so they can be compared and so future projects slot in without design work:

1. **Header**: title, one-sentence description, status stamp (`alpha on PyPI`, `under upstream review`, `buildathon submission`), dates, links (repo, PyPI, PR, report, demo).
2. **Claims and evidence table**: three to six rows. Each row is `claim | measurement | context (corpus, date) | verify (link)`. This is the signature element of the site and the thing nobody else has. Examples: "Incremental index equals a cold rebuild | property suite over random edit/delete/rename sequences + crash injection | 263 tests, 3 OS × 3 Python | tests/convergence"; "Score saturation eliminated | 86.8% → 0% of recommendations at 1.0 | 6,657 printers, evaluation harness | PR #224".
3. **The problem** (three to five sentences, plain language).
4. **How it works**: one architecture diagram (hand-authored SVG, inlined, themed with CSS variables) and a short walk-through of the pipeline.
5. **Decisions**: two to four ADR-style entries, each `decision / alternatives considered / why / consequence`. Pulled directly from your existing DECISIONS.md and ARCHITECTURE.md prose.
6. **What went wrong**: one or two debugging narratives with numbers before and after. This is the section engineers will remember.
7. **Limitations**: the honest list, copied from your own repos.
8. **What I'd do next**.

Each section after the table is collapsible on mobile via native `<details>` elements, so the first screen of a case study is the header and the evidence table.

**cidx** case study content sources: README, ARCHITECTURE.md, DECISIONS.md (ADR-003 SQLite over embeddings, ADR-007 no embeddings in v1, ADR-008 convergence invariant as release gate, ADR-015/016 the Django fixes), CHANGELOG 0.1.0a2, docs/verification.md. Diagram: the existing ASCII system overview redrawn as SVG (watcher → incremental engine → SQLite store → query layer → CLI / MCP).

**Printer recommendations and assistant (GSoC 2026)** content sources: final report, PR #224 and #230 bodies, PR #236 documentation. Diagram: build-time pipeline (foomatic-db XML → 6,657 printer records → 415-dimension feature vectors → IDF-weighted cosine → damping and penalties → per-printer JSON shards) plus the deterministic query pipeline of the assistant (normalisation → entity resolution → intent classification → typed query → local data → typed response). Note the resume says 463 dimensions and the PR body says 415; reconcile before publishing. "What went wrong": the saturation story. Limitations: internal-consistency metrics only; no ground-truth dataset; duplex not recorded.

**Casefile** content sources: README, ARCHITECTURE.md, pitch video. Diagram: alert → probes → evidence → findings → features → calibrated score → expected-cost policy → sealed artifact → replay. Decisions: sign-constrained logistic regression, IRLS over gradient descent, physical label isolation, floats rejected in canonical JSON, Merkle odd-leaf promotion. "What it gets wrong": copied nearly verbatim; it is already excellent.

### Tier 2: Contribution story (the Open Source page)

OpenPrinting is not a "project"; it is a body of contributions over ten months. It gets its own page (section 11) with a contribution ledger rather than a case-study page.

### Tier 3: The work index list

`/work/` is a single chronological list, not a grid. Each row: year, title, one line of what it is, one line of evidence or outcome, links. Tier 1 entries appear at the top with a "case study" link; tier 3 entries (Interview Copilot, Conversational Assessment Recommender, and optionally FinSight and Chrono Wall under a small "experiments" heading) appear below with only external links. No tech chips. Technology names appear inside the one-line description where they matter ("tree-sitter and SQLite", "Gemini structured outputs and Zod").

### What is demonstrated visually rather than described

- Architecture: one SVG diagram per case study, no more.
- Before/after numbers: rendered as a two-value figure with a label (86.8% → 0%), in tabular mono figures, not as a chart. Charts imply a dataset; you have single measurements.
- The recommendation UI and the assistant: one screenshot each, from the PR pages, with alt text. No carousels.
- cidx: a short static code block showing the MCP configuration and one CLI query with its real output. This is more convincing than a screenshot and costs nothing to load.

### Rejected project-presentation ideas

- Live embedded demos: cidx is a local CLI and MCP server; there is nothing to embed. Interview Copilot's backend runs on a free Render instance that sleeps, so an iframe would show a cold-start spinner. Link out instead.
- Interactive architecture diagrams: your diagrams have six to nine nodes. Interactivity adds JavaScript and no information.
- GitHub star counts and contribution heatmaps on project pages: no signal at your current numbers, and the heatmap is a GitHub artifact, not evidence of anything specific.

---

## 11. Experience presentation strategy

### What "experience" means for your profile

You do not have an employer internship on record yet. Your experience is GSoC (a paid, mentored, deadline-driven program at a Linux Foundation project) and ten months of maintainer-reviewed open-source contribution. Treat these as real experience, because they are, and present them with the same seriousness a company internship would get: organisation, role, dates, mentors, what shipped, what is verifiable.

### The Open Source page (`/open-source/`)

Sections in order:

1. **OpenPrinting, The Linux Foundation** as the single organisation heading, with dates (November 2025 to present) and the Hall of Fame quote as a pull-quote with its link.
2. **Timeline of contribution phases**, each with a one-line outcome:
   - Nov 2025: author system (AuthorCard component, integration into post layout).
   - Dec 2025: migration of 200+ Jekyll posts into Next.js via a Node script preserving frontmatter, media and legacy URLs.
   - Mar 2026: build-time indexed client-side search (unified/remark AST pipeline → static JSON → MiniSearch), publication dates, slug redirects, homepage.
   - May–Aug 2026: GSoC project (link to the case study).
   - Aug 2026: trailing-slash root-cause fix and a CI URL check (link to the writing piece).
3. **Contribution ledger**: a generated table of your commits in the organisation repository (date, title, link). Generated at build from a JSON data file; refreshable by a scheduled workflow (section 24). This replaces "14 PRs merged" with something a reader can scroll and click.
4. **Recognition**: Hall of Fame, GSoC certificate, Winter of Code Top 20. Small, factual, dated.

### GSoC placement

GSoC appears in three places, each doing a different job: one line in the hero (credibility), the case study under Work (depth), and the timeline on the Open Source page (context). It does not get a separate top-level page; a standalone "GSoC" page would duplicate the case study.

### Future internships and jobs

The content model has an `experience` collection from day one, even though the launch site renders it inside the About page as a short list. When you get an internship, you add one entry and the About page grows a proper "Experience" section without a redesign. If a role generates a case-study-worthy project, that is a new Work entry, not a change to the Experience entry.

---

## 12. Personal branding strategy

The brief is right to reject manufactured personal brands. The way to communicate personality without inventing one is to let your actual habits show, because they are distinctive:

- **You write honesty rules into your projects.** Surface them. A short "How I work" block on the About page can quote three or four sentences you already wrote: "numbers are reported as measured, never tuned to look good"; "losses are published at the same prominence as wins"; "unknown is not false"; "if you can rebuild it, you can trust it" is your mentor's line, so do not use that one.
- **You document decisions.** The site has a public changelog page or footer entry (section 25), and the case studies use ADR structure. The medium is the message.
- **You are a competitive programmer.** One line, with rating and link, on the About page. It says "I enjoy hard problems for their own sake" without saying it.
- **You are a student.** Do not hide it. "Final-year CS student, graduating 2027" in the hero is honest and it reframes everything else as more impressive, not less. Recruiters for new-grad roles need it; everyone else respects it.
- **Voice.** Your READMEs use British spelling (colour, authorisation, catalogue) and short declarative sentences. Keep that voice on the site. Do not switch to marketing voice for the hero.
- **No tagline, no slogan, no "passionate".** The hero says what you build and who you have built it with. That is the brand.
- **No photo requirement.** A photo is optional. If you include one, it is small, on the About page, and not a hero element.

---

## 13. Content strategy

### Prominent (home page)

- Name, positioning sentence, three-line proof paragraph with inline links (OpenPrinting, cidx, GSoC final report).
- Three selected works as list rows with one evidence line each: cidx, printer recommendations (GSoC), Casefile.
- Open source summary: one paragraph plus the Hall of Fame line plus a link.
- Contact: email, GitHub, LinkedIn, resume PDF. In the header on desktop and repeated in the footer.

### Secondary (one click away)

- The full work list, including tier 3 projects.
- The Open Source page with the ledger.
- About: education, competitive programming, how I work, currently.
- Writing.

### Removed

- Skills lists, percentages, badges, "technologies I use" grids.
- The Spotify clone, Tic-Tac-Toe, currency converter, bookstore, the Cynthia Ugwu clone, DSA practice repo.
- Mystery Message (or, at most, an unlinked mention as a learning project).
- Stars, followers, repository counts, contribution heatmap, snake animation, ASCII art.
- "10+ technologies", "5+ projects", any counted-things statistic.
- Fake "response time" and "availability" widgets.

### Rewritten

Resume bullets are written for an ATS and a two-column PDF. On the site every bullet becomes either a claim-with-evidence row or a sentence in plain language. Two examples:

- Resume: "Diagnosed that 86.8% of similarity scores saturated at a perfect 1.0, making ranking meaningless; added evidence damping and capability-conflict penalties that cut saturation to 0%."
  Site: "The first scoring model was wrong. 86.8% of recommendations scored a perfect 1.0, because two printers sharing one generic driver looked identical to cosine similarity. IDF weighting, evidence damping and conflict penalties brought saturation to 0% and the evidence-to-score correlation from 0.078 to 0.851. The evaluation harness now fails if any documented metric drifts."
- Resume: "Shipped the site's author system and homepage; 14 pull requests merged in total through maintainer review."
  Site: "Author system, content migration, site search and the homepage, credited in OpenPrinting's Hall of Fame. 14 commits in the production repository." (with the commits link)

### Writing section: three pieces you can publish at launch from existing material

1. **"When the first scoring model was wrong"**: the saturation diagnosis from the GSoC report, expanded with the scoring formula and the before/after table. ~900 words.
2. **"Tracing production 404s to a config generated at deploy time"**: PR #231's root-cause section, rewritten as a debugging narrative. The lesson (local and PR builds used the repository config; only the deploy workflow injected a generated one, so it could not reproduce outside production) is genuinely instructive. ~800 words.
3. **"Proving an incremental index equals a cold rebuild"**: ADR-008, the convergence suite, the multiset blind spot, and the two Django-scale fixes from the 0.1.0a2 changelog. ~1,200 words.

Plus the GSoC final report as an external link (canonical on Medium; do not republish it in full or you split its search ranking).

### External links policy

Every claim links to its primary source: PR, commit filter, PyPI page, Hall of Fame, Medium report, LeetCode profile. Links open in the same tab (standard web behaviour; opening new tabs is a user's choice). External links carry a small visual marker in the link style so readers know they are leaving.

### Claims requiring verification before display

Listed in section 3.4. Add to the launch checklist: nothing ships with a number that does not have a `source` link in the data file.

---

## 14. Design system (visual specification)

Everything below is a starting specification to be tuned on real content, not a law. Values are chosen from the measured consensus in section 4.3 and adjusted for a document-like register.

### Typography

**Font recommendation: IBM Plex Sans (reading) + IBM Plex Mono (data, labels, code).**

Why: one family with a native sans/mono pair designed together; OFL licensed; mature variable and static cuts; tabular figures; a technical, documentation register that matches "verification record"; and it is not Inter, not Geist, and not the Instrument Serif pairing on your mentor's site, so the site does not look like anyone's house style. Both are available through the Fontsource provider in Astro's Fonts API, which generates metric-adjusted fallbacks automatically so text does not shift when the font loads.

Alternative if Plex feels too wide on your screen after a prototype: Geist Sans + Geist Mono (contemporary, tighter, also OFL). Decide on a one-page prototype, not in the abstract. Do not use more than two families.

Font budget: two variable WOFF2 files, Latin subset, under 120 KB total. Preload the sans file only.

**Scale (desktop / mobile), line-height, weight:**

| Role | Size | Leading | Weight | Family |
|---|---|---|---|---|
| Body | 17 px / 16 px | 1.65 | 400 | Sans |
| Body small (metadata, captions) | 14 px | 1.5 | 400 | Sans |
| Page title (h1) | 28 px / 24 px | 1.25 | 600 | Sans |
| Section heading (h2) | 20 px / 19 px | 1.35 | 600 | Sans |
| Sub-heading (h3) | 17 px | 1.4 | 600 | Sans |
| Section label | 12 px, uppercase, 0.08 em tracking | 1.4 | 500 | Mono |
| Evidence figure | 15 px, tabular figures | 1.4 | 500 | Mono |
| Stamp / status / date | 12–13 px | 1.4 | 400 | Mono |
| Code | 14 px | 1.6 | 400 | Mono |

Name in the header: 15 px sans, weight 600. The h1 on the home page is the name at 28 px. Every other page's h1 is the page title.

Measure: 640 px maximum for running text. Container: 680 px content plus 24 px gutters on desktop; 16 px gutters below 720 px.

### Spacing

A 4 px base with a short scale: 4, 8, 12, 16, 24, 32, 48, 64, 96. Paragraph spacing 16 px. Between rows in a list 12 px with a hairline. Between sections 64 px (48 on mobile). Header height 56 px. Page top padding 48 px (32 on mobile).

### Colour

Tokens defined on `:root`, redefined under `prefers-color-scheme: dark` and under an explicit `[data-theme]` attribute so the manual toggle works. Contrast targets: body text 12:1 or better on light, 10:1 or better on dark; muted text at least 4.5:1; hairlines are decorative and exempt.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | #FBFBFA (neutral off-white) | #141516 | Page background |
| `--bg-raised` | #F3F3F1 | #1C1D1F | Code blocks, table header, hover row |
| `--fg` | #1A1B1E | #E8E8E6 | Body text, headings |
| `--fg-muted` | #5C5F66 | #9A9DA3 | Metadata, secondary text |
| `--rule` | #E4E4E1 | #2A2C30 | Hairlines, table borders |
| `--accent` | #1F6F5F (deep teal-green) | #5FBFA8 | Links on hover, focus rings, "verified/merged" stamps |
| `--warn` | #8A5A00 | #D9A441 | "under review", "alpha" stamps |

Links: text colour with a 1 px underline in `--rule`-strength colour; on hover the underline becomes `--accent`. No blue links. External links get a small trailing mark (`↗`) via CSS with screen-reader text "opens external site".

Why deep teal-green as the single accent: it reads as "verified" and "passing", which is the site's theme; it is legible on both themes; and it is not the Vercel blue, Linear purple, or Raycast red that saturate developer sites.

### Layout

Single column everywhere. The only two-column moments are inside tables (claim | evidence) and the home page's work rows, where the evidence figure sits right-aligned on desktop and drops below the sentence on mobile.

### Borders, radius, shadows

- Border radius: 2 px on code blocks and stamps, 0 elsewhere. A document has square corners.
- Hairline rules (1 px, `--rule`) separate list rows and sections. No boxed cards.
- No shadows. Elevation does not exist in a document; the theme change and hover states use background colour only.

### Background treatment

Flat colour. No gradients, no noise, no grid, no dots.

### Components (the full list)

`Header`, `Footer`, `Identity` (name, role, updated), `Prose` (typographic wrapper for Markdown), `SectionLabel`, `WorkRow`, `EvidenceTable`, `Stamp`, `Timeline` (a dated list), `Ledger` (generated table), `WritingRow`, `Diagram` (inline SVG wrapper with a caption and a text alternative), `Details` (styled native `<details>`), `ThemeToggle`, `ExternalLink`. Fifteen components. Anything beyond this list needs a reason.

### Buttons

None. Every action on the site is a link. The only button is the theme toggle.

### Breakpoints

One meaningful breakpoint at 720 px (column goes full width, gutters to 16 px, evidence figures wrap below text, header links shrink to 13 px mono). A second at 1024 px only adjusts outer margins. Nothing else changes, which is what makes the mobile version indistinguishable in quality from the desktop one.

### Imagery and diagrams

- One inline SVG diagram per case study, drawn by hand (Figma, Excalidraw with the sketch style turned off, or D2 for a first draft) and cleaned so that fills and strokes use `currentColor` and the CSS tokens. The diagram then themes itself for free.
- Screenshots (two in the GSoC case study) go through Astro's image pipeline at build time, output as AVIF/WebP with explicit dimensions, lazy-loaded, with real alt text.
- No hero image. An optional small photograph on the About page only.
- Favicon: a monogram "gv" in the mono face, as SVG with a `prefers-color-scheme` media query inside it, plus a 180 px PNG for Apple touch icons and a 512 px PNG in the web manifest.

---

## 15. Animation philosophy

The design system has four kinds of motion and no others.

1. **State feedback (hover, focus, active).** 150 ms `ease-out` colour and underline transitions on links and rows. This is the entire hover vocabulary.
2. **Theme change.** A 200 ms transition on background and foreground colour so switching does not flash. Disabled during initial load so there is no flash of the wrong theme (an inline script in `<head>` sets the theme attribute before first paint).
3. **Page transitions.** Native cross-document View Transitions via one CSS rule (`@view-transition { navigation: auto; }`), giving a 150 ms cross-fade between pages in Chrome, Edge and Safari, and nothing in Firefox. The header can be given a shared `view-transition-name` so it stays fixed while the content fades. Zero JavaScript.
4. **Disclosure.** Native `<details>` elements open and close instantly. Animating them requires JavaScript or the new `::details-content` transitions; leave them instant.

Nothing animates on page load, on scroll, or continuously. No smooth-scroll library.

`prefers-reduced-motion: reduce` removes the theme transition and the view transition fade (a three-line media query). Hover colour changes remain, because they are functional feedback.

Why this is enough: the research found the sites of the people who teach animation for a living have between one and twenty animated elements, all hover-driven. Motion on this site is a property of the design system (one duration, one easing, four uses), not a collection of effects.

---

## 16. Mobile strategy

Designed at 375 px first, then allowed to widen. Concretely:

- **Navigation.** Four mono words in one row under or beside the name; no hamburger, no drawer. Tap targets are 44 px tall via padding even though the text is 13 px.
- **Typography.** Body 16 px; page titles 24 px; measure is the full width minus 16 px gutters. Line lengths at 375 px are about 45 to 50 characters, which is inside the readable range.
- **Work rows.** Title, sentence, then the evidence figure on its own line below; the whole row remains one tap target.
- **Evidence tables.** Four-column tables do not fit at 375 px. The table is marked up as a real table for screen readers, and below 720 px it is restyled with CSS so each row renders as a stacked block: claim in bold, then "measurement", "context" and "verify" as labelled lines. No horizontal scrolling, no pinch-zoom.
- **Case studies.** Sections after the evidence table are wrapped in `<details>` on all viewports but open by default on desktop and closed by default on mobile (set by a class toggled at build time plus one media query; no JavaScript). The first screen on a phone is the header and the table.
- **Diagrams.** SVGs scale to the column width; text inside them is set at a minimum of 12 px at 375 px, which caps how many nodes a diagram can have (about nine). Each diagram has a "text version" `<details>` beneath it listing the pipeline as an ordered list, which also serves screen readers.
- **Code blocks.** Horizontal scroll inside the block only, with 14 px mono; never wrap code.
- **Touch.** No hover-dependent information anywhere; hover is enhancement only. Focus rings are visible for keyboard users and hidden for pointer users via `:focus-visible`.
- **Performance on mobile networks.** Total transfer for the home page under 200 KB including fonts; no images on the home page; case studies lazy-load their one or two screenshots.
- **Testing.** Every page is checked at 375, 390, 768, 1024 and 1440 px before launch, plus iOS Safari for the view-transition fallback and the `<details>` styling.

---

## 17. Accessibility strategy

Accessibility is a property of the design system, not a pass at the end.

- **Semantics.** One `<h1>` per page; headings in order; `<header>`, `<nav aria-label="Primary">`, `<main>`, `<footer>` landmarks; `<article>` for posts and case studies; real `<table>` with `<th scope>` for evidence tables and the ledger; `<time datetime>` for every date; `<details>/<summary>` for disclosure.
- **Skip link.** "Skip to content" as the first focusable element, visible on focus.
- **Keyboard.** Every interactive element is a link, a native button, or a native summary, so keyboard behaviour is free. Focus order follows DOM order. `:focus-visible` rings in `--accent`, 2 px, 2 px offset.
- **Contrast.** Tokens in section 14 are chosen to pass WCAG AA at 4.5:1 for all text and AAA for body text. Verified in CI, not by eye.
- **Reduced motion.** Honoured as in section 15.
- **Colour independence.** Status stamps use text ("merged", "under review", "alpha") in addition to colour. Links are underlined, not colour-only.
- **Images and diagrams.** Screenshots have descriptive alt text written by you. Diagrams are inline SVG with `role="img"` and an `aria-labelledby` title, plus the text version beneath.
- **External links.** A visually hidden "(external)" suffix.
- **Theme toggle.** A `<button aria-pressed>` with a text label, not an icon-only control.
- **Language and reading.** `lang="en"` (with `en-GB` if you keep British spelling consistently). Short sentences; no text in images.
- **Zoom.** Layout holds at 200% zoom and at 320 px CSS width (WCAG reflow).
- **CI.** pa11y-ci runs axe over every URL in the sitemap on each pull request; Lighthouse CI asserts an accessibility score of 100. A failing check blocks deploy.
- **Manual pass before launch.** Screen reader walk-through (NVDA on Windows, VoiceOver on iOS) of the home page and one case study.

---

## 18. Performance strategy

Targets, all measured on the mobile Lighthouse profile against the built output, and asserted in CI:

| Metric | Target | Why it is realistic |
|---|---|---|
| Lighthouse Performance / Accessibility / Best Practices / SEO | 100 / 100 / 100 / 100 | A static Astro site with zero islands hits this by default; the risk is fonts and images |
| Largest Contentful Paint | under 1.0 s on fast 3G simulation | The LCP element is text; the sans font is preloaded with a metric-matched fallback |
| Cumulative Layout Shift | 0 | No late-loaded content; images carry width and height; fonts use `size-adjust` fallbacks |
| Interaction to Next Paint | under 50 ms | There is almost no JavaScript to block the main thread |
| Home page transfer (compressed) | under 200 KB including fonts | ~15 KB HTML, ~12 KB CSS, ~1 KB JS, ~110 KB fonts |
| JavaScript per page | under 2 KB | The theme script only |

Rules that keep it there:

- **Zero client-side frameworks.** No React, no islands at launch. The theme toggle is a 20-line inline script.
- **Fonts:** two variable WOFF2 files via Astro's Fonts API (Fontsource provider), Latin subset, `font-display: swap` with generated `size-adjust` fallbacks, preload only the sans file.
- **Images:** all through `astro:assets` at build time, AVIF and WebP, explicit dimensions, `loading="lazy"` except nothing on the home page needs eager loading because there are no images there.
- **CSS:** one global stylesheet, roughly 300 lines, inlined by Astro when below its inlining threshold. No Tailwind, no CSS-in-JS.
- **Data:** GitHub and LeetCode figures are JSON in the repository, rendered at build. No fetch at page load, ever.
- **Third parties:** none. No analytics script, no embeds, no font CDN. If you want visitor counts later, GoatCounter's script-free pixel is the only acceptable option.
- **HTML:** Astro's `compressHTML` default; semantic markup keeps DOM size small (under 800 nodes on the longest case study).
- **Caching:** GitHub Pages serves `Cache-Control: max-age=600` for everything and you cannot change headers. Astro emits content-hashed asset filenames under `_astro/`, so a redeploy never serves a stale stylesheet against new HTML. Nothing to configure.

---

## 19. SEO strategy

The goal is narrow: a search for "Gati Varshney" returns this site first, and links shared on LinkedIn, X or Slack show a correct preview.

- **Titles.** Home: `Gati Varshney` followed by the role line. Other pages: `Page title — Gati Varshney`. The name is in every title, in the h1 of the home page, and spelled identically everywhere online.
- **Meta description** per page, 120 to 155 characters, written by hand in frontmatter.
- **Canonical URL** on every page, built from `Astro.site` plus the path, with the trailing slash that GitHub Pages serves.
- **Open Graph and Twitter cards.** `og:title`, `og:description`, `og:url`, `og:type` (`website` for pages, `article` for posts and case studies), `og:image` (1200 × 630, generated at build), `twitter:card=summary_large_image`. The OG image is typeset in the site's own fonts: name, page title, one line of evidence, on the paper background. Generated with Satori and resvg during the build; cached by content hash.
- **JSON-LD.** Home page: `ProfilePage` whose `mainEntity` is a `Person` with a stable `@id` (`https://gativarshney.github.io/#person`), `name`, `url`, `jobTitle` ("Software engineering student"), `alumniOf` (JSS Academy of Technical Education), `sameAs` (GitHub, LinkedIn, LeetCode, Medium), `knowsAbout`. Posts and case studies: `Article` or `TechArticle` with `author` pointing at the same `@id`, `datePublished`, `dateModified`.
- **Sitemap and robots.** `@astrojs/sitemap` generates `sitemap-index.xml`; `robots.txt` in `public/` allows everything and names the sitemap.
- **RSS** for writing, which search engines and engineers both use.
- **Cross-links, which matter more than any markup for a name search.** The site links to your GitHub, LinkedIn, LeetCode and Medium; each of those profiles links back to `https://gativarshney.github.io`. Set the GitHub profile "website" field (currently empty), add the URL to the LinkedIn contact section and to the Medium bio.
- **Search Console.** Verify the property with the HTML-tag method and submit the sitemap on launch day.
- **Content over markup.** Three real articles and three case studies will do more for ranking than any structured data.

---

## 20. GitHub Pages deployment architecture

Constraint: free hosting at `https://gativarshney.github.io`, no custom domain, no paid services. This is entirely sufficient; nothing in the design needs a server.

### Repository

- Name: **`gativarshney/gativarshney.github.io`**, public. GitHub only serves a user site from a repository with exactly this name. Your existing `gativarshney/gativarshney` (profile README) and your OpenPrinting fork do not conflict.
- Default branch `main`. Source of truth for content and code; the build output is never committed.
- Repository Settings → Pages → Build and deployment → Source: **GitHub Actions** (not "Deploy from a branch"). This is a one-time click after the first workflow run.
- HTTPS is automatic on `*.github.io`; "Enforce HTTPS" is on by default.

### Why a user site removes the usual pain

Project sites live at `username.github.io/repo/` and force a `base` path into every link and asset. A user site is served from the root, so `site: 'https://gativarshney.github.io'` with no `base` is the whole configuration. If you ever buy a domain, you add one `CNAME` file and change `site`; no link changes.

### Build and deploy workflow (`.github/workflows/deploy.yml`)

Trigger: push to `main`, plus manual `workflow_dispatch`. Two jobs:

1. **build**: checkout; `withastro/action@v6` (installs dependencies with the detected package manager, runs `astro build`, uploads `dist/` as the Pages artifact). Node 22 LTS.
2. **deploy**: `actions/deploy-pages@v5` into the `github-pages` environment, with `permissions: pages: write, id-token: write`.

A typical deploy completes in under two minutes. Pull requests run a separate `check.yml`: `astro check`, build, then pa11y-ci and Lighthouse CI against the built output served locally. No deploy on pull requests.

### Static generation and routing

- Astro emits one `index.html` per route in a directory (`/work/cidx/index.html`). Configure `trailingSlash: 'always'` so canonical URLs match what GitHub Pages serves; GitHub redirects `/about` to `/about/` with a 301 on its own.
- There is no SPA and no client-side router, so every URL is a real file, every deep link works on a hard load, and there is nothing to work around. The `404.html` redirect hack used by SPAs on GitHub Pages is unnecessary and would harm indexing.
- `src/pages/404.astro` builds to `404.html`, which GitHub Pages serves for any missing path.
- An empty `public/.nojekyll` file is included as a safeguard. The Actions path does not run Jekyll, but the file costs nothing and prevents a future "deploy from branch" mistake from stripping the `_astro/` directory.

### Asset paths

All internal links are root-relative (`/work/cidx/`). Images imported through `astro:assets` get hashed filenames under `/_astro/`. `public/` holds `resume.pdf`, `robots.txt`, `.nojekyll`, favicons and the web manifest, served verbatim at the root.

### SEO files

`robots.txt` (static), `sitemap-index.xml` (generated), `rss.xml` (generated), `og/*.png` (generated). All produced by the build; nothing is maintained by hand except `robots.txt`.

### Favicon and manifest

`favicon.svg` (with an embedded dark-mode media query), `apple-touch-icon.png` (180 px), `icon-512.png`, and `site.webmanifest`. All in `public/`.

### Data refresh workflow (optional, phase 2)

`.github/workflows/refresh-data.yml` on a weekly cron: a small Node script queries GitHub's REST API for your commits in `OpenPrinting/openprinting.github.io` (public data; the default `GITHUB_TOKEN` suffices) and LeetCode's GraphQL endpoint (unofficial, wrapped in `continue-on-error`), writes `src/data/contributions.json` and `src/data/leetcode.json` with an `asOf` date, and commits if changed. The commit triggers the deploy workflow. The JSON is committed, so a failed fetch still builds from the last good snapshot. Until this exists, you update the two files by hand; the site never depends on an API at build or read time.

### Limits that matter

Published site under 1 GB, soft 100 GB per month bandwidth, ten-minute build timeout. A text site with a handful of screenshots is orders of magnitude below all of these.

### Caching and performance on GitHub Pages

GitHub's CDN (Fastly) serves the site with gzip and a fixed ten-minute cache. Hashed asset names make this safe. There is no way to set custom headers, add Brotli, or configure redirects beyond the trailing-slash behaviour; none of these are needed.

---

## 21. Technical architecture

### Recommended stack

**Astro 7.3 (static output), plain CSS with custom properties, Markdown/MDX content collections, zero client-side framework.**

Verified versions as of 17 September 2026: Astro 7.3.3 (Node 22.12 or newer required), `@astrojs/mdx` 8.0.1, `@astrojs/sitemap` 3.7.4, `@astrojs/rss` 4.0.19, Sharp 0.35.4, Satori 0.33.4, `@resvg/resvg-js` 2.6.2.

### Why Astro over the alternatives

| Option | Verdict | Reason |
|---|---|---|
| **Astro** | Recommended | Typed content collections, build-time image optimisation, a Fonts API that generates metric-matched fallbacks, sitemap and RSS integrations, native view transitions, one-step official GitHub Pages action, and zero JavaScript unless you ask for it |
| Next.js static export | Rejected | Ships the React runtime on every page for no interactivity; `next/image` loses its optimiser on export; no first-party content-collection story; every route with dynamic segments needs `generateStaticParams`. Fine for React-heavy sites, wrong for a text site |
| TanStack Start prerendered (your mentor's stack) | Rejected | Same runtime cost as Next, less mature GitHub Pages path; his 631 KB bundle is the demonstration |
| SvelteKit + adapter-static | Viable, not chosen | Excellent output, thinner content tooling; you would rebuild collections and image handling |
| Eleventy | Viable, not chosen | Very light, but images, typed data and MDX are assembled by hand |
| Plain HTML/CSS | Rejected | Fine for one page; falls apart at twelve pages sharing a layout plus RSS, sitemap and OG images |
| Vite + React SPA | Rejected | Real 404s on deep links at GitHub Pages; the redirect hack stops search engines indexing the case studies |

### Project structure

```
gativarshney.github.io/
├─ .github/workflows/
│  ├─ deploy.yml            # push to main → build → deploy-pages
│  ├─ check.yml             # PRs: astro check, build, pa11y-ci, lighthouse-ci
│  └─ refresh-data.yml      # optional weekly snapshot of contributions/leetcode
├─ public/
│  ├─ resume.pdf
│  ├─ robots.txt
│  ├─ .nojekyll
│  ├─ favicon.svg, apple-touch-icon.png, icon-512.png, site.webmanifest
├─ src/
│  ├─ content.config.ts     # collections + Zod schemas
│  ├─ content/
│  │  ├─ work/              # cidx.mdx, printer-recommendations.mdx, casefile.mdx, interview-copilot.md, ...
│  │  ├─ writing/           # three posts at launch
│  │  └─ experience/        # gsoc-2026.md, openprinting.md (rendered on About until it grows)
│  ├─ data/
│  │  ├─ profile.json       # name, role line, positioning, links, updated date, "looking for" line
│  │  ├─ contributions.json # generated ledger of OpenPrinting commits
│  │  ├─ recognition.json   # hall of fame, GSoC, WoC, with links and dates
│  │  └─ leetcode.json      # rating, rank, solved, asOf
│  ├─ layouts/
│  │  ├─ Base.astro         # head, header, footer, theme script, JSON-LD
│  │  ├─ Page.astro
│  │  ├─ CaseStudy.astro
│  │  └─ Post.astro
│  ├─ components/           # the fifteen components in section 14
│  ├─ diagrams/             # cidx.svg, printer-recommendations.svg, casefile.svg (inlined)
│  ├─ styles/global.css     # tokens, typography, layout, components (~300 lines)
│  └─ pages/
│     ├─ index.astro
│     ├─ work/index.astro, work/[slug].astro
│     ├─ open-source.astro
│     ├─ writing/index.astro, writing/[slug].astro
│     ├─ about.astro
│     ├─ 404.astro
│     ├─ rss.xml.ts
│     └─ og/[...slug].png.ts
├─ astro.config.mjs
├─ package.json
└─ README.md
```

### Configuration essentials

`site: 'https://gativarshney.github.io'`, no `base`, `trailingSlash: 'always'`, `build.format: 'directory'`, integrations `mdx()` and `sitemap()`, `image.responsiveStyles: true`, fonts declared through `fontProviders.fontsource()` for the sans and mono families with `cssVariable` names used by the stylesheet, `session: false` to tree-shake the session runtime.

### Markdown processing note

Astro 7 uses a Rust Markdown processor by default that does not run remark or rehype plugins. The plan needs none: heading anchors and reading time can be computed in the layout from the rendered headings and the raw body. Stay on the default processor; it is faster and it removes a class of dependency drift.

### What is custom-built and what is not

| Element | Implementation | Why |
|---|---|---|
| Layout, typography, tokens | Plain CSS | 300 lines; no framework earns its place |
| Header, footer, rows, tables, stamps, timeline, ledger | Astro components (HTML templates, no client JS) | Rendered at build |
| Theme toggle | 20-line inline vanilla script | Must run before first paint; a framework would be 40 KB for a boolean |
| Page transitions | One CSS at-rule | Native View Transitions |
| Disclosure on mobile | Native `<details>` | Free, accessible, no JS |
| Diagrams | Hand-authored inline SVG | Themed with CSS variables; crisp at any size |
| Evidence tables | Astro component over frontmatter data | Typed, reusable, the site's signature |
| OG images | Satori + resvg at build | Only place a rendering library is justified |
| Search | None | Twelve pages do not need search; add Pagefind later if writing grows past fifty posts |
| Analytics | None | See section 18 |

---

## 22. Content and data architecture

### Principle

Content is data. The site's code never contains a fact about you. Adding an internship, a project, a post, or a recognition is a file edit, never a component edit.

### Collections (`src/content.config.ts`, Zod-validated)

**`work`** (MDX). Frontmatter:

```yaml
title: cidx
slug: cidx
summary: Local code index for AI coding agents: tree-sitter, SQLite, five read-only MCP tools.
tier: case-study          # case-study | listed | experiment
status: alpha             # alpha | under-review | merged | shipped | archived | submission
statusNote: 0.1.0a2 on PyPI
period: { start: 2026-07, end: null }
featured: true
order: 1
links:
  - { label: Repository, url: https://github.com/gativarshney/cidx }
  - { label: PyPI, url: https://pypi.org/project/cidx/ }
technologies: [Python, tree-sitter, SQLite, MCP, Hypothesis]
evidence:
  - claim: Incremental index equals a cold rebuild
    value: property suite + crash injection
    context: 263 tests · Ubuntu, macOS, Windows × Python 3.11–3.13
    measuredOn: 2026-09-16
    source: https://github.com/gativarshney/cidx/tree/main/tests/convergence
  - claim: Cold index of Django
    value: 30.5 s
    context: 3,043 files · 76,166 symbols · warm file cache
    measuredOn: 2026-09-16
    source: https://github.com/gativarshney/cidx/blob/main/docs/verification.md
diagram: cidx
lastVerified: 2026-09-17
```

The body is the narrative in the fixed skeleton (problem, how it works, decisions, what went wrong, limitations, next). Tier-3 entries have the same frontmatter with `tier: listed`, no evidence, and an empty body.

**`writing`** (MDX): `title`, `subtitle`, `date`, `updated`, `description`, `tags`, optional `canonical` for pieces published elsewhere first.

**`experience`** (Markdown): `organisation`, `role`, `type` (program | internship | job | contribution), `start`, `end`, `location`, `summary`, `links`, `related` (work slugs). Rendered as a list on About; becomes its own section when it has two or more entries of type internship or job.

### Data files (`src/data/*.json`, also Zod-validated at build)

- `profile.json`: name, role line, positioning paragraph (Markdown string), `lookingFor` line, links (GitHub, LinkedIn, email, Medium, LeetCode), `updated` (set by a tiny pre-build script from the last commit date, so you never edit it by hand).
- `contributions.json`: `{ asOf, repository, commits: [{ date, title, url }] }`.
- `recognition.json`: `[{ title, org, date, url, note }]`.
- `leetcode.json`: `{ asOf, rating, globalRank, topPercent, solved: { easy, medium, hard } }`.

### Invariants enforced at build

- Every `evidence` row must have a `source` URL; the build fails otherwise. This is how "nothing ships without a link" becomes structural.
- `lastVerified` older than 12 months on a case study prints a visible "last verified" warning in the header so staleness is impossible to miss.
- `status: merged` requires a `links` entry labelled "Merged PR".

### Adding things later

| Event | Edit |
|---|---|
| New internship | One file in `content/experience/` |
| New project | One MDX file in `content/work/`; set `tier` and `featured` |
| New post | One MDX file in `content/writing/` |
| GSoC PRs merged | Change `status` to `merged`, add the merged-PR link, bump `lastVerified` |
| New recognition | One object in `recognition.json` |
| New numbers | Edit the evidence row and its `measuredOn` |
| Résumé update | Replace `public/resume.pdf` |

No component changes for any of these.

---

## 23. Dependency recommendations

Runtime (build-time) dependencies, seven:

| Package | Purpose | Justification |
|---|---|---|
| `astro` ^7.3 | Framework | The build system, routing, content collections, fonts, images |
| `@astrojs/mdx` ^8.0 | MDX for case studies | Lets a case study embed the `EvidenceTable` and `Diagram` components inside Markdown |
| `@astrojs/sitemap` ^3.7 | Sitemap | One line of config |
| `@astrojs/rss` ^4.0 | RSS feed | One endpoint file |
| `sharp` ^0.35 | Image pipeline | Required peer for `astro:assets` on static builds |
| `satori` ^0.33 | OG images | JSX-to-SVG layout so preview images match the site's typography |
| `@resvg/resvg-js` ^2.6 | OG images | SVG to PNG |

Development dependencies: `typescript`, `@astrojs/check`, `pa11y-ci`, `@lhci/cli`.

Fonts arrive through Astro's Fonts API with the Fontsource provider, so no font packages are installed.

Explicitly not added, with reasons: React/Preact/Solid (no interactive surface), Motion/GSAP/Lenis (no animation beyond CSS), Tailwind (300 lines of CSS is clearer as CSS), `<ClientRouter />` (cross-document view transitions do the job in CSS), `rehype-mermaid` or Playwright (commit SVGs instead), `fontaine` (redundant with the Fonts API), `astro-og-canvas` (Satori chosen; one OG tool, not two), analytics packages, any UI component library, any CMS.

Total production JavaScript shipped to visitors: the theme script. Everything above runs only at build.

---

## 24. Long-term maintenance strategy

The site is designed so that the only thing you touch after launch is content.

- **Monthly, five minutes.** Add or update one thing: a post, a status, a number. The pre-build script refreshes the "Updated" date automatically from git, so the maintenance signal is honest.
- **When something ships.** Flip a status, add a link, bump `lastVerified`. The GSoC merge is the first such event.
- **Every semester.** Replace `resume.pdf`; re-read the positioning paragraph and the "looking for" line; archive a tier-3 project if it no longer represents you.
- **Yearly.** Bump Astro's major version (its upgrade guides are thorough; the site uses no experimental features and no plugins that could break); re-run the accessibility and Lighthouse checks; review fonts for a newer release.
- **Automation that does not need you.** Deploy on push; checks on pull requests; the optional weekly data refresh; Dependabot for the seven dependencies, with grouped minor updates so you are not flooded.
- **Failure modes and their answers.** LeetCode endpoint changes → the workflow is `continue-on-error` and the last JSON stands. GitHub Actions quota → the free tier gives 2,000 minutes a month for private repos and unlimited for public; this repo is public. Astro major upgrade breaks a component → the fifteen components are small and framework-free; worst case is an afternoon.
- **What never changes.** URLs. Every page path in section 9 is permanent; if a page is retired, it becomes a redirect (an HTML meta-refresh page in `public/`, since GitHub Pages has no server redirects). Search ranking and shared links survive redesigns.
- **The README of the site repository** documents the content model, how to add each kind of entry, and how to run the checks locally, so that you (or anyone) can maintain it in two years without re-learning it.

---

## 25. Unusual ideas worth considering

Each of these was tested against one question: does it add verifiable information, or does it add surface?

| Idea | Verdict | Reason |
|---|---|---|
| **Claims-and-evidence table per case study** | Adopt; it is the site's signature | Nobody in the 35-site survey does it; it is exactly how you already document work; it converts "trust me" into "check here" |
| **"Last verified" stamp and a build-time staleness warning** | Adopt | A truthful maintenance signal that costs one frontmatter field |
| **Status stamps (alpha, under review, merged)** | Adopt | Makes the unmerged GSoC PRs an honest fact rather than an awkward omission, and gives you something to update when they merge |
| **Generated contribution ledger** (real commit titles with links) | Adopt | Alex Carpenter's real-PR-titles list was the highest-signal element in the whole survey; yours is generated from data so it never goes stale |
| **Decision records inside case studies** | Adopt | You already write ADRs; two to four per case study, in the same format, is the technical-reviewer layer |
| **"What went wrong" section in every case study** | Adopt | Your own "What it gets wrong" section in Casefile is the most memorable thing you have written; it becomes a house rule |
| **Colophon and public site source** | Adopt | Costs one line; proves the site itself follows the rules it claims |
| **Text-version of every diagram** | Adopt | Accessibility and mobile in one move |
| **"Looking for" sentence in the hero** | Adopt | The single highest-leverage line for recruiters; only one of 35 sites had it |
| Engineering timeline visualisation | Reject | Four points; a dated list says the same thing without decoration |
| Interactive architecture diagrams | Reject | Six-to-nine-node diagrams gain nothing from interactivity |
| GitHub contribution heatmap | Reject | Activity is not outcome; even the one site that shows it is weaker for it |
| LeetCode live widget or calendar | Reject | One line with rating and link on About; a snapshot number, not a widget |
| Project dependency visualisation | Reject | No reader has asked this question about a portfolio |
| Build logs | Reject | Your CI badges and verification document already exist in the repo; link to them |
| "What I learned" sections | Fold into "What went wrong" and "What I'd do next" | Standalone "lessons" sections drift into platitudes |
| Now page | Fold into a dated "Currently" block on the home page | Separate pages go stale |
| Changelog of the site | Reject | The git history is public; the "Updated" date is the signal |
| Playground / labs | Reject for launch | Nothing to put in it yet; if cidx grows a browser demo, it lives inside the case study |
| Command palette, AI chat over the site | Reject | Novelty; hides content behind an interaction |

---

## 26. Ideas explicitly rejected, and why

Collected from the brief, the research, and your existing materials.

1. **Copying your mentor's editorial cream-and-serif look.** Same organisation, same mentor, same community: it would be read as derivative, and it would put a 630 KB animation stack in front of a text site.
2. **A dark-first "developer environment" theme.** It is the 2024–26 design-engineer house style and it is the natural continuation of your terminal-themed README. Light-first with a system dark mode differentiates and reads better in recruiting contexts.
3. **Any display serif.** It is the current editorial-portfolio cliché and your mentor's signature.
4. **A React or TanStack runtime.** No interactive surface justifies it.
5. **Tailwind.** Not harmful; simply unnecessary at 300 lines of CSS, and it would spread the design across templates instead of one file.
6. **Smooth scrolling, scroll reveals, parallax, text splitting.** Motion without information.
7. **Skills sections, tech chips, logo walls.** Unverifiable; technologies appear inside project sentences instead.
8. **Star counts, follower counts, repository counts, "10+ technologies".** Counting things is not measuring things.
9. **A contact form.** Requires a backend or a third-party form service; mailto is faster and free.
10. **Client-side data fetching.** Rate limits, layout shift, an API dependency at read time.
11. **Hotlinked fonts, analytics scripts, embeds.** Third-party requests on a page whose point is being fast and private.
12. **Republishing the GSoC report in full.** Medium is canonical; a summary with a link avoids splitting search ranking.
13. **Mystery Message as a featured project.** It matches a widely followed course project; engineers will recognise it.
14. **Chrono Wall on the home page.** Its aesthetic contradicts the site's.
15. **A "GSoC" page, an "Achievements" page, a "Skills" page, a "Uses" page.** Each duplicates or dilutes.
16. **A custom domain as a requirement.** The user site at `gativarshney.github.io` is served from the root with automatic HTTPS; a domain is a one-file addition if ever wanted.
17. **A CMS, a database, or serverless functions.** The content is a dozen Markdown files.
18. **An SPA with a 404-redirect hack.** Real 404s on deep links and no indexing of the case studies.
19. **Big hero typography.** It is volume; the substance is in the paragraph under the name.
20. **A photo in the hero.** Optional and small on About; the work is the portrait.

---

## 27. Final page-by-page blueprint

### Home (`/`)

1. **Purpose:** identity and table of contents; the 30-second recruiter path.
2. **Audience:** everyone; recruiters first.
3. **Sections:** header · identity block · positioning paragraph and links · selected work (3) · open source · writing (3) · currently · footer.
4. **Content:** from `profile.json`, the three `featured` work entries, the three latest posts, the currently block (Markdown in `profile.json`).
5. **Components:** Header, Identity, Prose, SectionLabel, WorkRow ×3, WritingRow ×3, Footer.
6. **Interaction:** link hovers; theme toggle.
7. **Responsive:** single column throughout; evidence figures drop below sentences under 720 px; nav becomes a 13 px mono row.
8. **SEO:** title "Gati Varshney — [role line]"; ProfilePage + Person JSON-LD; OG image with name and role line; canonical.

### Work index (`/work/`)

1. **Purpose:** the complete, honest list.
2. **Audience:** engineers and hiring managers who want more than three.
3. **Sections:** h1 "Work" · one-sentence intro · case studies (tier 1, rows with evidence figure and "Case study →") · other work (tier 3 rows with external links only) · optional "Experiments" sub-list.
4. **Content:** every `work` entry sorted by `order` then date; status stamps on each row.
5. **Components:** WorkRow, Stamp, SectionLabel.
6. **Interaction:** rows link; nothing else.
7. **Responsive:** as home.
8. **SEO:** title "Work — Gati Varshney"; description; canonical; OG image with the page title.

### Case study (`/work/<slug>/`) ×3

1. **Purpose:** the evidence file for one project.
2. **Audience:** technical reviewers; recruiters read the header and table only.
3. **Sections:** header (title, one sentence, stamp with status note, period, links row) · claims-and-evidence table · the problem · how it works (diagram + text version + walkthrough) · decisions (2–4 ADR entries) · what went wrong · limitations · what I'd do next · "last verified" line · previous/next case study links.
4. **Content:** frontmatter for the header and table; MDX body for the rest, sourced from the repositories' own documents.
5. **Components:** CaseStudy layout, Stamp, EvidenceTable, Diagram, Details, Prose, ExternalLink.
6. **Interaction:** `<details>` disclosure (open on desktop, closed on mobile); link hovers; in-page anchor links on h2s.
7. **Responsive:** table restyles to stacked blocks under 720 px; diagram scales; code scrolls horizontally inside its block.
8. **SEO:** title "[Title] — Gati Varshney"; TechArticle JSON-LD with `dateModified` = `lastVerified`; OG image with title and one evidence line; canonical.

**cidx specifics:** evidence rows for convergence, test matrix, Django cold index, per-file save latency (with its scale caveat), PyPI release; decisions ADR-003, ADR-007, ADR-008, ADR-016; what went wrong: the O(n²) sweep and the foreign-key indexes; a static code block with the MCP config and one real query output.

**Printer recommendations specifics:** evidence rows for saturation 86.8% → 0%, correlation 0.078 → 0.851, misleading claims 1,470 → 0, shard size (6 KB page load vs 24 MB aggregate, median shard 3.2 KB), 6,657 printers, assistant tests (384 over 187 utterances, with the PR link); status "under upstream review" with PR #224 and #230 links and the final report link; two screenshots; decisions: build-time pipeline for a static host, IDF weighting, deterministic assistant over an LLM, unknown-is-not-false; limitations from your own report. Reconcile 463 vs 415 feature dimensions before publishing.

**Casefile specifics:** evidence rows for held-out precision/recall/F1, cost reduction 64.7%, calibration (Brier 0.041), the two withheld mechanisms at 0% blocked (a deliberate negative result in the table), the import-graph boundary test; decisions: sign-constrained logistic regression, IRLS, physical label isolation, floats rejected in canonical JSON, Merkle odd-leaf promotion; the pitch video link; status "buildathon submission (Razorpay AI Buildathon, Track 02)".

### Open Source (`/open-source/`)

1. **Purpose:** the contribution story with proof.
2. **Audience:** maintainers, recruiters searching for the phrase, GSoC community.
3. **Sections:** h1 · OpenPrinting heading with dates and Hall of Fame pull-quote · timeline (Nov 2025 → Aug 2026, five entries with one-line outcomes and links) · contribution ledger (generated table) · recognition (three entries).
4. **Content:** `experience` entries of type contribution and program; `contributions.json`; `recognition.json`.
5. **Components:** Timeline, Ledger, Stamp, Prose.
6. **Interaction:** links only; the ledger is a plain table, not sortable (14 rows do not need sorting).
7. **Responsive:** ledger columns collapse to date + title under 720 px.
8. **SEO:** title "Open Source — Gati Varshney"; description naming OpenPrinting and The Linux Foundation; canonical; OG.

### Writing index (`/writing/`) and post (`/writing/<slug>/`)

1. **Purpose:** the depth layer that grows; the three launch pieces in section 13.
2. **Audience:** engineers.
3. **Sections (index):** h1 · rows of title, one-line subtitle, date. **Sections (post):** title, date, updated, body, "last verified" if it contains measurements, previous/next.
4. **Content:** `writing` collection.
5. **Components:** WritingRow, Post layout, Prose, Diagram where needed.
6. **Interaction:** none beyond links and anchors.
7. **Responsive:** full-width column.
8. **SEO:** Article JSON-LD; OG with title and subtitle; RSS entry; canonical (or the `canonical` field for externally published pieces).

### About (`/about/`)

1. **Purpose:** the person behind the work, in short.
2. **Audience:** hiring managers, mentors, anyone deciding whether to reply to an email.
3. **Sections:** h1 · two-paragraph bio in your voice (optional small photo beside it) · education (one entry: degree, institution, 2023–2027, GPA if you want it) · experience list (GSoC, OpenPrinting; grows) · competitive programming (one line: Knight, rating, top percentage, solved count, link, `asOf`) · how I work (three or four quoted principles from your own repos) · currently (same block as home) · résumé link.
4. **Content:** `profile.json`, `experience`, `leetcode.json`, `recognition.json`.
5. **Components:** Prose, Timeline, Stamp.
6. **Interaction:** none.
7. **Responsive:** photo, if any, stacks above the bio under 720 px.
8. **SEO:** title "About — Gati Varshney"; Person JSON-LD reference; canonical; OG.

### 404

Title "Page not found — Gati Varshney"; one sentence; links to home, work, writing. `noindex`.

### Résumé (`/resume.pdf`)

The PDF, kept in `public/`. The site's About page shows its "updated" date read from a field in `profile.json`. No HTML résumé page: the site is the HTML résumé.

---

## 28. Implementation roadmap

Content before code. The site's quality is bounded by the three case studies and three posts, so they come first and are written in Markdown that the later build consumes unchanged.

### Phase 0 — Content and verification (before any code)

- Collect assets: PR #224/#230 screenshots, certificate images, the résumé PDF, an optional photo.
- Resolve the verification list in section 3.4 (route count, feature dimensions, participant count, PR-versus-commit wording).
- Write `profile.json` (positioning paragraph, looking-for line, links).
- Write the three case studies in the fixed skeleton, with evidence rows and source links, and the three posts. Draw the three diagrams.
- Decide the font pairing on a one-page typographic prototype (Plex versus Geist).

### Phase 1 — Skeleton live at the URL

- Create `gativarshney/gativarshney.github.io`; scaffold Astro; add tokens, global CSS, Base layout, header, footer, theme script, 404, `.nojekyll`, `robots.txt`, favicons.
- Add `deploy.yml`; set Pages source to GitHub Actions; confirm `https://gativarshney.github.io` serves the skeleton with a 100/100/100/100 Lighthouse.
- Add `check.yml` with `astro check`, pa11y-ci and Lighthouse CI.

### Phase 2 — Home, About, Work index

- Content collections and schemas; the fifteen components; home, about and work index rendering from data.
- Mobile pass at 375 px.

### Phase 3 — Case studies and diagrams

- CaseStudy layout; EvidenceTable with the build-time source-link invariant; Diagram with text version; `<details>` behaviour; three case studies rendered.

### Phase 4 — Open Source and Writing

- Timeline, Ledger from `contributions.json` (hand-filled first), recognition; writing index and posts; RSS.

### Phase 5 — SEO, previews, polish

- OG image endpoint; JSON-LD; sitemap; Search Console; cross-links from GitHub profile, LinkedIn and Medium back to the site.
- Screen-reader walk-through; keyboard pass; 200% zoom check; view-transition fallback check in Firefox and iOS Safari.

### Phase 6 — Launch and cleanup

- Announce with the link in the GitHub profile "website" field and the LinkedIn contact section.
- Simplify the GitHub profile README to a short paragraph and the link.
- Archive the learning-project repositories on GitHub.
- Optional: `refresh-data.yml` weekly snapshot; Dependabot grouped updates.

### Success criteria (measurable)

- A first-time visitor can state your name, role, and one project within ten seconds of the page loading, in a hallway test with three people.
- A recruiter reaches the résumé PDF, email, GitHub and LinkedIn without scrolling on a 1366 × 768 laptop and with one scroll on a 375 px phone.
- A technical reviewer can find a decision record, a measured number with its reproduction link, and a stated limitation within one click of the home page.
- Every number on the site has a source link; the build fails otherwise.
- Lighthouse 100/100/100/100 on the mobile profile for every page; home page transfer under 200 KB; JavaScript under 2 KB.
- pa11y-ci reports zero violations across the sitemap; a manual screen-reader pass of the home page and one case study finds nothing blocking.
- Adding a new project, post, or experience entry requires editing exactly one content file and no components.
- The "Updated" date on the home page is never more than 60 days old.
- The site looks like a document, not a template: no cards, no gradients, no motion on load; a screenshot of it in 2029 should not need explaining.

---

## THE FINAL VISION

You open `gativarshney.github.io` and the page is already there. No loader, no fade-in, no motion. An off-white page, a name, and under it one line that tells you who this is: a final-year computer science student who spent the summer building for OpenPrinting at The Linux Foundation. A small grey date says the page was touched this month.

One paragraph, and you understand the kind of engineer you are looking at. Not from adjectives. From nouns: a code index for AI coding agents that proves its own consistency; a recommendation system that had to be fixed because its first scoring model was wrong; a fraud verifier that publishes what it cannot detect. The links to GitHub, LinkedIn, email and a résumé are right there in the text, the way a letter would include them.

Three rows follow. Each has a title, one sentence, and a small monospaced figure: 263 tests across three operating systems; saturation cut from 86.8% to zero; precision 0.888 on a held-out world. If you are a recruiter, you have what you need and you have been on the page for twenty seconds. If you are an engineer, you click one.

The case study opens like a verification record. A table at the top: claim, measurement, context, and a link for each. Below it, the problem in plain words, one diagram that themes itself when you switch to dark mode, a handful of decisions written the way decision records are written, and then a section most portfolios would never include: what went wrong, with the numbers before and after. Then the limitations, unprompted. You realise that the site is doing the same thing the projects do. It shows its working.

Nothing on the site asks for your attention. The typography is calm, the spacing is generous, the accent colour appears only where it means something. On a phone it is the same site, not a compressed version of it. It loads in under a second on a bad connection because there is almost nothing to load.

You leave remembering two things: a name, and the feeling that everything you read there could be checked. In three years the site will look the same, because there was nothing on it that could go out of fashion; only the dates will have moved, and the list will be longer.
