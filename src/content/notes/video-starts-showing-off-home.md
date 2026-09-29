---
id: nthK4Rdusj
date: 2025-02-17T21:31:00Z
tags:
  - project:primortal
  - gamedev
  - tools
  - level-design
draft: false
---
This video starts with me “showing off” my home-spun map editor. It did what I needed earlier on - had swap-able swatches, layer rendering controls, copy/paste abilities, entity property management, and more. Then, it shows me opening the same map in TIled, changing the position of some entities, and finally walking around in the edited map.

When I first started this project, my instinct was to use Tiled to map editing. But I really didn’t enjoy the libraries available, so I developed my own internal data format for maps, and also wrote my own map editor. That was fun, but ultimately stupid.

I still like the map data format I landed on, it integrates nicely with my rendering engine. But I finally bit the bullet and wrote a converter that can parse a Tiled map and convert it to my internal format. Now I can stop worrying about implementing quality-of-life improvements for my bespoke map editor, and instead focus on building the game itself…

PS: I also bought [@snowhex](https://tmblr.co/MtS7nE6NYOjqz5rtU2IK0fg)’s tileset to use as a placeholder for my sprites - letting me focus on implementing the game engine instead of attempting to draw decent looking pixelart.

<video controls playsinline preload="none" poster="https://media.fisher.sh/notes/2025/02/17/video-starts-showing-off-home-poster.jpg" width="1684" height="1666" src="https://media.fisher.sh/notes/2025/02/17/video-starts-showing-off-home.mp4"></video>
