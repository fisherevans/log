---
id: nt39KRBbhf
date: 2025-09-02T09:18:00Z
tags:
  - project:primortal
  - gamedev
  - lighting
draft: false
---
Now, with shaders! I had to work on a custom pixel fork to allow me to bind samples to uniforms accessed by custom shaders. This let me implement “screen” and “overlay” compositions to build my light map. Lights are now an extension of entities and have their own update behaviors (such as flickering for a torch, or pulsing for the coin).

<video controls playsinline preload="none" poster="https://media.fisher.sh/notes/2025/09/02/shaders-had-work-custom-pixel-poster.jpg" width="1450" height="972" src="https://media.fisher.sh/notes/2025/09/02/shaders-had-work-custom-pixel.mp4"></video>
