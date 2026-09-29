---
id: ntkC7JQALk
date: 2025-10-26T11:34:00Z
tags:
  - project:primortal
  - gamedev
  - game-engine
draft: false
---
**_Scripted entity behaviors!_** Here’s an example of the player remotely controlling another entity by pressing buttons. Once the NPC steps on one of the end-spots, the NPC walks itself back to the start.

Since my XenoLog posts a week ago, **_I’ve been busy re-writing my entire entity control system_** for the over world game state. It’s taken 5,000+ lines of code over 100+ files, but it’s been worth it! Entities no longer implement a single interface, and they no longer interact directly with the dozen or so sub-systems that make up the over-world state.

The entity system was revamped, and now maintains 5 independent components for each entity:

- **Position**: Where they are, and how they’re moving
- **Behavior**: Automatic updates the entity state every tick: player controls, NPC wandering “AI”, scripted motion, etc.
- **Renderer**: What sprites/lights/animations to render
- **Occupation**: Which tiles they are “in”, important during movement
- **Presence**: How they engage with other entities (i.e. can the be interacted with? do they block ingress into an occupied tile?)

On top of that, all changes to entities and other game state components go through a new Event & Effect dispatcher, decoupling triggers and side effects. This allowed me to implement a Plan system with which I can queue up combinations of serial and parallel effects in whatever sequence I want. At the moment, the system supports:

- 10+ events (entity enters a zone, player interacted, scripted movement completed, etc.), and
- 25+ effects (trigger dialogue, mutate entity, change camera, swap out entity behavior, etc.)

This all culminates to parameterized, generic entity creation. I can register bespoke (or reusable) entity constructors and event handlers and reference them within Tiled (my map editor) when creating entities. These can be used to create flexible NPC interactions, dialogue sequences, teleportation, basically anything you need to do to control a game entity.

I feel like at this point, I’m close to completing the “build the game engine” milestone and I can start focusing on actually working on the “true game”.

A lot of this stuff I’ve built is already available in something like Unity or Godot - but part of this project has been about proving to myself I could program a game without. It’s been a lifelong dream to build a game from scratch - seriously, since middle school when I first played with HTML. So I’m super proud of this specific update.

<video controls playsinline preload="none" poster="https://media.fisher.sh/notes/2025/10/26/scripted-entity-behaviors-heres-example-poster.jpg" width="1200" height="800" src="https://media.fisher.sh/notes/2025/10/26/scripted-entity-behaviors-heres-example.mp4"></video>
