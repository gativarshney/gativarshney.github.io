/**
 * Architecture diagrams for the case studies, as data. Each diagram is a stack
 * of rows; a row holds one full-width node, one narrower "source" node, or a
 * left/right pair. Edges run straight down between named nodes.
 * `n` ties a node to the numbered steps in the case study's "How it works".
 */
export type DNode = { id: string; label: string; sub: string; subN?: string; n?: string; accent?: boolean };
export type DRow = { full: DNode } | { source: DNode } | { left?: DNode; right?: DNode };
export type DEdge = { from: string; to: string; label?: string; labelN?: string };
export type Diagram = { alt: string; rows: DRow[]; edges: DEdge[] };

export const diagrams: Record<string, Diagram> = {
  // after ARCHITECTURE.md in the cidx repository
  cidx: {
    alt: 'cidx architecture: a watcher and a cold indexer feed an incremental engine, which writes to a SQLite store; a query layer reads the store and serves a CLI and an MCP server used by AI coding agents.',
    rows: [
      { source: { id: 'repo', label: 'Your repository', sub: 'source files on disk · .gitignore honoured', subN: 'source files · .gitignore honoured' } },
      { right: { id: 'watcher', n: '01', label: 'Watcher', sub: 'debounce ~100 ms · coalesce per path', subN: 'debounce · coalesce' } },
      {
        left: { id: 'cold', n: '01', label: 'Cold indexer', sub: 'first full walk of the repository', subN: 'first full walk' },
        right: { id: 'engine', n: '02', label: 'Incremental engine', sub: 'hash → tree-sitter → one transaction', subN: 'hash → parse → write' },
      },
      { full: { id: 'store', n: '04', label: 'SQLite store', sub: 'WAL · FTS5 · files / symbols / refs · one file, outside the repo', subN: 'WAL · FTS5 · outside the repo' } },
      { full: { id: 'query', n: '05', label: 'Query layer', sub: 'rank → fit ~700 tokens → shape, with a freshness stamp', subN: 'rank → budget → shape' } },
      {
        left: { id: 'cli', n: '06', label: 'CLI', sub: 'cidx index · query · check', subN: 'query · check' },
        right: { id: 'mcp', n: '06', label: 'MCP server', sub: 'stdio · 5 read-only tools', subN: 'stdio · 5 tools' },
      },
      { right: { id: 'agent', label: 'AI coding agent', sub: 'gets locations, not file dumps', subN: 'locations, not dumps', accent: true } },
    ],
    edges: [
      { from: 'repo', to: 'watcher', label: 'saves, git ops', labelN: 'saves' },
      { from: 'repo', to: 'cold', label: 'first run' },
      { from: 'watcher', to: 'engine', label: 'paths' },
      { from: 'cold', to: 'store', label: 'rows' },
      { from: 'engine', to: 'store', label: 'rows' },
      { from: 'store', to: 'query', label: 'lookups' },
      { from: 'query', to: 'cli' },
      { from: 'query', to: 'mcp' },
      { from: 'mcp', to: 'agent', label: 'answers' },
    ],
  },

  // after the Architecture section of the Contributable README
  contributable: {
    alt: 'Contributable architecture: the GSoC organisation list is mapped to GitHub repositories; a scheduled job in GitHub Actions reads the GitHub GraphQL API and computes the figures; the result is committed to a data branch; the Next.js site on Vercel reads those files and serves pages, an API, badges and feeds without calling GitHub.',
    rows: [
      { source: { id: 'gsoc', label: 'GSoC organisations, 2024–2026', sub: '253 organisations · umbrella ones mapped by hand', subN: '253 organisations' } },
      { full: { id: 'disc', n: '02', label: 'Discovery', sub: 'up to 12 active repositories each · no forks, archives or mirrors', subN: 'up to 12 repos each' } },
      {
        left: { id: 'gql', label: 'GitHub GraphQL', sub: 'public data only', subN: 'public data' },
        right: { id: 'sweep', n: '03', label: 'Sweep job', sub: 'GitHub Actions · 4× an hour', subN: 'Actions · 4× an hour' },
      },
      { full: { id: 'metrics', n: '04', label: 'Metrics, as pure functions', sub: 'merge rate · Kaplan-Meier reply time · bots removed · starter states · trends', subN: 'merge rate · reply time · trends' } },
      { full: { id: 'data', n: '05', label: 'data branch', sub: 'one snapshot commit · CC BY 4.0 · author names hashed', subN: 'snapshot · CC BY 4.0' } },
      { full: { id: 'site', n: '06', label: 'Next.js on Vercel', sub: 'reads the files through the fetch cache · a page view never calls GitHub', subN: 'never calls GitHub' } },
      {
        left: { id: 'pages', label: 'Fifteen pages', sub: 'Explore · GSoC · issues · match', subN: 'Explore · GSoC · issues', accent: true },
        right: { id: 'api', label: 'API · badges · feeds', sub: '/api/v1 · README badges · Atom', subN: 'API · badges · Atom', accent: true },
      },
    ],
    edges: [
      { from: 'gsoc', to: 'disc', label: 'organisations' },
      { from: 'disc', to: 'sweep', label: 'repositories', labelN: 'repos' },
      { from: 'gql', to: 'metrics', label: 'pull requests, issues', labelN: 'PRs, issues' },
      { from: 'sweep', to: 'metrics', label: 'stalest first', labelN: 'stalest first' },
      { from: 'metrics', to: 'data' },
      { from: 'data', to: 'site', label: 'files' },
      { from: 'site', to: 'pages' },
      { from: 'site', to: 'api' },
    ],
  },

  // after the GSoC 2026 final report and PRs #224, #230, #236
  'printer-recommendations': {
    alt: 'Printer recommendation pipeline: foomatic-db XML is parsed into printer records and encoded as feature vectors; similarity and evidence corrections produce ranked, explained recommendations, written as one JSON shard per printer at build time; the printer page and the assistant read those shards in the browser.',
    rows: [
      { source: { id: 'xml', label: 'foomatic-db XML', sub: 'printers, drivers and capabilities, as the project records them', subN: 'printers · drivers · capabilities' } },
      { full: { id: 'parse', n: '01', label: 'Parse and normalise', sub: '6,657 printer records, produced in the site’s generate step', subN: '6,657 printer records' } },
      { full: { id: 'vec', n: '02', label: 'Feature vectors', sub: '463-dimension space · drivers marked obsolete are excluded', subN: '463 dims · obsolete drivers out' } },
      {
        left: { id: 'sim', n: '03', label: 'Similarity', sub: 'IDF-weighted cosine: rare evidence counts more', subN: 'IDF-weighted cosine' },
        right: { id: 'fix', n: '04', label: 'Corrections', sub: 'evidence damping × capability-conflict penalties', subN: 'damping × penalties' },
      },
      { full: { id: 'rank', n: '05', label: 'Rank and explain', sub: 'top 10 · deterministic order · reasons from the shared attributes', subN: 'top 10 · with reasons' } },
      { full: { id: 'shards', n: '06', label: 'JSON shards', sub: 'one per printer · median 3.2 KB · everything above runs at build time', subN: 'one per printer · 3.2 KB' } },
      {
        left: { id: 'page', label: 'Printer page', sub: 'fetches its own shard, not 24 MB', subN: 'fetches one shard', accent: true },
        right: { id: 'bot', n: '07', label: 'Assistant', sub: 'deterministic · says “unknown”, never guesses', subN: 'deterministic', accent: true },
      },
    ],
    edges: [
      { from: 'xml', to: 'parse', label: 'at build time' },
      { from: 'parse', to: 'vec' },
      { from: 'vec', to: 'sim' },
      { from: 'vec', to: 'fix' },
      { from: 'sim', to: 'rank', label: 'score' },
      { from: 'fix', to: 'rank', label: 'weight' },
      { from: 'rank', to: 'shards' },
      { from: 'shards', to: 'page', label: 'in the browser', labelN: 'browser' },
      { from: 'shards', to: 'bot', label: 'same artifacts', labelN: 'same data' },
    ],
  },

  // after PR #18 and the search architecture document
  'openprinting-search': {
    alt: 'OpenPrinting search architecture: a prebuild step parses every Markdown post into an AST and extracts titles, headings and body text into one static JSON index; in the browser, MiniSearch loads that file on the first query, ranks with field weights and fuzzy matching, and shows results in a modal.',
    rows: [
      { source: { id: 'md', label: 'Markdown posts', sub: '200+ news posts and pages in the content directory', subN: '200+ posts and pages' } },
      { full: { id: 'ast', n: '01', label: 'Prebuild extractor', sub: 'unified + remark-parse → an AST for every post, before each production build', subN: 'unified + remark → AST' } },
      {
        left: { id: 'heads', n: '02', label: 'Titles and headings', sub: 'title, h1 to h3, a snippet', subN: 'title · h1–h3' },
        right: { id: 'body', n: '02', label: 'Body text', sub: 'normalised · code blocks stripped', subN: 'code stripped' },
      },
      { full: { id: 'index', n: '03', label: 'static-index.json', sub: 'one versioned file · 263 documents · shipped like any other asset', subN: 'one file · 263 documents' } },
      { full: { id: 'mini', n: '04', label: 'MiniSearch, in the browser', sub: 'the index is fetched and built lazily, on the first query', subN: 'built on first query' } },
      { full: { id: 'rank', n: '05', label: 'Ranking', sub: 'title ×3 · headings ×2 · body ×1 · fuzzy 0.2 · top 8', subN: 'title ×3 · headings ×2 · fuzzy' } },
      { full: { id: 'modal', n: '06', label: 'Search modal', sub: 'Cmd/Ctrl + K · 200 ms debounce · no server anywhere', subN: 'Cmd/Ctrl + K · no server', accent: true } },
    ],
    edges: [
      { from: 'md', to: 'ast', label: 'at build time' },
      { from: 'ast', to: 'heads' },
      { from: 'ast', to: 'body' },
      { from: 'heads', to: 'index' },
      { from: 'body', to: 'index' },
      { from: 'index', to: 'mini', label: 'deploy, then fetch', labelN: 'deploy · fetch' },
      { from: 'mini', to: 'rank' },
      { from: 'rank', to: 'modal', label: 'results' },
    ],
  },
};
