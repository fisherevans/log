---
id: ntZ5O7Bayw
date: 2025-10-02T23:18:00Z
tags:
  - project:primortal
  - gamedev
images:
  - src: https://media.fisher.sh/notes/2025/10/02/not-whole-lot-show-mostly-1.png
    alt: "Not a whole lot to show - I\u2019ve mostly been working on refactoring and clean up. I\u2019ve been refining my player load out de"
  - src: https://media.fisher.sh/notes/2025/10/02/not-whole-lot-show-mostly-2.png
    alt: "Not a whole lot to show - I\u2019ve mostly been working on refactoring and clean up. I\u2019ve been refining my player load out de"
  - src: https://media.fisher.sh/notes/2025/10/02/not-whole-lot-show-mostly-3.png
    alt: "Not a whole lot to show - I\u2019ve mostly been working on refactoring and clean up. I\u2019ve been refining my player load out de"
  - src: https://media.fisher.sh/notes/2025/10/02/not-whole-lot-show-mostly-4.png
    alt: "Not a whole lot to show - I\u2019ve mostly been working on refactoring and clean up. I\u2019ve been refining my player load out de"
  - src: https://media.fisher.sh/notes/2025/10/02/not-whole-lot-show-mostly-5.png
    alt: "Not a whole lot to show - I\u2019ve mostly been working on refactoring and clean up. I\u2019ve been refining my player load out de"
  - src: https://media.fisher.sh/notes/2025/10/02/not-whole-lot-show-mostly-6.png
    alt: "Not a whole lot to show - I\u2019ve mostly been working on refactoring and clean up. I\u2019ve been refining my player load out de"
draft: false
---
Not a whole lot to show - I’ve mostly been working on refactoring and clean up. I’ve been refining my player load out design and “Primortal” archetypes. I originally wanted:

- A party system, where you would “load in” 1 of your 4-6 Primortals in your team
- Damage Types, Body Types, and Type Affinities with strengths and weaknesses amongst each other

Ultimately - it was too complex and not fun. I’ve decided to simplify it quite a bite. I went from 8 body types & 8 damage types, to 5 Primortal “Flavors”. Each flavor has general patterns for the types of skills they use an and how they behave in combat. But it’s not like rock, paper scissors - more like the colors in Magic the Gathering - it’s behavioral theming - no strict rules.

Instead of party members, defeating and optionally capturing Primortals reward you with research points to unlock the skills that creature uses. Before deploying on your next adventure, you can change your skill loadout with skills you’ve unlocked from all Primortals.

This shift has made it much easier to focus in on a tighter combat experience - focused more on building fun and interesting skill sets, and the puzzle solving of applying those skills in an efficient sequence to maximize outgoing damage and minimize incoming damage in real time - and less about swapping party members to play against type weaknesses.

I decided to focus on 5 core creatures to start - one for each type:

- Kinetic: focuses on direct hits and defending one-self
- Thermal: Sustained burning status damage
- Voltaic: Glass cannon, weak - but string hits
- Corrosive: Low passive damage + low damage small hits
- Mutagenic: Self healing while chipping away the opponent

Plus a 6th creature - a dummy robot to start building out the combat tutorial.
