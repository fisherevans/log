---
id: ntKIXssCus
date: 2025-09-28T20:15:00Z
tags:
  - project:primortal
  - gamedev
images:
  - src: https://media.fisher.sh/notes/2025/09/28/small-update-statuses-internally-they-2.png
    alt: "Small update to statuses - internally, they are tracked with \u201cstacks\u201d, but visually they are represented with level, 1-3"
  - src: https://media.fisher.sh/notes/2025/09/28/small-update-statuses-internally-they-3.png
    alt: "Small update to statuses - internally, they are tracked with \u201cstacks\u201d, but visually they are represented with level, 1-3"
draft: false
---
Small update to statuses - internally, they are tracked with “stacks”, but visually they are represented with level, 1-3. It simplifies the effects a bit. Burning now does more damage the more “exposure” the (longer, and strong the effect is) - Poisoning deals flat damage, but the higher the level, the slow the stacks decrease. I think it looks much cleaner

I also implemented “Interrupt”, which is when you get hit while in a vulnerable stance. It nullifies the remaining ticks in your current skill. I also want to add a skill that stuns a player after, essentially making them “sleep” for a few ticks after their current skill.

<video controls playsinline preload="none" poster="https://media.fisher.sh/notes/2025/09/28/small-update-statuses-internally-they-1-poster.jpg" width="1448" height="970" src="https://media.fisher.sh/notes/2025/09/28/small-update-statuses-internally-they-1.mp4"></video>
