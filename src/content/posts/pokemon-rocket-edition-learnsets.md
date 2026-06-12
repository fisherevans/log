---
id: UTnTV91Ilq
title: "Pokemon: Rocket Edition - Learnsets"
date: 2023-09-18
description: A reference dump of the tweaked evolutions and level-up movesets in
  the Fire Red - Rocket Edition ROM hack, extracted from a patched ROM with
  HexManiacAdvance.
tags:
  - pokemon
  - tools
hasVideo: false
updatedDate: 2026-06-03
draft: false
---
[Pokemon: Fire Red - Rocket Edition](https://rocket-edition.com) is a popular ROM-hack. As part of the hack, the pokemon evolutions and level-up move sets were heavily tweaked. For the life of me, I couldn't find a resource online that listed these changes, so I decided to post my own findings.

***[Skip the how, and just bring me to the data!](#explorer)***

## Method

I used the [HexManiacAdvance](https://github.com/haven1433/HexManiacAdvance) tool to inspect my patched ROM. Using the following script in the `Tools > Show Automation Tool` window, I was able to generate a JSON dump of the data I was looking for:

```python
import json

ps = {}

for i, n in enumerate(data.pokemon.names):
  ps[i] = {'name':n.name}

for i, id in enumerate(data.pokedex.national):
  ps[i]['id'] = id.index

for i, e in enumerate(data.pokemon.evolutions):
  ps[i]['evolutions'] = []
  if e.method1 != 'None':
    ps[i]['evolutions'].append({'method':e.method1, 'arg':e.arg1, 'species':e.species1})
  if e.method2 != 'None':
    ps[i]['evolutions'].append({'method':e.method2, 'arg':e.arg2, 'species':e.species2})
  if e.method3 != 'None':
    ps[i]['evolutions'].append({'method':e.method3, 'arg':e.arg3, 'species':e.species3})
  if e.method4 != 'None':
    ps[i]['evolutions'].append({'method':e.method4, 'arg':e.arg4, 'species':e.species4})
  if e.method5 != 'None':
    ps[i]['evolutions'].append({'method':e.method5, 'arg':e.arg5, 'species':e.species5})


for i, lu in enumerate(data.pokemon.moves.levelup):
  ps[i]['moves_levelup'] = []
  for m in lu.movesFromLevel:
    mid = m.pair.move
    ps[i]['moves_levelup'].append({
      'move':{
        'name': data.pokemon.moves.names[mid].name,
        'power': data.pokemon.moves.stats.battle[mid].power,
        'type': data.pokemon.moves.stats.battle[mid].type,
        'accuracy': data.pokemon.moves.stats.battle[mid].accuracy,
        'pp': data.pokemon.moves.stats.battle[mid].pp
      },
      'level':m.pair.level
    })


for i, tmc in enumerate(data.pokemon.moves.tmcompatibility):
  ps[i]['moves_tm'] = []
  for num, m in enumerate(data.pokemon.moves.tms):
    name = m.move
    if " " in name:
      name = '"' + name + '"'
    if tmc.moves.HasField(name) and tmc.moves[name] > 0:
      mid = m.move
      ps[i]['moves_tm'].append({
        'name': data.pokemon.moves.names[mid].name,
        'tm': num + 1,
        'power': data.pokemon.moves.stats.battle[mid].power,
        'type': data.pokemon.moves.stats.battle[mid].type,
        'accuracy': data.pokemon.moves.stats.battle[mid].accuracy,
        'pp': data.pokemon.moves.stats.battle[mid].pp
      })

f = open("pokemon.json", "w")
f.write(json.dumps(ps, indent = 2))
f.close()
print("done")
```

The output looked [something like this](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon.json):

```json
{
  "64": {
    "name": "Kadabra",
    "id": 65,
    "evolutions": [
      {
        "arg": 33,
        "species": "Alakazam",
        "method": "Level"
      }
    ],
    "moves_tm": [
      {
        "pp": 20,
        "type": "Fight",
        "tm": 1,
        "name": "Focus Punch",
        "accuracy": 100,
        "power": 150
      },
      {
        "pp": 20,
        "type": "Psychc",
        "tm": 4,
        "name": "Calm Mind",
        "accuracy": 0,
        "power": 0
      },
      // ...
    ],
    "moves_levelup": [
      {
        "move": {
          "pp": 20,
          "type": "Psychc",
          "name": "Teleport",
          "accuracy": 0,
          "power": 0
        },
        "level": 1
      },
      {
        "move": {
          "pp": 15,
          "type": "Psychc",
          "name": "Kinesis",
          "accuracy": 80,
          "power": 0
        },
        "level": 1
      },
      // ...
    ]
  }
  // ...
}
```

Then I just wrote a [little golang script](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/render.go) to print out the Markdown.

I hope it helps!

# Explorer

Search by name, click to add a Pokemon to the comparison list, click again to remove. You can stack as many as you want side-by-side, and the URL hash tracks your selection so the "Open standalone" link preserves what you're looking at.



[Open the explorer in its own tab ↗](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/explorer.html)