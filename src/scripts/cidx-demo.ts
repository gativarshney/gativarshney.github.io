/**
 * "Try cidx in the browser": a JavaScript port of cidx's query layer over a
 * sample index (cidx indexing its own source, exported from SQLite to JSON by
 * scripts/export-cidx-sample.py). Each tab is one of the MCP tools, and the
 * output is the text an agent would receive, line for line.
 *
 * Port notes, against src/cidx at the exported commit:
 *   ranking/features.py  match tier (exact > prefix > substring > FTS), kind
 *                        weight, popularity (log-scaled resolved references)
 *   ranking/scorer.py    weighted sum, ties broken on (path, line)
 *   ranking/budget.py    the ~700-token budget, truncation marker, age stamp
 *   core/query.py        find_definition, find_references, outline_file
 *   mcp/server.py        row formats and the fail-open miss message
 * Left out: the locality and recency ranking features. They read file
 * modification times, and a static sample has no edit history.
 */
type Sym = { id: number; name: string; qname: string; kind: string; path: string; line: number; signature: string | null };
type Ref = { path: string; line: number; name: string; resolved: number | null; confidence: string };
type Index = { commit: string; engine: string; indexedAt: number; files: string[]; symbols: Sym[]; refs: Ref[]; popularity: Map<number, number> };
type Tool = 'search_symbols' | 'find_definition' | 'find_references' | 'outline_file';
type Part = [cls: string, text: string];
type Row = { parts: Part[]; refs?: string };

const KIND_WEIGHT: Record<string, number> = { function: 1, class: 1, method: 0.9, const: 0.6, import: 0.3 };
const DEFINITION_KINDS = new Set(['function', 'class', 'method', 'const']);
const WEIGHTS = { matchTier: 3, kind: 1, popularity: 1 };
const MAX_TOKENS = 700;
const TIER_LIMIT = 200;
const ARG: Record<Tool, string> = { search_symbols: 'query', find_definition: 'name', find_references: 'name', outline_file: 'path' };

function hydrate(raw: any): Index {
  const symbols: Sym[] = raw.symbols.map((s: any[], id: number) => ({ id, name: s[0], qname: s[1], kind: s[2], path: raw.files[s[3]], line: s[4], signature: s[5] }));
  const refs: Ref[] = raw.refs.map((r: any[]) => ({ path: raw.files[r[0]], line: r[1], name: r[2], resolved: r[3], confidence: raw.confidence[r[4]] }));
  const popularity = new Map<number, number>();
  refs.forEach((r) => { if (r.resolved !== null) popularity.set(r.resolved, (popularity.get(r.resolved) ?? 0) + 1); });
  return { commit: raw.commit, engine: raw.engine, indexedAt: raw.indexed_at_ms, files: raw.files, symbols, refs, popularity };
}

const byPlace = (a: { path: string; line: number }, b: { path: string; line: number }) => (a.path < b.path ? -1 : a.path > b.path ? 1 : a.line - b.line);
/* Python's repr() for a str */
const repr = (s: string) => (s.includes("'") && !s.includes('"') ? `"${s}"` : `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`);

