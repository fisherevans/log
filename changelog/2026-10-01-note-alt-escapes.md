# 2026-10-01 - Image alt text holds literal characters, not `\uXXXX` escapes

## What changed

- 48 `images[].alt` values across 17 notes rewritten from JSON-style `\uXXXX`
  escapes to the literal characters (`😅` -> `😅`, `“` -> `“`).
  Frontmatter only; no body, no other key, and no visible text changed.
- `tools/backport-instagram.py` and `tools/backport-tumblr.py` now emit that field
  with `json.dumps(..., ensure_ascii=False)`, so a re-run does not reintroduce it.

## Why

Scribe (`scribe.fisher.sh`) was down with
`500: parse notes/another-one-those-doesnt-look: yaml: line 10: found invalid
Unicode character escape code`, and its whole editor showed the crash screen - the
collection listing gives up on the first file it cannot read.

The two parsers that read this frontmatter do not agree. BMP escapes like `“`
are valid YAML; **UTF-16 surrogate halves like `😅` are not**. js-yaml
(Astro) accepts them anyway, so the site has built cleanly since the backports
landed and nothing flagged it. Go's yaml.v3, which scribe uses, rejects them per
the spec. Eleven notes carried surrogate pairs; the other six carried only BMP
escapes and were legal but inconsistent, so they were rewritten too.

Both importers built the line with a bare `json.dumps(...)`, whose default
`ensure_ascii=True` escapes every non-ASCII character. That is correct for JSON and
wrong for YAML. The content fix without the importer fix would have lasted exactly
until the next backport.

## Decisions

- **Double quotes kept on every rewritten value.** The strings are prose containing
  `:`, `#` and `’`; quoting them is required in some cases and harmless in the rest,
  and keeping the existing style holds the diff to the characters that mattered.
- **BMP escapes rewritten as well, not just the illegal ones.** Legal but
  unreadable, and leaving a mix means the next person has to know which escapes are
  the dangerous ones.

## Verification

`gopkg.in/yaml.v3` (the exact parser scribe runs) over all 152 content files: 11
failed before, 0 after. PyYAML agrees. `rg '\\u[0-9a-fA-F]{4}' src/content` returns
nothing.
