---
id: nteat1phPc
date: 2025-09-10T21:48:00Z
tags:
  - project:primortal
  - gamedev
draft: false
---
This one will be hard to explain.. but this blog is for me in the end. I’ve added stances to the skill execution, represented by the black lines with an icon (shield = defending, !!! = vulnerable). Those stances will eventually impact how damage is calculated.

This adds a nice layer to the skill system where you need to time your skills’ stances with your opponents damage ticks (white dot with black border) to avoid taking extra damage or even reduce it.

Next steps will be to actually adjust damage calculation, not just render the stances. Then I want to add a stunned effect (getting hit while vulnerable) which will basically “parallelize” you for a few ticks (adding a dummy skill that does nothing). Then? Statuses! Always need burn…

<video controls playsinline preload="none" poster="https://media.fisher.sh/notes/2025/09/10/one-will-hard-explain-blog-poster.jpg" width="1448" height="966" src="https://media.fisher.sh/notes/2025/09/10/one-will-hard-explain-blog.mp4"></video>
