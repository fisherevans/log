---
id: nt9mQcnjgC
date: 2025-11-06T17:48:00Z
tags:
  - project:primortal
  - gamedev
  - pixel-art
draft: false
---
This bug has been haunting me since day one…

My camera follows a targeted entity, lagging slightly behind and speeding up as the entity gets further away. There’s an equilibrium met where the speed of the entity matches the speed of the camera as it tries to catch up. This creates nice, fluid camera movements when the character starts or stops moving.

The problem is that slight differences in frame timings cause the camera movement jitter between two pixel coordinates, making the entity’s render position flicker by a single pixel. The effect is subtle, it just makes the animation feel “off"…

The fix wasn’t obvious. I started tracking the standard deviation of camera-to-entity deltas over N frames. When the deviation’s low (steady motion), I lock the camera delta to a fixed threshold to stop per-frame jitter. Once it rises above that threshold, normal logic resumes.

The result? Smooth motion at last - no more phantom jitter, and I can finally sleep at night.

<video controls playsinline preload="none" poster="https://media.fisher.sh/notes/2025/11/06/bug-has-been-haunting-since-poster.jpg" width="1920" height="1280" src="https://media.fisher.sh/notes/2025/11/06/bug-has-been-haunting-since.mp4"></video>