/* SQLite LIKE: % and _ are wildcards, ASCII case-insensitive */
function like(pattern: string): RegExp {
  const body = Array.from(pattern).map((ch) => (ch === '%' ? '.*' : ch === '_' ? '.' : ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).join('');
  return new RegExp(`^${body}$`, 'is');
}
/* FTS5 unicode61: tokens are runs of letters and digits, case-folded */
const ftsTokens = (text: string) => text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
function ftsMatch(sym: Sym, query: string): boolean {
  const phrases = (query.match(/\w+/g) ?? []).map(ftsTokens).filter((p) => p.length);
  if (!phrases.length) return false;
  const columns = [sym.name, sym.qname, sym.signature ?? ''].map(ftsTokens);
  // each phrase must occur in some column, its last token as a prefix
  return phrases.every((phrase) => columns.some((doc) => doc.some((_, at) => phrase.every((tok, k) => {
    const d = doc[at + k];
    return d !== undefined && (k === phrase.length - 1 ? d.startsWith(tok) : d === tok);
  }))));
}

function searchSymbols(ix: Index, text: string): { rows: Sym[]; total: number } {
  const tiers = new Map<number, number>();
  const record = (matches: Sym[], tier: number) => matches.slice(0, TIER_LIMIT).forEach((s) => tiers.set(s.id, Math.max(tiers.get(s.id) ?? 0, tier)));
  const prefix = like(text + '%'), substring = like('%' + text + '%');
  record(ix.symbols.filter((s) => s.name === text || s.qname === text), 3);
  record(ix.symbols.filter((s) => prefix.test(s.name)), 2);
  record(ix.symbols.filter((s) => substring.test(s.name)), 1);
  record(ix.symbols.filter((s) => ftsMatch(s, text)), 0);
  const candidates = Array.from(tiers, ([id, tier]) => ({ sym: ix.symbols[id], tier }));
  const pop = (s: Sym) => Math.log1p(ix.popularity.get(s.id) ?? 0);
  const maxPop = Math.max(0, ...candidates.map((c) => pop(c.sym))) || 1;
  const ranked = candidates
    .map((c) => ({ sym: c.sym, score: WEIGHTS.matchTier * (c.tier / 3) + WEIGHTS.kind * (KIND_WEIGHT[c.sym.kind] ?? 0.5) + WEIGHTS.popularity * (pop(c.sym) / maxPop) }))
    .sort((a, b) => b.score - a.score || byPlace(a.sym, b.sym));
  return { rows: ranked.slice(0, 100).map((c) => c.sym), total: ranked.length };
}

const findDefinition = (ix: Index, name: string) => ix.symbols.filter((s) => (s.name === name || s.qname === name) && DEFINITION_KINDS.has(s.kind)).slice(0, 50);

function findReferences(ix: Index, name: string): Ref[] {
  const bare = name.split('.').pop()!;
  const ids = new Set(findDefinition(ix, name).map((s) => s.id));
  const unresolved = (r: Ref) => (r.resolved === null ? 1 : 0);
  return ix.refs
    .filter((r) => (r.resolved !== null ? ids.has(r.resolved) : r.name === bare))
    .sort((a, b) => unresolved(a) - unresolved(b) || byPlace(a, b))
    .slice(0, 200);
}

const outlineFile = (ix: Index, path: string) => ix.symbols.filter((s) => s.path === path).sort((a, b) => a.line - b.line || (a.qname < b.qname ? -1 : a.qname > b.qname ? 1 : 0));

/* budget.shape(): keep rows while they fit the token budget (chars / 4), always at least one */
function shape(rows: Row[], total: number): { kept: Row[]; truncated: boolean } {
  const kept: Row[] = [];
  let spent = 0;
  for (const row of rows) {
    const chars = Array.from(row.parts.map((p) => p[1]).join('  ')).length;
    const cost = chars ? Math.max(1, Math.floor(chars / 4)) : 0;
    if (kept.length && spent + cost > MAX_TOKENS) break;
    kept.push(row);
    spent += cost;
  }
  return { kept, truncated: kept.length < total };
}

const symbolRow = (s: Sym): Row => ({
  parts: [['q', s.qname], ['k', s.kind], ['loc', `${s.path}:${s.line}`], ...(s.signature ? [['sig', s.signature] as Part] : [])],
  refs: DEFINITION_KINDS.has(s.kind) ? s.qname : undefined,
});

function run(ix: Index, tool: Tool, arg: string): { rows: Row[]; total: number; miss?: string } {
  if (tool === 'search_symbols') {
    const { rows, total } = searchSymbols(ix, arg);
    return { rows: rows.map(symbolRow), total, miss: `no symbols match ${repr(arg)}` };
  }
  if (tool === 'find_definition') {
    const rows = findDefinition(ix, arg);
    return { rows: rows.map(symbolRow), total: rows.length, miss: `no definition of ${repr(arg)} in the index` };
  }
  if (tool === 'find_references') {
    const rows = findReferences(ix, arg);
    return {
      rows: rows.map((r) => {
        const parts: Part[] = [['loc', `${r.path}:${r.line}`], ['q', r.name], [`c ${r.confidence}`, `[${r.confidence}]`]];
        if (r.resolved !== null) { const d = ix.symbols[r.resolved]; parts.push(['sig', `-> ${d.qname} (${d.path})`]); }
        return { parts };
      }),
      total: rows.length, miss: `no references to ${repr(arg)} in the index`,
    };
  }
  const rows = outlineFile(ix, arg);
  return {
    rows: rows.map((s) => ({ parts: [['loc', String(s.line)], ['q', s.qname], ['k', s.kind], ...(s.signature ? [['sig', s.signature] as Part] : [])], refs: DEFINITION_KINDS.has(s.kind) ? s.qname : undefined })),
    total: rows.length, miss: `no symbols for ${repr(arg)} (is the path repo-relative?)`,
  };
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */
function mount(root: HTMLElement) {
  if (root.dataset.bound) return;
  root.dataset.bound = '1';
  const input = root.querySelector<HTMLInputElement>('[data-q]')!;
  const select = root.querySelector<HTMLSelectElement>('[data-file]')!;
  const call = root.querySelector<HTMLElement>('[data-call]')!;
  const out = root.querySelector<HTMLElement>('[data-out]')!;
  const foot = root.querySelector<HTMLElement>('[data-foot]')!;
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  let ix: Index | null = null;
  let loading: Promise<void> | null = null;
  let tool: Tool = 'search_symbols';

  const meta = (text: string) => { const el = document.createElement('div'); el.className = 'ln meta'; el.textContent = text; return el; };

  function render() {
    root.dataset.tool = tool;
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tool === tool)));
    call.textContent = `${tool}(${ARG[tool]}:`;
    if (!ix) return;
    const arg = tool === 'outline_file' ? select.value : input.value.trim();
    out.replaceChildren();
    out.scrollTop = 0;
    if (!arg) { out.append(meta('type a symbol name, or pick one of the examples')); return; }
    const result = run(ix, tool, arg);
    const { kept, truncated } = shape(result.rows, result.total);
    kept.forEach((row) => {
      const el = document.createElement('div');
      el.className = 'ln';
      row.parts.forEach(([cls, text], i) => { if (i) el.append('  '); const s = document.createElement('span'); s.className = cls; s.textContent = text; el.append(s); });
      if (row.refs && tool !== 'find_references') { el.classList.add('go'); el.tabIndex = 0; el.setAttribute('role', 'button'); el.dataset.refs = row.refs; el.title = `find_references("${row.refs}")`; }
      out.append(el);
    });
    if (truncated) out.append(meta(`truncated: true, total_matches: ${result.total}`));
    out.append(meta(`index_age_ms: ${Math.max(0, Date.now() - ix.indexedAt)}`));
    if (!result.rows.length) out.append(meta(`cidx: ${result.miss}. Fall back to grep/ripgrep for this question; results may simply not be indexed yet.`));
  }

  function load() {
    loading ??= fetch(root.dataset.src!)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((raw) => {
        ix = hydrate(raw);
        ix.files.forEach((f) => select.add(new Option(f, f, false, f === 'src/cidx/ranking/scorer.py')));
        foot.textContent = `sample index · cidx ${ix.engine} @ ${ix.commit} · ${ix.files.length} files · ${ix.symbols.length} symbols · ${ix.refs.length} references`;
        render();
      })
      .catch(() => { out.replaceChildren(meta('the sample index could not be loaded; reload the page to try again')); loading = null; });
    return loading;
  }
  const show = (next: Tool, value?: string) => { tool = next; if (value !== undefined) input.value = value; render(); };
  const firstExample = (t: Tool) => root.querySelector<HTMLElement>(`[data-try][data-for="${t}"]`)?.dataset.try;

  input.addEventListener('input', () => { if (ix) render(); else load(); });
  select.addEventListener('change', render);
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const tab = t.closest<HTMLElement>('[role="tab"]');
    const example = t.closest<HTMLElement>('[data-try]');
    const refs = t.closest<HTMLElement>('[data-refs]');
    // a tab opens on its own first example unless the current text already answers it
    if (tab) {
      const next = tab.dataset.tool as Tool;
      const useful = !!ix && next !== 'outline_file' && run(ix, next, input.value.trim()).rows.length > 0;
      show(next, useful ? undefined : firstExample(next));
    } else if (example) show(example.dataset.for as Tool, example.dataset.try);
    else if (refs) show('find_references', refs.dataset.refs);
  });
  root.addEventListener('keydown', (e) => {
    const refs = (e.target as HTMLElement).closest<HTMLElement>('[data-refs]');
    if (refs && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); show('find_references', refs.dataset.refs); }
  });

  render();
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => { if (entries.some((en) => en.isIntersecting)) { io.disconnect(); load(); } }, { rootMargin: '500px 0px' });
    io.observe(root);
  } else load();
}

const init = () => document.querySelectorAll<HTMLElement>('[data-cidx-demo]').forEach(mount);
init();
document.addEventListener('astro:page-load', init);
