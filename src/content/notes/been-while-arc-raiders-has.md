---
id: ntTkYIElgB
date: 2025-12-08T22:59:00Z
tags:
  - project:primortal
  - gamedev
draft: false
---
It’s been a while - ARC Raiders has taken up more of my free time than I’d like to admit… But! I’ve been working on some combat improvements.

**Statuses:** I tried to convey more details about status conditions. I’m worried it’s too much currently - but I’d rather add too much up front and then only keep what’s important later. That said, I was able to create visual feedback for all the parts of a status:

- Statuses are applied with “stacks” which are removed over time. This is shown with the status background, it’s kind of like a vertical progress bar.
- Based on thresholds of how many stacks are applied, the status is in level 1, 2, or 3 - indicated by the dots below it. As the level changes, a “upwards” or “downwards” animation is shown on top of it.
- Statuses trigger their effects every 4 combat ticks (starting from the time they are applied). This is indicated by the “rotating” and flashing border.

** Move “Animations”: ** Not to be confused with actually animating my sprites, hehe - I added a flexible system for adding sprite _transformations_ as skills are triggered. This was a relatively cheap way to add some much needed visual feedback for combat.

** Tempo**: Combat doesn’t have to be real time, but if you queue moves fast enough, it is. If you’re able to keep moves queued you increase your tempo, which adds a damage bonus. This used to be a tick counter, but I’ve changed it to a more abstract gauge.

Overall, I’m trying to focus on adding some more feedback elements (animations/sounds) to help the player understand if their actions are doing what they want. Combat is a tricky thing to balance and tune. I’m eager to get sounds working - and then I think I’ll be at the point where I’d be happy to get some play testing and feedback on it.

<video controls playsinline preload="none" poster="https://media.fisher.sh/notes/2025/12/08/been-while-arc-raiders-has-poster.jpg" width="1200" height="800" src="https://media.fisher.sh/notes/2025/12/08/been-while-arc-raiders-has.mp4"></video>
