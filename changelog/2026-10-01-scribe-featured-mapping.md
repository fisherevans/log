# 2026-10-01 - Scribe binds the `featured` field

## What changed

- `.scribe.yml` maps the posts role `featured` to the `featured` field.

## Why

`featured: boolean` has been on posts since 2026-09-29 and drives the "Featured"
section on the home page, but scribe had no first-class control for it - the field
sat in the editor's collapsed "additional fields" bucket, which is where fields the
editor knows nothing about go.

Scribe v0.5.0 gives `blog-post` a `featured` role and renders it as a toggle beside
draft. A role only appears when `.scribe.yml` binds it, so this line is what turns
that toggle on for this site. A stored mapping is authoritative in scribe - it does
not auto-bind roles the file leaves out - so adding a field to `.pages.yml` is not
enough on its own when the editor has a matching role.

**Order matters.** This lands with or after scribe v0.5.0, not before. On the
v0.4.1 editor the binding only marks `featured` as covered by the experience, which
removes it from "additional fields" without putting a toggle anywhere - the one
current way to set it from the editor would disappear.

## Related

- `fisherevans/fisher-sh#6`
- Scribe's side: `changelog/2026-10-01-featured-toggle-and-schema-reload.md` in `fisherevans/scribe`
