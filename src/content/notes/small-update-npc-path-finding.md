---
id: nttVW5yyeg
date: 2025-10-31T16:30:00Z
tags:
  - project:primortal
  - gamedev
draft: false
---
Just a small update on my NPC path finding. I was fighting some bugs that I’ve worked through:

- They were sometimes taking slightly non-noptimal paths (like, overshooting a turn).
- They were getting stuck for longer than I wanted.
- They weren’t adjusting their plans as things change in front of them, only once they ran into stuff…

To help understand the issues, I added some debugging logic to render their path ahead of them, it helped A LOT in identifying the actual issues. Plus it’s really cool being able to see their plans and how they change based on your impact.

The only thing left that I want to do is adding the walk-back fail safe, but at this point I think I can just design my world to avoid it as a problem. I’ll come back to it another time.

<video controls playsinline preload="none" poster="https://media.fisher.sh/notes/2025/10/31/small-update-npc-path-finding-poster.jpg" width="1920" height="1280" src="https://media.fisher.sh/notes/2025/10/31/small-update-npc-path-finding.mp4"></video>
