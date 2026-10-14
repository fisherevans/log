# Search waits for its listing

**Date:** 2026-10-14
**Type:** fix
**Issue:** #21

## What changed

Search initializes after the document has been parsed. The inline script previously ran before the following listing element existed and cached a null reference. Typing a query then threw instead of displaying results.

## Why

The stream must remain searchable as it grows. Waiting for DOMContentLoaded makes both the full-text query and the clear action operate on the real listing without changing the search behavior or content.

## Validation

Built the actual site against disposable demonstration entries. Browser checks covered full-text results, an empty result, clearing back to the timeline, and repeated filtering without page exceptions.
