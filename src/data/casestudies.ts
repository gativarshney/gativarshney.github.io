/**
 * Long-form case-study content. Every number here traces to a linked source.
 * Sources: cidx README, ARCHITECTURE.md, DECISIONS.md, CHANGELOG.md, docs/verification.md;
 * GSoC 2026 final report on Medium; OpenPrinting PRs #224, #230, #236.
 */
export type Row = { claim: string; value: string; context: string; source: { label: string; href: string } };
export type Block = { title: string; body: string };

export type CaseStudy = {
  slug: string;
  problem: string[];
  pipeline: { title: string; steps: string[]; note?: string };
  evidence: Row[];
  decisions: Block[];
  wentWrong: Block[];
  limitations: string[];
  next: string[];
  lastVerified: string;
};

const CIDX = 'https://github.com/gativarshney/cidx';
const OP = 'https://github.com/OpenPrinting/openprinting.github.io/pull/';
const REPORT = 'https://medium.com/@gativarshney/gsoc-2026-final-report-ai-driven-printer-compatibility-recommendation-portal-9283d6fe2a5c';
const STAGING = 'https://github.com/rudra-iitm/openprinting.github.io/pull/';
const OPC = 'https://github.com/OpenPrinting/openprinting.github.io/commit/';

export const caseStudies: Record<string, CaseStudy> = {
  cidx: {
    slug: 'cidx',
    problem: [
      'Most coding agents find code by grepping and reading files. It works, but on a large repository it burns tokens on files that never end up mattering, and the agent still has to guess which of five matches is the definition.',
      'cidx parses a repository into a symbol and reference index, keeps it fresh within milliseconds of a save, and answers over MCP with locations and signatures rather than file contents. Zero-config means exactly that: no API keys, no vector database, no Docker, no accounts. One SQLite file, stored outside the repository, and five tools that can only read.',
    ],
    pipeline: {
      title: 'From a saved file to an answer',
      steps: [
        'A watcher debounces and coalesces file events; a cold indexer does the first full walk, honouring .gitignore through git plus a fixed skip-list of build and dependency directories.',
        'The incremental engine hashes the file, parses it with tree-sitter (error-tolerant, so half-written files still index), and replaces its rows in one SQLite transaction.',
        'References are resolved by a cascade: same-file scope, then explicit imports followed to their source, then a unique global name. Each reference carries a confidence tag: exact, import, or name-only.',
        'The store is stdlib SQLite in WAL mode with an FTS5 table for fuzzy symbol search, keyed by a hash of the repository path so nothing is ever written inside the repo.',
        'A query layer ranks results (match tier, kind, popularity, locality, recency), fits the answer into roughly 700 tokens with truncation markers and a freshness stamp, and recommends grep on a miss.',
        'Two consumers call the same library: the CLI, and an MCP server over stdio exposing search_symbols, find_definition, find_references, outline_file and repo_map.',
      ],
      note: 'Neither the CLI nor the MCP server contains logic of its own.',
    },
    evidence: [
      { claim: 'Incremental index equals a cold rebuild', value: 'property suite + crash injection', context: 'Hypothesis drives random edit, delete and rename storms; snapshots compared as multisets', source: { label: 'tests/convergence', href: `${CIDX}/tree/main/tests/convergence` } },
      { claim: 'Test suite', value: '263 tests', context: 'Ubuntu, macOS, Windows × Python 3.11, 3.12, 3.13', source: { label: 'CI workflow', href: `${CIDX}/actions/workflows/ci.yml` } },
      { claim: 'Cold index of Django', value: '30.5 s', context: '3,043 files · 76,166 symbols · 206,801 references · warm file cache; 67.8–97.2 s with a cold cache', source: { label: 'docs/verification.md', href: `${CIDX}/blob/main/docs/verification.md` } },
      { claim: 'Exact lookups', value: '22.6 ms · 27.0 ms', context: 'p95 for find_definition and find_references on Django, 60 samples each', source: { label: 'docs/verification.md', href: `${CIDX}/blob/main/docs/verification.md` } },
      { claim: 'Save to queryable', value: '0.33 s · 1.8 s', context: 'isolated save, then p50 for back-to-back saves on Django; the whole-index re-resolution dominates at that size', source: { label: 'docs/verification.md', href: `${CIDX}/blob/main/docs/verification.md` } },
      { claim: 'Same index on Linux and Windows', value: 'fingerprint match', context: 'a pinned Django revision indexed on both, digests compared in CI', source: { label: 'cross-platform workflow', href: `${CIDX}/blob/main/.github/workflows/cross-platform-django.yml` } },
      { claim: 'Published', value: 'alpha on PyPI', context: 'Apache-2.0; 16 dated architecture decision records; a changelog in Keep a Changelog format', source: { label: 'pypi.org/project/cidx', href: 'https://pypi.org/project/cidx/' } },
    ],
    decisions: [
      { title: 'No embeddings in v1 (ADR-007)', body: 'Retrieval works on names, references and file structure. A vector index would add a model dependency, non-determinism and a setup step, and the questions agents actually ask (“where is X defined”, “who uses Y”) do not need it. Consequence: conceptual search is out of scope and is stated as such.' },
      { title: 'Stdlib SQLite, index outside the repository (ADR-003)', body: 'One database file per repository under the user’s cache directory, WAL mode so the watcher thread writes while the MCP thread reads, FTS5 for fuzzy search. No daemon, no service, and nothing written into a project that a user did not ask for.' },
      { title: 'The convergence invariant is a release gate (ADR-008)', body: 'The incremental index must equal what a cold rebuild would produce, including reference resolutions, after any sequence of edits, deletes and renames. A property-based suite proves it, a crash-injection test shows the index can never be half-written, and cidx check lets a user prove it on their own machine.' },
      { title: 'Five read-only tools over stdio (ADR-006)', body: 'Read-only by design: a hostile file in a repository has no blast radius because there is nothing it can make cidx write or execute. Stdio keeps the setup to one line in an MCP client config.' },
      { title: 'Benchmark rules written before the first run (ADR-005, ADR-013)', body: 'The evaluation harness ships in the repository with honesty rules fixed in advance: raw JSONL logs published with every result, every number recomputable from the logs alone, losses shown at the same prominence as wins, and a dev/holdout task split that is never tuned against.' },
    ],
    wentWrong: [
      { title: 'The cold start was O(n²)', body: 'cidx serve on a repository with no index built it through the watcher’s reconciliation sweep, which recomputed whole-index resolution and spawned git check-ignore once per file. Django had not finished after 400 seconds, and a doubling test showed 3.8× time per 2× files. Batching the whole-index work to the end of the sweep brought the same cold start to about two minutes (ADR-015).' },
      { title: 'Three foreign-key columns had no index', body: 'Replacing one file’s rows scanned the whole symbols and refs tables. On Django a re-index ran past 11 minutes and every single-file save paid a 360 ms scan. Three indexes took the re-index to 46 seconds and the per-file delete from 361 ms to 1.7 ms (ADR-016).' },
      { title: 'A write-lock race that bypassed the busy timeout', body: 'Write transactions used a deferred BEGIN and read before writing, so a second connection committing in between failed at once with SQLITE_BUSY_SNAPSHOT. Seen on CI as the watcher’s consumer thread dying during its first sweep. Every mutation now begins IMMEDIATE, and an unhandled exception in the watcher thread is logged instead of killing it silently.' },
      { title: 'The convergence check had a blind spot', body: 'It compared row sets, so an index missing one of several identical rows still passed. Minified JavaScript yields distinct functions with identical rows; Django’s vendored select2 has eleven. Snapshots are now multisets, so counts must match too.' },
      { title: 'ESM import specifiers never resolved', body: 'TypeScript and ESM imports that carry an emitted extension (./core.js, as NodeNext requires) built candidates from the specifier verbatim, so on zod 0 of 53,535 references carried the import confidence. Such specifiers now map to the TypeScript source.' },
    ],
    limitations: [
      'TypeScript type-level declarations (interface, type, enum) are not indexed in v1; value-level code is.',
      'CommonJS exports are not tracked as bindings; require() calls do appear as references.',
      'No semantic or conceptual search, by design.',
      'Namespace imports (import * as core) are not followed; core.thing() resolves by unique global name at best.',
      'There is no type checker. Confidence tags say how a reference was resolved; they do not promise precision.',
      'After a save, freshness cost grows with the repository: the saved file’s rows land in about 0.3 s, but references are re-resolved across the whole index, about 1.5 s on Django.',
      'Ranked search and the repository map scan: about 135 ms p95 on Django, over the 50 ms target at that scale.',
    ],
    next: [
      'Incremental reference resolution, so save latency stops scaling with repository size.',
      'Type-level TypeScript symbols, which the limitations list makes the most-requested gap.',
      'Publishing a first benchmark run under the methodology already in the repository.',
    ],
    lastVerified: '2026-09-16',
  },

  'printer-recommendations': {
    slug: 'printer-recommendations',
    problem: [
      'OpenPrinting’s Foomatic database records 6,657 printers with their drivers and capabilities. You could look a printer up. You could not ask the database what to do next: “my printer is discontinued, what is similar?” or “find me a colour laser printer with good Linux support.”',
      'The constraint shaped everything: the OpenPrinting website is a statically exported Next.js application on GitHub Pages. There is no request-time backend and no database behind these features. The expensive work has to happen at build time, and the browser’s job has to stay small.',
    ],
    pipeline: {
      title: 'From Foomatic XML to a 3 KB shard',
      steps: [
        'foomatic-db XML is parsed and normalised into 6,657 printer records during the site’s generate step.',
        'Each printer is encoded as a feature vector in a 463-dimension space: driver families, command sets, PostScript and PCL levels, colour, mechanism type, resolution tiers and support grade. Drivers that foomatic-db marks obsolete are then excluded, so a superseded driver never counts as shared evidence; that leaves 415 dimensions active in the published build.',
        'Candidates are ranked by IDF-weighted cosine similarity, so sharing a rare driver (necp6, 8 printers) counts for far more than sharing postscript (1,746 printers).',
        'The score is damped by how much evidence the pair actually shares, then multiplied by penalties for capability conflicts in type, colour and extreme resolution gaps.',
        'Results below a minimum score are dropped, the top 10 are kept in deterministic score-then-id order, and human-readable explanations are generated from the shared attributes.',
        'Output is one JSON shard per printer, median 3.2 KB. A printer page fetches its own record and recommendations instead of a 24 MB aggregate.',
        'The assistant is a deterministic local pipeline over the same artifacts: normalisation, entity resolution, intent classification, a typed query against local data, a typed response. It is not a language model connected to an API, so it cannot invent printers outside the catalogue.',
      ],
      note: 'Do the expensive work before deployment. Keep the browser’s job small.',
    },
    evidence: [
      { claim: 'Perfect-score saturation eliminated', value: '86.8% → 0%', context: 'share of recommendations scoring exactly 1.0, before and after the scoring redesign; measured by the project’s evaluation pipeline', source: { label: 'final report', href: REPORT } },
      { claim: 'Scores now track evidence', value: '0.078 → 0.851', context: 'correlation between supporting evidence and score', source: { label: 'final report', href: REPORT } },
      { claim: 'Misleading explanation claims', value: '1,470 → 0', context: 'final validation reaches zero false claims', source: { label: 'final report', href: REPORT } },
      { claim: 'Scale', value: '6,657 printers · 463 dimensions', context: 'the full Foomatic printer set and the engineered feature space; 415 dimensions stay active once obsolete drivers are excluded. One shard each, median 3.2 KB', source: { label: 'PR #236 · quality doc', href: `${OP}236` } },
      { claim: 'Recommendations pull request', value: '+4,013 lines · 34 files', context: '36 commits; open for upstream review', source: { label: 'PR #224', href: `${OP}224` } },
      { claim: 'Assistant pull request', value: '+11,200 lines · 70 files', context: '50 commits; screen recording in the PR; open for upstream review', source: { label: 'PR #230', href: `${OP}230` } },
      { claim: 'Documentation', value: '+1,091 lines', context: 'data formats, pipeline architecture, evaluation, regeneration, UI contract', source: { label: 'PR #236', href: `${OP}236` } },
    ],
    decisions: [
      { title: 'Build time, not request time', body: 'Everything is generated during the site build. No backend, no external API, and no data leaves the static site. This is what makes the feature deployable on GitHub Pages at all, and it is why every printer page loads a few kilobytes instead of the whole dataset.' },
      { title: 'An engineered similarity pipeline, not a trained model', body: 'With no ground-truth “replacement printer” dataset there was nothing to train against, and a black box could not have explained its own recommendations. An explicit pipeline can: every recommendation shows the evidence behind it.' },
      { title: 'Rare evidence should matter more', body: 'Common features are not necessarily informative. IDF weighting makes sharing a driver used by eight printers count far more than sharing one used by 1,746.' },
      { title: 'Similarity is not enough', body: 'A recommendation supported by one weak signal should not look as confident as one supported by many independent signals. Evidence damping and conflict penalties encode that directly.' },
      { title: 'A deterministic assistant that reuses the recommendation artifacts', body: 'The assistant does not recompute or re-rank; it uses the same shards, scores and shared features as the printer pages, so “similar” means one thing everywhere. Being deterministic, it is reproducible and grounded in the data.' },
      { title: 'Unknown is not false', body: 'Foomatic records duplex support for no printer at all. Answering “no” to “does this printer support duplex?” would be wrong. The assistant reports a data gap instead of guessing; missing colour information does not mean monochrome.' },
    ],
    wentWrong: [
      { title: 'The first scoring model looked right and was wrong', body: 'The first version produced too many perfect-looking recommendations: 86.8% of scores saturated at 1.0. The cause was sparse data. Cosine similarity made two printers that shared a generic driver look identical, because that one shared feature was most of what either record contained. IDF weighting, evidence damping and capability-conflict penalties took saturation to 0% and moved the evidence-to-score correlation from 0.078 to 0.851. The evaluation harness now fails if any documented metric drifts.' },
    ],
    limitations: [
      'The metrics measure internal consistency and scoring behaviour, not human-labelled recommendation accuracy. Foomatic has no ground-truth replacement dataset to measure against.',
      'Capabilities that Foomatic does not record (duplex, for example) cannot be recommended on; the assistant says so rather than guessing.',
      'All three pull requests are open for upstream review as of this page’s last verification; the final report and the PRs are the primary sources until they merge.',
    ],
    next: [
      'Land the upstream review on #224, #230 and #236.',
      'A small hand-labelled set of known replacement pairs, to put a human-judged number next to the internal-consistency ones.',
    ],
    lastVerified: '2026-09-29',
  },
  'openprinting-search': {
    slug: 'openprinting-search',
    problem: [
      'The OpenPrinting website is a statically exported Next.js application on GitHub Pages. There is no server to run a query against, and the site had a placeholder search that did nothing useful. It also had more than 200 news posts and pages worth finding.',
      'The constraint was the same one that later shaped the GSoC work: anything expensive has to happen at build time, and the browser has to do only the cheap part. The result is a search that works entirely from a JSON file the site already ships.',
    ],
    pipeline: {
      title: 'From Markdown to an answer, with no server',
      steps: [
        'A prebuild step runs before every production build and walks every Markdown post in the content directory.',
        'Each post is parsed into an AST with unified and remark-parse, then walked to extract the title, the h1 to h3 headings, a snippet, and normalised body text. Code blocks and formatting artifacts are stripped so they cannot pollute results.',
        'The extractor writes one versioned static index file, public/search/static-index.json, which the deploy ships like any other asset. The live index holds 263 documents.',
        'In the browser, MiniSearch builds its in-memory index lazily on the first query, so visitors who never search pay nothing.',
        'Ranking is weighted: title matches count three times, headings twice, body once. Fuzzy matching with a 0.2 threshold tolerates typos, and results are capped at the top eight.',
        'The modal opens with Cmd or Ctrl + K, debounces input by 200 ms, shows a loading state during initialisation, handles empty results, and closes on Escape.',
      ],
      note: 'Do the expensive work before deploy. Keep the browser’s job small.',
    },
    evidence: [
      { claim: 'Live in production', value: 'openprinting.github.io', context: 'press Cmd or Ctrl + K on any page; the index is served from /search/static-index.json', source: { label: 'live index', href: 'https://openprinting.github.io/search/static-index.json' } },
      { claim: 'Index size', value: '263 documents', context: 'measured from the live index on 2026-09-29; the PR indexed 200+ posts at the time', source: { label: 'live index', href: 'https://openprinting.github.io/search/static-index.json' } },
      { claim: 'Search system', value: '+793 lines · 14 files', context: 'build-time extractor, runtime engine, modal UI, architecture doc; 13 commits, merged 2026-03-06', source: { label: 'PR #18', href: `${STAGING}18` } },
      { claim: 'Deployment fix', value: '1 file', context: 'the generated index was gitignored and never reached GitHub Pages; fixed the same day', source: { label: 'PR #22', href: `${STAGING}22` } },
      { claim: 'Merged and in production', value: '2 pull requests', context: 'reviewed and merged in the staging repository, then promoted to the production history under my name', source: { label: 'production history', href: `${OPC}bf736416e141d87112c9a273ccbc1016768b717d` } },
      { claim: 'Ranking', value: 'title ×3 · headings ×2 · body ×1', context: 'fuzzy threshold 0.2, top 8 results, 200 ms debounce', source: { label: 'PR #18', href: `${STAGING}18` } },
    ],
    decisions: [
      { title: 'Two layers, separated on purpose', body: 'A build-time indexing layer and a client-side runtime layer, with a typed schema between them. The build side can change how it extracts text without touching the UI, and the runtime can change ranking without re-parsing Markdown.' },
      { title: 'AST parsing instead of regular expressions', body: 'Markdown is not regular. Parsing with unified and remark-parse and walking the tree gives clean titles, headings and body text, and makes it trivial to drop code blocks, which would otherwise dominate matches with identifiers.' },
      { title: 'MiniSearch in the browser', body: 'A small, dependency-free full-text engine that supports field boosting, fuzzy matching and prefix search. It fits the static-export constraint exactly: fetch one JSON file, build the index in memory, answer locally.' },
      { title: 'Lazy initialisation and a base-path-aware fetch', body: 'The index is only fetched and built on the first keystroke, and the fetch respects the Next.js base path so the same code works in development, in preview builds and on GitHub Pages.' },
      { title: 'Designed for a second source', body: 'The schema anticipated a second index, the Foomatic driver lookup, without an architectural change. The live site now offers exactly that as a second search scope.' },
    ],
    wentWrong: [
      { title: 'The index never reached production', body: 'The generated index file was listed in .gitignore, so the deployed site fetched a path that did not exist and search failed silently in production while working locally. PR #22 fixed the ignore rule the same day. The general lesson came back during the trailing-slash investigation months later: a build that only breaks in the deploy environment needs a check that runs in the deploy environment.' },
    ],
    limitations: [
      'The whole index ships to the browser on first search, about 1.9 MB uncompressed for 263 documents. Fine at this size; a much larger site would want a sharded or prefix-split index.',
      'Ranking is lexical. There is no semantic matching, which is the right trade for a static site with no server.',
      'Results are capped at eight; there is no pagination.',
    ],
    next: [
      'Compress or shard the index if the post count keeps growing.',
      'Add a CI check that the deployed site can fetch the index, so a regression of the PR #22 bug is caught before merge.',
    ],
    lastVerified: '2026-09-29',
  },
};
