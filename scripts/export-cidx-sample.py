"""Export a cidx index (SQLite) to the compact JSON the in-browser demo reads.

Usage:
    cidx index --repo <checkout of cidx>
    python scripts/export-cidx-sample.py <path to index.db> <commit> > public/demo/cidx-sample.json

Only values the demo needs are kept; ids are renumbered so the file is stable
for a given index.
"""
import json
import sqlite3
import sys

CONFIDENCE = ["exact", "import", "name-only"]


def main(db_path: str, commit: str) -> None:
    db = sqlite3.connect(db_path)
    db.row_factory = sqlite3.Row
    files = [r["path"] for r in db.execute("SELECT path FROM files ORDER BY path")]
    file_at = {p: i for i, p in enumerate(files)}

    rows = db.execute(
        "SELECT s.id, s.name, s.qualified_name, s.kind, f.path, s.start_line,"
        " s.signature, s.parent_id FROM symbols s JOIN files f ON f.id = s.file_id"
        " ORDER BY f.path, s.start_line, s.qualified_name, s.id"
    ).fetchall()
    sym_at = {r["id"]: i for i, r in enumerate(rows)}
    symbols = [
        [r["name"], r["qualified_name"], r["kind"], file_at[r["path"]], r["start_line"],
         r["signature"], sym_at.get(r["parent_id"])]
        for r in rows
    ]

    refs = [
        [file_at[r["path"]], r["line"], r["name"], sym_at.get(r["resolved_symbol_id"]),
         CONFIDENCE.index(r["confidence"])]
        for r in db.execute(
            "SELECT f.path, r.line, r.name, r.resolved_symbol_id, r.confidence"
            " FROM refs r JOIN files f ON f.id = r.file_id ORDER BY f.path, r.line, r.name, r.id"
        )
    ]
    meta = dict(db.execute("SELECT key, value FROM meta").fetchall())
    indexed_at = db.execute("SELECT MAX(indexed_at) FROM files").fetchone()[0]
    json.dump(
        {
            "source": "cidx indexing its own src/cidx",
            "commit": commit,
            "engine": meta.get("engine_version"),
            "indexed_at_ms": int(indexed_at * 1000),
            "confidence": CONFIDENCE,
            "files": files,
            "symbols": symbols,
            "refs": refs,
        },
        sys.stdout,
        separators=(",", ":"),
    )


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
