---
id: ntovKSJmwN
date: 2025-11-13T22:48:00Z
tags:
  - project:primortal
  - gamedev
draft: false
---
Sounds! I’ve been working on my sound engine - something that has barely existed until now. There are two big updates shown in this video:

- **Dialogue Sound**: I emulated the Golden Sun dialogue sounds, I’m quite happy with it. It’s still a little squeakier than I want it - but I’ve made it possible to tweak energy, pitch, speed, “worble”, etc. to get different voices for different characters.
- **Spatial Audio**: Entities can now emit sounds, and respect fall off configurations based on their distance from the camera. You can hear the energy shield door get quieter the further I walk away from it; you can also here the footsteps of the NPCs in the hallways as they walk by

I just grabbed some royalty free sound for now to work on the audio system, but I need to start putting my Foley Engineer hat on soon to start figuring our the “sound identity” of my game. Having realistic sounds doesn’t fit the visual aesthetic, so I need to lean into heavily compressed/bit crushed GBA-esque sounds.

<video controls playsinline preload="none" poster="https://media.fisher.sh/notes/2025/11/13/sounds-been-working-sound-engine-poster.jpg" width="2396" height="1594" src="https://media.fisher.sh/notes/2025/11/13/sounds-been-working-sound-engine.mp4"></video>
