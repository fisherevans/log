---
title: "Pokemon: Rocket Edition - Learnsets"
date: 2023-09-18
description: A reference dump of the tweaked evolutions and level-up movesets in
  the Fire Red - Rocket Edition ROM hack, extracted from a patched ROM with
  HexManiacAdvance.
tags:
  - pokemon
hasVideo: false
draft: true
---

[Pokemon: Fire Red - Rocket Edition](https://rocket-edition.com) is a popular ROM-hack. As part of the hack, the pokemon evolutions and level-up move sets were heavily tweaked. For the life of me, I couldn't find a resource online that listed these changes, so I decided to post my own findings.

[***Skip the how, and just bring me to the data!***](#pokemon)

## Method

I used the [HexManiacAdvance](https://github.com/haven1433/HexManiacAdvance) tool to inspect my patched ROM. Using the followng script in the `Tools > Show Automation Tool` window, I was able to generate some a JSON dump of the data I was looking for:

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

Then I just wrote a [little golang script](./20230918-script.go) to print out the Markdown.

I hope it helps!

# Pokemon

| | | | |
|-|-|-|-|
|[000 - Chimecho](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/chimecho.txt)|[000 - Latias](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/latias.txt)|[002 - Bulbasaur](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/bulbasaur.txt)|[003 - Ivysaur](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/ivysaur.txt)|
|[004 - Venusaur](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/venusaur.txt)|[005 - Charmander](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/charmander.txt)|[006 - Charmeleon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/charmeleon.txt)|[007 - Charizard](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/charizard.txt)|
|[008 - Squirtle](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/squirtle.txt)|[009 - Wartortle](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/wartortle.txt)|[010 - Blastoise](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/blastoise.txt)|[011 - Caterpie](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/caterpie.txt)|
|[012 - Metapod](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/metapod.txt)|[013 - Butterfree](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/butterfree.txt)|[014 - Weedle](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/weedle.txt)|[015 - Kakuna](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/kakuna.txt)|
|[016 - Beedrill](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/beedrill.txt)|[017 - Pidgey](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/pidgey.txt)|[018 - Pidgeotto](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/pidgeotto.txt)|[019 - Pidgeot](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/pidgeot.txt)|
|[020 - Rattata](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/rattata.txt)|[021 - Raticate](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/raticate.txt)|[022 - Spearow](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/spearow.txt)|[023 - Fearow](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/fearow.txt)|
|[024 - Ekans](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/ekans.txt)|[025 - Arbok](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/arbok.txt)|[026 - Pikachu](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/pikachu.txt)|[027 - Raichu](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/raichu.txt)|
|[028 - Sandshrew](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/sandshrew.txt)|[029 - Sandslash](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/sandslash.txt)|[030 - Nidoran\sf](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/nidoransf.txt)|[031 - Nidorina](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/nidorina.txt)|
|[032 - Nidoqueen](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/nidoqueen.txt)|[033 - Nidoran\sm](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/nidoransm.txt)|[034 - Nidorino](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/nidorino.txt)|[035 - Nidoking](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/nidoking.txt)|
|[036 - Clefairy](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/clefairy.txt)|[037 - Clefable](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/clefable.txt)|[038 - Vulpix](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/vulpix.txt)|[039 - Ninetales](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/ninetales.txt)|
|[040 - Jigglypuff](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/jigglypuff.txt)|[041 - Wigglytuff](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/wigglytuff.txt)|[042 - Zubat](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/zubat.txt)|[043 - Golbat](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/golbat.txt)|
|[044 - Oddish](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/oddish.txt)|[045 - Gloom](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/gloom.txt)|[046 - Vileplume](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/vileplume.txt)|[047 - Paras](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/paras.txt)|
|[048 - Parasect](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/parasect.txt)|[049 - Venonat](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/venonat.txt)|[050 - Venomoth](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/venomoth.txt)|[051 - Diglett](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/diglett.txt)|
|[052 - Dugtrio](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/dugtrio.txt)|[053 - Meowth](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/meowth.txt)|[054 - Persian](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/persian.txt)|[055 - Psyduck](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/psyduck.txt)|
|[056 - Golduck](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/golduck.txt)|[057 - Mankey](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/mankey.txt)|[058 - Primeape](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/primeape.txt)|[059 - Growlithe](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/growlithe.txt)|
|[060 - Arcanine](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/arcanine.txt)|[061 - Poliwag](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/poliwag.txt)|[062 - Poliwhirl](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/poliwhirl.txt)|[063 - Poliwrath](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/poliwrath.txt)|
|[064 - Abra](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/abra.txt)|[065 - Kadabra](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/kadabra.txt)|[066 - Alakazam](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/alakazam.txt)|[067 - Machop](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/machop.txt)|
|[068 - Machoke](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/machoke.txt)|[069 - Machamp](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/machamp.txt)|[070 - Bellsprout](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/bellsprout.txt)|[071 - Weepinbell](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/weepinbell.txt)|
|[072 - Victreebel](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/victreebel.txt)|[073 - Tentacool](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/tentacool.txt)|[074 - Tentacruel](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/tentacruel.txt)|[075 - Geodude](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/geodude.txt)|
|[076 - Graveler](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/graveler.txt)|[077 - Golem](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/golem.txt)|[078 - Ponyta](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/ponyta.txt)|[079 - Rapidash](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/rapidash.txt)|
|[080 - Slowpoke](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/slowpoke.txt)|[081 - Slowbro](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/slowbro.txt)|[082 - Magnemite](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/magnemite.txt)|[083 - Magneton](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/magneton.txt)|
|[084 - Farfetch'd](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/farfetchd.txt)|[085 - Doduo](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/doduo.txt)|[086 - Dodrio](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/dodrio.txt)|[087 - Seel](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/seel.txt)|
|[088 - Dewgong](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/dewgong.txt)|[089 - Grimer](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/grimer.txt)|[090 - Muk](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/muk.txt)|[091 - Shellder](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/shellder.txt)|
|[092 - Cloyster](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/cloyster.txt)|[093 - Gastly](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/gastly.txt)|[094 - Haunter](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/haunter.txt)|[095 - Gengar](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/gengar.txt)|
|[096 - Onix](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/onix.txt)|[097 - Drowzee](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/drowzee.txt)|[098 - Hypno](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/hypno.txt)|[099 - Krabby](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/krabby.txt)|
|[100 - Kingler](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/kingler.txt)|[101 - Voltorb](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/voltorb.txt)|[102 - Electrode](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/electrode.txt)|[103 - Exeggcute](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/exeggcute.txt)|
|[104 - Exeggutor](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/exeggutor.txt)|[105 - Cubone](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/cubone.txt)|[106 - Marowak](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/marowak.txt)|[107 - Hitmonlee](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/hitmonlee.txt)|
|[108 - Hitmonchan](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/hitmonchan.txt)|[109 - Lickitung](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/lickitung.txt)|[110 - Koffing](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/koffing.txt)|[111 - Weezing](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/weezing.txt)|
|[112 - Rhyhorn](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/rhyhorn.txt)|[113 - Rhydon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/rhydon.txt)|[114 - Chansey](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/chansey.txt)|[115 - Tangela](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/tangela.txt)|
|[116 - Kangaskhan](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/kangaskhan.txt)|[117 - Horsea](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/horsea.txt)|[118 - Seadra](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/seadra.txt)|[119 - Goldeen](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/goldeen.txt)|
|[120 - Seaking](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/seaking.txt)|[121 - Staryu](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/staryu.txt)|[122 - Starmie](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/starmie.txt)|[123 - Mr. Mime](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/mr.-mime.txt)|
|[124 - Scyther](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/scyther.txt)|[125 - Jynx](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/jynx.txt)|[126 - Electabuzz](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/electabuzz.txt)|[127 - Magmar](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/magmar.txt)|
|[128 - Pinsir](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/pinsir.txt)|[129 - Tauros](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/tauros.txt)|[130 - Magikarp](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/magikarp.txt)|[131 - Gyarados](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/gyarados.txt)|
|[132 - Lapras](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/lapras.txt)|[133 - Ditto](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/ditto.txt)|[134 - Eevee](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/eevee.txt)|[135 - Vaporeon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/vaporeon.txt)|
|[136 - Jolteon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/jolteon.txt)|[137 - Flareon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/flareon.txt)|[138 - Porygon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/porygon.txt)|[139 - Omanyte](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/omanyte.txt)|
|[140 - Omastar](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/omastar.txt)|[141 - Kabuto](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/kabuto.txt)|[142 - Kabutops](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/kabutops.txt)|[143 - Aerodactyl](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/aerodactyl.txt)|
|[144 - Snorlax](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/snorlax.txt)|[145 - Articuno](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/articuno.txt)|[146 - Zapdos](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/zapdos.txt)|[147 - Moltres](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/moltres.txt)|
|[148 - Dratini](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/dratini.txt)|[149 - Dragonair](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/dragonair.txt)|[150 - Dragonite](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/dragonite.txt)|[151 - Mewtwo](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/mewtwo.txt)|
|[152 - Mew](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/mew.txt)|[153 - Chikorita](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/chikorita.txt)|[154 - Bayleef](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/bayleef.txt)|[155 - Meganium](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/meganium.txt)|
|[156 - Cyndaquil](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/cyndaquil.txt)|[157 - Quilava](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/quilava.txt)|[158 - Typhlosion](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/typhlosion.txt)|[159 - Totodile](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/totodile.txt)|
|[160 - Croconaw](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/croconaw.txt)|[161 - Feraligatr](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/feraligatr.txt)|[162 - Sentret](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/sentret.txt)|[163 - Furret](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/furret.txt)|
|[164 - Hoothoot](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/hoothoot.txt)|[165 - Noctowl](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/noctowl.txt)|[166 - Ledyba](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/ledyba.txt)|[167 - Ledian](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/ledian.txt)|
|[168 - Spinarak](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/spinarak.txt)|[169 - Ariados](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/ariados.txt)|[170 - Crobat](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/crobat.txt)|[171 - Chinchou](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/chinchou.txt)|
|[172 - Lanturn](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/lanturn.txt)|[173 - Pichu](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/pichu.txt)|[174 - Cleffa](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/cleffa.txt)|[175 - Igglybuff](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/igglybuff.txt)|
|[176 - Togepi](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/togepi.txt)|[177 - Togetic](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/togetic.txt)|[178 - Natu](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/natu.txt)|[179 - Xatu](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/xatu.txt)|
|[180 - Mareep](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/mareep.txt)|[181 - Flaaffy](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/flaaffy.txt)|[182 - Ampharos](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/ampharos.txt)|[183 - Bellossom](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/bellossom.txt)|
|[184 - Marill](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/marill.txt)|[185 - Azumarill](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/azumarill.txt)|[186 - Sudowoodo](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/sudowoodo.txt)|[187 - Politoed](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/politoed.txt)|
|[188 - Hoppip](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/hoppip.txt)|[189 - Skiploom](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/skiploom.txt)|[190 - Jumpluff](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/jumpluff.txt)|[191 - Aipom](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/aipom.txt)|
|[192 - Sunkern](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/sunkern.txt)|[193 - Sunflora](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/sunflora.txt)|[194 - Yanma](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/yanma.txt)|[195 - Wooper](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/wooper.txt)|
|[196 - Quagsire](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/quagsire.txt)|[197 - Espeon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/espeon.txt)|[198 - Umbreon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/umbreon.txt)|[199 - Murkrow](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/murkrow.txt)|
|[200 - Slowking](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/slowking.txt)|[201 - Misdreavus](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/misdreavus.txt)|[202 - Unown](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/unown.txt)|[203 - Wobbuffet](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/wobbuffet.txt)|
|[204 - Girafarig](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/girafarig.txt)|[205 - Pineco](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/pineco.txt)|[206 - Forretress](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/forretress.txt)|[207 - Dunsparce](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/dunsparce.txt)|
|[208 - Gligar](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/gligar.txt)|[209 - Steelix](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/steelix.txt)|[210 - Snubbull](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/snubbull.txt)|[211 - Granbull](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/granbull.txt)|
|[212 - Qwilfish](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/qwilfish.txt)|[213 - Scizor](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/scizor.txt)|[214 - Shuckle](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/shuckle.txt)|[215 - Heracross](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/heracross.txt)|
|[216 - Sneasel](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/sneasel.txt)|[217 - Teddiursa](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/teddiursa.txt)|[218 - Ursaring](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/ursaring.txt)|[219 - Slugma](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/slugma.txt)|
|[220 - Magcargo](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/magcargo.txt)|[221 - Swinub](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/swinub.txt)|[222 - Piloswine](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/piloswine.txt)|[223 - Corsola](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/corsola.txt)|
|[224 - Remoraid](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/remoraid.txt)|[225 - Octillery](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/octillery.txt)|[226 - Delibird](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/delibird.txt)|[227 - Mantine](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/mantine.txt)|
|[228 - Skarmory](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/skarmory.txt)|[229 - Houndour](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/houndour.txt)|[230 - Houndoom](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/houndoom.txt)|[231 - Kingdra](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/kingdra.txt)|
|[232 - Phanpy](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/phanpy.txt)|[233 - Donphan](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/donphan.txt)|[234 - Porygon2](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/porygon2.txt)|[235 - Stantler](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/stantler.txt)|
|[236 - Smeargle](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/smeargle.txt)|[237 - Tyrogue](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/tyrogue.txt)|[238 - Hitmontop](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/hitmontop.txt)|[239 - Smoochum](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/smoochum.txt)|
|[240 - Elekid](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/elekid.txt)|[241 - Magby](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/magby.txt)|[242 - Miltank](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/miltank.txt)|[243 - Blissey](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/blissey.txt)|
|[244 - Raikou](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/raikou.txt)|[245 - Entei](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/entei.txt)|[246 - Suicune](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/suicune.txt)|[247 - Larvitar](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/larvitar.txt)|
|[248 - Pupitar](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/pupitar.txt)|[249 - Tyranitar](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/tyranitar.txt)|[250 - Lugia](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/lugia.txt)|[251 - Ho-Oh](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/ho-oh.txt)|
|[253 - Treecko](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/treecko.txt)|[254 - Grovyle](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/grovyle.txt)|[255 - Sceptile](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/sceptile.txt)|[256 - Torchic](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/torchic.txt)|
|[257 - Combusken](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/combusken.txt)|[258 - Blaziken](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/blaziken.txt)|[259 - Mudkip](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/mudkip.txt)|[260 - Marshtomp](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/marshtomp.txt)|
|[261 - Swampert](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/swampert.txt)|[262 - Poochyena](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/poochyena.txt)|[263 - Mightyena](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/mightyena.txt)|[264 - Zigzagoon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/zigzagoon.txt)|
|[265 - Linoone](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/linoone.txt)|[266 - Wurmple](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/wurmple.txt)|[267 - Silcoon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/silcoon.txt)|[268 - Beautifly](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/beautifly.txt)|
|[269 - Cascoon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/cascoon.txt)|[270 - Dustox](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/dustox.txt)|[271 - Lotad](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/lotad.txt)|[272 - Lombre](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/lombre.txt)|
|[273 - Ludicolo](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/ludicolo.txt)|[274 - Seedot](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/seedot.txt)|[275 - Nuzleaf](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/nuzleaf.txt)|[276 - Shedinja](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/shedinja.txt)|
|[277 - Taillow](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/taillow.txt)|[278 - Spinda](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/spinda.txt)|[279 - Wingull](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/wingull.txt)|[280 - Armaldo](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/armaldo.txt)|
|[281 - Ralts](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/ralts.txt)|[282 - Kirlia](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/kirlia.txt)|[283 - Pelipper](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/pelipper.txt)|[284 - Surskit](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/surskit.txt)|
|[285 - Swellow](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/swellow.txt)|[286 - Shroomish](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/shroomish.txt)|[287 - Roselia](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/roselia.txt)|[288 - Slakoth](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/slakoth.txt)|
|[289 - Vigoroth](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/vigoroth.txt)|[290 - Shiftry](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/shiftry.txt)|[291 - Nincada](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/nincada.txt)|[292 - Ninjask](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/ninjask.txt)|
|[293 - Tropius](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/tropius.txt)|[294 - Whismur](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/whismur.txt)|[295 - Loudred](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/loudred.txt)|[296 - Flygon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/flygon.txt)|
|[297 - Makuhita](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/makuhita.txt)|[298 - Solrock](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/solrock.txt)|[299 - Claydol](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/claydol.txt)|[300 - Wailord](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/wailord.txt)|
|[301 - Skitty](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/skitty.txt)|[302 - Torkoal](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/torkoal.txt)|[303 - Minun](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/minun.txt)|[304 - Relicanth](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/relicanth.txt)|
|[305 - Aron](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/aron.txt)|[306 - Lairon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/lairon.txt)|[307 - Mawile](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/mawile.txt)|[308 - Meditite](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/meditite.txt)|
|[309 - Hariyama](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/hariyama.txt)|[310 - Electrike](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/electrike.txt)|[311 - Grumpig](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/grumpig.txt)|[312 - Plusle](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/plusle.txt)|
|[313 - Castform](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/castform.txt)|[314 - Volbeat](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/volbeat.txt)|[315 - Dusclops](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/dusclops.txt)|[316 - Slaking](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/slaking.txt)|
|[317 - Gulpin](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/gulpin.txt)|[318 - Milotic](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/milotic.txt)|[319 - Carvanha](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/carvanha.txt)|[320 - Masquerain](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/masquerain.txt)|
|[321 - Wailmer](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/wailmer.txt)|[322 - Manectric](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/manectric.txt)|[323 - Numel](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/numel.txt)|[324 - Nosepass](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/nosepass.txt)|
|[325 - Azurill](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/azurill.txt)|[326 - Spoink](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/spoink.txt)|[327 - Breloom](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/breloom.txt)|[328 - Sharpedo](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/sharpedo.txt)|
|[329 - Trapinch](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/trapinch.txt)|[330 - Vibrava](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/vibrava.txt)|[331 - Walrein](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/walrein.txt)|[332 - Cacnea](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/cacnea.txt)|
|[333 - Medicham](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/medicham.txt)|[334 - Swablu](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/swablu.txt)|[335 - Seviper](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/seviper.txt)|[336 - Banette](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/banette.txt)|
|[337 - Glalie](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/glalie.txt)|[338 - Lunatone](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/lunatone.txt)|[339 - Sableye](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/sableye.txt)|[340 - Barboach](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/barboach.txt)|
|[341 - Luvdisc](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/luvdisc.txt)|[342 - Corphish](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/corphish.txt)|[343 - Kecleon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/kecleon.txt)|[344 - Baltoy](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/baltoy.txt)|
|[345 - Illumise](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/illumise.txt)|[346 - Lileep](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/lileep.txt)|[347 - Cradily](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/cradily.txt)|[348 - Anorith](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/anorith.txt)|
|[349 - Crawdaunt](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/crawdaunt.txt)|[350 - Feebas](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/feebas.txt)|[351 - Aggron](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/aggron.txt)|[352 - Delcatty](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/delcatty.txt)|
|[353 - Absol](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/absol.txt)|[354 - Shuppet](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/shuppet.txt)|[355 - Wynaut](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/wynaut.txt)|[356 - Duskull](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/duskull.txt)|
|[357 - Swalot](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/swalot.txt)|[358 - Deoxys](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/deoxys.txt)|[359 - Gorebyss](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/gorebyss.txt)|[360 - Altaria](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/altaria.txt)|
|[361 - Cacturne](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/cacturne.txt)|[362 - Snorunt](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/snorunt.txt)|[363 - Camerupt](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/camerupt.txt)|[364 - Spheal](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/spheal.txt)|
|[365 - Sealeo](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/sealeo.txt)|[366 - Exploud](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/exploud.txt)|[367 - Clamperl](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/clamperl.txt)|[368 - Huntail](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/huntail.txt)|
|[369 - Zangoose](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/zangoose.txt)|[370 - Whiscash](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/whiscash.txt)|[371 - Gardevoir](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/gardevoir.txt)|[372 - Bagon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/bagon.txt)|
|[373 - Shelgon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/shelgon.txt)|[374 - Salamence](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/salamence.txt)|[375 - Beldum](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/beldum.txt)|[376 - Metang](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/metang.txt)|
|[377 - Metagross](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/metagross.txt)|[378 - Regirock](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/regirock.txt)|[379 - Regice](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/regice.txt)|[380 - Rayquaza](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/rayquaza.txt)|
|[382 - Registeel](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/registeel.txt)|[383 - Kyogre](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/kyogre.txt)|[384 - Groudon](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/groudon.txt)|[385 - MissingNo.](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/missingno.txt)|
|[386 - Jirachi](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/jirachi.txt)|[387 - Celebi](https://media.fisher.sh/blog/2023/09/18/pokemon-rocket-edition-learnsets/pokemon/celebi.txt)| | |

