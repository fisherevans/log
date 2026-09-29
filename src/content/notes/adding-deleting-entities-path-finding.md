---
id: ntaMnvCwv2
date: 2025-10-30T23:36:00Z
tags:
  - project:primortal
  - gamedev
  - pathfinding
draft: false
---
**Adding/deleting entities & path-finding improvements**

Up until today, entities could only be added to the world when the Tiled map was loaded. But I’ve added dynamic system events for registering and deleting entities. In this demo video, I added a button to spawn a new entity, who will try to walk across the map before triggering their own deletion.

I’ve also improved my NPC path-finding algorithm immensely.

- **Cached paths**: A scripted behavior used to just run an A* algorithm every time an entity was idle. Now it caches the last path calculated for a few seconds, reducing CPU load. It will still re-calculate its path if it runs into an issue. I exponentially backs off those retries if they are continuously stuck to avoid using up too much CPU when an NPC is stuck.
- **Dynamic impedance**: Originally, the algorithm only supported binary “blocked” or “not blocked” tiles. Now tiles and entities have a dynamic impedance, a weighted value of how much of an obstacle something is. A wall has an infinitely high impedance, while an NPC that walks around has a low one. This allows NPCs to identify paths that go through closed doors or other NPCs (if there’s no other way). I eventually want to add controls to my map file that create “encouraged” paths, which would just be a series of tiles with lower than normal impedance values.

There are still two improvements I want to make before moving to my next focus:

1. **Predict future (non-)impediments**: if an entity that is in an NPCs way is actively moving (out of their way), we should ignore their impedance. As of right now, all NPCs think all other (moving) NPCs are just static obstacles. They all try to walk around each other, even though they’re all going to the same place. It’s more like a stampede than a queue.
2. **Backtracking when stuck**: If two NPCs get in each other’s ways such that there’s no way to get around each other - they’ll just get stuck forever. I want to add a mechanism to walk backwards a few tiles on a random rare occasion, letting the other NPC through. This would be more of a failsafe than a feature - to prevent a game sequence from getting permanently stuck.

I can’t believe it’s been over 10 years since I first learned of A* in school… It was honestly one of the most magical home work assignments I did - just a few dozen lines of code and, ✨ta-da✨, magic, you’ve got something “intelligently” moving around your world…

<video controls playsinline preload="none" poster="https://media.fisher.sh/notes/2025/10/30/adding-deleting-entities-path-finding-poster.jpg" width="1200" height="800" src="https://media.fisher.sh/notes/2025/10/30/adding-deleting-entities-path-finding.mp4"></video>
