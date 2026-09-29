---
id: ntRizcZFFr
date: 2025-03-04T23:20:00Z
tags:
  - project:primortal
  - gamedev
  - combat
draft: false
---
I spent a lot of time recently on non-visual work recently, which is hard to demo.

I’ve revamped my asset & sprite atlas engine to allow states to filter/specify which assets they want to load into a shared sprite atlas. This shared atlas (a single giant image containing all the sprites I might want to draw) is used with a batch rendering engine to greatly reduce the amount of resources it takes to run the game. It’s currently sitting pretty at ~30MB of RAM. Most importantly, this work required me to fork the pixel v2 library to support this batching with the built-in text package.

After that, I did the work to render the opponent health in combat, and got rid of the debug text rendering. It looks much better now!

Next up, I want to continue to add UX features to combat to make it easier to see what’s happening (and what’s happened), and add the tempo counter.

<video controls playsinline preload="none" poster="https://media.fisher.sh/notes/2025/03/04/spent-lot-time-recently-non-poster.jpg" width="1450" height="972" src="https://media.fisher.sh/notes/2025/03/04/spent-lot-time-recently-non.mp4"></video>
