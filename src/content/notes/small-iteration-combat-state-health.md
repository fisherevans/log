---
id: ntXO4Ieswy
date: 2025-03-18T22:13:00Z
tags:
  - project:primortal
  - gamedev
  - combat
draft: false
---
Small iteration in the combat state. Health is now fluid - damage adjusts a target, but the actual health takes time to reach that target. This means the health bar updates smoothly and it technically allows you to recover from death. I want to add skills that change how quickly (or slowly) the effective health updates.

I also added a pending animation on the next skill, and some UI button hints for canceling the pending skill.

Next up, I want to show both the “target” and “current” health in the stats bar.

<video controls playsinline preload="none" poster="https://media.fisher.sh/notes/2025/03/18/small-iteration-combat-state-health-poster.jpg" width="1450" height="972" src="https://media.fisher.sh/notes/2025/03/18/small-iteration-combat-state-health.mp4"></video>
