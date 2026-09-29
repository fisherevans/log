---
id: ntWQGF9d1k
date: 2025-10-23T00:21:00Z
tags:
  - project:primortal
  - gamedev
  - ui
  - go
images:
  - src: https://media.fisher.sh/notes/2025/10/23/another-one-those-doesnt-look-2.png
    alt: "Another one of those \u201cdoesn\u2019t look big, but is massive\u201d updates\u2026 \ud83d\ude05"
draft: false
---
Another one of those “doesn’t look big, but is massive” updates… 😅

I added a full event & effect system to my engine, replacing a dozen smaller systems I had built to facilitate all of the other game mechanics in the over world.

**_That meant re-implementing:_** interactions, dialogue/chatter triggers, timers/delays, movement restrictions, zones, combat triggers, teleportation, state transitions, camera adjustments, and more…

But, hey! We got there! :) It just took 3-4 full evenings of effort… The only thing not working is dashing across gaps, that was a problem for another day…

On top of that, I added support for JavaScript event handlers, allowing me to embed JS directly into my entity definition in Tiled. This will hopefully make it easier to create more interactive worlds directly in the map editor, without having to hop around between my code and map editors. Event handlers can be written in Go, along side the rest of my code, in JS files (edited in my IDE) and referenced by entities, or inline directly in Tiled.

The default property editor is gross in Tiled for code snippets (see the video…), but I’m working on a fork of Tiled to support basic JS editing with autocomplete and linting based on a types file! Here’s a little look at that:

Oh, I also added some actual settings in the menu, allowing me to more easily tune of knobs to debug rendering issues. Nothing for real players though…

<video controls playsinline preload="none" poster="https://media.fisher.sh/notes/2025/10/23/another-one-those-doesnt-look-1-poster.jpg" width="2612" height="1788" src="https://media.fisher.sh/notes/2025/10/23/another-one-those-doesnt-look-1.mp4"></video>
