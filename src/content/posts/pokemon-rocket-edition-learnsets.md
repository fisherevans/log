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
|[000 - Chimecho](#chimecho)|[000 - Latias](#latias)|[002 - Bulbasaur](#bulbasaur)|[003 - Ivysaur](#ivysaur)|
|[004 - Venusaur](#venusaur)|[005 - Charmander](#charmander)|[006 - Charmeleon](#charmeleon)|[007 - Charizard](#charizard)|
|[008 - Squirtle](#squirtle)|[009 - Wartortle](#wartortle)|[010 - Blastoise](#blastoise)|[011 - Caterpie](#caterpie)|
|[012 - Metapod](#metapod)|[013 - Butterfree](#butterfree)|[014 - Weedle](#weedle)|[015 - Kakuna](#kakuna)|
|[016 - Beedrill](#beedrill)|[017 - Pidgey](#pidgey)|[018 - Pidgeotto](#pidgeotto)|[019 - Pidgeot](#pidgeot)|
|[020 - Rattata](#rattata)|[021 - Raticate](#raticate)|[022 - Spearow](#spearow)|[023 - Fearow](#fearow)|
|[024 - Ekans](#ekans)|[025 - Arbok](#arbok)|[026 - Pikachu](#pikachu)|[027 - Raichu](#raichu)|
|[028 - Sandshrew](#sandshrew)|[029 - Sandslash](#sandslash)|[030 - Nidoran\sf](#nidoran\sf)|[031 - Nidorina](#nidorina)|
|[032 - Nidoqueen](#nidoqueen)|[033 - Nidoran\sm](#nidoran\sm)|[034 - Nidorino](#nidorino)|[035 - Nidoking](#nidoking)|
|[036 - Clefairy](#clefairy)|[037 - Clefable](#clefable)|[038 - Vulpix](#vulpix)|[039 - Ninetales](#ninetales)|
|[040 - Jigglypuff](#jigglypuff)|[041 - Wigglytuff](#wigglytuff)|[042 - Zubat](#zubat)|[043 - Golbat](#golbat)|
|[044 - Oddish](#oddish)|[045 - Gloom](#gloom)|[046 - Vileplume](#vileplume)|[047 - Paras](#paras)|
|[048 - Parasect](#parasect)|[049 - Venonat](#venonat)|[050 - Venomoth](#venomoth)|[051 - Diglett](#diglett)|
|[052 - Dugtrio](#dugtrio)|[053 - Meowth](#meowth)|[054 - Persian](#persian)|[055 - Psyduck](#psyduck)|
|[056 - Golduck](#golduck)|[057 - Mankey](#mankey)|[058 - Primeape](#primeape)|[059 - Growlithe](#growlithe)|
|[060 - Arcanine](#arcanine)|[061 - Poliwag](#poliwag)|[062 - Poliwhirl](#poliwhirl)|[063 - Poliwrath](#poliwrath)|
|[064 - Abra](#abra)|[065 - Kadabra](#kadabra)|[066 - Alakazam](#alakazam)|[067 - Machop](#machop)|
|[068 - Machoke](#machoke)|[069 - Machamp](#machamp)|[070 - Bellsprout](#bellsprout)|[071 - Weepinbell](#weepinbell)|
|[072 - Victreebel](#victreebel)|[073 - Tentacool](#tentacool)|[074 - Tentacruel](#tentacruel)|[075 - Geodude](#geodude)|
|[076 - Graveler](#graveler)|[077 - Golem](#golem)|[078 - Ponyta](#ponyta)|[079 - Rapidash](#rapidash)|
|[080 - Slowpoke](#slowpoke)|[081 - Slowbro](#slowbro)|[082 - Magnemite](#magnemite)|[083 - Magneton](#magneton)|
|[084 - Farfetch'd](#farfetch'd)|[085 - Doduo](#doduo)|[086 - Dodrio](#dodrio)|[087 - Seel](#seel)|
|[088 - Dewgong](#dewgong)|[089 - Grimer](#grimer)|[090 - Muk](#muk)|[091 - Shellder](#shellder)|
|[092 - Cloyster](#cloyster)|[093 - Gastly](#gastly)|[094 - Haunter](#haunter)|[095 - Gengar](#gengar)|
|[096 - Onix](#onix)|[097 - Drowzee](#drowzee)|[098 - Hypno](#hypno)|[099 - Krabby](#krabby)|
|[100 - Kingler](#kingler)|[101 - Voltorb](#voltorb)|[102 - Electrode](#electrode)|[103 - Exeggcute](#exeggcute)|
|[104 - Exeggutor](#exeggutor)|[105 - Cubone](#cubone)|[106 - Marowak](#marowak)|[107 - Hitmonlee](#hitmonlee)|
|[108 - Hitmonchan](#hitmonchan)|[109 - Lickitung](#lickitung)|[110 - Koffing](#koffing)|[111 - Weezing](#weezing)|
|[112 - Rhyhorn](#rhyhorn)|[113 - Rhydon](#rhydon)|[114 - Chansey](#chansey)|[115 - Tangela](#tangela)|
|[116 - Kangaskhan](#kangaskhan)|[117 - Horsea](#horsea)|[118 - Seadra](#seadra)|[119 - Goldeen](#goldeen)|
|[120 - Seaking](#seaking)|[121 - Staryu](#staryu)|[122 - Starmie](#starmie)|[123 - Mr. Mime](#mr.-mime)|
|[124 - Scyther](#scyther)|[125 - Jynx](#jynx)|[126 - Electabuzz](#electabuzz)|[127 - Magmar](#magmar)|
|[128 - Pinsir](#pinsir)|[129 - Tauros](#tauros)|[130 - Magikarp](#magikarp)|[131 - Gyarados](#gyarados)|
|[132 - Lapras](#lapras)|[133 - Ditto](#ditto)|[134 - Eevee](#eevee)|[135 - Vaporeon](#vaporeon)|
|[136 - Jolteon](#jolteon)|[137 - Flareon](#flareon)|[138 - Porygon](#porygon)|[139 - Omanyte](#omanyte)|
|[140 - Omastar](#omastar)|[141 - Kabuto](#kabuto)|[142 - Kabutops](#kabutops)|[143 - Aerodactyl](#aerodactyl)|
|[144 - Snorlax](#snorlax)|[145 - Articuno](#articuno)|[146 - Zapdos](#zapdos)|[147 - Moltres](#moltres)|
|[148 - Dratini](#dratini)|[149 - Dragonair](#dragonair)|[150 - Dragonite](#dragonite)|[151 - Mewtwo](#mewtwo)|
|[152 - Mew](#mew)|[153 - Chikorita](#chikorita)|[154 - Bayleef](#bayleef)|[155 - Meganium](#meganium)|
|[156 - Cyndaquil](#cyndaquil)|[157 - Quilava](#quilava)|[158 - Typhlosion](#typhlosion)|[159 - Totodile](#totodile)|
|[160 - Croconaw](#croconaw)|[161 - Feraligatr](#feraligatr)|[162 - Sentret](#sentret)|[163 - Furret](#furret)|
|[164 - Hoothoot](#hoothoot)|[165 - Noctowl](#noctowl)|[166 - Ledyba](#ledyba)|[167 - Ledian](#ledian)|
|[168 - Spinarak](#spinarak)|[169 - Ariados](#ariados)|[170 - Crobat](#crobat)|[171 - Chinchou](#chinchou)|
|[172 - Lanturn](#lanturn)|[173 - Pichu](#pichu)|[174 - Cleffa](#cleffa)|[175 - Igglybuff](#igglybuff)|
|[176 - Togepi](#togepi)|[177 - Togetic](#togetic)|[178 - Natu](#natu)|[179 - Xatu](#xatu)|
|[180 - Mareep](#mareep)|[181 - Flaaffy](#flaaffy)|[182 - Ampharos](#ampharos)|[183 - Bellossom](#bellossom)|
|[184 - Marill](#marill)|[185 - Azumarill](#azumarill)|[186 - Sudowoodo](#sudowoodo)|[187 - Politoed](#politoed)|
|[188 - Hoppip](#hoppip)|[189 - Skiploom](#skiploom)|[190 - Jumpluff](#jumpluff)|[191 - Aipom](#aipom)|
|[192 - Sunkern](#sunkern)|[193 - Sunflora](#sunflora)|[194 - Yanma](#yanma)|[195 - Wooper](#wooper)|
|[196 - Quagsire](#quagsire)|[197 - Espeon](#espeon)|[198 - Umbreon](#umbreon)|[199 - Murkrow](#murkrow)|
|[200 - Slowking](#slowking)|[201 - Misdreavus](#misdreavus)|[202 - Unown](#unown)|[203 - Wobbuffet](#wobbuffet)|
|[204 - Girafarig](#girafarig)|[205 - Pineco](#pineco)|[206 - Forretress](#forretress)|[207 - Dunsparce](#dunsparce)|
|[208 - Gligar](#gligar)|[209 - Steelix](#steelix)|[210 - Snubbull](#snubbull)|[211 - Granbull](#granbull)|
|[212 - Qwilfish](#qwilfish)|[213 - Scizor](#scizor)|[214 - Shuckle](#shuckle)|[215 - Heracross](#heracross)|
|[216 - Sneasel](#sneasel)|[217 - Teddiursa](#teddiursa)|[218 - Ursaring](#ursaring)|[219 - Slugma](#slugma)|
|[220 - Magcargo](#magcargo)|[221 - Swinub](#swinub)|[222 - Piloswine](#piloswine)|[223 - Corsola](#corsola)|
|[224 - Remoraid](#remoraid)|[225 - Octillery](#octillery)|[226 - Delibird](#delibird)|[227 - Mantine](#mantine)|
|[228 - Skarmory](#skarmory)|[229 - Houndour](#houndour)|[230 - Houndoom](#houndoom)|[231 - Kingdra](#kingdra)|
|[232 - Phanpy](#phanpy)|[233 - Donphan](#donphan)|[234 - Porygon2](#porygon2)|[235 - Stantler](#stantler)|
|[236 - Smeargle](#smeargle)|[237 - Tyrogue](#tyrogue)|[238 - Hitmontop](#hitmontop)|[239 - Smoochum](#smoochum)|
|[240 - Elekid](#elekid)|[241 - Magby](#magby)|[242 - Miltank](#miltank)|[243 - Blissey](#blissey)|
|[244 - Raikou](#raikou)|[245 - Entei](#entei)|[246 - Suicune](#suicune)|[247 - Larvitar](#larvitar)|
|[248 - Pupitar](#pupitar)|[249 - Tyranitar](#tyranitar)|[250 - Lugia](#lugia)|[251 - Ho-Oh](#ho-oh)|
|[253 - Treecko](#treecko)|[254 - Grovyle](#grovyle)|[255 - Sceptile](#sceptile)|[256 - Torchic](#torchic)|
|[257 - Combusken](#combusken)|[258 - Blaziken](#blaziken)|[259 - Mudkip](#mudkip)|[260 - Marshtomp](#marshtomp)|
|[261 - Swampert](#swampert)|[262 - Poochyena](#poochyena)|[263 - Mightyena](#mightyena)|[264 - Zigzagoon](#zigzagoon)|
|[265 - Linoone](#linoone)|[266 - Wurmple](#wurmple)|[267 - Silcoon](#silcoon)|[268 - Beautifly](#beautifly)|
|[269 - Cascoon](#cascoon)|[270 - Dustox](#dustox)|[271 - Lotad](#lotad)|[272 - Lombre](#lombre)|
|[273 - Ludicolo](#ludicolo)|[274 - Seedot](#seedot)|[275 - Nuzleaf](#nuzleaf)|[276 - Shedinja](#shedinja)|
|[277 - Taillow](#taillow)|[278 - Spinda](#spinda)|[279 - Wingull](#wingull)|[280 - Armaldo](#armaldo)|
|[281 - Ralts](#ralts)|[282 - Kirlia](#kirlia)|[283 - Pelipper](#pelipper)|[284 - Surskit](#surskit)|
|[285 - Swellow](#swellow)|[286 - Shroomish](#shroomish)|[287 - Roselia](#roselia)|[288 - Slakoth](#slakoth)|
|[289 - Vigoroth](#vigoroth)|[290 - Shiftry](#shiftry)|[291 - Nincada](#nincada)|[292 - Ninjask](#ninjask)|
|[293 - Tropius](#tropius)|[294 - Whismur](#whismur)|[295 - Loudred](#loudred)|[296 - Flygon](#flygon)|
|[297 - Makuhita](#makuhita)|[298 - Solrock](#solrock)|[299 - Claydol](#claydol)|[300 - Wailord](#wailord)|
|[301 - Skitty](#skitty)|[302 - Torkoal](#torkoal)|[303 - Minun](#minun)|[304 - Relicanth](#relicanth)|
|[305 - Aron](#aron)|[306 - Lairon](#lairon)|[307 - Mawile](#mawile)|[308 - Meditite](#meditite)|
|[309 - Hariyama](#hariyama)|[310 - Electrike](#electrike)|[311 - Grumpig](#grumpig)|[312 - Plusle](#plusle)|
|[313 - Castform](#castform)|[314 - Volbeat](#volbeat)|[315 - Dusclops](#dusclops)|[316 - Slaking](#slaking)|
|[317 - Gulpin](#gulpin)|[318 - Milotic](#milotic)|[319 - Carvanha](#carvanha)|[320 - Masquerain](#masquerain)|
|[321 - Wailmer](#wailmer)|[322 - Manectric](#manectric)|[323 - Numel](#numel)|[324 - Nosepass](#nosepass)|
|[325 - Azurill](#azurill)|[326 - Spoink](#spoink)|[327 - Breloom](#breloom)|[328 - Sharpedo](#sharpedo)|
|[329 - Trapinch](#trapinch)|[330 - Vibrava](#vibrava)|[331 - Walrein](#walrein)|[332 - Cacnea](#cacnea)|
|[333 - Medicham](#medicham)|[334 - Swablu](#swablu)|[335 - Seviper](#seviper)|[336 - Banette](#banette)|
|[337 - Glalie](#glalie)|[338 - Lunatone](#lunatone)|[339 - Sableye](#sableye)|[340 - Barboach](#barboach)|
|[341 - Luvdisc](#luvdisc)|[342 - Corphish](#corphish)|[343 - Kecleon](#kecleon)|[344 - Baltoy](#baltoy)|
|[345 - Illumise](#illumise)|[346 - Lileep](#lileep)|[347 - Cradily](#cradily)|[348 - Anorith](#anorith)|
|[349 - Crawdaunt](#crawdaunt)|[350 - Feebas](#feebas)|[351 - Aggron](#aggron)|[352 - Delcatty](#delcatty)|
|[353 - Absol](#absol)|[354 - Shuppet](#shuppet)|[355 - Wynaut](#wynaut)|[356 - Duskull](#duskull)|
|[357 - Swalot](#swalot)|[358 - Deoxys](#deoxys)|[359 - Gorebyss](#gorebyss)|[360 - Altaria](#altaria)|
|[361 - Cacturne](#cacturne)|[362 - Snorunt](#snorunt)|[363 - Camerupt](#camerupt)|[364 - Spheal](#spheal)|
|[365 - Sealeo](#sealeo)|[366 - Exploud](#exploud)|[367 - Clamperl](#clamperl)|[368 - Huntail](#huntail)|
|[369 - Zangoose](#zangoose)|[370 - Whiscash](#whiscash)|[371 - Gardevoir](#gardevoir)|[372 - Bagon](#bagon)|
|[373 - Shelgon](#shelgon)|[374 - Salamence](#salamence)|[375 - Beldum](#beldum)|[376 - Metang](#metang)|
|[377 - Metagross](#metagross)|[378 - Regirock](#regirock)|[379 - Regice](#regice)|[380 - Rayquaza](#rayquaza)|
|[382 - Registeel](#registeel)|[383 - Kyogre](#kyogre)|[384 - Groudon](#groudon)|[385 - MissingNo.](#missingno.)|
|[386 - Jirachi](#jirachi)|[387 - Celebi](#celebi)| | |

## Chimecho
ID: 000

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Wrap|Normal *(Physical)*|15|90|20|
|6|Growl|Normal *(Physical)*|0|100|40|
|9|Astonish|Ghost *(Physical)*|30|100|15|
|14|Confusion|Psychic *(Special)*|50|100|25|
|17|Uproar|Normal *(Physical)*|50|100|10|
|22|Take Down|Normal *(Physical)*|90|85|20|
|25|Yawn|Normal *(Physical)*|0|100|10|
|30|Psywave|Psychic *(Special)*|1|100|15|
|33|Double-Edge|Normal *(Physical)*|120|100|15|
|38|Heal Bell|Normal *(Physical)*|0|0|5|
|41|Safeguard|Normal *(Physical)*|0|0|25|
|46|Extrasensory|Psychic *(Special)*|80|100|20|
|49|Heal Pulse|Psychic *(Special)*|0|0|10|
|54|Psychic|Psychic *(Special)*|90|100|10|
|57|Healing Wish|Psychic *(Special)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Latias
ID: 000

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Psywave|Psychic *(Special)*|1|100|15|
|5|Wish|Normal *(Physical)*|0|100|10|
|10|Helping Hand|Normal *(Physical)*|0|100|20|
|15|Safeguard|Normal *(Physical)*|0|0|25|
|20|Dragonbreath|Dragon *(Special)*|60|100|20|
|25|Water Sport|Water *(Special)*|0|100|15|
|30|Refresh|Normal *(Physical)*|0|100|20|
|35|Mist Ball|Psychic *(Special)*|70|100|5|
|40|Zen Headbutt|Psychic *(Special)*|80|100|15|
|45|Recover|Normal *(Physical)*|0|0|10|
|50|Charm|23 *(Physical)*|0|100|20|
|55|Psychic|Psychic *(Special)*|90|100|10|
|60|Heal Pulse|Psychic *(Special)*|0|0|10|
|65|Magic Coat|Psychic *(Special)*|0|100|15|
|70|Dragon Pulse|Dragon *(Special)*|90|100|10|
|75|Healing Wish|Psychic *(Special)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM50|Overheat|Fire *(Special)*|130|90|5|

## Bulbasaur
ID: 002

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 16|[Ivysaur](#ivysaur)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|7|Leech Seed|Grass *(Special)*|0|90|10|
|9|Vine Whip|Grass *(Special)*|40|100|25|
|13|Poisonpowder|Poison *(Physical)*|0|75|35|
|13|Sleep Powder|Grass *(Special)*|0|75|15|
|15|Take Down|Normal *(Physical)*|90|85|20|
|19|Razor Leaf|Grass *(Special)*|55|95|25|
|21|Sweet Scent|Normal *(Physical)*|0|100|20|
|25|Growth|Normal *(Physical)*|0|0|40|
|27|Double-Edge|Normal *(Physical)*|120|100|15|
|31|Worry Seed|Grass *(Special)*|0|100|10|
|33|Synthesis|Grass *(Special)*|0|0|5|
|37|Seed Bomb|Grass *(Special)*|80|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Ivysaur
ID: 003

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 32|[Venusaur](#venusaur)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Leech Seed|Grass *(Special)*|0|90|10|
|3|Growl|Normal *(Physical)*|0|100|40|
|7|Leech Seed|Grass *(Special)*|0|90|10|
|9|Vine Whip|Grass *(Special)*|40|100|25|
|13|Poisonpowder|Poison *(Physical)*|0|75|35|
|13|Sleep Powder|Grass *(Special)*|0|75|15|
|15|Take Down|Normal *(Physical)*|90|85|20|
|20|Razor Leaf|Grass *(Special)*|55|95|25|
|23|Sweet Scent|Normal *(Physical)*|0|100|20|
|28|Growth|Normal *(Physical)*|0|0|40|
|31|Double-Edge|Normal *(Physical)*|120|100|15|
|36|Worry Seed|Grass *(Special)*|0|100|10|
|39|Synthesis|Grass *(Special)*|0|0|5|
|44|Solarbeam|Grass *(Special)*|120|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Venusaur
ID: 004

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Power Whip|Grass *(Special)*|120|85|10|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Leech Seed|Grass *(Special)*|0|90|10|
|1|Vine Whip|Grass *(Special)*|40|100|25|
|3|Growl|Normal *(Physical)*|0|100|40|
|7|Leech Seed|Grass *(Special)*|0|90|10|
|9|Vine Whip|Grass *(Special)*|40|100|25|
|13|Poisonpowder|Poison *(Physical)*|0|75|35|
|13|Sleep Powder|Grass *(Special)*|0|75|15|
|15|Take Down|Normal *(Physical)*|90|85|20|
|20|Razor Leaf|Grass *(Special)*|55|95|25|
|23|Sweet Scent|Normal *(Physical)*|0|100|20|
|28|Growth|Normal *(Physical)*|0|0|40|
|31|Double-Edge|Normal *(Physical)*|120|100|15|
|32|Petal Dance|Grass *(Special)*|120|100|10|
|39|Worry Seed|Grass *(Special)*|0|100|10|
|45|Synthesis|Grass *(Special)*|0|0|5|
|53|Solarbeam|Grass *(Special)*|120|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Charmander
ID: 005

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 16|[Charmeleon](#charmeleon)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|7|Ember|Fire *(Special)*|40|100|25|
|10|Smokescreen|Normal *(Physical)*|0|100|20|
|16|Metal Claw|Steel *(Physical)*|50|95|35|
|19|Scary Face|Normal *(Physical)*|0|90|10|
|25|Fire Fang|Fire *(Special)*|65|95|15|
|28|Flame Burst|Fire *(Special)*|70|100|15|
|34|Slash|Normal *(Physical)*|70|100|20|
|37|Flamethrower|Fire *(Special)*|90|100|15|
|43|Fire Spin|Fire *(Special)*|35|85|15|
|46|Inferno|Fire *(Special)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Charmeleon
ID: 006

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 36|[Charizard](#charizard)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Ember|Fire *(Special)*|40|100|25|
|7|Ember|Fire *(Special)*|40|100|25|
|10|Smokescreen|Normal *(Physical)*|0|100|20|
|17|Metal Claw|Steel *(Physical)*|50|95|35|
|21|Scary Face|Normal *(Physical)*|0|90|10|
|28|Fire Fang|Fire *(Special)*|65|95|15|
|32|Flame Burst|Fire *(Special)*|70|100|15|
|39|Slash|Normal *(Physical)*|70|100|20|
|43|Flamethrower|Fire *(Special)*|90|100|15|
|50|Fire Spin|Fire *(Special)*|35|85|15|
|54|Inferno|Fire *(Special)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Charizard
ID: 007

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Shadow Claw|Ghost *(Physical)*|70|100|15|
|1|Dragon Claw|Dragon *(Special)*|80|100|15|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Ember|Fire *(Special)*|40|100|25|
|1|Smokescreen|Normal *(Physical)*|0|100|20|
|7|Ember|Fire *(Special)*|40|100|25|
|10|Smokescreen|Normal *(Physical)*|0|100|20|
|17|Dragon Rage|Dragon *(Special)*|1|100|10|
|21|Scary Face|Normal *(Physical)*|0|90|10|
|28|Fire Fang|Fire *(Special)*|65|95|15|
|32|Flame Burst|Fire *(Special)*|70|100|15|
|36|Wing Attack|Flying *(Physical)*|60|100|35|
|41|Slash|Normal *(Physical)*|70|100|20|
|47|Flamethrower|Fire *(Special)*|90|100|15|
|56|Air Slash|Flying *(Physical)*|75|95|15|
|62|Fire Spin|Fire *(Special)*|35|85|15|
|71|Inferno|Fire *(Special)*|100|50|5|
|77|Heat Wave|Fire *(Special)*|100|90|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Squirtle
ID: 008

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 16|[Wartortle](#wartortle)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|4|Tail Whip|Normal *(Physical)*|0|100|30|
|7|Bubble|Water *(Special)*|30|100|30|
|10|Withdraw|Water *(Special)*|0|0|40|
|13|Water Gun|Water *(Special)*|40|100|25|
|16|Bite|Dark *(Special)*|60|100|25|
|19|Rapid Spin|Normal *(Physical)*|20|100|40|
|22|Protect|Normal *(Physical)*|0|0|10|
|25|Water Pulse|Water *(Special)*|60|100|20|
|28|Aqua Tail|Water *(Special)*|90|90|10|
|31|Skull Bash|Normal *(Physical)*|130|100|10|
|34|Iron Defense|Steel *(Physical)*|0|0|15|
|37|Rain Dance|Water *(Special)*|0|0|5|
|40|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Wartortle
ID: 009

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 36|[Blastoise](#blastoise)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Bubble|Water *(Special)*|30|100|30|
|4|Tail Whip|Normal *(Physical)*|0|100|30|
|7|Bubble|Water *(Special)*|30|100|30|
|10|Withdraw|Water *(Special)*|0|0|40|
|13|Water Gun|Water *(Special)*|40|100|25|
|16|Bite|Dark *(Special)*|60|100|25|
|20|Rapid Spin|Normal *(Physical)*|20|100|40|
|24|Protect|Normal *(Physical)*|0|0|10|
|28|Water Pulse|Water *(Special)*|60|100|20|
|32|Aqua Tail|Water *(Special)*|90|90|10|
|36|Skull Bash|Normal *(Physical)*|130|100|10|
|40|Iron Defense|Steel *(Physical)*|0|0|15|
|44|Rain Dance|Water *(Special)*|0|0|5|
|48|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Blastoise
ID: 010

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Shell Smash|Normal *(Physical)*|0|0|15|
|1|Flash Cannon|Steel *(Physical)*|80|100|10|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Bubble|Water *(Special)*|30|100|30|
|1|Withdraw|Water *(Special)*|0|0|40|
|4|Tail Whip|Normal *(Physical)*|0|100|30|
|7|Bubble|Water *(Special)*|30|100|30|
|10|Withdraw|Water *(Special)*|0|0|40|
|13|Water Gun|Water *(Special)*|40|100|25|
|16|Bite|Dark *(Special)*|60|100|25|
|20|Rapid Spin|Normal *(Physical)*|20|100|40|
|24|Protect|Normal *(Physical)*|0|0|10|
|28|Water Pulse|Water *(Special)*|60|100|20|
|32|Aqua Tail|Water *(Special)*|90|90|10|
|39|Skull Bash|Normal *(Physical)*|130|100|10|
|46|Iron Defense|Steel *(Physical)*|0|0|15|
|53|Rain Dance|Water *(Special)*|0|0|5|
|60|Hydro Pump|Water *(Special)*|110|80|5|

## Caterpie
ID: 011

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 7|[Metapod](#metapod)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|String Shot|Bug *(Physical)*|0|95|40|
|15|Bug Bite|Bug *(Physical)*|60|100|20|

## Metapod
ID: 012

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 10|[Butterfree](#butterfree)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Harden|Normal *(Physical)*|0|0|30|
|7|Harden|Normal *(Physical)*|0|0|30|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Butterfree
ID: 013

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Confusion|Psychic *(Special)*|50|100|25|
|10|Confusion|Psychic *(Special)*|50|100|25|
|12|Poisonpowder|Poison *(Physical)*|0|75|35|
|12|Stun Spore|Grass *(Special)*|0|75|30|
|12|Sleep Powder|Grass *(Special)*|0|75|15|
|16|Gust|Flying *(Physical)*|40|100|35|
|18|Supersonic|Normal *(Physical)*|0|55|20|
|22|Whirlwind|Normal *(Physical)*|0|100|20|
|24|Psybeam|Psychic *(Special)*|65|100|20|
|28|Silver Wind|Bug *(Physical)*|60|100|5|
|30|Roost|Flying *(Physical)*|0|0|10|
|34|Rage Powder|Bug *(Physical)*|0|100|20|
|36|Safeguard|Normal *(Physical)*|0|0|25|
|40|Attract|Normal *(Physical)*|0|100|15|
|42|Bug Buzz|Bug *(Physical)*|90|100|10|
|46|Quiver Dance|Bug *(Physical)*|0|0|20|

## Weedle
ID: 014

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 7|[Kakuna](#kakuna)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Poison Sting|Poison *(Physical)*|15|100|35|
|1|String Shot|Bug *(Physical)*|0|95|40|
|15|Bug Bite|Bug *(Physical)*|60|100|20|

## Kakuna
ID: 015

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 10|[Beedrill](#beedrill)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Harden|Normal *(Physical)*|0|0|30|
|7|Harden|Normal *(Physical)*|0|0|30|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Beedrill
ID: 016

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Fury Attack|Normal *(Physical)*|15|85|20|
|10|Fury Attack|Normal *(Physical)*|15|85|20|
|13|Focus Energy|Normal *(Physical)*|0|0|30|
|16|Twineedle|Bug *(Physical)*|25|100|20|
|19|Rage|Normal *(Physical)*|20|100|20|
|22|Pursuit|Dark *(Special)*|40|100|20|
|25|Toxic Spikes|Poison *(Physical)*|0|0|20|
|28|Pin Missile|Bug *(Physical)*|25|95|20|
|31|Agility|Psychic *(Special)*|0|0|30|
|34|Drill Run|Ground *(Physical)*|80|100|10|
|37|Poison Jab|Poison *(Physical)*|80|100|20|
|40|Endeavor|Normal *(Physical)*|1|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|

## Pidgey
ID: 017

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 18|[Pidgeotto](#pidgeotto)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|5|Sand-Attack|Ground *(Physical)*|0|100|15|
|9|Gust|Flying *(Physical)*|40|100|35|
|13|Quick Attack|Normal *(Physical)*|40|100|30|
|17|Whirlwind|Normal *(Physical)*|0|100|20|
|21|Twister|Dragon *(Special)*|40|100|20|
|25|Featherdance|Flying *(Physical)*|0|100|15|
|29|Agility|Psychic *(Special)*|0|0|30|
|33|Wing Attack|Flying *(Physical)*|60|100|35|
|37|Roost|Flying *(Physical)*|0|0|10|
|41|Mirror Move|Flying *(Physical)*|0|0|20|
|45|Air Slash|Flying *(Physical)*|75|95|15|
|49|Hurricane|Flying *(Physical)*|110|70|10|
|53|Brave Bird|Flying *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|

## Pidgeotto
ID: 018

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 36|[Pidgeot](#pidgeot)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Sand-Attack|Ground *(Physical)*|0|100|15|
|1|Gust|Flying *(Physical)*|40|100|35|
|5|Sand-Attack|Ground *(Physical)*|0|100|15|
|9|Gust|Flying *(Physical)*|40|100|35|
|13|Quick Attack|Normal *(Physical)*|40|100|30|
|17|Whirlwind|Normal *(Physical)*|0|100|20|
|22|Twister|Dragon *(Special)*|40|100|20|
|27|Featherdance|Flying *(Physical)*|0|100|15|
|32|Agility|Psychic *(Special)*|0|0|30|
|37|Wing Attack|Flying *(Physical)*|60|100|35|
|42|Roost|Flying *(Physical)*|0|0|10|
|47|Mirror Move|Flying *(Physical)*|0|0|20|
|52|Air Slash|Flying *(Physical)*|75|95|15|
|57|Hurricane|Flying *(Physical)*|110|70|10|
|62|Brave Bird|Flying *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|

## Pidgeot
ID: 019

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Sand-Attack|Ground *(Physical)*|0|100|15|
|1|Gust|Flying *(Physical)*|40|100|35|
|1|Quick Attack|Normal *(Physical)*|40|100|30|
|5|Sand-Attack|Ground *(Physical)*|0|100|15|
|9|Gust|Flying *(Physical)*|40|100|35|
|13|Quick Attack|Normal *(Physical)*|40|100|30|
|17|Whirlwind|Normal *(Physical)*|0|100|20|
|22|Twister|Dragon *(Special)*|40|100|20|
|27|Featherdance|Flying *(Physical)*|0|100|15|
|32|Agility|Psychic *(Special)*|0|0|30|
|38|Wing Attack|Flying *(Physical)*|60|100|35|
|44|Roost|Flying *(Physical)*|0|0|10|
|50|Mirror Move|Flying *(Physical)*|0|0|20|
|56|Air Slash|Flying *(Physical)*|75|95|15|
|62|Hurricane|Flying *(Physical)*|110|70|10|
|68|Brave Bird|Flying *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Rattata
ID: 020

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 20|[Raticate](#raticate)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|4|Quick Attack|Normal *(Physical)*|40|100|30|
|7|Focus Energy|Normal *(Physical)*|0|0|30|
|10|Bite|Dark *(Special)*|60|100|25|
|13|Pursuit|Dark *(Special)*|40|100|20|
|16|Hyper Fang|Normal *(Physical)*|80|90|15|
|19|Sucker Punch|Dark *(Special)*|80|100|5|
|22|Crunch|Dark *(Special)*|80|100|15|
|25|Assurance|Dark *(Special)*|60|100|10|
|28|Super Fang|Normal *(Physical)*|1|90|10|
|31|Double-Edge|Normal *(Physical)*|120|100|15|
|34|Endeavor|Normal *(Physical)*|1|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Raticate
ID: 021

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Swords Dance|Normal *(Physical)*|0|0|20|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Quick Attack|Normal *(Physical)*|40|100|30|
|1|Focus Energy|Normal *(Physical)*|0|0|30|
|4|Quick Attack|Normal *(Physical)*|40|100|30|
|7|Focus Energy|Normal *(Physical)*|0|0|30|
|10|Bite|Dark *(Special)*|60|100|25|
|13|Pursuit|Dark *(Special)*|40|100|20|
|16|Hyper Fang|Normal *(Physical)*|80|90|15|
|19|Sucker Punch|Dark *(Special)*|80|100|5|
|20|Scary Face|Normal *(Physical)*|0|90|10|
|24|Crunch|Dark *(Special)*|80|100|15|
|29|Assurance|Dark *(Special)*|60|100|10|
|34|Super Fang|Normal *(Physical)*|1|90|10|
|39|Double-Edge|Normal *(Physical)*|120|100|15|
|44|Endeavor|Normal *(Physical)*|1|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|

## Spearow
ID: 022

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 20|[Fearow](#fearow)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|5|Leer|Normal *(Physical)*|0|100|30|
|9|Fury Attack|Normal *(Physical)*|15|85|20|
|13|Pursuit|Dark *(Special)*|40|100|20|
|17|Aerial Ace|Flying *(Physical)*|60|0|20|
|21|Mirror Move|Flying *(Physical)*|0|0|20|
|25|Agility|Psychic *(Special)*|0|0|30|
|29|Assurance|Dark *(Special)*|60|100|10|
|33|Roost|Flying *(Physical)*|0|0|10|
|37|Drill Peck|Flying *(Physical)*|80|100|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|

## Fearow
ID: 023

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Pluck|Flying *(Physical)*|60|100|20|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Fury Attack|Normal *(Physical)*|15|85|20|
|5|Leer|Normal *(Physical)*|0|100|30|
|9|Fury Attack|Normal *(Physical)*|15|85|20|
|13|Pursuit|Dark *(Special)*|40|100|20|
|17|Aerial Ace|Flying *(Physical)*|60|0|20|
|23|Mirror Move|Flying *(Physical)*|0|0|20|
|29|Agility|Psychic *(Special)*|0|0|30|
|35|Assurance|Dark *(Special)*|60|100|10|
|41|Roost|Flying *(Physical)*|0|0|10|
|47|Drill Peck|Flying *(Physical)*|80|100|20|
|53|Drill Run|Ground *(Physical)*|80|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|

## Ekans
ID: 024

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 22|[Arbok](#arbok)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Wrap|Normal *(Physical)*|15|90|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|4|Poison Sting|Poison *(Physical)*|15|100|35|
|9|Bite|Dark *(Special)*|60|100|25|
|12|Glare|Normal *(Physical)*|0|100|30|
|17|Screech|Normal *(Physical)*|0|85|40|
|20|Acid|Poison *(Physical)*|50|100|30|
|25|Stockpile|Normal *(Physical)*|0|0|10|
|25|Swallow|Normal *(Physical)*|0|0|10|
|25|Spit Up|Normal *(Physical)*|100|100|10|
|28|Acid Spray|Poison *(Physical)*|40|100|20|
|33|Mud Bomb|Ground *(Physical)*|65|85|10|
|36|Poison Fang|Poison *(Physical)*|50|100|15|
|41|Haze|Ice *(Special)*|0|0|30|
|44|Coil|Poison *(Physical)*|0|0|20|
|49|Gunk Shot|Poison *(Physical)*|120|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|

## Arbok
ID: 025

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Ice Fang|Ice *(Special)*|65|95|15|
|1|Thunder Fang|Electric *(Special)*|65|95|15|
|1|Fire Fang|Fire *(Special)*|65|95|15|
|1|Wrap|Normal *(Physical)*|15|90|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Poison Sting|Poison *(Physical)*|15|100|35|
|1|Bite|Dark *(Special)*|60|100|25|
|4|Poison Sting|Poison *(Physical)*|15|100|35|
|9|Bite|Dark *(Special)*|60|100|25|
|12|Glare|Normal *(Physical)*|0|100|30|
|17|Screech|Normal *(Physical)*|0|85|40|
|20|Acid|Poison *(Physical)*|50|100|30|
|22|Crunch|Dark *(Special)*|80|100|15|
|27|Stockpile|Normal *(Physical)*|0|0|10|
|27|Swallow|Normal *(Physical)*|0|0|10|
|27|Spit Up|Normal *(Physical)*|100|100|10|
|32|Acid Spray|Poison *(Physical)*|40|100|20|
|39|Mud Bomb|Ground *(Physical)*|65|85|10|
|44|Poison Fang|Poison *(Physical)*|50|100|15|
|51|Haze|Ice *(Special)*|0|0|30|
|56|Coil|Poison *(Physical)*|0|0|20|
|63|Gunk Shot|Poison *(Physical)*|120|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Pikachu
ID: 026

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 96|[Raichu](#raichu)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Thundershock|Electric *(Special)*|40|100|30|
|5|Tail Whip|Normal *(Physical)*|0|100|30|
|10|Thunder Wave|Electric *(Special)*|0|100|20|
|13|Quick Attack|Normal *(Physical)*|40|100|30|
|18|Double Team|Normal *(Physical)*|0|0|15|
|21|Slam|Normal *(Physical)*|80|75|20|
|26|Thunderbolt|Electric *(Special)*|90|100|15|
|29|Fake Out|Normal *(Physical)*|40|100|10|
|34|Agility|Psychic *(Special)*|0|0|30|
|37|Discharge|Electric *(Special)*|80|100|15|
|42|Light Screen|Psychic *(Special)*|0|0|30|
|45|Thunder|Electric *(Special)*|110|70|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Raichu
ID: 027

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Thundershock|Electric *(Special)*|40|100|30|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Quick Attack|Normal *(Physical)*|40|100|30|
|1|Thunderbolt|Electric *(Special)*|90|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Sandshrew
ID: 028

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 22|[Sandslash](#sandslash)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|3|Sand-Attack|Ground *(Physical)*|0|100|15|
|5|Poison Sting|Poison *(Physical)*|15|100|35|
|7|Rollout|Rock *(Physical)*|30|90|20|
|9|Rapid Spin|Normal *(Physical)*|20|100|40|
|11|Swift|Normal *(Physical)*|60|0|20|
|14|Fury Cutter|Bug *(Physical)*|40|95|20|
|17|Magnitude|Ground *(Physical)*|1|100|30|
|20|Fury Swipes|Normal *(Physical)*|18|80|15|
|23|Sand Tomb|Ground *(Physical)*|35|85|15|
|26|Slash|Normal *(Physical)*|70|100|20|
|30|Dig|Ground *(Physical)*|80|100|10|
|34|Metal Claw|Steel *(Physical)*|50|95|35|
|38|Swords Dance|Normal *(Physical)*|0|0|20|
|42|Sandstorm|Rock *(Physical)*|0|0|10|
|46|Earthquake|Ground *(Physical)*|100|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Sandslash
ID: 029

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|1|Sand-Attack|Ground *(Physical)*|0|100|15|
|1|Poison Sting|Poison *(Physical)*|15|100|35|
|3|Sand-Attack|Ground *(Physical)*|0|100|15|
|5|Poison Sting|Poison *(Physical)*|15|100|35|
|7|Rollout|Rock *(Physical)*|30|90|20|
|9|Rapid Spin|Normal *(Physical)*|20|100|40|
|11|Swift|Normal *(Physical)*|60|0|20|
|14|Fury Cutter|Bug *(Physical)*|40|95|20|
|17|Magnitude|Ground *(Physical)*|1|100|30|
|20|Fury Swipes|Normal *(Physical)*|18|80|15|
|22|Crush Claw|Normal *(Physical)*|75|95|10|
|26|Sand Tomb|Ground *(Physical)*|35|85|15|
|30|Slash|Normal *(Physical)*|70|100|20|
|34|Dig|Ground *(Physical)*|80|100|10|
|38|Metal Claw|Steel *(Physical)*|50|95|35|
|42|Swords Dance|Normal *(Physical)*|0|0|20|
|46|Sandstorm|Rock *(Physical)*|0|0|10|
|50|Earthquake|Ground *(Physical)*|100|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Nidoran\sf
ID: 030

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 16|[Nidorina](#nidorina)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Scratch|Normal *(Physical)*|40|100|35|
|7|Tail Whip|Normal *(Physical)*|0|100|30|
|9|Double Kick|Fight *(Physical)*|30|100|30|
|13|Poison Sting|Poison *(Physical)*|15|100|35|
|19|Fury Swipes|Normal *(Physical)*|18|80|15|
|21|Bite|Dark *(Special)*|60|100|25|
|25|Helping Hand|Normal *(Physical)*|0|100|20|
|31|Toxic Spikes|Poison *(Physical)*|0|0|20|
|33|Flatter|Dark *(Special)*|0|100|15|
|37|Crunch|Dark *(Special)*|80|100|15|
|43|Attract|Normal *(Physical)*|0|100|15|
|45|Poison Fang|Poison *(Physical)*|50|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Nidorina
ID: 031

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 94|[Nidoqueen](#nidoqueen)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Scratch|Normal *(Physical)*|40|100|35|
|7|Tail Whip|Normal *(Physical)*|0|100|30|
|9|Double Kick|Fight *(Physical)*|30|100|30|
|13|Poison Sting|Poison *(Physical)*|15|100|35|
|20|Fury Swipes|Normal *(Physical)*|18|80|15|
|23|Bite|Dark *(Special)*|60|100|25|
|28|Helping Hand|Normal *(Physical)*|0|100|20|
|35|Toxic Spikes|Poison *(Physical)*|0|0|20|
|38|Flatter|Dark *(Special)*|0|100|15|
|43|Crunch|Dark *(Special)*|80|100|15|
|50|Attract|Normal *(Physical)*|0|100|15|
|58|Poison Fang|Poison *(Physical)*|50|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Nidoqueen
ID: 032

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Double Kick|Fight *(Physical)*|30|100|30|
|1|Poison Sting|Poison *(Physical)*|15|100|35|
|23|Super Fang|Normal *(Physical)*|1|90|10|
|35|Body Slam|Normal *(Physical)*|85|100|15|
|43|Earth Power|Ground *(Physical)*|90|100|10|
|58|Superpower|Fight *(Physical)*|120|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Nidoran\sm
ID: 033

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 16|[Nidorino](#nidorino)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Peck|Flying *(Physical)*|35|100|35|
|7|Focus Energy|Normal *(Physical)*|0|0|30|
|9|Double Kick|Fight *(Physical)*|30|100|30|
|13|Poison Sting|Poison *(Physical)*|15|100|35|
|19|Fury Attack|Normal *(Physical)*|15|85|20|
|21|Horn Attack|Normal *(Physical)*|65|100|25|
|25|Helping Hand|Normal *(Physical)*|0|100|20|
|31|Toxic Spikes|Poison *(Physical)*|0|0|20|
|33|Flatter|Dark *(Special)*|0|100|15|
|37|Poison Jab|Poison *(Physical)*|80|100|20|
|43|Attract|Normal *(Physical)*|0|100|15|
|45|Horn Drill|Normal *(Physical)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Nidorino
ID: 034

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 94|[Nidoking](#nidoking)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Peck|Flying *(Physical)*|35|100|35|
|7|Focus Energy|Normal *(Physical)*|0|0|30|
|9|Double Kick|Fight *(Physical)*|30|100|30|
|13|Poison Sting|Poison *(Physical)*|15|100|35|
|20|Fury Attack|Normal *(Physical)*|15|85|20|
|23|Horn Attack|Normal *(Physical)*|65|100|25|
|28|Helping Hand|Normal *(Physical)*|0|100|20|
|35|Toxic Spikes|Poison *(Physical)*|0|0|20|
|38|Flatter|Dark *(Special)*|0|100|15|
|43|Poison Jab|Poison *(Physical)*|80|100|20|
|50|Attract|Normal *(Physical)*|0|100|15|
|58|Horn Drill|Normal *(Physical)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Nidoking
ID: 035

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Focus Energy|Normal *(Physical)*|0|0|30|
|1|Double Kick|Fight *(Physical)*|30|100|30|
|1|Poison Sting|Poison *(Physical)*|15|100|35|
|23|Poison Tail|Poison *(Physical)*|50|100|25|
|35|Thrash|Normal *(Physical)*|120|100|20|
|43|Earth Power|Ground *(Physical)*|90|100|10|
|58|Megahorn|Bug *(Physical)*|120|85|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Clefairy
ID: 036

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 94|[Clefable](#clefable)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Pound|Normal *(Physical)*|40|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|4|Encore|Normal *(Physical)*|0|100|5|
|7|Sing|Normal *(Physical)*|0|55|15|
|10|Doubleslap|Normal *(Physical)*|15|85|10|
|13|Defense Curl|Normal *(Physical)*|0|0|40|
|16|Follow Me|Normal *(Physical)*|0|100|20|
|19|Minimize|Normal *(Physical)*|0|0|10|
|22|Wake-Up Slap|Fight *(Physical)*|70|100|10|
|25|Cosmic Power|Psychic *(Special)*|0|0|20|
|28|Stored Power|Psychic *(Special)*|20|100|10|
|31|Metronome|Normal *(Physical)*|0|0|10|
|34|Moonlight|23 *(Physical)*|0|0|5|
|37|Moonblast|23 *(Physical)*|95|100|40|
|40|Aromatherapy|Grass *(Special)*|0|0|5|
|43|Meteor Mash|Steel *(Physical)*|90|90|10|
|46|Lunar Dance|Psychic *(Special)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Clefable
ID: 037

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Heal Bell|Normal *(Physical)*|0|0|5|
|1|Sing|Normal *(Physical)*|0|55|15|
|1|Doubleslap|Normal *(Physical)*|15|85|10|
|1|Minimize|Normal *(Physical)*|0|0|10|
|1|Metronome|Normal *(Physical)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|

## Vulpix
ID: 038

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 95|[Ninetales](#ninetales)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Ember|Fire *(Special)*|40|100|25|
|4|Tail Whip|Normal *(Physical)*|0|100|30|
|7|Roar|Normal *(Physical)*|0|100|20|
|10|Quick Attack|Normal *(Physical)*|40|100|30|
|12|Fire Spin|Fire *(Special)*|35|85|15|
|15|Confuse Ray|Ghost *(Physical)*|0|100|10|
|18|Imprison|Psychic *(Special)*|0|100|10|
|20|Feint Attack|Dark *(Special)*|60|0|20|
|23|Flame Burst|Fire *(Special)*|70|100|15|
|26|Will-O-Wisp|Fire *(Special)*|0|85|15|
|28|Hex|Ghost *(Physical)*|65|100|10|
|31|Dark Pulse|Dark *(Special)*|80|100|15|
|34|Flamethrower|Fire *(Special)*|90|100|15|
|36|Safeguard|Normal *(Physical)*|0|0|25|
|39|Extrasensory|Psychic *(Special)*|80|100|20|
|42|Fire Blast|Fire *(Special)*|110|85|5|
|44|Grudge|Ghost *(Physical)*|0|100|5|
|47|Attract|Normal *(Physical)*|0|100|15|
|50|Inferno|Fire *(Special)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|

## Ninetales
ID: 039

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Nasty Plot|Dark *(Special)*|0|0|20|
|1|Ember|Fire *(Special)*|40|100|25|
|1|Quick Attack|Normal *(Physical)*|40|100|30|
|1|Confuse Ray|Ghost *(Physical)*|0|100|10|
|1|Safeguard|Normal *(Physical)*|0|0|25|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Jigglypuff
ID: 040

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 94|[Wigglytuff](#wigglytuff)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Sing|Normal *(Physical)*|0|55|15|
|5|Defense Curl|Normal *(Physical)*|0|0|40|
|9|Pound|Normal *(Physical)*|40|100|35|
|13|Disable|Normal *(Physical)*|0|100|20|
|17|Rollout|Rock *(Physical)*|30|90|20|
|21|Doubleslap|Normal *(Physical)*|15|85|10|
|25|Rest|Psychic *(Special)*|0|0|10|
|29|Body Slam|Normal *(Physical)*|85|100|15|
|33|Wake-Up Slap|Fight *(Physical)*|70|100|10|
|37|Charming Cry|23 *(Physical)*|60|0|20|
|41|Mimic|Normal *(Physical)*|0|100|10|
|45|Hyper Voice|Normal *(Physical)*|90|100|10|
|49|Double-Edge|Normal *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Wigglytuff
ID: 041

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Sing|Normal *(Physical)*|0|55|15|
|1|Disable|Normal *(Physical)*|0|100|20|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|1|Doubleslap|Normal *(Physical)*|15|85|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|TM49|Snatch|Dark *(Special)*|0|100|10|

## Zubat
ID: 042

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 22|[Golbat](#golbat)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Leech Life|Bug *(Physical)*|20|100|15|
|4|Supersonic|Normal *(Physical)*|0|55|20|
|8|Astonish|Ghost *(Physical)*|30|100|15|
|12|Bite|Dark *(Special)*|60|100|25|
|15|Wing Attack|Flying *(Physical)*|60|100|35|
|19|Confuse Ray|Ghost *(Physical)*|0|100|10|
|23|Swift|Normal *(Physical)*|60|0|20|
|26|Air Cutter|Flying *(Physical)*|60|95|25|
|30|Acrobatics|Flying *(Physical)*|55|100|15|
|34|Mean Look|Normal *(Physical)*|0|100|5|
|37|Poison Fang|Poison *(Physical)*|50|100|15|
|41|Haze|Ice *(Special)*|0|0|30|
|45|Air Slash|Flying *(Physical)*|75|95|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|TM49|Snatch|Dark *(Special)*|0|100|10|

## Golbat
ID: 043

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Happiness 0|[Crobat](#crobat)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Screech|Normal *(Physical)*|0|85|40|
|1|Leech Life|Bug *(Physical)*|20|100|15|
|1|Supersonic|Normal *(Physical)*|0|55|20|
|1|Astonish|Ghost *(Physical)*|30|100|15|
|4|Supersonic|Normal *(Physical)*|0|55|20|
|8|Astonish|Ghost *(Physical)*|30|100|15|
|12|Bite|Dark *(Special)*|60|100|25|
|15|Wing Attack|Flying *(Physical)*|60|100|35|
|19|Confuse Ray|Ghost *(Physical)*|0|100|10|
|24|Swift|Normal *(Physical)*|60|0|20|
|28|Air Cutter|Flying *(Physical)*|60|95|25|
|33|Acrobatics|Flying *(Physical)*|55|100|15|
|38|Mean Look|Normal *(Physical)*|0|100|5|
|42|Poison Fang|Poison *(Physical)*|50|100|15|
|47|Haze|Ice *(Special)*|0|0|30|
|52|Air Slash|Flying *(Physical)*|75|95|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Oddish
ID: 044

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 21|[Gloom](#gloom)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Absorb|Grass *(Special)*|20|100|20|
|5|Sweet Scent|Normal *(Physical)*|0|100|20|
|9|Acid|Poison *(Physical)*|50|100|30|
|13|Poisonpowder|Poison *(Physical)*|0|75|35|
|15|Stun Spore|Grass *(Special)*|0|75|30|
|17|Sleep Powder|Grass *(Special)*|0|75|15|
|21|Mega Drain|Grass *(Special)*|40|100|15|
|25|Teeter Dance|Normal *(Physical)*|0|100|20|
|29|Nature Power|Normal *(Physical)*|0|0|20|
|33|Charm|23 *(Physical)*|0|100|20|
|37|Moonlight|23 *(Physical)*|0|0|5|
|41|Giga Drain|Grass *(Special)*|75|100|10|
|45|Petal Dance|Grass *(Special)*|120|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Gloom
ID: 045

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 93|[Bellossom](#bellossom)|
|Stone 98|[Vileplume](#vileplume)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Absorb|Grass *(Special)*|20|100|20|
|1|Sweet Scent|Normal *(Physical)*|0|100|20|
|1|Acid|Poison *(Physical)*|50|100|30|
|5|Sweet Scent|Normal *(Physical)*|0|100|20|
|9|Acid|Poison *(Physical)*|50|100|30|
|13|Poisonpowder|Poison *(Physical)*|0|75|35|
|15|Stun Spore|Grass *(Special)*|0|75|30|
|17|Sleep Powder|Grass *(Special)*|0|75|15|
|23|Mega Drain|Grass *(Special)*|40|100|15|
|27|Teeter Dance|Normal *(Physical)*|0|100|20|
|31|Nature Power|Normal *(Physical)*|0|0|20|
|35|Charm|23 *(Physical)*|0|100|20|
|41|Moonlight|23 *(Physical)*|0|0|5|
|47|Giga Drain|Grass *(Special)*|75|100|10|
|53|Petal Dance|Grass *(Special)*|120|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Vileplume
ID: 046

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Giga Drain|Grass *(Special)*|75|100|10|
|1|Aromatherapy|Grass *(Special)*|0|0|5|
|1|Stun Spore|Grass *(Special)*|0|75|30|
|1|Poisonpowder|Poison *(Physical)*|0|75|35|
|53|Petal Dance|Grass *(Special)*|120|100|10|
|65|Solarbeam|Grass *(Special)*|120|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Paras
ID: 047

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 24|[Parasect](#parasect)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|6|Stun Spore|Grass *(Special)*|0|75|30|
|6|Poisonpowder|Poison *(Physical)*|0|75|35|
|11|Leech Life|Bug *(Physical)*|20|100|15|
|17|Fury Cutter|Bug *(Physical)*|40|95|20|
|22|Spore|Grass *(Special)*|0|100|15|
|27|Slash|Normal *(Physical)*|70|100|20|
|33|Growth|Normal *(Physical)*|0|0|40|
|38|Giga Drain|Grass *(Special)*|75|100|10|
|43|Aromatherapy|Grass *(Special)*|0|0|5|
|49|Rage Powder|Bug *(Physical)*|0|100|20|
|54|X-Scissor|Bug *(Physical)*|80|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Parasect
ID: 048

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Cross Poison|Poison *(Physical)*|70|100|20|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Stun Spore|Grass *(Special)*|0|75|30|
|1|Poisonpowder|Poison *(Physical)*|0|75|35|
|1|Leech Life|Bug *(Physical)*|20|100|15|
|6|Stun Spore|Grass *(Special)*|0|75|30|
|6|Poisonpowder|Poison *(Physical)*|0|75|35|
|11|Leech Life|Bug *(Physical)*|20|100|15|
|17|Fury Cutter|Bug *(Physical)*|40|95|20|
|22|Spore|Grass *(Special)*|0|100|15|
|29|Slash|Normal *(Physical)*|70|100|20|
|37|Growth|Normal *(Physical)*|0|0|40|
|44|Giga Drain|Grass *(Special)*|75|100|10|
|51|Aromatherapy|Grass *(Special)*|0|0|5|
|59|Rage Powder|Bug *(Physical)*|0|100|20|
|66|X-Scissor|Bug *(Physical)*|80|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Venonat
ID: 049

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 31|[Venomoth](#venomoth)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Disable|Normal *(Physical)*|0|100|20|
|1|Foresight|Normal *(Physical)*|0|100|40|
|5|Supersonic|Normal *(Physical)*|0|55|20|
|11|Confusion|Psychic *(Special)*|50|100|25|
|13|Poisonpowder|Poison *(Physical)*|0|75|35|
|17|Leech Life|Bug *(Physical)*|20|100|15|
|23|Stun Spore|Grass *(Special)*|0|75|30|
|25|Psybeam|Psychic *(Special)*|65|100|20|
|29|Sleep Powder|Grass *(Special)*|0|75|15|
|35|Signal Beam|Bug *(Physical)*|75|100|15|
|37|Zen Headbutt|Psychic *(Special)*|80|100|15|
|41|Poison Fang|Poison *(Physical)*|50|100|15|
|47|Psychic|Psychic *(Special)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Venomoth
ID: 050

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Silver Wind|Bug *(Physical)*|60|100|5|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Disable|Normal *(Physical)*|0|100|20|
|1|Foresight|Normal *(Physical)*|0|100|40|
|1|Supersonic|Normal *(Physical)*|0|55|20|
|5|Supersonic|Normal *(Physical)*|0|55|20|
|11|Confusion|Psychic *(Special)*|50|100|25|
|13|Poisonpowder|Poison *(Physical)*|0|75|35|
|17|Leech Life|Bug *(Physical)*|20|100|15|
|23|Stun Spore|Grass *(Special)*|0|75|30|
|25|Psybeam|Psychic *(Special)*|65|100|20|
|29|Sleep Powder|Grass *(Special)*|0|75|15|
|31|Gust|Flying *(Physical)*|40|100|35|
|37|Signal Beam|Bug *(Physical)*|75|100|15|
|41|Zen Headbutt|Psychic *(Special)*|80|100|15|
|47|Poison Fang|Poison *(Physical)*|50|100|15|
|55|Psychic|Psychic *(Special)*|90|100|10|
|59|Bug Buzz|Bug *(Physical)*|90|100|10|
|63|Quiver Dance|Bug *(Physical)*|0|0|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Diglett
ID: 051

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 26|[Dugtrio](#dugtrio)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Sand-Attack|Ground *(Physical)*|0|100|15|
|4|Growl|Normal *(Physical)*|0|100|40|
|7|Astonish|Ghost *(Physical)*|30|100|15|
|12|Mud-Slap|Ground *(Physical)*|20|100|10|
|15|Magnitude|Ground *(Physical)*|1|100|30|
|18|Bulldoze|Ground *(Physical)*|60|100|20|
|23|Sucker Punch|Dark *(Special)*|80|100|5|
|26|Mud Bomb|Ground *(Physical)*|65|85|10|
|29|Dig|Ground *(Physical)*|80|100|10|
|34|Earth Power|Ground *(Physical)*|90|100|10|
|37|Slash|Normal *(Physical)*|70|100|20|
|40|Earthquake|Ground *(Physical)*|100|100|10|
|45|Fissure|Ground *(Physical)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Dugtrio
ID: 052

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Night Slash|Dark *(Special)*|70|100|20|
|1|Tri Attack|Normal *(Physical)*|80|100|10|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Sand-Attack|Ground *(Physical)*|0|100|15|
|1|Rototiller|Ground *(Physical)*|0|0|10|
|4|Growl|Normal *(Physical)*|0|100|40|
|7|Astonish|Ghost *(Physical)*|30|100|15|
|12|Mud-Slap|Ground *(Physical)*|20|100|10|
|15|Magnitude|Ground *(Physical)*|1|100|30|
|18|Bulldoze|Ground *(Physical)*|60|100|20|
|23|Sucker Punch|Dark *(Special)*|80|100|5|
|26|Sand Tomb|Ground *(Physical)*|35|85|15|
|28|Mud Bomb|Ground *(Physical)*|65|85|10|
|33|Dig|Ground *(Physical)*|80|100|10|
|40|Earth Power|Ground *(Physical)*|90|100|10|
|45|Slash|Normal *(Physical)*|70|100|20|
|50|Earthquake|Ground *(Physical)*|100|100|10|
|57|Fissure|Ground *(Physical)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Meowth
ID: 053

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 28|[Persian](#persian)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|6|Bite|Dark *(Special)*|60|100|25|
|9|Fake Out|Normal *(Physical)*|40|100|10|
|14|Fury Swipes|Normal *(Physical)*|18|80|15|
|17|Screech|Normal *(Physical)*|0|85|40|
|22|Feint Attack|Dark *(Special)*|60|0|20|
|25|Taunt|Dark *(Special)*|0|100|20|
|30|Pay Day|Normal *(Physical)*|40|100|20|
|33|Slash|Normal *(Physical)*|70|100|20|
|38|Nasty Plot|Dark *(Special)*|0|0|20|
|41|Assurance|Dark *(Special)*|60|100|10|
|46|Night Slash|Dark *(Special)*|70|100|20|
|49|Hone Claws|Dark *(Special)*|0|0|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Persian
ID: 054

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Switcheroo|Dark *(Special)*|0|100|10|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Bite|Dark *(Special)*|60|100|25|
|1|Fake Out|Normal *(Physical)*|40|100|10|
|6|Bite|Dark *(Special)*|60|100|25|
|9|Fake Out|Normal *(Physical)*|40|100|10|
|14|Fury Swipes|Normal *(Physical)*|18|80|15|
|17|Screech|Normal *(Physical)*|0|85|40|
|22|Feint Attack|Dark *(Special)*|60|0|20|
|25|Taunt|Dark *(Special)*|0|100|20|
|28|Swift|Normal *(Physical)*|60|0|20|
|32|Power Gem|Rock *(Physical)*|80|100|20|
|37|Hypnosis|Psychic *(Special)*|0|60|20|
|44|Slash|Normal *(Physical)*|70|100|20|
|49|Nasty Plot|Dark *(Special)*|0|0|20|
|56|Assurance|Dark *(Special)*|60|100|10|
|61|Night Slash|Dark *(Special)*|70|100|20|
|68|Hone Claws|Dark *(Special)*|0|0|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Psyduck
ID: 055

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 33|[Golduck](#golduck)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Water Sport|Water *(Special)*|0|100|15|
|1|Scratch|Normal *(Physical)*|40|100|35|
|4|Tail Whip|Normal *(Physical)*|0|100|30|
|8|Water Gun|Water *(Special)*|40|100|25|
|11|Disable|Normal *(Physical)*|0|100|20|
|15|Confusion|Psychic *(Special)*|50|100|25|
|18|Water Pulse|Water *(Special)*|60|100|20|
|22|Fury Swipes|Normal *(Physical)*|18|80|15|
|25|Screech|Normal *(Physical)*|0|85|40|
|29|Zen Headbutt|Psychic *(Special)*|80|100|15|
|32|Aqua Tail|Water *(Special)*|90|90|10|
|36|Encore|Normal *(Physical)*|0|100|5|
|39|Psych Up|Normal *(Physical)*|0|0|10|
|43|Amnesia|Psychic *(Special)*|0|0|20|
|46|Hydro Pump|Water *(Special)*|110|80|5|
|50|Role Play|Psychic *(Special)*|0|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Golduck
ID: 056

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Aqua Jet|Water *(Special)*|40|100|30|
|1|Water Sport|Water *(Special)*|0|100|15|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Water Gun|Water *(Special)*|40|100|25|
|4|Tail Whip|Normal *(Physical)*|0|100|30|
|8|Water Gun|Water *(Special)*|40|100|25|
|11|Disable|Normal *(Physical)*|0|100|20|
|15|Confusion|Psychic *(Special)*|50|100|25|
|18|Water Pulse|Water *(Special)*|60|100|20|
|22|Fury Swipes|Normal *(Physical)*|18|80|15|
|25|Screech|Normal *(Physical)*|0|85|40|
|29|Zen Headbutt|Psychic *(Special)*|80|100|15|
|32|Aqua Tail|Water *(Special)*|90|90|10|
|38|Encore|Normal *(Physical)*|0|100|5|
|43|Psych Up|Normal *(Physical)*|0|0|10|
|49|Amnesia|Psychic *(Special)*|0|0|20|
|54|Hydro Pump|Water *(Special)*|110|80|5|
|60|Role Play|Psychic *(Special)*|0|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Mankey
ID: 057

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 28|[Primeape](#primeape)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Covet|Normal *(Physical)*|60|100|40|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Low Kick|Fight *(Physical)*|1|100|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Focus Energy|Normal *(Physical)*|0|0|30|
|9|Fury Swipes|Normal *(Physical)*|18|80|15|
|13|Karate Chop|Fight *(Physical)*|50|100|25|
|17|Seismic Toss|Fight *(Physical)*|1|100|20|
|21|Screech|Normal *(Physical)*|0|85|40|
|25|Assurance|Dark *(Special)*|60|100|10|
|33|Swagger|Normal *(Physical)*|0|90|15|
|37|Cross Chop|Fight *(Physical)*|100|80|5|
|41|Thrash|Normal *(Physical)*|120|100|20|
|45|Punishment|Dark *(Special)*|60|100|5|
|49|Close Combat|Fight *(Physical)*|120|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Primeape
ID: 058

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Endeavor|Normal *(Physical)*|1|100|5|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Low Kick|Fight *(Physical)*|1|100|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Focus Energy|Normal *(Physical)*|0|0|30|
|9|Fury Swipes|Normal *(Physical)*|18|80|15|
|13|Karate Chop|Fight *(Physical)*|50|100|25|
|17|Seismic Toss|Fight *(Physical)*|1|100|20|
|21|Screech|Normal *(Physical)*|0|85|40|
|25|Assurance|Dark *(Special)*|60|100|10|
|28|Rage|Normal *(Physical)*|20|100|20|
|35|Swagger|Normal *(Physical)*|0|90|15|
|41|Cross Chop|Fight *(Physical)*|100|80|5|
|47|Thrash|Normal *(Physical)*|120|100|20|
|53|Punishment|Dark *(Special)*|60|100|5|
|59|Close Combat|Fight *(Physical)*|120|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Growlithe
ID: 059

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 95|[Arcanine](#arcanine)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bite|Dark *(Special)*|60|100|25|
|1|Roar|Normal *(Physical)*|0|100|20|
|6|Ember|Fire *(Special)*|40|100|25|
|8|Leer|Normal *(Physical)*|0|100|30|
|10|Odor Sleuth|Normal *(Physical)*|0|100|40|
|12|Helping Hand|Normal *(Physical)*|0|100|20|
|17|Flame Wheel|Fire *(Special)*|60|100|25|
|19|Reversal|Fight *(Physical)*|1|100|15|
|21|Fire Fang|Fire *(Special)*|65|95|15|
|23|Take Down|Normal *(Physical)*|90|85|20|
|28|Flame Burst|Fire *(Special)*|70|100|15|
|30|Agility|Psychic *(Special)*|0|0|30|
|32|Body Slam|Normal *(Physical)*|85|100|15|
|34|Flamethrower|Fire *(Special)*|90|100|15|
|39|Crunch|Dark *(Special)*|80|100|15|
|41|Heat Wave|Fire *(Special)*|100|90|10|
|43|Outrage|Dragon *(Special)*|120|100|10|
|45|Flare Blitz|Fire *(Special)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Arcanine
ID: 060

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Close Combat|Fight *(Physical)*|120|100|5|
|1|Thunder Fang|Electric *(Special)*|65|95|15|
|1|Bite|Dark *(Special)*|60|100|25|
|1|Roar|Normal *(Physical)*|0|100|20|
|1|Fire Fang|Fire *(Special)*|65|95|15|
|1|Odor Sleuth|Normal *(Physical)*|0|100|40|
|34|Extremespeed|Normal *(Physical)*|80|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Poliwag
ID: 061

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 25|[Poliwhirl](#poliwhirl)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Water Sport|Water *(Special)*|0|100|15|
|5|Bubble|Water *(Special)*|30|100|30|
|8|Hypnosis|Psychic *(Special)*|0|60|20|
|11|Water Gun|Water *(Special)*|40|100|25|
|15|Doubleslap|Normal *(Physical)*|15|85|10|
|18|Rain Dance|Water *(Special)*|0|0|5|
|21|Body Slam|Normal *(Physical)*|85|100|15|
|25|Bubblebeam|Water *(Special)*|65|100|20|
|28|Mud Shot|Ground *(Physical)*|55|95|15|
|31|Belly Drum|Normal *(Physical)*|0|0|10|
|35|Wake-Up Slap|Fight *(Physical)*|70|100|10|
|38|Mud Bomb|Ground *(Physical)*|65|85|10|
|41|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Poliwhirl
ID: 062

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 40|[Politoed](#politoed)|
|Stone 97|[Poliwrath](#poliwrath)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Water Sport|Water *(Special)*|0|100|15|
|1|Bubble|Water *(Special)*|30|100|30|
|1|Hypnosis|Psychic *(Special)*|0|60|20|
|5|Bubble|Water *(Special)*|30|100|30|
|8|Hypnosis|Psychic *(Special)*|0|60|20|
|11|Water Gun|Water *(Special)*|40|100|25|
|15|Doubleslap|Normal *(Physical)*|15|85|10|
|18|Rain Dance|Water *(Special)*|0|0|5|
|21|Body Slam|Normal *(Physical)*|85|100|15|
|27|Bubblebeam|Water *(Special)*|65|100|20|
|32|Mud Shot|Ground *(Physical)*|55|95|15|
|37|Belly Drum|Normal *(Physical)*|0|0|10|
|43|Wake-Up Slap|Fight *(Physical)*|70|100|10|
|48|Mud Bomb|Ground *(Physical)*|65|85|10|
|53|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Poliwrath
ID: 063

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Storm Throw|Fight *(Physical)*|60|100|10|
|1|Bubblebeam|Water *(Special)*|65|100|20|
|1|Hypnosis|Psychic *(Special)*|0|60|20|
|1|Doubleslap|Normal *(Physical)*|15|85|10|
|1|Submission|Fight *(Physical)*|80|80|25|
|32|Circle Throw|Fight *(Physical)*|60|90|10|
|43|Mind Reader|Normal *(Physical)*|0|100|5|
|53|Dynamicpunch|Fight *(Physical)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Abra
ID: 064

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 16|[Kadabra](#kadabra)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Teleport|Psychic *(Special)*|0|0|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Kadabra
ID: 065

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 33|[Alakazam](#alakazam)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Teleport|Psychic *(Special)*|0|0|20|
|1|Kinesis|Psychic *(Special)*|0|80|15|
|1|Confusion|Psychic *(Special)*|50|100|25|
|16|Confusion|Psychic *(Special)*|50|100|25|
|18|Disable|Normal *(Physical)*|0|100|20|
|22|Miracle Eye|Psychic *(Special)*|0|100|40|
|24|Magic Coat|Psychic *(Special)*|0|100|15|
|28|Psybeam|Psychic *(Special)*|65|100|20|
|30|Reflect|Psychic *(Special)*|0|0|20|
|34|Skill Swap|Psychic *(Special)*|0|100|10|
|36|Recover|Normal *(Physical)*|0|0|10|
|40|Psycho Cut|Psychic *(Special)*|70|100|20|
|42|Role Play|Psychic *(Special)*|0|100|10|
|46|Psychic|Psychic *(Special)*|90|100|10|
|48|Future Sight|Psychic *(Special)*|120|100|15|
|52|Trick|Psychic *(Special)*|0|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Alakazam
ID: 066

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Teleport|Psychic *(Special)*|0|0|20|
|1|Kinesis|Psychic *(Special)*|0|80|15|
|1|Confusion|Psychic *(Special)*|50|100|25|
|16|Confusion|Psychic *(Special)*|50|100|25|
|18|Disable|Normal *(Physical)*|0|100|20|
|22|Miracle Eye|Psychic *(Special)*|0|100|40|
|24|Magic Coat|Psychic *(Special)*|0|100|15|
|28|Psybeam|Psychic *(Special)*|65|100|20|
|30|Reflect|Psychic *(Special)*|0|0|20|
|34|Skill Swap|Psychic *(Special)*|0|100|10|
|36|Recover|Normal *(Physical)*|0|0|10|
|40|Psycho Cut|Psychic *(Special)*|70|100|20|
|42|Calm Mind|Psychic *(Special)*|0|0|20|
|46|Psychic|Psychic *(Special)*|90|100|10|
|48|Future Sight|Psychic *(Special)*|120|100|15|
|52|Trick|Psychic *(Special)*|0|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Machop
ID: 067

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 28|[Machoke](#machoke)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Low Kick|Fight *(Physical)*|1|100|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|7|Focus Energy|Normal *(Physical)*|0|0|30|
|10|Karate Chop|Fight *(Physical)*|50|100|25|
|13|Low Sweep|Fight *(Physical)*|60|100|20|
|19|Foresight|Normal *(Physical)*|0|100|40|
|22|Seismic Toss|Fight *(Physical)*|1|100|20|
|25|Revenge|Fight *(Physical)*|60|100|10|
|31|Vital Throw|Fight *(Physical)*|70|100|10|
|34|Submission|Fight *(Physical)*|80|80|25|
|37|Wake-Up Slap|Fight *(Physical)*|70|100|10|
|43|Cross Chop|Fight *(Physical)*|100|80|5|
|46|Scary Face|Normal *(Physical)*|0|90|10|
|49|Dynamicpunch|Fight *(Physical)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Machoke
ID: 068

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 45|[Machamp](#machamp)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Low Kick|Fight *(Physical)*|1|100|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Focus Energy|Normal *(Physical)*|0|0|30|
|1|Karate Chop|Fight *(Physical)*|50|100|25|
|7|Focus Energy|Normal *(Physical)*|0|0|30|
|10|Karate Chop|Fight *(Physical)*|50|100|25|
|13|Low Sweep|Fight *(Physical)*|60|100|20|
|19|Foresight|Normal *(Physical)*|0|100|40|
|22|Seismic Toss|Fight *(Physical)*|1|100|20|
|25|Revenge|Fight *(Physical)*|60|100|10|
|32|Vital Throw|Fight *(Physical)*|70|100|10|
|36|Submission|Fight *(Physical)*|80|80|25|
|30|Wake-Up Slap|Fight *(Physical)*|70|100|10|
|44|Cross Chop|Fight *(Physical)*|100|80|5|
|51|Scary Face|Normal *(Physical)*|0|90|10|
|55|Dynamicpunch|Fight *(Physical)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Machamp
ID: 069

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bullet Punch|Steel *(Physical)*|40|100|30|
|1|Low Kick|Fight *(Physical)*|1|100|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Focus Energy|Normal *(Physical)*|0|0|30|
|1|Karate Chop|Fight *(Physical)*|50|100|25|
|7|Focus Energy|Normal *(Physical)*|0|0|30|
|10|Karate Chop|Fight *(Physical)*|50|100|25|
|13|Low Sweep|Fight *(Physical)*|60|100|20|
|19|Foresight|Normal *(Physical)*|0|100|40|
|22|Seismic Toss|Fight *(Physical)*|1|100|20|
|25|Revenge|Fight *(Physical)*|60|100|10|
|32|Vital Throw|Fight *(Physical)*|70|100|10|
|36|Submission|Fight *(Physical)*|80|80|25|
|30|Wake-Up Slap|Fight *(Physical)*|70|100|10|
|44|Cross Chop|Fight *(Physical)*|100|80|5|
|51|Scary Face|Normal *(Physical)*|0|90|10|
|55|Dynamicpunch|Fight *(Physical)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Bellsprout
ID: 070

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 21|[Weepinbell](#weepinbell)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Vine Whip|Grass *(Special)*|40|100|25|
|7|Growth|Normal *(Physical)*|0|0|40|
|11|Wrap|Normal *(Physical)*|15|90|20|
|13|Sleep Powder|Grass *(Special)*|0|75|15|
|15|Poisonpowder|Poison *(Physical)*|0|75|35|
|17|Stun Spore|Grass *(Special)*|0|75|30|
|23|Acid|Poison *(Physical)*|50|100|30|
|27|Knock Off|Dark *(Special)*|65|100|25|
|29|Sweet Scent|Normal *(Physical)*|0|100|20|
|35|Acid Spray|Poison *(Physical)*|40|100|20|
|39|Razor Leaf|Grass *(Special)*|55|95|25|
|41|Slam|Normal *(Physical)*|80|75|20|
|47|Seed Bomb|Grass *(Special)*|80|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Weepinbell
ID: 071

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 98|[Victreebel](#victreebel)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Vine Whip|Grass *(Special)*|40|100|25|
|1|Growth|Normal *(Physical)*|0|0|40|
|1|Wrap|Normal *(Physical)*|15|90|20|
|7|Growth|Normal *(Physical)*|0|0|40|
|11|Wrap|Normal *(Physical)*|15|90|20|
|13|Sleep Powder|Grass *(Special)*|0|75|15|
|15|Poisonpowder|Poison *(Physical)*|0|75|35|
|17|Stun Spore|Grass *(Special)*|0|75|30|
|23|Acid|Poison *(Physical)*|50|100|30|
|27|Knock Off|Dark *(Special)*|65|100|25|
|29|Sweet Scent|Normal *(Physical)*|0|100|20|
|35|Acid Spray|Poison *(Physical)*|40|100|20|
|39|Razor Leaf|Grass *(Special)*|55|95|25|
|41|Slam|Normal *(Physical)*|80|75|20|
|47|Seed Bomb|Grass *(Special)*|80|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Victreebel
ID: 072

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Weather Ball|Normal *(Physical)*|50|100|10|
|1|Power Whip|Grass *(Special)*|120|85|10|
|1|Stockpile|Normal *(Physical)*|0|0|10|
|1|Swallow|Normal *(Physical)*|0|0|10|
|1|Spit Up|Normal *(Physical)*|100|100|10|
|1|Vine Whip|Grass *(Special)*|40|100|25|
|1|Sleep Powder|Grass *(Special)*|0|75|15|
|1|Sweet Scent|Normal *(Physical)*|0|100|20|
|1|Razor Leaf|Grass *(Special)*|55|95|25|
|27|Leaf Tornado|Grass *(Special)*|65|90|10|
|47|Leaf Storm|Grass *(Special)*|130|90|5|
|47|Leaf Blade|Grass *(Special)*|90|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Tentacool
ID: 073

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Tentacruel](#tentacruel)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Poison Sting|Poison *(Physical)*|15|100|35|
|5|Supersonic|Normal *(Physical)*|0|55|20|
|8|Constrict|Normal *(Physical)*|10|100|35|
|12|Acid|Poison *(Physical)*|50|100|30|
|15|Toxic Spikes|Poison *(Physical)*|0|0|20|
|19|Bubblebeam|Water *(Special)*|65|100|20|
|22|Wrap|Normal *(Physical)*|15|90|20|
|26|Acid Spray|Poison *(Physical)*|40|100|20|
|29|Barrier|Psychic *(Special)*|0|0|20|
|33|Water Pulse|Water *(Special)*|60|100|20|
|36|Poison Jab|Poison *(Physical)*|80|100|20|
|40|Screech|Normal *(Physical)*|0|85|40|
|43|Hex|Ghost *(Physical)*|65|100|10|
|47|Hydro Pump|Water *(Special)*|110|80|5|
|50|Sludge Bomb|Poison *(Physical)*|90|100|10|
|54|Giga Drain|Grass *(Special)*|75|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Tentacruel
ID: 074

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Poison Sting|Poison *(Physical)*|15|100|35|
|1|Supersonic|Normal *(Physical)*|0|55|20|
|1|Constrict|Normal *(Physical)*|10|100|35|
|5|Supersonic|Normal *(Physical)*|0|55|20|
|8|Constrict|Normal *(Physical)*|10|100|35|
|12|Acid|Poison *(Physical)*|50|100|30|
|15|Toxic Spikes|Poison *(Physical)*|0|0|20|
|19|Bubblebeam|Water *(Special)*|65|100|20|
|22|Wrap|Normal *(Physical)*|15|90|20|
|26|Acid Spray|Poison *(Physical)*|40|100|20|
|29|Barrier|Psychic *(Special)*|0|0|20|
|34|Water Pulse|Water *(Special)*|60|100|20|
|38|Poison Jab|Poison *(Physical)*|80|100|20|
|43|Screech|Normal *(Physical)*|0|85|40|
|47|Hex|Ghost *(Physical)*|65|100|10|
|52|Hydro Pump|Water *(Special)*|110|80|5|
|56|Sludge Bomb|Poison *(Physical)*|90|100|10|
|61|Giga Drain|Grass *(Special)*|75|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Geodude
ID: 075

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 25|[Graveler](#graveler)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|4|Mud Sport|Ground *(Physical)*|0|100|15|
|8|Rock Polish|Rock *(Physical)*|0|0|20|
|11|Rock Throw|Rock *(Physical)*|50|90|15|
|15|Magnitude|Ground *(Physical)*|1|100|30|
|18|Rollout|Rock *(Physical)*|30|90|20|
|22|Rock Blast|Rock *(Physical)*|25|80|10|
|25|Rock Climb|Normal *(Physical)*|90|85|20|
|29|Selfdestruct|Normal *(Physical)*|200|100|5|
|32|Bulldoze|Ground *(Physical)*|60|100|20|
|36|Stealth Rock|Rock *(Physical)*|0|0|20|
|39|Earthquake|Ground *(Physical)*|100|100|10|
|43|Explosion|Normal *(Physical)*|250|100|5|
|46|Double-Edge|Normal *(Physical)*|120|100|15|
|50|Stone Edge|Rock *(Physical)*|100|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Graveler
ID: 076

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 40|[Golem](#golem)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|1|Mud Sport|Ground *(Physical)*|0|100|15|
|1|Rock Polish|Rock *(Physical)*|0|0|20|
|4|Mud Sport|Ground *(Physical)*|0|100|15|
|8|Rock Polish|Rock *(Physical)*|0|0|20|
|11|Rock Throw|Rock *(Physical)*|50|90|15|
|15|Magnitude|Ground *(Physical)*|1|100|30|
|18|Rollout|Rock *(Physical)*|30|90|20|
|22|Rock Blast|Rock *(Physical)*|25|80|10|
|27|Rock Climb|Normal *(Physical)*|90|85|20|
|31|Selfdestruct|Normal *(Physical)*|200|100|5|
|36|Bulldoze|Ground *(Physical)*|60|100|20|
|42|Stealth Rock|Rock *(Physical)*|0|0|20|
|47|Earthquake|Ground *(Physical)*|100|100|10|
|53|Explosion|Normal *(Physical)*|250|100|5|
|58|Double-Edge|Normal *(Physical)*|120|100|15|
|64|Stone Edge|Rock *(Physical)*|100|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Golem
ID: 077

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|1|Mud Sport|Ground *(Physical)*|0|100|15|
|1|Rock Polish|Rock *(Physical)*|0|0|20|
|4|Mud Sport|Ground *(Physical)*|0|100|15|
|8|Rock Polish|Rock *(Physical)*|0|0|20|
|11|Rock Throw|Rock *(Physical)*|50|90|15|
|15|Magnitude|Ground *(Physical)*|1|100|30|
|18|Steamroller|Bug *(Physical)*|65|100|20|
|22|Rock Blast|Rock *(Physical)*|25|80|10|
|27|Rock Climb|Normal *(Physical)*|90|85|20|
|31|Selfdestruct|Normal *(Physical)*|200|100|5|
|36|Bulldoze|Ground *(Physical)*|60|100|20|
|42|Stealth Rock|Rock *(Physical)*|0|0|20|
|47|Earthquake|Ground *(Physical)*|100|100|10|
|53|Explosion|Normal *(Physical)*|250|100|5|
|58|Double-Edge|Normal *(Physical)*|120|100|15|
|64|Stone Edge|Rock *(Physical)*|100|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM04|Strength|Normal *(Physical)*|80|100|15|

## Ponyta
ID: 078

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 40|[Rapidash](#rapidash)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Tackle|Normal *(Physical)*|50|100|35|
|4|Tail Whip|Normal *(Physical)*|0|100|30|
|9|Ember|Fire *(Special)*|40|100|25|
|13|Flame Wheel|Fire *(Special)*|60|100|25|
|17|Stomp|Normal *(Physical)*|65|100|20|
|21|Flame Charge|Fire *(Special)*|50|100|20|
|25|Fire Spin|Fire *(Special)*|35|85|15|
|29|Take Down|Normal *(Physical)*|90|85|20|
|33|Inferno|Fire *(Special)*|100|50|5|
|37|Agility|Psychic *(Special)*|0|0|30|
|41|Fire Blast|Fire *(Special)*|110|85|5|
|45|Bounce|Flying *(Physical)*|85|85|5|
|49|Flare Blitz|Fire *(Special)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM04|Strength|Normal *(Physical)*|80|100|15|

## Rapidash
ID: 079

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Poison Jab|Poison *(Physical)*|80|100|20|
|1|Megahorn|Bug *(Physical)*|120|85|10|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Quick Attack|Normal *(Physical)*|40|100|30|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Ember|Fire *(Special)*|40|100|25|
|4|Tail Whip|Normal *(Physical)*|0|100|30|
|9|Ember|Fire *(Special)*|40|100|25|
|13|Flame Wheel|Fire *(Special)*|60|100|25|
|17|Stomp|Normal *(Physical)*|65|100|20|
|21|Flame Charge|Fire *(Special)*|50|100|20|
|25|Fire Spin|Fire *(Special)*|35|85|15|
|29|Take Down|Normal *(Physical)*|90|85|20|
|33|Inferno|Fire *(Special)*|100|50|5|
|37|Agility|Psychic *(Special)*|0|0|30|
|40|Fury Attack|Normal *(Physical)*|15|85|20|
|45|Fire Blast|Fire *(Special)*|110|85|5|
|49|Bounce|Flying *(Physical)*|85|85|5|
|54|Flare Blitz|Fire *(Special)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM08|Dive|Water *(Special)*|60|100|10|

## Slowpoke
ID: 080

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 37|[Slowbro](#slowbro)|
|Stone 97|[Slowking](#slowking)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Curse|??? *(Physical)*|0|0|10|
|1|Yawn|Normal *(Physical)*|0|100|10|
|1|Tackle|Normal *(Physical)*|50|100|35|
|5|Growl|Normal *(Physical)*|0|100|40|
|9|Water Gun|Water *(Special)*|40|100|25|
|14|Confusion|Psychic *(Special)*|50|100|25|
|19|Disable|Normal *(Physical)*|0|100|20|
|23|Headbutt|Normal *(Physical)*|70|100|15|
|28|Water Pulse|Water *(Special)*|60|100|20|
|32|Zen Headbutt|Psychic *(Special)*|80|100|15|
|36|Slack Off|Normal *(Physical)*|0|0|10|
|41|Amnesia|Psychic *(Special)*|0|0|20|
|45|Psychic|Psychic *(Special)*|90|100|10|
|49|Rain Dance|Water *(Special)*|0|0|5|
|54|Psych Up|Normal *(Physical)*|0|0|10|
|58|Heal Pulse|Psychic *(Special)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Slowbro
ID: 081

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Curse|??? *(Physical)*|0|0|10|
|1|Yawn|Normal *(Physical)*|0|100|10|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|5|Growl|Normal *(Physical)*|0|100|40|
|9|Water Gun|Water *(Special)*|40|100|25|
|14|Confusion|Psychic *(Special)*|50|100|25|
|19|Disable|Normal *(Physical)*|0|100|20|
|23|Headbutt|Normal *(Physical)*|70|100|15|
|28|Water Pulse|Water *(Special)*|60|100|20|
|32|Zen Headbutt|Psychic *(Special)*|80|100|15|
|36|Slack Off|Normal *(Physical)*|0|0|10|
|37|Withdraw|Water *(Special)*|0|0|40|
|43|Amnesia|Psychic *(Special)*|0|0|20|
|49|Psychic|Psychic *(Special)*|90|100|10|
|55|Rain Dance|Water *(Special)*|0|0|5|
|62|Psych Up|Normal *(Physical)*|0|0|10|
|68|Heal Pulse|Psychic *(Special)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Magnemite
ID: 082

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Magneton](#magneton)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|4|Supersonic|Normal *(Physical)*|0|55|20|
|7|Thundershock|Electric *(Special)*|40|100|30|
|11|Sonicboom|Normal *(Physical)*|1|90|20|
|15|Thunder Wave|Electric *(Special)*|0|100|20|
|18|Magnet Bomb|Steel *(Physical)*|60|0|20|
|21|Spark|Electric *(Special)*|65|100|20|
|25|Mirror Shot|Steel *(Physical)*|65|85|10|
|29|Metal Sound|Steel *(Physical)*|0|85|40|
|32|Shock Wave|Electric *(Special)*|60|0|20|
|35|Flash Cannon|Steel *(Physical)*|80|100|10|
|39|Screech|Normal *(Physical)*|0|85|40|
|43|Discharge|Electric *(Special)*|80|100|15|
|46|Recycle|Normal *(Physical)*|0|100|10|
|49|Lock-On|Normal *(Physical)*|0|100|5|
|53|Zap Cannon|Electric *(Special)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Magneton
ID: 083

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tri Attack|Normal *(Physical)*|80|100|10|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Thundershock|Electric *(Special)*|40|100|30|
|1|Supersonic|Normal *(Physical)*|0|55|20|
|1|Sonicboom|Normal *(Physical)*|1|90|20|
|4|Supersonic|Normal *(Physical)*|0|55|20|
|7|Thundershock|Electric *(Special)*|40|100|30|
|11|Sonicboom|Normal *(Physical)*|1|90|20|
|15|Thunder Wave|Electric *(Special)*|0|100|20|
|18|Magnet Bomb|Steel *(Physical)*|60|0|20|
|21|Spark|Electric *(Special)*|65|100|20|
|25|Mirror Shot|Steel *(Physical)*|65|85|10|
|29|Metal Sound|Steel *(Physical)*|0|85|40|
|34|Shock Wave|Electric *(Special)*|60|0|20|
|39|Flash Cannon|Steel *(Physical)*|80|100|10|
|45|Screech|Normal *(Physical)*|0|85|40|
|51|Discharge|Electric *(Special)*|80|100|15|
|56|Recycle|Normal *(Physical)*|0|100|10|
|62|Lock-On|Normal *(Physical)*|0|100|5|
|67|Zap Cannon|Electric *(Special)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM02|Fly|Flying *(Physical)*|70|95|15|

## Farfetch'd
ID: 084

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Poison Jab|Poison *(Physical)*|80|100|20|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Sand-Attack|Ground *(Physical)*|0|100|15|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Fury Cutter|Bug *(Physical)*|40|95|20|
|7|Fury Attack|Normal *(Physical)*|15|85|20|
|9|Knock Off|Dark *(Special)*|65|100|25|
|13|Aerial Ace|Flying *(Physical)*|60|0|20|
|19|Slash|Normal *(Physical)*|70|100|20|
|21|Air Cutter|Flying *(Physical)*|60|95|25|
|25|Swords Dance|Normal *(Physical)*|0|0|20|
|31|Agility|Psychic *(Special)*|0|0|30|
|33|Night Slash|Dark *(Special)*|70|100|20|
|37|Acrobatics|Flying *(Physical)*|55|100|15|
|43|Leaf Blade|Grass *(Special)*|90|100|15|
|45|False Swipe|Normal *(Physical)*|40|100|40|
|49|Air Slash|Flying *(Physical)*|75|95|15|
|55|Brave Bird|Flying *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|

## Doduo
ID: 085

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 31|[Dodrio](#dodrio)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|5|Quick Attack|Normal *(Physical)*|40|100|30|
|10|Rage|Normal *(Physical)*|20|100|20|
|14|Fury Attack|Normal *(Physical)*|15|85|20|
|19|Pursuit|Dark *(Special)*|40|100|20|
|23|Uproar|Normal *(Physical)*|50|100|10|
|28|Acupressure|Normal *(Physical)*|0|0|30|
|32|Double Hit|Normal *(Physical)*|35|100|15|
|37|Agility|Psychic *(Special)*|0|0|30|
|41|Drill Peck|Flying *(Physical)*|80|100|20|
|46|Endeavor|Normal *(Physical)*|1|100|5|
|50|Thrash|Normal *(Physical)*|120|100|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|

## Dodrio
ID: 086

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Brave Bird|Flying *(Physical)*|120|100|15|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Quick Attack|Normal *(Physical)*|40|100|30|
|1|Rage|Normal *(Physical)*|20|100|20|
|5|Quick Attack|Normal *(Physical)*|40|100|30|
|10|Rage|Normal *(Physical)*|20|100|20|
|14|Fury Attack|Normal *(Physical)*|15|85|20|
|19|Pursuit|Dark *(Special)*|40|100|20|
|23|Uproar|Normal *(Physical)*|50|100|10|
|28|Acupressure|Normal *(Physical)*|0|0|30|
|34|Tri Attack|Normal *(Physical)*|80|100|10|
|41|Agility|Psychic *(Special)*|0|0|30|
|47|Drill Peck|Flying *(Physical)*|80|100|20|
|54|Endeavor|Normal *(Physical)*|1|100|5|
|60|Thrash|Normal *(Physical)*|120|100|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Seel
ID: 087

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 34|[Dewgong](#dewgong)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Headbutt|Normal *(Physical)*|70|100|15|
|3|Growl|Normal *(Physical)*|0|100|40|
|7|Water Sport|Water *(Special)*|0|100|15|
|11|Icy Wind|Ice *(Special)*|55|95|15|
|13|Encore|Normal *(Physical)*|0|100|5|
|17|Ice Shard|Ice *(Special)*|40|100|30|
|21|Rest|Psychic *(Special)*|0|0|10|
|23|Lick|Ghost *(Physical)*|30|100|30|
|27|Aurora Beam|Ice *(Special)*|65|100|20|
|31|Aqua Jet|Water *(Special)*|40|100|30|
|33|Brine|Water *(Special)*|65|100|10|
|37|Take Down|Normal *(Physical)*|90|85|20|
|41|Dive|Water *(Special)*|60|100|10|
|43|Aqua Tail|Water *(Special)*|90|90|10|
|47|Ice Beam|Ice *(Special)*|90|100|10|
|51|Safeguard|Normal *(Physical)*|0|0|25|
|53|Hail|Ice *(Special)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Dewgong
ID: 088

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Drill Run|Ground *(Physical)*|80|100|10|
|1|Headbutt|Normal *(Physical)*|70|100|15|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Signal Beam|Bug *(Physical)*|75|100|15|
|1|Icy Wind|Ice *(Special)*|55|95|15|
|3|Growl|Normal *(Physical)*|0|100|40|
|7|Signal Beam|Bug *(Physical)*|75|100|15|
|11|Icy Wind|Ice *(Special)*|55|95|15|
|13|Encore|Normal *(Physical)*|0|100|5|
|17|Ice Shard|Ice *(Special)*|40|100|30|
|21|Rest|Psychic *(Special)*|0|0|10|
|23|Frost Breath|Ice *(Special)*|60|90|10|
|27|Aurora Beam|Ice *(Special)*|65|100|20|
|31|Aqua Jet|Water *(Special)*|40|100|30|
|33|Brine|Water *(Special)*|65|100|10|
|34|Sheer Cold|Ice *(Special)*|1|30|5|
|39|Take Down|Normal *(Physical)*|90|85|20|
|45|Dive|Water *(Special)*|60|100|10|
|49|Aqua Tail|Water *(Special)*|90|90|10|
|55|Ice Beam|Ice *(Special)*|90|100|10|
|61|Safeguard|Normal *(Physical)*|0|0|25|
|65|Hail|Ice *(Special)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|

## Grimer
ID: 089

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 38|[Muk](#muk)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Poison Gas|Poison *(Physical)*|0|90|40|
|1|Pound|Normal *(Physical)*|40|100|35|
|4|Harden|Normal *(Physical)*|0|0|30|
|7|Mud-Slap|Ground *(Physical)*|20|100|10|
|12|Disable|Normal *(Physical)*|0|100|20|
|15|Sludge|Poison *(Physical)*|65|100|20|
|18|Minimize|Normal *(Physical)*|0|0|10|
|21|Mud Bomb|Ground *(Physical)*|65|85|10|
|26|Poison Jab|Poison *(Physical)*|80|100|20|
|29|Curse|??? *(Physical)*|0|0|10|
|32|Screech|Normal *(Physical)*|0|85|40|
|37|Sludge Bomb|Poison *(Physical)*|90|100|10|
|40|Acid Armor|Poison *(Physical)*|0|0|40|
|43|Gunk Shot|Poison *(Physical)*|120|80|5|
|48|Memento|Dark *(Special)*|0|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Muk
ID: 090

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Shadow Sneak|Ghost *(Physical)*|40|100|30|
|1|Poison Gas|Poison *(Physical)*|0|90|40|
|1|Pound|Normal *(Physical)*|40|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|1|Mud-Slap|Ground *(Physical)*|20|100|10|
|4|Harden|Normal *(Physical)*|0|0|30|
|7|Mud-Slap|Ground *(Physical)*|20|100|10|
|12|Disable|Normal *(Physical)*|0|100|20|
|15|Sludge|Poison *(Physical)*|65|100|20|
|18|Minimize|Normal *(Physical)*|0|0|10|
|21|Mud Bomb|Ground *(Physical)*|65|85|10|
|26|Poison Jab|Poison *(Physical)*|80|100|20|
|29|Curse|??? *(Physical)*|0|0|10|
|32|Screech|Normal *(Physical)*|0|85|40|
|37|Sludge Bomb|Poison *(Physical)*|90|100|10|
|43|Acid Armor|Poison *(Physical)*|0|0|40|
|49|Gunk Shot|Poison *(Physical)*|120|80|5|
|57|Memento|Dark *(Special)*|0|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Shellder
ID: 091

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 97|[Cloyster](#cloyster)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|4|Withdraw|Water *(Special)*|0|0|40|
|8|Supersonic|Normal *(Physical)*|0|55|20|
|13|Icicle Spear|Ice *(Special)*|25|100|30|
|16|Protect|Normal *(Physical)*|0|0|10|
|20|Leer|Normal *(Physical)*|0|100|30|
|25|Clamp|Water *(Special)*|35|85|10|
|28|Ice Shard|Ice *(Special)*|40|100|30|
|32|Razor Shell|Water *(Special)*|75|95|10|
|37|Aurora Beam|Ice *(Special)*|65|100|20|
|40|Whirlpool|Water *(Special)*|35|85|15|
|44|Brine|Water *(Special)*|65|100|10|
|49|Iron Defense|Steel *(Physical)*|0|0|15|
|52|Ice Beam|Ice *(Special)*|90|100|10|
|56|Shell Smash|Normal *(Physical)*|0|0|15|
|61|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Cloyster
ID: 092

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Rock Blast|Rock *(Physical)*|25|80|10|
|1|Withdraw|Water *(Special)*|0|0|40|
|1|Supersonic|Normal *(Physical)*|0|55|20|
|1|Protect|Normal *(Physical)*|0|0|10|
|1|Aurora Beam|Ice *(Special)*|65|100|20|
|13|Spike Cannon|Normal *(Physical)*|20|100|15|
|28|Spikes|Ground *(Physical)*|0|0|20|
|52|Icicle Crash|Ice *(Special)*|85|90|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|

## Gastly
ID: 093

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 25|[Haunter](#haunter)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Hypnosis|Psychic *(Special)*|0|60|20|
|1|Lick|Ghost *(Physical)*|30|100|30|
|5|Spite|Ghost *(Physical)*|0|100|10|
|8|Mean Look|Normal *(Physical)*|0|100|5|
|12|Curse|??? *(Physical)*|0|0|10|
|15|Night Shade|Ghost *(Physical)*|1|100|15|
|19|Confuse Ray|Ghost *(Physical)*|0|100|10|
|22|Shadow Sneak|Ghost *(Physical)*|40|100|30|
|26|Payback|Dark *(Special)*|50|100|10|
|29|Shadow Ball|Ghost *(Physical)*|80|100|15|
|33|Dream Eater|Psychic *(Special)*|100|100|15|
|36|Dark Pulse|Dark *(Special)*|80|100|15|
|40|Destiny Bond|Ghost *(Physical)*|0|0|5|
|43|Hex|Ghost *(Physical)*|65|100|10|
|47|Nightmare|Ghost *(Physical)*|0|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|

## Haunter
ID: 094

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 40|[Gengar](#gengar)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Hypnosis|Psychic *(Special)*|0|60|20|
|1|Lick|Ghost *(Physical)*|30|100|30|
|1|Spite|Ghost *(Physical)*|0|100|10|
|5|Spite|Ghost *(Physical)*|0|100|10|
|8|Mean Look|Normal *(Physical)*|0|100|5|
|12|Curse|??? *(Physical)*|0|0|10|
|15|Night Shade|Ghost *(Physical)*|1|100|15|
|19|Confuse Ray|Ghost *(Physical)*|0|100|10|
|22|Shadow Sneak|Ghost *(Physical)*|40|100|30|
|25|Shadow Punch|Ghost *(Physical)*|60|0|20|
|28|Payback|Dark *(Special)*|50|100|10|
|33|Shadow Ball|Ghost *(Physical)*|80|100|15|
|39|Dream Eater|Psychic *(Special)*|100|100|15|
|44|Dark Pulse|Dark *(Special)*|80|100|15|
|50|Destiny Bond|Ghost *(Physical)*|0|0|5|
|55|Hex|Ghost *(Physical)*|65|100|10|
|61|Nightmare|Ghost *(Physical)*|0|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Gengar
ID: 095

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Clear Smog|Poison *(Physical)*|50|0|15|
|1|Hypnosis|Psychic *(Special)*|0|60|20|
|1|Lick|Ghost *(Physical)*|30|100|30|
|1|Spite|Ghost *(Physical)*|0|100|10|
|5|Spite|Ghost *(Physical)*|0|100|10|
|8|Mean Look|Normal *(Physical)*|0|100|5|
|12|Curse|??? *(Physical)*|0|0|10|
|15|Night Shade|Ghost *(Physical)*|1|100|15|
|19|Confuse Ray|Ghost *(Physical)*|0|100|10|
|22|Shadow Sneak|Ghost *(Physical)*|40|100|30|
|25|Shadow Punch|Ghost *(Physical)*|60|0|20|
|28|Payback|Dark *(Special)*|50|100|10|
|33|Shadow Ball|Ghost *(Physical)*|80|100|15|
|39|Dream Eater|Psychic *(Special)*|100|100|15|
|44|Dark Pulse|Dark *(Special)*|80|100|15|
|50|Destiny Bond|Ghost *(Physical)*|0|0|5|
|55|Hex|Ghost *(Physical)*|65|100|10|
|61|Nightmare|Ghost *(Physical)*|0|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Onix
ID: 096

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 36|[Steelix](#steelix)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Mud Sport|Ground *(Physical)*|0|100|15|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|1|Bind|Normal *(Physical)*|15|85|20|
|4|Curse|??? *(Physical)*|0|0|10|
|7|Rock Throw|Rock *(Physical)*|50|90|15|
|10|Rage|Normal *(Physical)*|20|100|20|
|13|Rock Tomb|Rock *(Physical)*|60|95|15|
|16|Stealth Rock|Rock *(Physical)*|0|0|20|
|19|Rock Polish|Rock *(Physical)*|0|0|20|
|22|Rock Blast|Rock *(Physical)*|25|80|10|
|25|Dragonbreath|Dragon *(Special)*|60|100|20|
|28|Slam|Normal *(Physical)*|80|75|20|
|31|Screech|Normal *(Physical)*|0|85|40|
|34|Rock Slide|Rock *(Physical)*|75|90|10|
|37|Sand Tomb|Ground *(Physical)*|35|85|15|
|40|Iron Tail|Steel *(Physical)*|100|75|15|
|43|Dig|Ground *(Physical)*|80|100|10|
|46|Stone Edge|Rock *(Physical)*|100|80|5|
|49|Double-Edge|Normal *(Physical)*|120|100|15|
|52|Sandstorm|Rock *(Physical)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Drowzee
ID: 097

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 26|[Hypno](#hypno)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Pound|Normal *(Physical)*|40|100|35|
|1|Hypnosis|Psychic *(Special)*|0|60|20|
|5|Disable|Normal *(Physical)*|0|100|20|
|9|Confusion|Psychic *(Special)*|50|100|25|
|13|Headbutt|Normal *(Physical)*|70|100|15|
|17|Poison Gas|Poison *(Physical)*|0|90|40|
|21|Meditate|Psychic *(Special)*|0|0|40|
|25|Psybeam|Psychic *(Special)*|65|100|20|
|29|Drain Punch|Fight *(Physical)*|75|100|10|
|33|Psych Up|Normal *(Physical)*|0|0|10|
|37|Psycho Cut|Psychic *(Special)*|70|100|20|
|41|Dream Eater|Psychic *(Special)*|100|100|15|
|45|Swagger|Normal *(Physical)*|0|90|15|
|49|Psychic|Psychic *(Special)*|90|100|10|
|53|Nasty Plot|Dark *(Special)*|0|0|20|
|57|Zen Headbutt|Psychic *(Special)*|80|100|15|
|61|Future Sight|Psychic *(Special)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Hypno
ID: 098

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Nightmare|Ghost *(Physical)*|0|100|15|
|1|Switcheroo|Dark *(Special)*|0|100|10|
|1|Pound|Normal *(Physical)*|40|100|35|
|1|Hypnosis|Psychic *(Special)*|0|60|20|
|1|Disable|Normal *(Physical)*|0|100|20|
|1|Confusion|Psychic *(Special)*|50|100|25|
|5|Disable|Normal *(Physical)*|0|100|20|
|9|Confusion|Psychic *(Special)*|50|100|25|
|13|Headbutt|Normal *(Physical)*|70|100|15|
|17|Poison Gas|Poison *(Physical)*|0|90|40|
|21|Meditate|Psychic *(Special)*|0|0|40|
|25|Psybeam|Psychic *(Special)*|65|100|20|
|31|Drain Punch|Fight *(Physical)*|75|100|10|
|35|Psych Up|Normal *(Physical)*|0|0|10|
|39|Psycho Cut|Psychic *(Special)*|70|100|20|
|43|Dream Eater|Psychic *(Special)*|100|100|15|
|47|Swagger|Normal *(Physical)*|0|90|15|
|51|Psychic|Psychic *(Special)*|90|100|10|
|55|Nasty Plot|Dark *(Special)*|0|0|20|
|59|Zen Headbutt|Psychic *(Special)*|80|100|15|
|64|Future Sight|Psychic *(Special)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Krabby
ID: 099

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 28|[Kingler](#kingler)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Mud Sport|Ground *(Physical)*|0|100|15|
|1|Bubble|Water *(Special)*|30|100|30|
|5|Vicegrip|Normal *(Physical)*|55|100|30|
|9|Leer|Normal *(Physical)*|0|100|30|
|11|Harden|Normal *(Physical)*|0|0|30|
|15|Bubblebeam|Water *(Special)*|65|100|20|
|19|Mud Shot|Ground *(Physical)*|55|95|15|
|21|Metal Claw|Steel *(Physical)*|50|95|35|
|25|Stomp|Normal *(Physical)*|65|100|20|
|29|Protect|Normal *(Physical)*|0|0|10|
|31|Guillotine|Normal *(Physical)*|1|30|5|
|35|Slam|Normal *(Physical)*|80|75|20|
|39|Clamp|Water *(Special)*|35|85|10|
|41|Crabhammer|Water *(Special)*|100|90|10|
|45|Flail|Normal *(Physical)*|1|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Kingler
ID: 100

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Ancientpower|Rock *(Physical)*|60|100|5|
|1|Mud Sport|Ground *(Physical)*|0|100|15|
|1|Bubble|Water *(Special)*|30|100|30|
|1|Vicegrip|Normal *(Physical)*|55|100|30|
|1|Leer|Normal *(Physical)*|0|100|30|
|5|Vicegrip|Normal *(Physical)*|55|100|30|
|9|Leer|Normal *(Physical)*|0|100|30|
|11|Harden|Normal *(Physical)*|0|0|30|
|15|Bubblebeam|Water *(Special)*|65|100|20|
|19|Mud Shot|Ground *(Physical)*|55|95|15|
|21|Metal Claw|Steel *(Physical)*|50|95|35|
|25|Stomp|Normal *(Physical)*|65|100|20|
|28|Hone Claws|Dark *(Special)*|0|0|15|
|32|Protect|Normal *(Physical)*|0|0|10|
|37|Guillotine|Normal *(Physical)*|1|30|5|
|44|Slam|Normal *(Physical)*|80|75|20|
|51|Clamp|Water *(Special)*|35|85|10|
|56|Crabhammer|Water *(Special)*|100|90|10|
|63|Flail|Normal *(Physical)*|1|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Voltorb
ID: 101

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Electrode](#electrode)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Charge|Electric *(Special)*|0|100|20|
|5|Tackle|Normal *(Physical)*|50|100|35|
|8|Sonicboom|Normal *(Physical)*|1|90|20|
|12|Spark|Electric *(Special)*|65|100|20|
|15|Rollout|Rock *(Physical)*|30|90|20|
|19|Screech|Normal *(Physical)*|0|85|40|
|22|Charge Beam|Electric *(Special)*|50|90|10|
|26|Light Screen|Psychic *(Special)*|0|0|30|
|29|Rapid Spin|Normal *(Physical)*|20|100|40|
|33|Selfdestruct|Normal *(Physical)*|200|100|5|
|36|Swift|Normal *(Physical)*|60|0|20|
|40|Thunder Wave|Electric *(Special)*|0|100|20|
|43|Signal Beam|Bug *(Physical)*|75|100|15|
|47|Explosion|Normal *(Physical)*|250|100|5|
|50|Mirror Coat|Psychic *(Special)*|1|100|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Electrode
ID: 102

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Charge|Electric *(Special)*|0|100|20|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Sonicboom|Normal *(Physical)*|1|90|20|
|1|Spark|Electric *(Special)*|65|100|20|
|5|Tackle|Normal *(Physical)*|50|100|35|
|8|Sonicboom|Normal *(Physical)*|1|90|20|
|12|Spark|Electric *(Special)*|65|100|20|
|15|Rollout|Rock *(Physical)*|30|90|20|
|19|Screech|Normal *(Physical)*|0|85|40|
|22|Charge Beam|Electric *(Special)*|50|90|10|
|26|Light Screen|Psychic *(Special)*|0|0|30|
|29|Rapid Spin|Normal *(Physical)*|20|100|40|
|35|Selfdestruct|Normal *(Physical)*|200|100|5|
|40|Swift|Normal *(Physical)*|60|0|20|
|46|Thunder Wave|Electric *(Special)*|0|100|20|
|51|Signal Beam|Bug *(Physical)*|75|100|15|
|57|Explosion|Normal *(Physical)*|250|100|5|
|62|Mirror Coat|Psychic *(Special)*|1|100|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Exeggcute
ID: 103

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 98|[Exeggutor](#exeggutor)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Barrage|Normal *(Physical)*|15|85|20|
|1|Uproar|Normal *(Physical)*|50|100|10|
|1|Hypnosis|Psychic *(Special)*|0|60|20|
|7|Reflect|Psychic *(Special)*|0|0|20|
|11|Leech Seed|Grass *(Special)*|0|90|10|
|17|Bullet Seed|Grass *(Special)*|25|100|30|
|19|Stun Spore|Grass *(Special)*|0|75|30|
|21|Poisonpowder|Poison *(Physical)*|0|75|35|
|23|Sleep Powder|Grass *(Special)*|0|75|15|
|27|Confusion|Psychic *(Special)*|50|100|25|
|33|Softboiled|Normal *(Physical)*|0|0|10|
|37|Nature Power|Normal *(Physical)*|0|0|20|
|43|Solarbeam|Grass *(Special)*|120|100|10|
|47|Extrasensory|Psychic *(Special)*|80|100|20|
|53|Worry Seed|Grass *(Special)*|0|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Exeggutor
ID: 104

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Seed Bomb|Grass *(Special)*|80|100|15|
|1|Barrage|Normal *(Physical)*|15|85|20|
|1|Hypnosis|Psychic *(Special)*|0|60|20|
|1|Confusion|Psychic *(Special)*|50|100|25|
|1|Stomp|Normal *(Physical)*|65|100|20|
|17|Zen Headbutt|Psychic *(Special)*|80|100|15|
|27|Egg Bomb|Normal *(Physical)*|100|75|10|
|37|Wood Hammer|Grass *(Special)*|120|100|15|
|47|Leaf Storm|Grass *(Special)*|130|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Cubone
ID: 105

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 28|[Marowak](#marowak)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|3|Tail Whip|Normal *(Physical)*|0|100|30|
|7|Bone Club|Ground *(Physical)*|65|85|20|
|11|Headbutt|Normal *(Physical)*|70|100|15|
|13|Leer|Normal *(Physical)*|0|100|30|
|17|Focus Energy|Normal *(Physical)*|0|0|30|
|21|Bonemerang|Ground *(Physical)*|50|90|10|
|23|Rage|Normal *(Physical)*|20|100|20|
|27|False Swipe|Normal *(Physical)*|40|100|40|
|31|Thrash|Normal *(Physical)*|120|100|20|
|33|Knock Off|Dark *(Special)*|65|100|25|
|37|Bone Rush|Ground *(Physical)*|25|80|10|
|41|Endeavor|Normal *(Physical)*|1|100|5|
|43|Double-Edge|Normal *(Physical)*|120|100|15|
|47|Skull Bash|Normal *(Physical)*|130|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Marowak
ID: 106

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Bone Club|Ground *(Physical)*|65|85|20|
|1|Headbutt|Normal *(Physical)*|70|100|15|
|3|Tail Whip|Normal *(Physical)*|0|100|30|
|7|Bone Club|Ground *(Physical)*|65|85|20|
|11|Headbutt|Normal *(Physical)*|70|100|15|
|13|Leer|Normal *(Physical)*|0|100|30|
|17|Focus Energy|Normal *(Physical)*|0|0|30|
|21|Bonemerang|Ground *(Physical)*|50|90|10|
|23|Rage|Normal *(Physical)*|20|100|20|
|27|False Swipe|Normal *(Physical)*|40|100|40|
|33|Thrash|Normal *(Physical)*|120|100|20|
|37|Knock Off|Dark *(Special)*|65|100|25|
|43|Bone Rush|Ground *(Physical)*|25|80|10|
|49|Endeavor|Normal *(Physical)*|1|100|5|
|53|Double-Edge|Normal *(Physical)*|120|100|15|
|59|Skull Bash|Normal *(Physical)*|130|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Hitmonlee
ID: 107

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Revenge|Fight *(Physical)*|60|100|10|
|1|Double Kick|Fight *(Physical)*|30|100|30|
|5|Meditate|Psychic *(Special)*|0|0|40|
|9|Rolling Kick|Fight *(Physical)*|60|85|15|
|13|Jump Kick|Fight *(Physical)*|100|95|10|
|17|Brick Break|Fight *(Physical)*|75|100|15|
|21|Focus Energy|Normal *(Physical)*|0|0|30|
|25|Low Kick|Fight *(Physical)*|1|100|20|
|29|Hi Jump Kick|Fight *(Physical)*|130|90|10|
|33|Mind Reader|Normal *(Physical)*|0|100|5|
|37|Foresight|Normal *(Physical)*|0|100|40|
|41|Helping Hand|Normal *(Physical)*|0|100|20|
|45|Blaze Kick|Fire *(Special)*|85|90|10|
|49|Endure|Normal *(Physical)*|0|0|10|
|53|Mega Kick|Normal *(Physical)*|120|75|5|
|57|Close Combat|Fight *(Physical)*|120|100|5|
|61|Reversal|Fight *(Physical)*|1|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Hitmonchan
ID: 108

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Revenge|Fight *(Physical)*|60|100|10|
|1|Comet Punch|Normal *(Physical)*|18|85|15|
|6|Agility|Psychic *(Special)*|0|0|30|
|11|Pursuit|Dark *(Special)*|40|100|20|
|16|Mach Punch|Fight *(Physical)*|40|100|30|
|16|Bullet Punch|Steel *(Physical)*|40|100|30|
|21|Fake Out|Normal *(Physical)*|40|100|10|
|26|Vacuum Wave|Fight *(Physical)*|40|100|30|
|31|Focus Energy|Normal *(Physical)*|0|0|30|
|36|Thunderpunch|Electric *(Special)*|75|100|15|
|36|Ice Punch|Ice *(Special)*|75|100|15|
|36|Fire Punch|Fire *(Special)*|75|100|15|
|41|Sky Uppercut|Fight *(Physical)*|85|90|15|
|46|Mega Punch|Normal *(Physical)*|80|85|20|
|51|Detect|Fight *(Physical)*|0|0|5|
|56|Focus Punch|Fight *(Physical)*|150|100|20|
|61|Counter|Fight *(Physical)*|1|100|20|
|66|Close Combat|Fight *(Physical)*|120|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Lickitung
ID: 109

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Lick|Ghost *(Physical)*|30|100|30|
|5|Supersonic|Normal *(Physical)*|0|55|20|
|9|Defense Curl|Normal *(Physical)*|0|0|40|
|13|Knock Off|Dark *(Special)*|65|100|25|
|17|Wrap|Normal *(Physical)*|15|90|20|
|21|Stomp|Normal *(Physical)*|65|100|20|
|25|Disable|Normal *(Physical)*|0|100|20|
|29|Slam|Normal *(Physical)*|80|75|20|
|33|Rollout|Rock *(Physical)*|30|90|20|
|37|Rock Climb|Normal *(Physical)*|90|85|20|
|41|Wish|Normal *(Physical)*|0|100|10|
|45|Refresh|Normal *(Physical)*|0|100|20|
|49|Screech|Normal *(Physical)*|0|85|40|
|53|Power Whip|Grass *(Special)*|120|85|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Koffing
ID: 110

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 35|[Weezing](#weezing)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Poison Gas|Poison *(Physical)*|0|90|40|
|1|Tackle|Normal *(Physical)*|50|100|35|
|4|Smog|Poison *(Physical)*|30|70|20|
|7|Smokescreen|Normal *(Physical)*|0|100|20|
|12|Assurance|Dark *(Special)*|60|100|10|
|15|Clear Smog|Poison *(Physical)*|50|0|15|
|18|Sludge|Poison *(Physical)*|65|100|20|
|23|Selfdestruct|Normal *(Physical)*|200|100|5|
|26|Haze|Ice *(Special)*|0|0|30|
|29|Dark Pulse|Dark *(Special)*|80|100|15|
|34|Sludge Bomb|Poison *(Physical)*|90|100|10|
|37|Explosion|Normal *(Physical)*|250|100|5|
|40|Destiny Bond|Ghost *(Physical)*|0|0|5|
|45|Memento|Dark *(Special)*|0|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Weezing
ID: 111

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Poison Gas|Poison *(Physical)*|0|90|40|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Smog|Poison *(Physical)*|30|70|20|
|1|Smokescreen|Normal *(Physical)*|0|100|20|
|4|Smog|Poison *(Physical)*|30|70|20|
|7|Smokescreen|Normal *(Physical)*|0|100|20|
|12|Double Hit|Normal *(Physical)*|35|100|15|
|15|Clear Smog|Poison *(Physical)*|50|0|15|
|18|Sludge|Poison *(Physical)*|65|100|20|
|23|Selfdestruct|Normal *(Physical)*|200|100|5|
|26|Haze|Ice *(Special)*|0|0|30|
|29|Dark Pulse|Dark *(Special)*|80|100|15|
|34|Sludge Bomb|Poison *(Physical)*|90|100|10|
|40|Explosion|Normal *(Physical)*|250|100|5|
|46|Destiny Bond|Ghost *(Physical)*|0|0|5|
|54|Memento|Dark *(Special)*|0|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Rhyhorn
ID: 112

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 42|[Rhydon](#rhydon)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Horn Attack|Normal *(Physical)*|65|100|25|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|8|Stomp|Normal *(Physical)*|65|100|20|
|12|Fury Attack|Normal *(Physical)*|15|85|20|
|19|Scary Face|Normal *(Physical)*|0|90|10|
|23|Rock Blast|Rock *(Physical)*|25|80|10|
|30|Bulldoze|Ground *(Physical)*|60|100|20|
|34|Rock Climb|Normal *(Physical)*|90|85|20|
|41|Take Down|Normal *(Physical)*|90|85|20|
|45|Drill Run|Ground *(Physical)*|80|100|10|
|52|Stone Edge|Rock *(Physical)*|100|80|5|
|56|Earthquake|Ground *(Physical)*|100|100|10|
|63|Horn Drill|Normal *(Physical)*|1|30|5|
|67|Megahorn|Bug *(Physical)*|120|85|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Rhydon
ID: 113

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Horn Attack|Normal *(Physical)*|65|100|25|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Stomp|Normal *(Physical)*|65|100|20|
|1|Fury Attack|Normal *(Physical)*|15|85|20|
|8|Stomp|Normal *(Physical)*|65|100|20|
|12|Fury Attack|Normal *(Physical)*|15|85|20|
|19|Scary Face|Normal *(Physical)*|0|90|10|
|23|Rock Blast|Rock *(Physical)*|25|80|10|
|30|Bulldoze|Ground *(Physical)*|60|100|20|
|34|Rock Climb|Normal *(Physical)*|90|85|20|
|41|Take Down|Normal *(Physical)*|90|85|20|
|42|Hammer Arm|Fight *(Physical)*|100|90|10|
|47|Drill Run|Ground *(Physical)*|80|100|10|
|56|Stone Edge|Rock *(Physical)*|100|80|5|
|62|Earthquake|Ground *(Physical)*|100|100|10|
|71|Horn Drill|Normal *(Physical)*|1|30|5|
|77|Megahorn|Bug *(Physical)*|120|85|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Chansey
ID: 114

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Happiness 0|[Blissey](#blissey)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|1|Pound|Normal *(Physical)*|40|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|5|Tail Whip|Normal *(Physical)*|0|100|30|
|9|Refresh|Normal *(Physical)*|0|100|20|
|12|Doubleslap|Normal *(Physical)*|15|85|10|
|16|Softboiled|Normal *(Physical)*|0|0|10|
|20|Helping Hand|Normal *(Physical)*|0|100|20|
|23|Minimize|Normal *(Physical)*|0|0|10|
|27|Take Down|Normal *(Physical)*|90|85|20|
|31|Sing|Normal *(Physical)*|0|55|15|
|34|Sweet Kiss|23 *(Physical)*|0|75|10|
|38|Heal Pulse|Psychic *(Special)*|0|0|10|
|42|Egg Bomb|Normal *(Physical)*|100|75|10|
|46|Light Screen|Psychic *(Special)*|0|0|30|
|50|Wish|Normal *(Physical)*|0|100|10|
|54|Double-Edge|Normal *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Tangela
ID: 115

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Ingrain|Grass *(Special)*|0|100|20|
|1|Constrict|Normal *(Physical)*|10|100|35|
|4|Sleep Powder|Grass *(Special)*|0|75|15|
|7|Vine Whip|Grass *(Special)*|40|100|25|
|10|Absorb|Grass *(Special)*|20|100|20|
|14|Poisonpowder|Poison *(Physical)*|0|75|35|
|17|Bind|Normal *(Physical)*|15|85|20|
|20|Growth|Normal *(Physical)*|0|0|40|
|23|Mega Drain|Grass *(Special)*|40|100|15|
|27|Knock Off|Dark *(Special)*|65|100|25|
|30|Stun Spore|Grass *(Special)*|0|75|30|
|33|Nature Power|Normal *(Physical)*|0|0|20|
|36|Giga Drain|Grass *(Special)*|75|100|10|
|40|Ancientpower|Rock *(Physical)*|60|100|5|
|43|Slam|Normal *(Physical)*|80|75|20|
|46|Tickle|Normal *(Physical)*|0|100|20|
|49|Pain Split|Normal *(Physical)*|0|100|20|
|53|Power Whip|Grass *(Special)*|120|85|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Kangaskhan
ID: 116

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Comet Punch|Normal *(Physical)*|18|85|15|
|1|Leer|Normal *(Physical)*|0|100|30|
|7|Fake Out|Normal *(Physical)*|40|100|10|
|10|Tail Whip|Normal *(Physical)*|0|100|30|
|13|Bite|Dark *(Special)*|60|100|25|
|19|Double Hit|Normal *(Physical)*|35|100|15|
|22|Rage|Normal *(Physical)*|20|100|20|
|25|Mega Punch|Normal *(Physical)*|80|85|20|
|31|Sucker Punch|Dark *(Special)*|80|100|5|
|34|Dizzy Punch|Normal *(Physical)*|70|100|10|
|37|Crunch|Dark *(Special)*|80|100|15|
|43|Endure|Normal *(Physical)*|0|0|10|
|46|Drain Punch|Fight *(Physical)*|75|100|10|
|49|Outrage|Dragon *(Special)*|120|100|10|
|55|Reversal|Fight *(Physical)*|1|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Horsea
ID: 117

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 32|[Seadra](#seadra)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bubble|Water *(Special)*|30|100|30|
|4|Smokescreen|Normal *(Physical)*|0|100|20|
|8|Leer|Normal *(Physical)*|0|100|30|
|11|Water Gun|Water *(Special)*|40|100|25|
|14|Focus Energy|Normal *(Physical)*|0|0|30|
|18|Bubblebeam|Water *(Special)*|65|100|20|
|23|Agility|Psychic *(Special)*|0|0|30|
|26|Twister|Dragon *(Special)*|40|100|20|
|30|Brine|Water *(Special)*|65|100|10|
|35|Hydro Pump|Water *(Special)*|110|80|5|
|38|Dragon Dance|Dragon *(Special)*|0|0|20|
|42|Dragon Pulse|Dragon *(Special)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Seadra
ID: 118

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 50|[Kingdra](#kingdra)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bubble|Water *(Special)*|30|100|30|
|1|Smokescreen|Normal *(Physical)*|0|100|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Water Gun|Water *(Special)*|40|100|25|
|4|Smokescreen|Normal *(Physical)*|0|100|20|
|8|Leer|Normal *(Physical)*|0|100|30|
|11|Water Gun|Water *(Special)*|40|100|25|
|14|Focus Energy|Normal *(Physical)*|0|0|30|
|18|Bubblebeam|Water *(Special)*|65|100|20|
|23|Agility|Psychic *(Special)*|0|0|30|
|26|Twister|Dragon *(Special)*|40|100|20|
|30|Brine|Water *(Special)*|65|100|10|
|32|Dragonbreath|Dragon *(Special)*|60|100|20|
|40|Hydro Pump|Water *(Special)*|110|80|5|
|48|Dragon Dance|Dragon *(Special)*|0|0|20|
|57|Dragon Pulse|Dragon *(Special)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Goldeen
ID: 119

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 33|[Seaking](#seaking)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Water Sport|Water *(Special)*|0|100|15|
|7|Supersonic|Normal *(Physical)*|0|55|20|
|11|Horn Attack|Normal *(Physical)*|65|100|25|
|17|Water Pulse|Water *(Special)*|60|100|20|
|21|Flail|Normal *(Physical)*|1|100|15|
|27|Mud Sport|Ground *(Physical)*|0|100|15|
|31|Fury Attack|Normal *(Physical)*|15|85|20|
|37|Waterfall|Water *(Special)*|80|100|15|
|41|Horn Drill|Normal *(Physical)*|1|30|5|
|47|Agility|Psychic *(Special)*|0|0|30|
|51|Rain Dance|Water *(Special)*|0|0|5|
|57|Megahorn|Bug *(Physical)*|120|85|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Seaking
ID: 120

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Poison Jab|Poison *(Physical)*|80|100|20|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Water Sport|Water *(Special)*|0|100|15|
|1|Supersonic|Normal *(Physical)*|0|55|20|
|7|Supersonic|Normal *(Physical)*|0|55|20|
|11|Horn Attack|Normal *(Physical)*|65|100|25|
|17|Water Pulse|Water *(Special)*|60|100|20|
|21|Flail|Normal *(Physical)*|1|100|15|
|27|Mud Sport|Ground *(Physical)*|0|100|15|
|31|Fury Attack|Normal *(Physical)*|15|85|20|
|33|Drill Run|Ground *(Physical)*|80|100|10|
|40|Waterfall|Water *(Special)*|80|100|15|
|47|Horn Drill|Normal *(Physical)*|1|30|5|
|56|Agility|Psychic *(Special)*|0|0|30|
|63|Rain Dance|Water *(Special)*|0|0|5|
|72|Megahorn|Bug *(Physical)*|120|85|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Staryu
ID: 121

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 97|[Starmie](#starmie)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|6|Water Gun|Water *(Special)*|40|100|25|
|10|Rapid Spin|Normal *(Physical)*|20|100|40|
|12|Recover|Normal *(Physical)*|0|0|10|
|15|Camouflage|Normal *(Physical)*|0|100|20|
|18|Swift|Normal *(Physical)*|60|0|20|
|22|Bubblebeam|Water *(Special)*|65|100|20|
|25|Minimize|Normal *(Physical)*|0|0|10|
|30|Signal Beam|Bug *(Physical)*|75|100|15|
|33|Light Screen|Psychic *(Special)*|0|0|30|
|36|Brine|Water *(Special)*|65|100|10|
|40|Recycle|Normal *(Physical)*|0|100|10|
|43|Power Gem|Rock *(Physical)*|80|100|20|
|48|Cosmic Power|Psychic *(Special)*|0|0|20|
|52|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Starmie
ID: 122

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Water Gun|Water *(Special)*|40|100|25|
|1|Rapid Spin|Normal *(Physical)*|20|100|40|
|1|Recover|Normal *(Physical)*|0|0|10|
|1|Swift|Normal *(Physical)*|60|0|20|
|22|Confuse Ray|Ghost *(Physical)*|0|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Mr. Mime
ID: 123

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Magical Leaf|Grass *(Special)*|60|0|20|
|1|Nasty Plot|Dark *(Special)*|0|0|20|
|1|Barrier|Psychic *(Special)*|0|0|20|
|1|Confusion|Psychic *(Special)*|50|100|25|
|1|Tickle|Normal *(Physical)*|0|100|20|
|1|Copycat|Normal *(Physical)*|0|0|20|
|8|Meditate|Psychic *(Special)*|0|0|40|
|11|Doubleslap|Normal *(Physical)*|15|85|10|
|15|Mimic|Normal *(Physical)*|0|100|10|
|18|Psywave|Psychic *(Special)*|1|100|15|
|22|Encore|Normal *(Physical)*|0|100|5|
|25|Light Screen|Psychic *(Special)*|0|0|30|
|25|Reflect|Psychic *(Special)*|0|0|20|
|29|Psybeam|Psychic *(Special)*|65|100|20|
|32|Substitute|Normal *(Physical)*|0|0|10|
|36|Recycle|Normal *(Physical)*|0|100|10|
|39|Trick|Psychic *(Special)*|0|100|10|
|43|Psychic|Psychic *(Special)*|90|100|10|
|46|Role Play|Psychic *(Special)*|0|100|10|
|50|Baton Pass|Normal *(Physical)*|0|0|40|
|54|Safeguard|Normal *(Physical)*|0|0|25|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Scyther
ID: 124

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 44|[Scizor](#scizor)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Vacuum Wave|Fight *(Physical)*|40|100|30|
|1|Quick Attack|Normal *(Physical)*|40|100|30|
|1|Leer|Normal *(Physical)*|0|100|30|
|5|Focus Energy|Normal *(Physical)*|0|0|30|
|9|Pursuit|Dark *(Special)*|40|100|20|
|13|False Swipe|Normal *(Physical)*|40|100|40|
|17|Agility|Psychic *(Special)*|0|0|30|
|21|Wing Attack|Flying *(Physical)*|60|100|35|
|25|Fury Cutter|Bug *(Physical)*|40|95|20|
|29|Slash|Normal *(Physical)*|70|100|20|
|33|Razor Wind|Normal *(Physical)*|80|100|10|
|37|Double Team|Normal *(Physical)*|0|0|15|
|41|X-Scissor|Bug *(Physical)*|80|100|15|
|45|Night Slash|Dark *(Special)*|70|100|20|
|49|Double Hit|Normal *(Physical)*|35|100|15|
|53|Air Slash|Flying *(Physical)*|75|95|15|
|57|Swords Dance|Normal *(Physical)*|0|0|20|
|61|Baton Pass|Normal *(Physical)*|0|0|40|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Jynx
ID: 125

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Nasty Plot|Dark *(Special)*|0|0|20|
|1|Pound|Normal *(Physical)*|40|100|35|
|1|Lick|Ghost *(Physical)*|30|100|30|
|1|Lovely Kiss|Normal *(Physical)*|0|75|10|
|1|Powder Snow|Ice *(Special)*|40|100|25|
|5|Lick|Ghost *(Physical)*|30|100|30|
|8|Lovely Kiss|Normal *(Physical)*|0|75|10|
|11|Powder Snow|Ice *(Special)*|40|100|25|
|15|Doubleslap|Normal *(Physical)*|15|85|10|
|18|Ice Punch|Ice *(Special)*|75|100|15|
|21|Heart Stamp|Psychic *(Special)*|60|100|25|
|25|Mean Look|Normal *(Physical)*|0|100|5|
|28|Fake Tears|Dark *(Special)*|0|100|20|
|33|Wake-Up Slap|Fight *(Physical)*|70|100|10|
|39|Avalanche|Ice *(Special)*|60|100|10|
|44|Body Slam|Normal *(Physical)*|85|100|15|
|49|Psychic|Psychic *(Special)*|90|100|10|
|55|Perish Song|Normal *(Physical)*|0|0|5|
|60|Blizzard|Ice *(Special)*|110|70|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Electabuzz
ID: 126

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Quick Attack|Normal *(Physical)*|40|100|30|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Thundershock|Electric *(Special)*|40|100|30|
|5|Thundershock|Electric *(Special)*|40|100|30|
|8|Low Kick|Fight *(Physical)*|1|100|20|
|12|Swift|Normal *(Physical)*|60|0|20|
|15|Shock Wave|Electric *(Special)*|60|0|20|
|19|Thunder Wave|Electric *(Special)*|0|100|20|
|22|Electroweb|Electric *(Special)*|55|95|15|
|26|Light Screen|Psychic *(Special)*|0|0|30|
|29|Thunderpunch|Electric *(Special)*|75|100|15|
|36|Discharge|Electric *(Special)*|80|100|15|
|42|Screech|Normal *(Physical)*|0|85|40|
|49|Thunderbolt|Electric *(Special)*|90|100|15|
|55|Thunder|Electric *(Special)*|110|70|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Magmar
ID: 127

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Smog|Poison *(Physical)*|30|70|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Ember|Fire *(Special)*|40|100|25|
|5|Ember|Fire *(Special)*|40|100|25|
|8|Smokescreen|Normal *(Physical)*|0|100|20|
|12|Feint Attack|Dark *(Special)*|60|0|20|
|15|Fire Spin|Fire *(Special)*|35|85|15|
|19|Clear Smog|Poison *(Physical)*|50|0|15|
|22|Flame Burst|Fire *(Special)*|70|100|15|
|26|Confuse Ray|Ghost *(Physical)*|0|100|10|
|29|Fire Punch|Fire *(Special)*|75|100|15|
|36|Lava Plume|Fire *(Special)*|80|100|15|
|42|Sunny Day|Fire *(Special)*|0|0|5|
|49|Flamethrower|Fire *(Special)*|90|100|15|
|55|Fire Blast|Fire *(Special)*|110|85|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Pinsir
ID: 128

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Vicegrip|Normal *(Physical)*|55|100|30|
|1|Focus Energy|Normal *(Physical)*|0|0|30|
|4|Bind|Normal *(Physical)*|15|85|20|
|8|Seismic Toss|Fight *(Physical)*|1|100|20|
|11|Harden|Normal *(Physical)*|0|0|30|
|15|Revenge|Fight *(Physical)*|60|100|10|
|18|Brick Break|Fight *(Physical)*|75|100|15|
|22|Vital Throw|Fight *(Physical)*|70|100|10|
|26|Submission|Fight *(Physical)*|80|80|25|
|29|X-Scissor|Bug *(Physical)*|80|100|15|
|33|Storm Throw|Fight *(Physical)*|60|100|10|
|36|Thrash|Normal *(Physical)*|120|100|20|
|40|Swords Dance|Normal *(Physical)*|0|0|20|
|43|Superpower|Fight *(Physical)*|120|100|5|
|47|Guillotine|Normal *(Physical)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Tauros
ID: 129

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|3|Tail Whip|Normal *(Physical)*|0|100|30|
|5|Rage|Normal *(Physical)*|20|100|20|
|8|Horn Attack|Normal *(Physical)*|65|100|25|
|11|Scary Face|Normal *(Physical)*|0|90|10|
|15|Pursuit|Dark *(Special)*|40|100|20|
|19|Rest|Psychic *(Special)*|0|0|10|
|24|Payback|Dark *(Special)*|50|100|10|
|29|Work Up|Normal *(Physical)*|0|0|20|
|35|Zen Headbutt|Psychic *(Special)*|80|100|15|
|41|Take Down|Normal *(Physical)*|90|85|20|
|48|Swagger|Normal *(Physical)*|0|90|15|
|55|Thrash|Normal *(Physical)*|120|100|20|
|63|Giga Impact|Normal *(Physical)*|150|90|5|

## Magikarp
ID: 130

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 20|[Gyarados](#gyarados)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Splash|Normal *(Physical)*|0|0|40|
|15|Tackle|Normal *(Physical)*|50|100|35|
|30|Flail|Normal *(Physical)*|1|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Gyarados
ID: 131

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Thrash|Normal *(Physical)*|120|100|20|
|20|Bite|Dark *(Special)*|60|100|25|
|23|Dragon Rage|Dragon *(Special)*|1|100|10|
|26|Leer|Normal *(Physical)*|0|100|30|
|29|Twister|Dragon *(Special)*|40|100|20|
|32|Ice Fang|Ice *(Special)*|65|95|15|
|35|Aqua Tail|Water *(Special)*|90|90|10|
|38|Rain Dance|Water *(Special)*|0|0|5|
|41|Hydro Pump|Water *(Special)*|110|80|5|
|44|Dragon Dance|Dragon *(Special)*|0|0|20|
|47|Hyper Beam|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Lapras
ID: 132

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Sing|Normal *(Physical)*|0|55|15|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Water Gun|Water *(Special)*|40|100|25|
|4|Mist|Ice *(Special)*|0|0|30|
|7|Confuse Ray|Ghost *(Physical)*|0|100|10|
|10|Ice Shard|Ice *(Special)*|40|100|30|
|14|Water Pulse|Water *(Special)*|60|100|20|
|18|Body Slam|Normal *(Physical)*|85|100|15|
|22|Rain Dance|Water *(Special)*|0|0|5|
|27|Perish Song|Normal *(Physical)*|0|0|5|
|32|Ice Beam|Ice *(Special)*|90|100|10|
|37|Aqua Tail|Water *(Special)*|90|90|10|
|43|Safeguard|Normal *(Physical)*|0|0|25|
|49|Hydro Pump|Water *(Special)*|110|80|5|
|55|Sheer Cold|Ice *(Special)*|1|30|5|

## Ditto
ID: 133

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Transform|Normal *(Physical)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|

## Eevee
ID: 134

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 93|[Espeon](#espeon)|
|Stone 94|[Umbreon](#umbreon)|
|Stone 95|[Flareon](#flareon)|
|Stone 96|[Jolteon](#jolteon)|
|Stone 97|[Vaporeon](#vaporeon)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Helping Hand|Normal *(Physical)*|0|100|20|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|5|Sand-Attack|Ground *(Physical)*|0|100|15|
|9|Round Eyes|23 *(Physical)*|0|100|30|
|13|Quick Attack|Normal *(Physical)*|40|100|30|
|17|Bite|Dark *(Special)*|60|100|25|
|21|Covet|Normal *(Physical)*|60|100|40|
|25|Take Down|Normal *(Physical)*|90|85|20|
|29|Charm|23 *(Physical)*|0|100|20|
|33|Baton Pass|Normal *(Physical)*|0|0|40|
|37|Double-Edge|Normal *(Physical)*|120|100|15|
|41|Wish|Normal *(Physical)*|0|100|10|
|45|Heal Bell|Normal *(Physical)*|0|0|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Vaporeon
ID: 135

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Helping Hand|Normal *(Physical)*|0|100|20|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|5|Sand-Attack|Ground *(Physical)*|0|100|15|
|9|Water Gun|Water *(Special)*|40|100|25|
|13|Quick Attack|Normal *(Physical)*|40|100|30|
|17|Water Pulse|Water *(Special)*|60|100|20|
|21|Aurora Beam|Ice *(Special)*|65|100|20|
|25|Take Down|Normal *(Physical)*|90|85|20|
|29|Acid Armor|Poison *(Physical)*|0|0|40|
|33|Haze|Ice *(Special)*|0|0|30|
|37|Muddy Water|Water *(Special)*|90|85|10|
|41|Wish|Normal *(Physical)*|0|100|10|
|45|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Jolteon
ID: 136

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Helping Hand|Normal *(Physical)*|0|100|20|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|5|Sand-Attack|Ground *(Physical)*|0|100|15|
|9|Thundershock|Electric *(Special)*|40|100|30|
|13|Quick Attack|Normal *(Physical)*|40|100|30|
|17|Double Kick|Fight *(Physical)*|30|100|30|
|21|Thunder Fang|Electric *(Special)*|65|95|15|
|25|Pin Missile|Bug *(Physical)*|25|95|20|
|29|Agility|Psychic *(Special)*|0|0|30|
|33|Thunder Wave|Electric *(Special)*|0|100|20|
|37|Discharge|Electric *(Special)*|80|100|15|
|41|Wish|Normal *(Physical)*|0|100|10|
|45|Thunder|Electric *(Special)*|110|70|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|

## Flareon
ID: 137

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Helping Hand|Normal *(Physical)*|0|100|20|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|5|Sand-Attack|Ground *(Physical)*|0|100|15|
|9|Ember|Fire *(Special)*|40|100|25|
|13|Quick Attack|Normal *(Physical)*|40|100|30|
|17|Bite|Dark *(Special)*|60|100|25|
|21|Fire Fang|Fire *(Special)*|65|95|15|
|25|Fire Spin|Fire *(Special)*|35|85|15|
|29|Scary Face|Normal *(Physical)*|0|90|10|
|33|Smog|Poison *(Physical)*|30|70|20|
|37|Lava Plume|Fire *(Special)*|80|100|15|
|41|Wish|Normal *(Physical)*|0|100|10|
|45|Flare Blitz|Fire *(Special)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Porygon
ID: 138

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 36|[Porygon2](#porygon2)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Conversion|Normal *(Physical)*|0|0|30|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Conversion 2|Normal *(Physical)*|0|100|30|
|1|Sharpen|Normal *(Physical)*|0|0|30|
|7|Psybeam|Psychic *(Special)*|65|100|20|
|12|Agility|Psychic *(Special)*|0|0|30|
|18|Recover|Normal *(Physical)*|0|0|10|
|23|Curse|??? *(Physical)*|0|0|10|
|29|Signal Beam|Bug *(Physical)*|75|100|15|
|34|Recycle|Normal *(Physical)*|0|100|10|
|40|Discharge|Electric *(Special)*|80|100|15|
|45|Lock-On|Normal *(Physical)*|0|100|5|
|51|Tri Attack|Normal *(Physical)*|80|100|10|
|56|Magic Coat|Psychic *(Special)*|0|100|15|
|62|Zap Cannon|Electric *(Special)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Omanyte
ID: 139

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 40|[Omastar](#omastar)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Constrict|Normal *(Physical)*|10|100|35|
|1|Withdraw|Water *(Special)*|0|0|40|
|7|Bite|Dark *(Special)*|60|100|25|
|10|Water Gun|Water *(Special)*|40|100|25|
|16|Rollout|Rock *(Physical)*|30|90|20|
|19|Leer|Normal *(Physical)*|0|100|30|
|25|Mud Shot|Ground *(Physical)*|55|95|15|
|28|Protect|Normal *(Physical)*|0|0|10|
|34|Muddy Water|Water *(Special)*|90|85|10|
|37|Ancientpower|Rock *(Physical)*|60|100|5|
|43|Tickle|Normal *(Physical)*|0|100|20|
|46|Rock Blast|Rock *(Physical)*|25|80|10|
|52|Shell Smash|Normal *(Physical)*|0|0|15|
|55|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Omastar
ID: 140

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Constrict|Normal *(Physical)*|10|100|35|
|1|Withdraw|Water *(Special)*|0|0|40|
|1|Bite|Dark *(Special)*|60|100|25|
|7|Bite|Dark *(Special)*|60|100|25|
|10|Water Gun|Water *(Special)*|40|100|25|
|16|Rollout|Rock *(Physical)*|30|90|20|
|19|Leer|Normal *(Physical)*|0|100|30|
|25|Mud Shot|Ground *(Physical)*|55|95|15|
|28|Protect|Normal *(Physical)*|0|0|10|
|34|Muddy Water|Water *(Special)*|90|85|10|
|37|Ancientpower|Rock *(Physical)*|60|100|5|
|40|Spike Cannon|Normal *(Physical)*|20|100|15|
|40|Spikes|Ground *(Physical)*|0|0|20|
|48|Tickle|Normal *(Physical)*|0|100|20|
|56|Rock Blast|Rock *(Physical)*|25|80|10|
|67|Shell Smash|Normal *(Physical)*|0|0|15|
|75|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|

## Kabuto
ID: 141

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 40|[Kabutops](#kabutops)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|6|Absorb|Grass *(Special)*|20|100|20|
|11|Leer|Normal *(Physical)*|0|100|30|
|16|Mud Shot|Ground *(Physical)*|55|95|15|
|21|Sand-Attack|Ground *(Physical)*|0|100|15|
|26|Endure|Normal *(Physical)*|0|0|10|
|31|Aqua Jet|Water *(Special)*|40|100|30|
|36|Mega Drain|Grass *(Special)*|40|100|15|
|41|Metal Sound|Steel *(Physical)*|0|85|40|
|46|Ancientpower|Rock *(Physical)*|60|100|5|
|51|Giga Drain|Grass *(Special)*|75|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Kabutops
ID: 142

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|X-Scissor|Bug *(Physical)*|80|100|15|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|1|Absorb|Grass *(Special)*|20|100|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|6|Absorb|Grass *(Special)*|20|100|20|
|11|Leer|Normal *(Physical)*|0|100|30|
|16|Mud Shot|Ground *(Physical)*|55|95|15|
|21|Sand-Attack|Ground *(Physical)*|0|100|15|
|26|Endure|Normal *(Physical)*|0|0|10|
|31|Aqua Jet|Water *(Special)*|40|100|30|
|36|Mega Drain|Grass *(Special)*|40|100|15|
|40|Slash|Normal *(Physical)*|70|100|20|
|45|Metal Sound|Steel *(Physical)*|0|85|40|
|54|Ancientpower|Rock *(Physical)*|60|100|5|
|63|Giga Drain|Grass *(Special)*|75|100|10|
|72|Night Slash|Dark *(Special)*|70|100|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Aerodactyl
ID: 143

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Ice Fang|Ice *(Special)*|65|95|15|
|1|Fire Fang|Fire *(Special)*|65|95|15|
|1|Thunder Fang|Electric *(Special)*|65|95|15|
|1|Wing Attack|Flying *(Physical)*|60|100|35|
|1|Supersonic|Normal *(Physical)*|0|55|20|
|1|Bite|Dark *(Special)*|60|100|25|
|1|Scary Face|Normal *(Physical)*|0|90|10|
|9|Roar|Normal *(Physical)*|0|100|20|
|17|Agility|Psychic *(Special)*|0|0|30|
|25|Ancientpower|Rock *(Physical)*|60|100|5|
|33|Crunch|Dark *(Special)*|80|100|15|
|41|Take Down|Normal *(Physical)*|90|85|20|
|49|Earth Power|Ground *(Physical)*|90|100|10|
|57|Iron Head|Steel *(Physical)*|80|100|15|
|65|Hyper Beam|Normal *(Physical)*|150|90|5|
|73|Rock Slide|Rock *(Physical)*|75|90|10|
|81|Giga Impact|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|

## Snorlax
ID: 144

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|4|Defense Curl|Normal *(Physical)*|0|0|40|
|9|Amnesia|Psychic *(Special)*|0|0|20|
|12|Lick|Ghost *(Physical)*|30|100|30|
|17|Belly Drum|Normal *(Physical)*|0|0|10|
|20|Yawn|Normal *(Physical)*|0|100|10|
|25|Pursuit|Dark *(Special)*|40|100|20|
|28|Rest|Psychic *(Special)*|0|0|10|
|33|Snore|Normal *(Physical)*|50|100|15|
|33|Sleep Talk|Normal *(Physical)*|0|0|10|
|36|Body Slam|Normal *(Physical)*|85|100|15|
|41|Block|Normal *(Physical)*|0|100|5|
|44|Rollout|Rock *(Physical)*|30|90|20|
|49|Crunch|Dark *(Special)*|80|100|15|
|52|Selfdestruct|Normal *(Physical)*|200|100|5|
|57|Giga Impact|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Articuno
ID: 145

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Gust|Flying *(Physical)*|40|100|35|
|1|Powder Snow|Ice *(Special)*|40|100|25|
|8|Mist|Ice *(Special)*|0|0|30|
|15|Ice Shard|Ice *(Special)*|40|100|30|
|22|Mind Reader|Normal *(Physical)*|0|100|5|
|29|Ancientpower|Rock *(Physical)*|60|100|5|
|36|Agility|Psychic *(Special)*|0|0|30|
|43|Ice Beam|Ice *(Special)*|90|100|10|
|50|Reflect|Psychic *(Special)*|0|0|20|
|57|Roost|Flying *(Physical)*|0|0|10|
|64|Heal Bell|Normal *(Physical)*|0|0|5|
|71|Blizzard|Ice *(Special)*|110|70|5|
|78|Sheer Cold|Ice *(Special)*|1|30|5|
|85|Hail|Ice *(Special)*|0|0|10|
|92|Hurricane|Flying *(Physical)*|110|70|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Zapdos
ID: 146

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Thundershock|Electric *(Special)*|40|100|30|
|8|Thunder Wave|Electric *(Special)*|0|100|20|
|15|Detect|Fight *(Physical)*|0|0|5|
|22|Pluck|Flying *(Physical)*|60|100|20|
|29|Ancientpower|Rock *(Physical)*|60|100|5|
|36|Charge|Electric *(Special)*|0|100|20|
|43|Agility|Psychic *(Special)*|0|0|30|
|50|Discharge|Electric *(Special)*|80|100|15|
|57|Roost|Flying *(Physical)*|0|0|10|
|64|Light Screen|Psychic *(Special)*|0|0|30|
|71|Drill Peck|Flying *(Physical)*|80|100|20|
|78|Thunder|Electric *(Special)*|110|70|10|
|85|Rain Dance|Water *(Special)*|0|0|5|
|92|Zap Cannon|Electric *(Special)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Moltres
ID: 147

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Wing Attack|Flying *(Physical)*|60|100|35|
|1|Ember|Fire *(Special)*|40|100|25|
|8|Fire Spin|Fire *(Special)*|35|85|15|
|15|Agility|Psychic *(Special)*|0|0|30|
|22|Endure|Normal *(Physical)*|0|0|10|
|29|Ancientpower|Rock *(Physical)*|60|100|5|
|36|Flamethrower|Fire *(Special)*|90|100|15|
|43|Safeguard|Normal *(Physical)*|0|0|25|
|50|Air Slash|Flying *(Physical)*|75|95|15|
|57|Roost|Flying *(Physical)*|0|0|10|
|64|Heat Wave|Fire *(Special)*|100|90|10|
|71|Solarbeam|Grass *(Special)*|120|100|10|
|78|Sky Attack|Flying *(Physical)*|140|90|5|
|85|Sunny Day|Fire *(Special)*|0|0|5|
|92|Hurricane|Flying *(Physical)*|110|70|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|

## Dratini
ID: 148

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Dragonair](#dragonair)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Wrap|Normal *(Physical)*|15|90|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|5|Thunder Wave|Electric *(Special)*|0|100|20|
|11|Twister|Dragon *(Special)*|40|100|20|
|15|Dragon Rage|Dragon *(Special)*|1|100|10|
|21|Slam|Normal *(Physical)*|80|75|20|
|25|Agility|Psychic *(Special)*|0|0|30|
|31|Dragon Tail|Dragon *(Special)*|60|90|10|
|35|Aqua Tail|Water *(Special)*|90|90|10|
|41|Dragon Pulse|Dragon *(Special)*|90|100|10|
|45|Safeguard|Normal *(Physical)*|0|0|25|
|51|Dragon Dance|Dragon *(Special)*|0|0|20|
|55|Outrage|Dragon *(Special)*|120|100|10|
|61|Hyper Beam|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|

## Dragonair
ID: 149

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 55|[Dragonite](#dragonite)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Wrap|Normal *(Physical)*|15|90|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Thunder Wave|Electric *(Special)*|0|100|20|
|1|Twister|Dragon *(Special)*|40|100|20|
|5|Thunder Wave|Electric *(Special)*|0|100|20|
|11|Twister|Dragon *(Special)*|40|100|20|
|15|Dragon Rage|Dragon *(Special)*|1|100|10|
|21|Slam|Normal *(Physical)*|80|75|20|
|25|Agility|Psychic *(Special)*|0|0|30|
|33|Dragon Tail|Dragon *(Special)*|60|90|10|
|39|Aqua Tail|Water *(Special)*|90|90|10|
|47|Dragon Pulse|Dragon *(Special)*|90|100|10|
|53|Safeguard|Normal *(Physical)*|0|0|25|
|61|Dragon Dance|Dragon *(Special)*|0|0|20|
|67|Outrage|Dragon *(Special)*|120|100|10|
|75|Hyper Beam|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Dragonite
ID: 150

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Fire Punch|Fire *(Special)*|75|100|15|
|1|Thunderpunch|Electric *(Special)*|75|100|15|
|1|Roost|Flying *(Physical)*|0|0|10|
|1|Extremespeed|Normal *(Physical)*|80|100|5|
|1|Wrap|Normal *(Physical)*|15|90|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Thunder Wave|Electric *(Special)*|0|100|20|
|1|Twister|Dragon *(Special)*|40|100|20|
|5|Thunder Wave|Electric *(Special)*|0|100|20|
|11|Twister|Dragon *(Special)*|40|100|20|
|15|Dragon Rage|Dragon *(Special)*|1|100|10|
|21|Slam|Normal *(Physical)*|80|75|20|
|25|Agility|Psychic *(Special)*|0|0|30|
|33|Dragon Tail|Dragon *(Special)*|60|90|10|
|39|Aqua Tail|Water *(Special)*|90|90|10|
|47|Dragon Pulse|Dragon *(Special)*|90|100|10|
|53|Safeguard|Normal *(Physical)*|0|0|25|
|55|Wing Attack|Flying *(Physical)*|60|100|35|
|61|Dragon Dance|Dragon *(Special)*|0|0|20|
|67|Outrage|Dragon *(Special)*|120|100|10|
|75|Hyper Beam|Normal *(Physical)*|150|90|5|
|81|Hurricane|Flying *(Physical)*|110|70|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Mewtwo
ID: 151

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Confusion|Psychic *(Special)*|50|100|25|
|1|Disable|Normal *(Physical)*|0|100|20|
|1|Barrier|Psychic *(Special)*|0|0|20|
|8|Swift|Normal *(Physical)*|60|0|20|
|15|Future Sight|Psychic *(Special)*|120|100|15|
|22|Psych Up|Normal *(Physical)*|0|0|10|
|29|Miracle Eye|Psychic *(Special)*|0|100|40|
|36|Mist|Ice *(Special)*|0|0|30|
|43|Psycho Cut|Psychic *(Special)*|70|100|20|
|50|Amnesia|Psychic *(Special)*|0|0|20|
|57|Reflect|Psychic *(Special)*|0|0|20|
|57|Light Screen|Psychic *(Special)*|0|0|30|
|64|Psychic|Psychic *(Special)*|90|100|10|
|71|Mimic|Normal *(Physical)*|0|100|10|
|79|Recover|Normal *(Physical)*|0|0|10|
|86|Safeguard|Normal *(Physical)*|0|0|25|
|93|Aura Sphere|Fight *(Physical)*|80|0|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Mew
ID: 152

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Pound|Normal *(Physical)*|40|100|35|
|1|Transform|Normal *(Physical)*|0|0|10|
|1|Safeguard|Normal *(Physical)*|0|0|25|
|10|Mega Punch|Normal *(Physical)*|80|85|20|
|20|Metronome|Normal *(Physical)*|0|0|10|
|30|Psychic|Psychic *(Special)*|90|100|10|
|40|Barrier|Psychic *(Special)*|0|0|20|
|50|Ancientpower|Rock *(Physical)*|60|100|5|
|60|Amnesia|Psychic *(Special)*|0|0|20|
|70|Mimic|Normal *(Physical)*|0|100|10|
|80|Baton Pass|Normal *(Physical)*|0|0|40|
|90|Nasty Plot|Dark *(Special)*|0|0|20|
|100|Aura Sphere|Fight *(Physical)*|80|0|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Chikorita
ID: 153

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 16|[Bayleef](#bayleef)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|6|Razor Leaf|Grass *(Special)*|55|95|25|
|9|Poisonpowder|Poison *(Physical)*|0|75|35|
|12|Synthesis|Grass *(Special)*|0|0|5|
|17|Reflect|Psychic *(Special)*|0|0|20|
|20|Magical Leaf|Grass *(Special)*|60|0|20|
|23|Nature Power|Normal *(Physical)*|0|0|20|
|28|Sweet Scent|Normal *(Physical)*|0|100|20|
|31|Light Screen|Psychic *(Special)*|0|0|30|
|34|Body Slam|Normal *(Physical)*|85|100|15|
|39|Safeguard|Normal *(Physical)*|0|0|25|
|42|Aromatherapy|Grass *(Special)*|0|0|5|
|45|Solarbeam|Grass *(Special)*|120|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Bayleef
ID: 154

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 32|[Meganium](#meganium)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Razor Leaf|Grass *(Special)*|55|95|25|
|1|Poisonpowder|Poison *(Physical)*|0|75|35|
|6|Razor Leaf|Grass *(Special)*|55|95|25|
|9|Poisonpowder|Poison *(Physical)*|0|75|35|
|12|Synthesis|Grass *(Special)*|0|0|5|
|18|Reflect|Psychic *(Special)*|0|0|20|
|22|Magical Leaf|Grass *(Special)*|60|0|20|
|26|Nature Power|Normal *(Physical)*|0|0|20|
|32|Sweet Scent|Normal *(Physical)*|0|100|20|
|36|Light Screen|Psychic *(Special)*|0|0|30|
|40|Body Slam|Normal *(Physical)*|85|100|15|
|46|Safeguard|Normal *(Physical)*|0|0|25|
|50|Aromatherapy|Grass *(Special)*|0|0|5|
|54|Solarbeam|Grass *(Special)*|120|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Meganium
ID: 155

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Heal Pulse|Psychic *(Special)*|0|0|10|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Razor Leaf|Grass *(Special)*|55|95|25|
|1|Poisonpowder|Poison *(Physical)*|0|75|35|
|6|Razor Leaf|Grass *(Special)*|55|95|25|
|9|Poisonpowder|Poison *(Physical)*|0|75|35|
|12|Synthesis|Grass *(Special)*|0|0|5|
|18|Reflect|Psychic *(Special)*|0|0|20|
|22|Magical Leaf|Grass *(Special)*|60|0|20|
|26|Nature Power|Normal *(Physical)*|0|0|20|
|32|Petal Dance|Grass *(Special)*|120|100|10|
|34|Sweet Scent|Normal *(Physical)*|0|100|20|
|40|Light Screen|Psychic *(Special)*|0|0|30|
|46|Body Slam|Normal *(Physical)*|85|100|15|
|54|Safeguard|Normal *(Physical)*|0|0|25|
|60|Aromatherapy|Grass *(Special)*|0|0|5|
|66|Solarbeam|Grass *(Special)*|120|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM01|Cut|Normal *(Physical)*|50|95|30|

## Cyndaquil
ID: 156

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 14|[Quilava](#quilava)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|6|Smokescreen|Normal *(Physical)*|0|100|20|
|10|Ember|Fire *(Special)*|40|100|25|
|13|Quick Attack|Normal *(Physical)*|40|100|30|
|19|Flame Wheel|Fire *(Special)*|60|100|25|
|22|Defense Curl|Normal *(Physical)*|0|0|40|
|28|Flame Charge|Fire *(Special)*|50|100|20|
|31|Swift|Normal *(Physical)*|60|0|20|
|37|Lava Plume|Fire *(Special)*|80|100|15|
|40|Flamethrower|Fire *(Special)*|90|100|15|
|46|Inferno|Fire *(Special)*|100|50|5|
|49|Rollout|Rock *(Physical)*|30|90|20|
|55|Double-Edge|Normal *(Physical)*|120|100|15|
|58|Eruption|Fire *(Special)*|150|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Quilava
ID: 157

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 36|[Typhlosion](#typhlosion)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Smokescreen|Normal *(Physical)*|0|100|20|
|6|Smokescreen|Normal *(Physical)*|0|100|20|
|10|Ember|Fire *(Special)*|40|100|25|
|13|Quick Attack|Normal *(Physical)*|40|100|30|
|20|Flame Wheel|Fire *(Special)*|60|100|25|
|24|Defense Curl|Normal *(Physical)*|0|0|40|
|31|Swift|Normal *(Physical)*|60|0|20|
|35|Flame Charge|Fire *(Special)*|50|100|20|
|42|Lava Plume|Fire *(Special)*|80|100|15|
|46|Flamethrower|Fire *(Special)*|90|100|15|
|53|Inferno|Fire *(Special)*|100|50|5|
|57|Rollout|Rock *(Physical)*|30|90|20|
|64|Double-Edge|Normal *(Physical)*|120|100|15|
|68|Eruption|Fire *(Special)*|150|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Typhlosion
ID: 158

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Extrasensory|Psychic *(Special)*|80|100|20|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Smokescreen|Normal *(Physical)*|0|100|20|
|1|Ember|Fire *(Special)*|40|100|25|
|6|Smokescreen|Normal *(Physical)*|0|100|20|
|10|Ember|Fire *(Special)*|40|100|25|
|13|Quick Attack|Normal *(Physical)*|40|100|30|
|20|Flame Wheel|Fire *(Special)*|60|100|25|
|24|Defense Curl|Normal *(Physical)*|0|0|40|
|31|Swift|Normal *(Physical)*|60|0|20|
|35|Flame Charge|Fire *(Special)*|50|100|20|
|43|Lava Plume|Fire *(Special)*|80|100|15|
|48|Flamethrower|Fire *(Special)*|90|100|15|
|56|Inferno|Fire *(Special)*|100|50|5|
|61|Rollout|Rock *(Physical)*|30|90|20|
|69|Double-Edge|Normal *(Physical)*|120|100|15|
|74|Eruption|Fire *(Special)*|150|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Totodile
ID: 159

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 18|[Croconaw](#croconaw)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|6|Water Gun|Water *(Special)*|40|100|25|
|8|Rage|Normal *(Physical)*|20|100|20|
|13|Bite|Dark *(Special)*|60|100|25|
|15|Scary Face|Normal *(Physical)*|0|90|10|
|20|Ice Fang|Ice *(Special)*|65|95|15|
|22|Flail|Normal *(Physical)*|1|100|15|
|27|Crunch|Dark *(Special)*|80|100|15|
|29|Aqua Jet|Water *(Special)*|40|100|30|
|34|Slash|Normal *(Physical)*|70|100|20|
|36|Screech|Normal *(Physical)*|0|85|40|
|41|Thrash|Normal *(Physical)*|120|100|20|
|43|Aqua Tail|Water *(Special)*|90|90|10|
|48|Superpower|Fight *(Physical)*|120|100|5|
|50|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Croconaw
ID: 160

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Feraligatr](#feraligatr)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Water Gun|Water *(Special)*|40|100|25|
|6|Water Gun|Water *(Special)*|40|100|25|
|8|Rage|Normal *(Physical)*|20|100|20|
|13|Bite|Dark *(Special)*|60|100|25|
|15|Scary Face|Normal *(Physical)*|0|90|10|
|21|Ice Fang|Ice *(Special)*|65|95|15|
|24|Flail|Normal *(Physical)*|1|100|15|
|30|Crunch|Dark *(Special)*|80|100|15|
|33|Aqua Jet|Water *(Special)*|40|100|30|
|39|Slash|Normal *(Physical)*|70|100|20|
|42|Screech|Normal *(Physical)*|0|85|40|
|48|Thrash|Normal *(Physical)*|120|100|20|
|51|Aqua Tail|Water *(Special)*|90|90|10|
|57|Superpower|Fight *(Physical)*|120|100|5|
|60|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Feraligatr
ID: 161

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Dragon Dance|Dragon *(Special)*|0|0|20|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Water Gun|Water *(Special)*|40|100|25|
|1|Rage|Normal *(Physical)*|20|100|20|
|6|Water Gun|Water *(Special)*|40|100|25|
|8|Rage|Normal *(Physical)*|20|100|20|
|13|Bite|Dark *(Special)*|60|100|25|
|15|Scary Face|Normal *(Physical)*|0|90|10|
|21|Ice Fang|Ice *(Special)*|65|95|15|
|24|Flail|Normal *(Physical)*|1|100|15|
|30|Agility|Psychic *(Special)*|0|0|30|
|32|Crunch|Dark *(Special)*|80|100|15|
|37|Aqua Jet|Water *(Special)*|40|100|30|
|45|Slash|Normal *(Physical)*|70|100|20|
|50|Screech|Normal *(Physical)*|0|85|40|
|58|Thrash|Normal *(Physical)*|120|100|20|
|63|Aqua Tail|Water *(Special)*|90|90|10|
|71|Superpower|Fight *(Physical)*|120|100|5|
|76|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|

## Sentret
ID: 162

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 15|[Furret](#furret)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Foresight|Normal *(Physical)*|0|100|40|
|4|Defense Curl|Normal *(Physical)*|0|0|40|
|7|Quick Attack|Normal *(Physical)*|40|100|30|
|13|Fury Swipes|Normal *(Physical)*|18|80|15|
|16|Helping Hand|Normal *(Physical)*|0|100|20|
|19|Follow Me|Normal *(Physical)*|0|100|20|
|25|Slam|Normal *(Physical)*|80|75|20|
|28|Rest|Psychic *(Special)*|0|0|10|
|31|Sucker Punch|Dark *(Special)*|80|100|5|
|36|Amnesia|Psychic *(Special)*|0|0|20|
|39|Baton Pass|Normal *(Physical)*|0|0|40|
|42|Assist|Normal *(Physical)*|0|100|20|
|47|Hyper Voice|Normal *(Physical)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Furret
ID: 163

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Coil|Poison *(Physical)*|0|0|20|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Foresight|Normal *(Physical)*|0|100|40|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|1|Quick Attack|Normal *(Physical)*|40|100|30|
|4|Defense Curl|Normal *(Physical)*|0|0|40|
|7|Quick Attack|Normal *(Physical)*|40|100|30|
|13|Fury Swipes|Normal *(Physical)*|18|80|15|
|17|Helping Hand|Normal *(Physical)*|0|100|20|
|21|Follow Me|Normal *(Physical)*|0|100|20|
|28|Slam|Normal *(Physical)*|80|75|20|
|32|Rest|Psychic *(Special)*|0|0|10|
|36|Sucker Punch|Dark *(Special)*|80|100|5|
|42|Amnesia|Psychic *(Special)*|0|0|20|
|46|Baton Pass|Normal *(Physical)*|0|0|40|
|50|Assist|Normal *(Physical)*|0|100|20|
|56|Hyper Voice|Normal *(Physical)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Hoothoot
ID: 164

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 20|[Noctowl](#noctowl)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Foresight|Normal *(Physical)*|0|100|40|
|5|Hypnosis|Psychic *(Special)*|0|60|20|
|9|Peck|Flying *(Physical)*|35|100|35|
|13|Uproar|Normal *(Physical)*|50|100|10|
|17|Reflect|Psychic *(Special)*|0|0|20|
|21|Confusion|Psychic *(Special)*|50|100|25|
|25|Night Shade|Ghost *(Physical)*|1|100|15|
|29|Take Down|Normal *(Physical)*|90|85|20|
|33|Air Slash|Flying *(Physical)*|75|95|15|
|37|Zen Headbutt|Psychic *(Special)*|80|100|15|
|41|Hyper Voice|Normal *(Physical)*|90|100|10|
|45|Extrasensory|Psychic *(Special)*|80|100|20|
|49|Psych Up|Normal *(Physical)*|0|0|10|
|53|Roost|Flying *(Physical)*|0|0|10|
|57|Dream Eater|Psychic *(Special)*|100|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Noctowl
ID: 165

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Sky Attack|Flying *(Physical)*|140|90|5|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Foresight|Normal *(Physical)*|0|100|40|
|1|Hypnosis|Psychic *(Special)*|0|60|20|
|5|Hypnosis|Psychic *(Special)*|0|60|20|
|9|Peck|Flying *(Physical)*|35|100|35|
|13|Uproar|Normal *(Physical)*|50|100|10|
|17|Reflect|Psychic *(Special)*|0|0|20|
|22|Confusion|Psychic *(Special)*|50|100|25|
|27|Night Shade|Ghost *(Physical)*|1|100|15|
|32|Take Down|Normal *(Physical)*|90|85|20|
|37|Air Slash|Flying *(Physical)*|75|95|15|
|42|Zen Headbutt|Psychic *(Special)*|80|100|15|
|47|Hyper Voice|Normal *(Physical)*|90|100|10|
|52|Extrasensory|Psychic *(Special)*|80|100|20|
|57|Psych Up|Normal *(Physical)*|0|0|10|
|62|Roost|Flying *(Physical)*|0|0|10|
|67|Dream Eater|Psychic *(Special)*|100|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Ledyba
ID: 166

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 18|[Ledian](#ledian)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|6|Supersonic|Normal *(Physical)*|0|55|20|
|9|Comet Punch|Normal *(Physical)*|18|85|15|
|14|Light Screen|Psychic *(Special)*|0|0|30|
|14|Reflect|Psychic *(Special)*|0|0|20|
|14|Safeguard|Normal *(Physical)*|0|0|25|
|17|Mach Punch|Fight *(Physical)*|40|100|30|
|22|Baton Pass|Normal *(Physical)*|0|0|40|
|25|Silver Wind|Bug *(Physical)*|60|100|5|
|30|Agility|Psychic *(Special)*|0|0|30|
|33|Swift|Normal *(Physical)*|60|0|20|
|38|Double-Edge|Normal *(Physical)*|120|100|15|
|41|Bug Buzz|Bug *(Physical)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Ledian
ID: 167

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Supersonic|Normal *(Physical)*|0|55|20|
|1|Comet Punch|Normal *(Physical)*|18|85|15|
|6|Supersonic|Normal *(Physical)*|0|55|20|
|9|Comet Punch|Normal *(Physical)*|18|85|15|
|14|Light Screen|Psychic *(Special)*|0|0|30|
|14|Reflect|Psychic *(Special)*|0|0|20|
|14|Safeguard|Normal *(Physical)*|0|0|25|
|17|Mach Punch|Fight *(Physical)*|40|100|30|
|24|Baton Pass|Normal *(Physical)*|0|0|40|
|29|Silver Wind|Bug *(Physical)*|60|100|5|
|36|Agility|Psychic *(Special)*|0|0|30|
|41|Swift|Normal *(Physical)*|60|0|20|
|48|Double-Edge|Normal *(Physical)*|120|100|15|
|53|Bug Buzz|Bug *(Physical)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Spinarak
ID: 168

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 22|[Ariados](#ariados)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Poison Sting|Poison *(Physical)*|15|100|35|
|1|String Shot|Bug *(Physical)*|0|95|40|
|5|Scary Face|Normal *(Physical)*|0|90|10|
|8|Constrict|Normal *(Physical)*|10|100|35|
|12|Leech Life|Bug *(Physical)*|20|100|15|
|15|Night Shade|Ghost *(Physical)*|1|100|15|
|19|Shadow Sneak|Ghost *(Physical)*|40|100|30|
|22|Fury Swipes|Normal *(Physical)*|18|80|15|
|26|Electroweb|Electric *(Special)*|55|95|15|
|29|Spider Web|Bug *(Physical)*|0|100|10|
|33|Agility|Psychic *(Special)*|0|0|30|
|36|Pin Missile|Bug *(Physical)*|25|95|20|
|40|Psychic|Psychic *(Special)*|90|100|10|
|43|Poison Jab|Poison *(Physical)*|80|100|20|
|47|Cross Poison|Poison *(Physical)*|70|100|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Ariados
ID: 169

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Sucker Punch|Dark *(Special)*|80|100|5|
|1|Poison Sting|Poison *(Physical)*|15|100|35|
|1|String Shot|Bug *(Physical)*|0|95|40|
|1|Sticky Web|Bug *(Physical)*|0|0|20|
|1|Scary Face|Normal *(Physical)*|0|90|10|
|5|Scary Face|Normal *(Physical)*|0|90|10|
|8|Constrict|Normal *(Physical)*|10|100|35|
|12|Leech Life|Bug *(Physical)*|20|100|15|
|15|Night Shade|Ghost *(Physical)*|1|100|15|
|19|Shadow Sneak|Ghost *(Physical)*|40|100|30|
|23|Fury Swipes|Normal *(Physical)*|18|80|15|
|28|Electroweb|Electric *(Special)*|55|95|15|
|32|Spider Web|Bug *(Physical)*|0|100|10|
|37|Agility|Psychic *(Special)*|0|0|30|
|41|Pin Missile|Bug *(Physical)*|25|95|20|
|46|Psychic|Psychic *(Special)*|90|100|10|
|50|Poison Jab|Poison *(Physical)*|80|100|20|
|55|Cross Poison|Poison *(Physical)*|70|100|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM02|Fly|Flying *(Physical)*|70|95|15|

## Crobat
ID: 170

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Cross Poison|Poison *(Physical)*|70|100|20|
|1|Screech|Normal *(Physical)*|0|85|40|
|1|Leech Life|Bug *(Physical)*|20|100|15|
|1|Supersonic|Normal *(Physical)*|0|55|20|
|1|Astonish|Ghost *(Physical)*|30|100|15|
|4|Supersonic|Normal *(Physical)*|0|55|20|
|8|Astonish|Ghost *(Physical)*|30|100|15|
|12|Bite|Dark *(Special)*|60|100|25|
|15|Wing Attack|Flying *(Physical)*|60|100|35|
|19|Confuse Ray|Ghost *(Physical)*|0|100|10|
|24|Swift|Normal *(Physical)*|60|0|20|
|28|Air Cutter|Flying *(Physical)*|60|95|25|
|33|Acrobatics|Flying *(Physical)*|55|100|15|
|38|Mean Look|Normal *(Physical)*|0|100|5|
|42|Poison Fang|Poison *(Physical)*|50|100|15|
|47|Haze|Ice *(Special)*|0|0|30|
|52|Air Slash|Flying *(Physical)*|75|95|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Chinchou
ID: 171

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 27|[Lanturn](#lanturn)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Supersonic|Normal *(Physical)*|0|55|20|
|1|Bubble|Water *(Special)*|30|100|30|
|6|Thunder Wave|Electric *(Special)*|0|100|20|
|9|Flail|Normal *(Physical)*|1|100|15|
|12|Confuse Ray|Ghost *(Physical)*|0|100|10|
|17|Water Gun|Water *(Special)*|40|100|25|
|20|Spark|Electric *(Special)*|65|100|20|
|23|Take Down|Normal *(Physical)*|90|85|20|
|28|Shock Wave|Electric *(Special)*|60|0|20|
|31|Bubblebeam|Water *(Special)*|65|100|20|
|34|Signal Beam|Bug *(Physical)*|75|100|15|
|39|Discharge|Electric *(Special)*|80|100|15|
|42|Heal Bell|Normal *(Physical)*|0|0|5|
|45|Hydro Pump|Water *(Special)*|110|80|5|
|50|Charge|Electric *(Special)*|0|100|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Lanturn
ID: 172

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Supersonic|Normal *(Physical)*|0|55|20|
|1|Bubble|Water *(Special)*|30|100|30|
|1|Thunder Wave|Electric *(Special)*|0|100|20|
|6|Thunder Wave|Electric *(Special)*|0|100|20|
|9|Flail|Normal *(Physical)*|1|100|15|
|12|Water Gun|Water *(Special)*|40|100|25|
|17|Confuse Ray|Ghost *(Physical)*|0|100|10|
|20|Spark|Electric *(Special)*|65|100|20|
|23|Take Down|Normal *(Physical)*|90|85|20|
|27|Stockpile|Normal *(Physical)*|0|0|10|
|27|Swallow|Normal *(Physical)*|0|0|10|
|27|Spit Up|Normal *(Physical)*|100|100|10|
|30|Shock Wave|Electric *(Special)*|60|0|20|
|35|Bubblebeam|Water *(Special)*|65|100|20|
|40|Signal Beam|Bug *(Physical)*|75|100|15|
|47|Discharge|Electric *(Special)*|80|100|15|
|52|Heal Bell|Normal *(Physical)*|0|0|5|
|57|Hydro Pump|Water *(Special)*|110|80|5|
|64|Charge|Electric *(Special)*|0|100|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Pichu
ID: 173

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Happiness 0|[Pikachu](#pikachu)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Thundershock|Electric *(Special)*|40|100|30|
|1|Charm|23 *(Physical)*|0|100|20|
|5|Tail Whip|Normal *(Physical)*|0|100|30|
|10|Thunder Wave|Electric *(Special)*|0|100|20|
|13|Sweet Kiss|23 *(Physical)*|0|75|10|
|18|Nasty Plot|Dark *(Special)*|0|0|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Cleffa
ID: 174

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Happiness 0|[Clefairy](#clefairy)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Pound|Normal *(Physical)*|40|100|35|
|1|Charm|23 *(Physical)*|0|100|20|
|4|Encore|Normal *(Physical)*|0|100|5|
|7|Sing|Normal *(Physical)*|0|55|15|
|10|Sweet Kiss|23 *(Physical)*|0|75|10|
|13|Copycat|Normal *(Physical)*|0|0|20|
|16|Magical Leaf|Grass *(Special)*|60|0|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Igglybuff
ID: 175

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Happiness 0|[Jigglypuff](#jigglypuff)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Sing|Normal *(Physical)*|0|55|15|
|1|Charm|23 *(Physical)*|0|100|20|
|5|Defense Curl|Normal *(Physical)*|0|0|40|
|9|Pound|Normal *(Physical)*|40|100|35|
|13|Sweet Kiss|23 *(Physical)*|0|75|10|
|17|Copycat|Normal *(Physical)*|0|0|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Togepi
ID: 176

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Happiness 0|[Togetic](#togetic)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Charm|23 *(Physical)*|0|100|20|
|5|Metronome|Normal *(Physical)*|0|0|10|
|9|Sweet Kiss|23 *(Physical)*|0|75|10|
|13|Yawn|Normal *(Physical)*|0|100|10|
|17|Encore|Normal *(Physical)*|0|100|5|
|21|Follow Me|Normal *(Physical)*|0|100|20|
|25|Present|Normal *(Physical)*|1|90|15|
|29|Wish|Normal *(Physical)*|0|100|10|
|33|Ancientpower|Rock *(Physical)*|60|100|5|
|37|Safeguard|Normal *(Physical)*|0|0|25|
|41|Baton Pass|Normal *(Physical)*|0|0|40|
|45|Double-Edge|Normal *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Togetic
ID: 177

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Magical Leaf|Grass *(Special)*|60|0|20|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Charm|23 *(Physical)*|0|100|20|
|1|Metronome|Normal *(Physical)*|0|0|10|
|1|Sweet Kiss|23 *(Physical)*|0|75|10|
|5|Metronome|Normal *(Physical)*|0|0|10|
|9|Sweet Kiss|23 *(Physical)*|0|75|10|
|13|Yawn|Normal *(Physical)*|0|100|10|
|17|Encore|Normal *(Physical)*|0|100|5|
|21|Follow Me|Normal *(Physical)*|0|100|20|
|25|Present|Normal *(Physical)*|1|90|15|
|29|Wish|Normal *(Physical)*|0|100|10|
|33|Ancientpower|Rock *(Physical)*|60|100|5|
|37|Safeguard|Normal *(Physical)*|0|0|25|
|41|Baton Pass|Normal *(Physical)*|0|0|40|
|45|Double-Edge|Normal *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Natu
ID: 178

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 25|[Xatu](#xatu)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|6|Night Shade|Ghost *(Physical)*|1|100|15|
|9|Teleport|Psychic *(Special)*|0|0|20|
|12|Featherdance|Flying *(Physical)*|0|100|15|
|17|Miracle Eye|Psychic *(Special)*|0|100|40|
|20|Mimic|Normal *(Physical)*|0|100|10|
|23|Confuse Ray|Ghost *(Physical)*|0|100|10|
|28|Wish|Normal *(Physical)*|0|100|10|
|33|Refresh|Normal *(Physical)*|0|100|20|
|36|Future Sight|Psychic *(Special)*|120|100|15|
|39|Stored Power|Psychic *(Special)*|20|100|10|
|44|Ominous Wind|Ghost *(Physical)*|60|100|5|
|47|Reflect|Psychic *(Special)*|0|0|20|
|47|Light Screen|Psychic *(Special)*|0|0|30|
|50|Psychic|Psychic *(Special)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Xatu
ID: 179

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|6|Night Shade|Ghost *(Physical)*|1|100|15|
|9|Teleport|Psychic *(Special)*|0|0|20|
|12|Featherdance|Flying *(Physical)*|0|100|15|
|17|Miracle Eye|Psychic *(Special)*|0|100|40|
|20|Mimic|Normal *(Physical)*|0|100|10|
|23|Confuse Ray|Ghost *(Physical)*|0|100|10|
|27|Roost|Flying *(Physical)*|0|0|10|
|32|Wish|Normal *(Physical)*|0|100|10|
|37|Refresh|Normal *(Physical)*|0|100|20|
|42|Future Sight|Psychic *(Special)*|120|100|15|
|47|Stored Power|Psychic *(Special)*|20|100|10|
|54|Ominous Wind|Ghost *(Physical)*|60|100|5|
|59|Reflect|Psychic *(Special)*|0|0|20|
|59|Light Screen|Psychic *(Special)*|0|0|30|
|66|Psychic|Psychic *(Special)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Mareep
ID: 180

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 15|[Flaaffy](#flaaffy)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|4|Thunder Wave|Electric *(Special)*|0|100|20|
|8|Thundershock|Electric *(Special)*|40|100|30|
|11|Cotton Spore|Grass *(Special)*|0|85|40|
|15|Charge|Electric *(Special)*|0|100|20|
|18|Take Down|Normal *(Physical)*|90|85|20|
|22|Shock Wave|Electric *(Special)*|60|0|20|
|25|Confuse Ray|Ghost *(Physical)*|0|100|10|
|29|Power Gem|Rock *(Physical)*|80|100|20|
|32|Discharge|Electric *(Special)*|80|100|15|
|36|Cotton Guard|Grass *(Special)*|0|0|20|
|39|Signal Beam|Bug *(Physical)*|75|100|15|
|43|Light Screen|Psychic *(Special)*|0|0|30|
|46|Thunder|Electric *(Special)*|110|70|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Flaaffy
ID: 181

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Ampharos](#ampharos)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Thunder Wave|Electric *(Special)*|0|100|20|
|1|Thundershock|Electric *(Special)*|40|100|30|
|4|Thunder Wave|Electric *(Special)*|0|100|20|
|8|Thundershock|Electric *(Special)*|40|100|30|
|11|Cotton Spore|Grass *(Special)*|0|85|40|
|16|Charge|Electric *(Special)*|0|100|20|
|20|Take Down|Normal *(Physical)*|90|85|20|
|25|Shock Wave|Electric *(Special)*|60|0|20|
|29|Confuse Ray|Ghost *(Physical)*|0|100|10|
|34|Power Gem|Rock *(Physical)*|80|100|20|
|38|Discharge|Electric *(Special)*|80|100|15|
|43|Cotton Guard|Grass *(Special)*|0|0|20|
|47|Signal Beam|Bug *(Physical)*|75|100|15|
|52|Light Screen|Psychic *(Special)*|0|0|30|
|56|Thunder|Electric *(Special)*|110|70|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Ampharos
ID: 182

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Fire Punch|Fire *(Special)*|75|100|15|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Thunder Wave|Electric *(Special)*|0|100|20|
|1|Thundershock|Electric *(Special)*|40|100|30|
|4|Thunder Wave|Electric *(Special)*|0|100|20|
|8|Thundershock|Electric *(Special)*|40|100|30|
|11|Cotton Spore|Grass *(Special)*|0|85|40|
|16|Charge|Electric *(Special)*|0|100|20|
|20|Take Down|Normal *(Physical)*|90|85|20|
|25|Shock Wave|Electric *(Special)*|60|0|20|
|29|Confuse Ray|Ghost *(Physical)*|0|100|10|
|30|Thunderpunch|Electric *(Special)*|75|100|15|
|35|Power Gem|Rock *(Physical)*|80|100|20|
|40|Discharge|Electric *(Special)*|80|100|15|
|46|Cotton Guard|Grass *(Special)*|0|0|20|
|51|Signal Beam|Bug *(Physical)*|75|100|15|
|57|Light Screen|Psychic *(Special)*|0|0|30|
|62|Thunder|Electric *(Special)*|110|70|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Bellossom
ID: 183

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Weather Ball|Normal *(Physical)*|50|100|10|
|1|Mega Drain|Grass *(Special)*|40|100|15|
|1|Sweet Scent|Normal *(Physical)*|0|100|20|
|1|Stun Spore|Grass *(Special)*|0|75|30|
|1|Sunny Day|Fire *(Special)*|0|0|5|
|23|Magical Leaf|Grass *(Special)*|60|0|20|
|53|Leaf Blade|Grass *(Special)*|90|100|15|
|53|Leaf Storm|Grass *(Special)*|130|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Marill
ID: 184

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 18|[Azumarill](#azumarill)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Bubble|Water *(Special)*|30|100|30|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|5|Water Sport|Water *(Special)*|0|100|15|
|7|Water Gun|Water *(Special)*|40|100|25|
|10|Defense Curl|Normal *(Physical)*|0|0|40|
|10|Rollout|Rock *(Physical)*|30|90|20|
|13|Bubblebeam|Water *(Special)*|65|100|20|
|16|Helping Hand|Normal *(Physical)*|0|100|20|
|20|Aqua Jet|Water *(Special)*|40|100|30|
|23|Double-Edge|Normal *(Physical)*|120|100|15|
|28|Aqua Tail|Water *(Special)*|90|90|10|
|31|Rain Dance|Water *(Special)*|0|0|5|
|37|Superpower|Fight *(Physical)*|120|100|5|
|40|Hydro Pump|Water *(Special)*|110|80|5|
|46|Play Rough|23 *(Physical)*|90|90|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Azumarill
ID: 185

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Bubble|Water *(Special)*|30|100|30|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Water Sport|Water *(Special)*|0|100|15|
|5|Water Sport|Water *(Special)*|0|100|15|
|7|Water Gun|Water *(Special)*|40|100|25|
|10|Defense Curl|Normal *(Physical)*|0|0|40|
|10|Rollout|Rock *(Physical)*|30|90|20|
|13|Bubblebeam|Water *(Special)*|65|100|20|
|16|Helping Hand|Normal *(Physical)*|0|100|20|
|21|Aqua Jet|Water *(Special)*|40|100|30|
|25|Double-Edge|Normal *(Physical)*|120|100|15|
|31|Aqua Tail|Water *(Special)*|90|90|10|
|35|Rain Dance|Water *(Special)*|0|0|5|
|42|Superpower|Fight *(Physical)*|120|100|5|
|46|Hydro Pump|Water *(Special)*|110|80|5|
|50|Play Rough|23 *(Physical)*|90|90|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Sudowoodo
ID: 186

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Wood Hammer|Grass *(Special)*|120|100|15|
|1|Copycat|Normal *(Physical)*|0|0|20|
|1|Flail|Normal *(Physical)*|1|100|15|
|1|Low Kick|Fight *(Physical)*|1|100|20|
|1|Rock Throw|Rock *(Physical)*|50|90|15|
|5|Flail|Normal *(Physical)*|1|100|15|
|8|Low Kick|Fight *(Physical)*|1|100|20|
|12|Rock Throw|Rock *(Physical)*|50|90|15|
|15|Mimic|Normal *(Physical)*|0|100|10|
|17|Slam|Normal *(Physical)*|80|75|20|
|20|Feint Attack|Dark *(Special)*|60|0|20|
|23|Rock Tomb|Rock *(Physical)*|60|95|15|
|26|Block|Normal *(Physical)*|0|100|5|
|29|Rock Slide|Rock *(Physical)*|75|90|10|
|33|Counter|Fight *(Physical)*|1|100|20|
|36|Sucker Punch|Dark *(Special)*|80|100|5|
|40|Double-Edge|Normal *(Physical)*|120|100|15|
|43|Stone Edge|Rock *(Physical)*|100|80|5|
|47|Hammer Arm|Fight *(Physical)*|100|90|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Politoed
ID: 187

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bubblebeam|Water *(Special)*|65|100|20|
|1|Hypnosis|Psychic *(Special)*|0|60|20|
|1|Doubleslap|Normal *(Physical)*|15|85|10|
|1|Perish Song|Normal *(Physical)*|0|0|5|
|27|Swagger|Normal *(Physical)*|0|90|15|
|37|Bounce|Flying *(Physical)*|85|85|5|
|48|Hyper Voice|Normal *(Physical)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Hoppip
ID: 188

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 18|[Skiploom](#skiploom)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Splash|Normal *(Physical)*|0|0|40|
|4|Synthesis|Grass *(Special)*|0|0|5|
|7|Tail Whip|Normal *(Physical)*|0|100|30|
|10|Fairy Wind|23 *(Physical)*|40|100|15|
|12|Poisonpowder|Poison *(Physical)*|0|75|35|
|14|Stun Spore|Grass *(Special)*|0|75|30|
|16|Sleep Powder|Grass *(Special)*|0|75|15|
|19|Bullet Seed|Grass *(Special)*|25|100|30|
|22|Leech Seed|Grass *(Special)*|0|90|10|
|25|Mega Drain|Grass *(Special)*|40|100|15|
|28|Acrobatics|Flying *(Physical)*|55|100|15|
|31|Rage Powder|Bug *(Physical)*|0|100|20|
|34|Cotton Spore|Grass *(Special)*|0|85|40|
|37|U-turn|Bug *(Physical)*|70|100|20|
|40|Worry Seed|Grass *(Special)*|0|100|10|
|43|Giga Drain|Grass *(Special)*|75|100|10|
|46|Bounce|Flying *(Physical)*|85|85|5|
|49|Memento|Dark *(Special)*|0|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Skiploom
ID: 189

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 27|[Jumpluff](#jumpluff)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Splash|Normal *(Physical)*|0|0|40|
|1|Synthesis|Grass *(Special)*|0|0|5|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Tackle|Normal *(Physical)*|50|100|35|
|4|Synthesis|Grass *(Special)*|0|0|5|
|7|Tail Whip|Normal *(Physical)*|0|100|30|
|10|Fairy Wind|23 *(Physical)*|40|100|15|
|12|Poisonpowder|Poison *(Physical)*|0|75|35|
|14|Stun Spore|Grass *(Special)*|0|75|30|
|16|Sleep Powder|Grass *(Special)*|0|75|15|
|20|Bullet Seed|Grass *(Special)*|25|100|30|
|24|Leech Seed|Grass *(Special)*|0|90|10|
|28|Mega Drain|Grass *(Special)*|40|100|15|
|32|Acrobatics|Flying *(Physical)*|55|100|15|
|36|Rage Powder|Bug *(Physical)*|0|100|20|
|40|Cotton Spore|Grass *(Special)*|0|85|40|
|44|U-turn|Bug *(Physical)*|70|100|20|
|48|Worry Seed|Grass *(Special)*|0|100|10|
|52|Giga Drain|Grass *(Special)*|75|100|10|
|56|Bounce|Flying *(Physical)*|85|85|5|
|60|Memento|Dark *(Special)*|0|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Jumpluff
ID: 190

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Splash|Normal *(Physical)*|0|0|40|
|1|Synthesis|Grass *(Special)*|0|0|5|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Tackle|Normal *(Physical)*|50|100|35|
|4|Synthesis|Grass *(Special)*|0|0|5|
|7|Tail Whip|Normal *(Physical)*|0|100|30|
|10|Fairy Wind|23 *(Physical)*|40|100|15|
|12|Poisonpowder|Poison *(Physical)*|0|75|35|
|14|Stun Spore|Grass *(Special)*|0|75|30|
|16|Sleep Powder|Grass *(Special)*|0|75|15|
|20|Bullet Seed|Grass *(Special)*|25|100|30|
|24|Leech Seed|Grass *(Special)*|0|90|10|
|29|Mega Drain|Grass *(Special)*|40|100|15|
|34|Acrobatics|Flying *(Physical)*|55|100|15|
|39|Rage Powder|Bug *(Physical)*|0|100|20|
|44|Cotton Spore|Grass *(Special)*|0|85|40|
|49|U-turn|Bug *(Physical)*|70|100|20|
|54|Cotton Guard|Grass *(Special)*|0|0|20|
|59|Giga Drain|Grass *(Special)*|75|100|10|
|64|Bounce|Flying *(Physical)*|85|85|5|
|69|Memento|Dark *(Special)*|0|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Aipom
ID: 191

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|4|Sand-Attack|Ground *(Physical)*|0|100|15|
|8|Astonish|Ghost *(Physical)*|30|100|15|
|11|Baton Pass|Normal *(Physical)*|0|0|40|
|15|Tickle|Normal *(Physical)*|0|100|20|
|18|Fury Swipes|Normal *(Physical)*|18|80|15|
|22|Swift|Normal *(Physical)*|60|0|20|
|25|Screech|Normal *(Physical)*|0|85|40|
|29|Agility|Psychic *(Special)*|0|0|30|
|32|Double Hit|Normal *(Physical)*|35|100|15|
|36|Covet|Normal *(Physical)*|60|100|40|
|39|Nasty Plot|Dark *(Special)*|0|0|20|
|43|Fake Out|Normal *(Physical)*|40|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Sunkern
ID: 192

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 93|[Sunflora](#sunflora)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Absorb|Grass *(Special)*|20|100|20|
|1|Growth|Normal *(Physical)*|0|0|40|
|4|Ingrain|Grass *(Special)*|0|100|20|
|7|Grasswhistle|Grass *(Special)*|0|55|15|
|10|Mega Drain|Grass *(Special)*|40|100|15|
|13|Leech Seed|Grass *(Special)*|0|90|10|
|16|Razor Leaf|Grass *(Special)*|55|95|25|
|19|Worry Seed|Grass *(Special)*|0|100|10|
|22|Giga Drain|Grass *(Special)*|75|100|10|
|25|Endeavor|Normal *(Physical)*|1|100|5|
|28|Synthesis|Grass *(Special)*|0|0|5|
|31|Nature Power|Normal *(Physical)*|0|0|20|
|34|Solarbeam|Grass *(Special)*|120|100|10|
|37|Double-Edge|Normal *(Physical)*|120|100|15|
|40|Sunny Day|Fire *(Special)*|0|0|5|
|43|Seed Bomb|Grass *(Special)*|80|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Sunflora
ID: 193

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Absorb|Grass *(Special)*|20|100|20|
|1|Growth|Normal *(Physical)*|0|0|40|
|4|Ingrain|Grass *(Special)*|0|100|20|
|7|Grasswhistle|Grass *(Special)*|0|55|15|
|10|Mega Drain|Grass *(Special)*|40|100|15|
|13|Leech Seed|Grass *(Special)*|0|90|10|
|16|Razor Leaf|Grass *(Special)*|55|95|25|
|19|Worry Seed|Grass *(Special)*|0|100|10|
|22|Giga Drain|Grass *(Special)*|75|100|10|
|25|Bullet Seed|Grass *(Special)*|25|100|30|
|28|Petal Dance|Grass *(Special)*|120|100|10|
|31|Flower Guard|23 *(Physical)*|0|0|10|
|34|Solarbeam|Grass *(Special)*|120|100|10|
|37|Double-Edge|Normal *(Physical)*|120|100|15|
|40|Sunny Day|Fire *(Special)*|0|0|5|
|43|Leaf Storm|Grass *(Special)*|130|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Yanma
ID: 194

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Foresight|Normal *(Physical)*|0|100|40|
|6|Quick Attack|Normal *(Physical)*|40|100|30|
|11|Double Team|Normal *(Physical)*|0|0|15|
|14|Sonicboom|Normal *(Physical)*|1|90|20|
|17|Detect|Fight *(Physical)*|0|0|5|
|22|Supersonic|Normal *(Physical)*|0|55|20|
|27|Uproar|Normal *(Physical)*|50|100|10|
|30|Pursuit|Dark *(Special)*|40|100|20|
|33|Ancientpower|Rock *(Physical)*|60|100|5|
|38|Hypnosis|Psychic *(Special)*|0|60|20|
|43|Wing Attack|Flying *(Physical)*|60|100|35|
|46|Screech|Normal *(Physical)*|0|85|40|
|49|U-turn|Bug *(Physical)*|70|100|20|
|54|Air Slash|Flying *(Physical)*|75|95|15|
|57|Bug Buzz|Bug *(Physical)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Wooper
ID: 195

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 20|[Quagsire](#quagsire)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Water Gun|Water *(Special)*|40|100|25|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|5|Mud Sport|Ground *(Physical)*|0|100|15|
|9|Mud Shot|Ground *(Physical)*|55|95|15|
|15|Slam|Normal *(Physical)*|80|75|20|
|19|Mud Bomb|Ground *(Physical)*|65|85|10|
|23|Amnesia|Psychic *(Special)*|0|0|20|
|29|Yawn|Normal *(Physical)*|0|100|10|
|33|Earthquake|Ground *(Physical)*|100|100|10|
|37|Rain Dance|Water *(Special)*|0|0|5|
|43|Mist|Ice *(Special)*|0|0|30|
|43|Haze|Ice *(Special)*|0|0|30|
|47|Muddy Water|Water *(Special)*|90|85|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Quagsire
ID: 196

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Water Gun|Water *(Special)*|40|100|25|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Mud Sport|Ground *(Physical)*|0|100|15|
|5|Mud Sport|Ground *(Physical)*|0|100|15|
|9|Mud Shot|Ground *(Physical)*|55|95|15|
|15|Slam|Normal *(Physical)*|80|75|20|
|19|Mud Bomb|Ground *(Physical)*|65|85|10|
|24|Amnesia|Psychic *(Special)*|0|0|20|
|31|Yawn|Normal *(Physical)*|0|100|10|
|36|Earthquake|Ground *(Physical)*|100|100|10|
|41|Rain Dance|Water *(Special)*|0|0|5|
|48|Mist|Ice *(Special)*|0|0|30|
|48|Haze|Ice *(Special)*|0|0|30|
|53|Muddy Water|Water *(Special)*|90|85|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Espeon
ID: 197

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Helping Hand|Normal *(Physical)*|0|100|20|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|5|Sand-Attack|Ground *(Physical)*|0|100|15|
|9|Confusion|Psychic *(Special)*|50|100|25|
|13|Quick Attack|Normal *(Physical)*|40|100|30|
|17|Swift|Normal *(Physical)*|60|0|20|
|21|Psybeam|Psychic *(Special)*|65|100|20|
|25|Stored Power|Psychic *(Special)*|20|100|10|
|29|Psych Up|Normal *(Physical)*|0|0|10|
|33|Morning Sun|Normal *(Physical)*|0|0|5|
|37|Psychic|Psychic *(Special)*|90|100|10|
|41|Wish|Normal *(Physical)*|0|100|10|
|45|Magic Coat|Psychic *(Special)*|0|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Umbreon
ID: 198

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Helping Hand|Normal *(Physical)*|0|100|20|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|5|Sand-Attack|Ground *(Physical)*|0|100|15|
|9|Pursuit|Dark *(Special)*|40|100|20|
|13|Quick Attack|Normal *(Physical)*|40|100|30|
|17|Confuse Ray|Ghost *(Physical)*|0|100|10|
|21|Feint Attack|Dark *(Special)*|60|0|20|
|25|Assurance|Dark *(Special)*|60|100|10|
|29|Screech|Normal *(Physical)*|0|85|40|
|33|Moonlight|23 *(Physical)*|0|0|5|
|37|Mean Look|Normal *(Physical)*|0|100|5|
|41|Wish|Normal *(Physical)*|0|100|10|
|45|Dark Pulse|Dark *(Special)*|80|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM02|Fly|Flying *(Physical)*|70|95|15|

## Murkrow
ID: 199

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Astonish|Ghost *(Physical)*|30|100|15|
|5|Pursuit|Dark *(Special)*|40|100|20|
|11|Haze|Ice *(Special)*|0|0|30|
|15|Wing Attack|Flying *(Physical)*|60|100|35|
|21|Night Shade|Ghost *(Physical)*|1|100|15|
|25|Icy Wind|Ice *(Special)*|55|95|15|
|31|Taunt|Dark *(Special)*|0|100|20|
|35|Feint Attack|Dark *(Special)*|60|0|20|
|41|Mean Look|Normal *(Physical)*|0|100|5|
|45|Dark Pulse|Dark *(Special)*|80|100|15|
|51|Roost|Flying *(Physical)*|0|0|10|
|55|Sucker Punch|Dark *(Special)*|80|100|5|
|61|Torment|Dark *(Special)*|0|100|15|
|65|Brave Bird|Flying *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Slowking
ID: 200

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Power Gem|Rock *(Physical)*|80|100|20|
|1|Hidden Power|Normal *(Physical)*|1|100|15|
|1|Curse|??? *(Physical)*|0|0|10|
|1|Yawn|Normal *(Physical)*|0|100|10|
|1|Tackle|Normal *(Physical)*|50|100|35|
|5|Growl|Normal *(Physical)*|0|100|40|
|9|Water Gun|Water *(Special)*|40|100|25|
|14|Confusion|Psychic *(Special)*|50|100|25|
|19|Disable|Normal *(Physical)*|0|100|20|
|23|Headbutt|Normal *(Physical)*|70|100|15|
|28|Water Pulse|Water *(Special)*|60|100|20|
|32|Zen Headbutt|Psychic *(Special)*|80|100|15|
|36|Nasty Plot|Dark *(Special)*|0|0|20|
|41|Swagger|Normal *(Physical)*|0|90|15|
|45|Psychic|Psychic *(Special)*|90|100|10|
|49|Signal Beam|Bug *(Physical)*|75|100|15|
|54|Psych Up|Normal *(Physical)*|0|0|10|
|58|Heal Pulse|Psychic *(Special)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Misdreavus
ID: 201

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Psywave|Psychic *(Special)*|1|100|15|
|5|Spite|Ghost *(Physical)*|0|100|10|
|10|Astonish|Ghost *(Physical)*|30|100|15|
|14|Confuse Ray|Ghost *(Physical)*|0|100|10|
|19|Mean Look|Normal *(Physical)*|0|100|5|
|23|Hex|Ghost *(Physical)*|65|100|10|
|28|Psybeam|Psychic *(Special)*|65|100|20|
|32|Pain Split|Normal *(Physical)*|0|100|20|
|37|Payback|Dark *(Special)*|50|100|10|
|41|Shadow Ball|Ghost *(Physical)*|80|100|15|
|46|Perish Song|Normal *(Physical)*|0|0|5|
|50|Grudge|Ghost *(Physical)*|0|100|5|
|55|Power Gem|Rock *(Physical)*|80|100|20|

## Unown
ID: 202

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Hidden Power|Normal *(Physical)*|1|100|15|

## Wobbuffet
ID: 203

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Counter|Fight *(Physical)*|1|100|20|
|1|Mirror Coat|Psychic *(Special)*|1|100|20|
|1|Safeguard|Normal *(Physical)*|0|0|25|
|1|Destiny Bond|Ghost *(Physical)*|0|0|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Girafarig
ID: 204

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Horn Leech|Grass *(Special)*|75|100|10|
|1|Skill Swap|Psychic *(Special)*|0|100|10|
|1|Astonish|Ghost *(Physical)*|30|100|15|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Confusion|Psychic *(Special)*|50|100|25|
|5|Odor Sleuth|Normal *(Physical)*|0|100|40|
|10|Stomp|Normal *(Physical)*|65|100|20|
|14|Agility|Psychic *(Special)*|0|0|30|
|19|Psybeam|Psychic *(Special)*|65|100|20|
|23|Baton Pass|Normal *(Physical)*|0|0|40|
|28|Assurance|Dark *(Special)*|60|100|10|
|32|Double Hit|Normal *(Physical)*|35|100|15|
|37|Psychic|Psychic *(Special)*|90|100|10|
|41|Zen Headbutt|Psychic *(Special)*|80|100|15|
|46|Crunch|Dark *(Special)*|80|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Pineco
ID: 205

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 31|[Forretress](#forretress)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Protect|Normal *(Physical)*|0|0|10|
|6|Selfdestruct|Normal *(Physical)*|200|100|5|
|9|Bug Bite|Bug *(Physical)*|60|100|20|
|12|Take Down|Normal *(Physical)*|90|85|20|
|17|Rapid Spin|Normal *(Physical)*|20|100|40|
|20|Bide|Normal *(Physical)*|1|100|10|
|23|Nature Power|Normal *(Physical)*|0|0|20|
|28|Spikes|Ground *(Physical)*|0|0|20|
|31|Payback|Dark *(Special)*|50|100|10|
|34|Explosion|Normal *(Physical)*|250|100|5|
|39|Iron Defense|Steel *(Physical)*|0|0|15|
|42|Rollout|Rock *(Physical)*|30|90|20|
|45|Double-Edge|Normal *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Forretress
ID: 206

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Protect|Normal *(Physical)*|0|0|10|
|1|Selfdestruct|Normal *(Physical)*|200|100|5|
|1|Bug Bite|Bug *(Physical)*|60|100|20|
|6|Selfdestruct|Normal *(Physical)*|200|100|5|
|9|Bug Bite|Bug *(Physical)*|60|100|20|
|12|Take Down|Normal *(Physical)*|90|85|20|
|17|Rapid Spin|Normal *(Physical)*|20|100|40|
|20|Bide|Normal *(Physical)*|1|100|10|
|23|Nature Power|Normal *(Physical)*|0|0|20|
|28|Spikes|Ground *(Physical)*|0|0|20|
|31|Mirror Shot|Steel *(Physical)*|65|85|10|
|32|Rock Polish|Rock *(Physical)*|0|0|20|
|36|Payback|Dark *(Special)*|50|100|10|
|42|Explosion|Normal *(Physical)*|250|100|5|
|46|Iron Defense|Steel *(Physical)*|0|0|15|
|50|Rollout|Rock *(Physical)*|30|90|20|
|56|Double-Edge|Normal *(Physical)*|120|100|15|
|60|Zap Cannon|Electric *(Special)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Dunsparce
ID: 207

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Rage|Normal *(Physical)*|20|100|20|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|4|Rollout|Rock *(Physical)*|30|90|20|
|7|Spite|Ghost *(Physical)*|0|100|10|
|10|Pursuit|Dark *(Special)*|40|100|20|
|13|Screech|Normal *(Physical)*|0|85|40|
|16|Yawn|Normal *(Physical)*|0|100|10|
|19|Ancientpower|Rock *(Physical)*|60|100|5|
|22|Take Down|Normal *(Physical)*|90|85|20|
|25|Roost|Flying *(Physical)*|0|0|10|
|28|Glare|Normal *(Physical)*|0|100|30|
|31|Dig|Ground *(Physical)*|80|100|10|
|34|Double-Edge|Normal *(Physical)*|120|100|15|
|37|Coil|Poison *(Physical)*|0|0|20|
|40|Endure|Normal *(Physical)*|0|0|10|
|43|Drill Run|Ground *(Physical)*|80|100|10|
|46|Endeavor|Normal *(Physical)*|1|100|5|
|49|Flail|Normal *(Physical)*|1|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Gligar
ID: 208

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Poison Sting|Poison *(Physical)*|15|100|35|
|4|Sand-Attack|Ground *(Physical)*|0|100|15|
|7|Harden|Normal *(Physical)*|0|0|30|
|10|Knock Off|Dark *(Special)*|65|100|25|
|13|Quick Attack|Normal *(Physical)*|40|100|30|
|16|Fury Cutter|Bug *(Physical)*|40|95|20|
|19|Feint Attack|Dark *(Special)*|60|0|20|
|22|Acrobatics|Flying *(Physical)*|55|100|15|
|27|Slash|Normal *(Physical)*|70|100|20|
|30|U-turn|Bug *(Physical)*|70|100|20|
|35|Screech|Normal *(Physical)*|0|85|40|
|40|X-Scissor|Bug *(Physical)*|80|100|15|
|45|Sky Uppercut|Fight *(Physical)*|85|90|15|
|50|Swords Dance|Normal *(Physical)*|0|0|20|
|55|Guillotine|Normal *(Physical)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Steelix
ID: 209

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Thunder Fang|Electric *(Special)*|65|95|15|
|1|Ice Fang|Ice *(Special)*|65|95|15|
|1|Fire Fang|Fire *(Special)*|65|95|15|
|1|Mud Sport|Ground *(Physical)*|0|100|15|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|1|Bind|Normal *(Physical)*|15|85|20|
|4|Curse|??? *(Physical)*|0|0|10|
|7|Rock Throw|Rock *(Physical)*|50|90|15|
|10|Rage|Normal *(Physical)*|20|100|20|
|13|Rock Tomb|Rock *(Physical)*|60|95|15|
|16|Stealth Rock|Rock *(Physical)*|0|0|20|
|19|Iron Defense|Steel *(Physical)*|0|0|15|
|22|Iron Head|Steel *(Physical)*|80|100|15|
|25|Dragonbreath|Dragon *(Special)*|60|100|20|
|28|Slam|Normal *(Physical)*|80|75|20|
|31|Screech|Normal *(Physical)*|0|85|40|
|34|Rock Slide|Rock *(Physical)*|75|90|10|
|37|Crunch|Dark *(Special)*|80|100|15|
|40|Iron Tail|Steel *(Physical)*|100|75|15|
|43|Dig|Ground *(Physical)*|80|100|10|
|46|Stone Edge|Rock *(Physical)*|100|80|5|
|49|Double-Edge|Normal *(Physical)*|120|100|15|
|52|Sandstorm|Rock *(Physical)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Snubbull
ID: 210

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 23|[Granbull](#granbull)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Ice Fang|Ice *(Special)*|65|95|15|
|1|Fire Fang|Fire *(Special)*|65|95|15|
|1|Thunder Fang|Electric *(Special)*|65|95|15|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Scary Face|Normal *(Physical)*|0|90|10|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Charm|23 *(Physical)*|0|100|20|
|7|Bite|Dark *(Special)*|60|100|25|
|13|Lick|Ghost *(Physical)*|30|100|30|
|19|Headbutt|Normal *(Physical)*|70|100|15|
|25|Roar|Normal *(Physical)*|0|100|20|
|31|Rage|Normal *(Physical)*|20|100|20|
|37|Play Rough|23 *(Physical)*|90|90|10|
|43|Payback|Dark *(Special)*|50|100|10|
|49|Crunch|Dark *(Special)*|80|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Granbull
ID: 211

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Ice Fang|Ice *(Special)*|65|95|15|
|1|Fire Fang|Fire *(Special)*|65|95|15|
|1|Thunder Fang|Electric *(Special)*|65|95|15|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Scary Face|Normal *(Physical)*|0|90|10|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Charm|23 *(Physical)*|0|100|20|
|7|Bite|Dark *(Special)*|60|100|25|
|13|Lick|Ghost *(Physical)*|30|100|30|
|19|Headbutt|Normal *(Physical)*|70|100|15|
|27|Roar|Normal *(Physical)*|0|100|20|
|35|Rage|Normal *(Physical)*|20|100|20|
|43|Play Rough|23 *(Physical)*|90|90|10|
|51|Payback|Dark *(Special)*|50|100|10|
|59|Crunch|Dark *(Special)*|80|100|15|
|67|Close Combat|Fight *(Physical)*|120|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Qwilfish
ID: 212

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Spikes|Ground *(Physical)*|0|0|20|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Poison Sting|Poison *(Physical)*|15|100|35|
|9|Harden|Normal *(Physical)*|0|0|30|
|9|Minimize|Normal *(Physical)*|0|0|10|
|13|Water Gun|Water *(Special)*|40|100|25|
|17|Rollout|Rock *(Physical)*|30|90|20|
|21|Toxic Spikes|Poison *(Physical)*|0|0|20|
|25|Stockpile|Normal *(Physical)*|0|0|10|
|25|Spit Up|Normal *(Physical)*|100|100|10|
|29|Revenge|Fight *(Physical)*|60|100|10|
|33|Brine|Water *(Special)*|65|100|10|
|37|Pin Missile|Bug *(Physical)*|25|95|20|
|41|Take Down|Normal *(Physical)*|90|85|20|
|45|Aqua Tail|Water *(Special)*|90|90|10|
|49|Poison Jab|Poison *(Physical)*|80|100|20|
|53|Destiny Bond|Ghost *(Physical)*|0|0|5|
|57|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Scizor
ID: 213

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bullet Punch|Steel *(Physical)*|40|100|30|
|1|Quick Attack|Normal *(Physical)*|40|100|30|
|1|Leer|Normal *(Physical)*|0|100|30|
|5|Focus Energy|Normal *(Physical)*|0|0|30|
|9|Pursuit|Dark *(Special)*|40|100|20|
|13|False Swipe|Normal *(Physical)*|40|100|40|
|17|Agility|Psychic *(Special)*|0|0|30|
|21|Metal Claw|Steel *(Physical)*|50|95|35|
|25|Fury Cutter|Bug *(Physical)*|40|95|20|
|29|Slash|Normal *(Physical)*|70|100|20|
|33|Razor Wind|Normal *(Physical)*|80|100|10|
|37|Iron Defense|Steel *(Physical)*|0|0|15|
|41|X-Scissor|Bug *(Physical)*|80|100|15|
|45|Night Slash|Dark *(Special)*|70|100|20|
|49|Double Hit|Normal *(Physical)*|35|100|15|
|53|Iron Head|Steel *(Physical)*|80|100|15|
|57|Swords Dance|Normal *(Physical)*|0|0|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Shuckle
ID: 214

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Withdraw|Water *(Special)*|0|0|40|
|1|Constrict|Normal *(Physical)*|10|100|35|
|1|Bide|Normal *(Physical)*|1|100|10|
|1|Rollout|Rock *(Physical)*|30|90|20|
|5|Encore|Normal *(Physical)*|0|100|5|
|9|Wrap|Normal *(Physical)*|15|90|20|
|12|Struggle Bug|Bug *(Physical)*|50|100|20|
|16|Safeguard|Normal *(Physical)*|0|0|25|
|20|Rest|Psychic *(Special)*|0|0|10|
|23|Rock Throw|Rock *(Physical)*|50|90|15|
|27|Gastro Acid|Poison *(Physical)*|0|100|10|
|31|Sticky Web|Bug *(Physical)*|0|0|20|
|34|Shell Smash|Normal *(Physical)*|0|0|15|
|38|Rock Slide|Rock *(Physical)*|75|90|10|
|42|Bug Bite|Bug *(Physical)*|60|100|20|
|45|Stone Edge|Rock *(Physical)*|100|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Heracross
ID: 215

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Arm Thrust|Fight *(Physical)*|15|100|20|
|1|Bullet Seed|Grass *(Special)*|25|100|30|
|1|Night Slash|Dark *(Special)*|70|100|20|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Horn Attack|Normal *(Physical)*|65|100|25|
|1|Endure|Normal *(Physical)*|0|0|10|
|7|Fury Attack|Normal *(Physical)*|15|85|20|
|10|Aerial Ace|Flying *(Physical)*|60|0|20|
|16|Bug Bite|Bug *(Physical)*|60|100|20|
|19|Counter|Fight *(Physical)*|1|100|20|
|25|Brick Break|Fight *(Physical)*|75|100|15|
|28|Take Down|Normal *(Physical)*|90|85|20|
|34|Close Combat|Fight *(Physical)*|120|100|5|
|37|Pursuit|Dark *(Special)*|40|100|20|
|43|Reversal|Fight *(Physical)*|1|100|15|
|46|Megahorn|Bug *(Physical)*|120|85|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Sneasel
ID: 216

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Taunt|Dark *(Special)*|0|100|20|
|8|Quick Attack|Normal *(Physical)*|40|100|30|
|10|Feint Attack|Dark *(Special)*|60|0|20|
|14|Icy Wind|Ice *(Special)*|55|95|15|
|16|Fury Swipes|Normal *(Physical)*|18|80|15|
|20|Agility|Psychic *(Special)*|0|0|30|
|22|Metal Claw|Steel *(Physical)*|50|95|35|
|25|Hone Claws|Dark *(Special)*|0|0|15|
|28|Beat Up|Dark *(Special)*|10|100|10|
|32|Screech|Normal *(Physical)*|0|85|40|
|35|Slash|Normal *(Physical)*|70|100|20|
|40|Snatch|Dark *(Special)*|0|100|10|
|44|Ice Shard|Ice *(Special)*|40|100|30|
|47|Night Slash|Dark *(Special)*|70|100|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Teddiursa
ID: 217

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Ursaring](#ursaring)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Covet|Normal *(Physical)*|60|100|40|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Round Eyes|23 *(Physical)*|0|100|30|
|1|Lick|Ghost *(Physical)*|30|100|30|
|1|Fake Tears|Dark *(Special)*|0|100|20|
|8|Fury Swipes|Normal *(Physical)*|18|80|15|
|15|Feint Attack|Dark *(Special)*|60|0|20|
|22|Sweet Scent|Normal *(Physical)*|0|100|20|
|29|Slash|Normal *(Physical)*|70|100|20|
|36|Charm|23 *(Physical)*|0|100|20|
|43|Rest|Psychic *(Special)*|0|0|10|
|43|Snore|Normal *(Physical)*|50|100|15|
|50|Thrash|Normal *(Physical)*|120|100|20|
|57|Belly Drum|Normal *(Physical)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Ursaring
ID: 218

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Close Combat|Fight *(Physical)*|120|100|5|
|1|Covet|Normal *(Physical)*|60|100|40|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Lick|Ghost *(Physical)*|30|100|30|
|1|Fake Tears|Dark *(Special)*|0|100|20|
|8|Fury Swipes|Normal *(Physical)*|18|80|15|
|15|Feint Attack|Dark *(Special)*|60|0|20|
|22|Sweet Scent|Normal *(Physical)*|0|100|20|
|29|Slash|Normal *(Physical)*|70|100|20|
|38|Charm|23 *(Physical)*|0|100|20|
|47|Rest|Psychic *(Special)*|0|0|10|
|47|Snore|Normal *(Physical)*|50|100|15|
|58|Thrash|Normal *(Physical)*|120|100|20|
|67|Hammer Arm|Fight *(Physical)*|100|90|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Slugma
ID: 219

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 38|[Magcargo](#magcargo)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Yawn|Normal *(Physical)*|0|100|10|
|1|Smog|Poison *(Physical)*|30|70|20|
|5|Ember|Fire *(Special)*|40|100|25|
|10|Rock Throw|Rock *(Physical)*|50|90|15|
|14|Harden|Normal *(Physical)*|0|0|30|
|19|Recover|Normal *(Physical)*|0|0|10|
|23|Flame Burst|Fire *(Special)*|70|100|15|
|28|Ancientpower|Rock *(Physical)*|60|100|5|
|31|Amnesia|Psychic *(Special)*|0|0|20|
|38|Lava Plume|Fire *(Special)*|80|100|15|
|41|Rock Slide|Rock *(Physical)*|75|90|10|
|46|Body Slam|Normal *(Physical)*|85|100|15|
|50|Flamethrower|Fire *(Special)*|90|100|15|
|55|Earth Power|Ground *(Physical)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Magcargo
ID: 220

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Yawn|Normal *(Physical)*|0|100|10|
|1|Smog|Poison *(Physical)*|30|70|20|
|1|Ember|Fire *(Special)*|40|100|25|
|1|Rock Throw|Rock *(Physical)*|50|90|15|
|5|Ember|Fire *(Special)*|40|100|25|
|10|Rock Throw|Rock *(Physical)*|50|90|15|
|14|Harden|Normal *(Physical)*|0|0|30|
|19|Recover|Normal *(Physical)*|0|0|10|
|23|Flame Burst|Fire *(Special)*|70|100|15|
|28|Ancientpower|Rock *(Physical)*|60|100|5|
|32|Amnesia|Psychic *(Special)*|0|0|20|
|37|Lava Plume|Fire *(Special)*|80|100|15|
|38|Shell Smash|Normal *(Physical)*|0|0|15|
|44|Rock Slide|Rock *(Physical)*|75|90|10|
|52|Body Slam|Normal *(Physical)*|85|100|15|
|59|Flamethrower|Fire *(Special)*|90|100|15|
|67|Earth Power|Ground *(Physical)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Swinub
ID: 221

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 33|[Piloswine](#piloswine)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Odor Sleuth|Normal *(Physical)*|0|100|40|
|5|Mud Sport|Ground *(Physical)*|0|100|15|
|8|Powder Snow|Ice *(Special)*|40|100|25|
|11|Mud-Slap|Ground *(Physical)*|20|100|10|
|14|Endure|Normal *(Physical)*|0|0|10|
|18|Mud Bomb|Ground *(Physical)*|65|85|10|
|21|Icy Wind|Ice *(Special)*|55|95|15|
|24|Ice Shard|Ice *(Special)*|40|100|30|
|28|Take Down|Normal *(Physical)*|90|85|20|
|35|Mist|Ice *(Special)*|0|0|30|
|37|Earthquake|Ground *(Physical)*|100|100|10|
|40|Flail|Normal *(Physical)*|1|100|15|
|44|Blizzard|Ice *(Special)*|110|70|5|
|48|Amnesia|Psychic *(Special)*|0|0|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Piloswine
ID: 222

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Icicle Crash|Ice *(Special)*|85|90|10|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Odor Sleuth|Normal *(Physical)*|0|100|40|
|1|Mud Sport|Ground *(Physical)*|0|100|15|
|1|Powder Snow|Ice *(Special)*|40|100|25|
|5|Mud Sport|Ground *(Physical)*|0|100|15|
|8|Powder Snow|Ice *(Special)*|40|100|25|
|11|Mud-Slap|Ground *(Physical)*|20|100|10|
|14|Endure|Normal *(Physical)*|0|0|10|
|18|Mud Bomb|Ground *(Physical)*|65|85|10|
|21|Icy Wind|Ice *(Special)*|55|95|15|
|24|Ice Fang|Ice *(Special)*|65|95|15|
|28|Take Down|Normal *(Physical)*|90|85|20|
|33|Fury Attack|Normal *(Physical)*|15|85|20|
|37|Mist|Ice *(Special)*|0|0|30|
|41|Thrash|Normal *(Physical)*|120|100|20|
|48|Ancientpower|Rock *(Physical)*|60|100|5|
|52|Earthquake|Ground *(Physical)*|100|100|10|
|58|Blizzard|Ice *(Special)*|110|70|5|
|65|Amnesia|Psychic *(Special)*|0|0|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Corsola
ID: 223

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|4|Harden|Normal *(Physical)*|0|0|30|
|8|Bubble|Water *(Special)*|30|100|30|
|10|Recover|Normal *(Physical)*|0|0|10|
|13|Refresh|Normal *(Physical)*|0|100|20|
|17|Bubblebeam|Water *(Special)*|65|100|20|
|20|Ancientpower|Rock *(Physical)*|60|100|5|
|23|Magic Coat|Psychic *(Special)*|0|100|15|
|27|Spike Cannon|Normal *(Physical)*|20|100|15|
|29|Iron Defense|Steel *(Physical)*|0|0|15|
|31|Rock Blast|Rock *(Physical)*|25|80|10|
|35|Endure|Normal *(Physical)*|0|0|10|
|38|Ingrain|Grass *(Special)*|0|100|20|
|41|Power Gem|Rock *(Physical)*|80|100|20|
|45|Mirror Coat|Psychic *(Special)*|1|100|20|
|47|Earth Power|Ground *(Physical)*|90|100|10|
|52|Flail|Normal *(Physical)*|1|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Remoraid
ID: 224

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 25|[Octillery](#octillery)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Water Gun|Water *(Special)*|40|100|25|
|6|Lock-On|Normal *(Physical)*|0|100|5|
|10|Psybeam|Psychic *(Special)*|65|100|20|
|14|Aurora Beam|Ice *(Special)*|65|100|20|
|18|Bubblebeam|Water *(Special)*|65|100|20|
|22|Focus Energy|Normal *(Physical)*|0|0|30|
|26|Water Pulse|Water *(Special)*|60|100|20|
|30|Signal Beam|Bug *(Physical)*|75|100|15|
|34|Ice Beam|Ice *(Special)*|90|100|10|
|38|Bullet Seed|Grass *(Special)*|25|100|30|
|42|Hydro Pump|Water *(Special)*|110|80|5|
|46|Hyper Beam|Normal *(Physical)*|150|90|5|
|50|Brine|Water *(Special)*|65|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Octillery
ID: 225

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Rock Blast|Rock *(Physical)*|25|80|10|
|1|Gunk Shot|Poison *(Physical)*|120|80|5|
|1|Water Gun|Water *(Special)*|40|100|25|
|1|Constrict|Normal *(Physical)*|10|100|35|
|1|Psybeam|Psychic *(Special)*|65|100|20|
|1|Aurora Beam|Ice *(Special)*|65|100|20|
|6|Constrict|Normal *(Physical)*|10|100|35|
|10|Psybeam|Psychic *(Special)*|65|100|20|
|14|Aurora Beam|Ice *(Special)*|65|100|20|
|18|Bubblebeam|Water *(Special)*|65|100|20|
|22|Focus Energy|Normal *(Physical)*|0|0|30|
|25|Octazooka|Water *(Special)*|65|85|10|
|28|Acid Spray|Poison *(Physical)*|40|100|20|
|34|Signal Beam|Bug *(Physical)*|75|100|15|
|40|Ice Beam|Ice *(Special)*|90|100|10|
|46|Bullet Seed|Grass *(Special)*|25|100|30|
|52|Hydro Pump|Water *(Special)*|110|80|5|
|58|Hyper Beam|Normal *(Physical)*|150|90|5|
|64|Water Spout|Water *(Special)*|150|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM02|Fly|Flying *(Physical)*|70|95|15|

## Delibird
ID: 226

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Present|Normal *(Physical)*|1|90|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Mantine
ID: 227

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Psybeam|Psychic *(Special)*|65|100|20|
|1|Bullet Seed|Grass *(Special)*|25|100|30|
|1|Signal Beam|Bug *(Physical)*|75|100|15|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Bubble|Water *(Special)*|30|100|30|
|1|Supersonic|Normal *(Physical)*|0|55|20|
|1|Bubblebeam|Water *(Special)*|65|100|20|
|3|Supersonic|Normal *(Physical)*|0|55|20|
|7|Bubblebeam|Water *(Special)*|65|100|20|
|11|Confuse Ray|Ghost *(Physical)*|0|100|10|
|14|Wing Attack|Flying *(Physical)*|60|100|35|
|16|Headbutt|Normal *(Physical)*|70|100|15|
|19|Water Pulse|Water *(Special)*|60|100|20|
|23|Mud Sport|Ground *(Physical)*|0|100|15|
|27|Take Down|Normal *(Physical)*|90|85|20|
|32|Agility|Psychic *(Special)*|0|0|30|
|36|Air Slash|Flying *(Physical)*|75|95|15|
|39|Mirror Coat|Psychic *(Special)*|1|100|20|
|46|Bounce|Flying *(Physical)*|85|85|5|
|49|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Skarmory
ID: 228

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Peck|Flying *(Physical)*|35|100|35|
|6|Sand-Attack|Ground *(Physical)*|0|100|15|
|9|Swift|Normal *(Physical)*|60|0|20|
|12|Agility|Psychic *(Special)*|0|0|30|
|17|Fury Attack|Normal *(Physical)*|15|85|20|
|20|Roost|Flying *(Physical)*|0|0|10|
|23|Air Cutter|Flying *(Physical)*|60|95|25|
|28|Spikes|Ground *(Physical)*|0|0|20|
|31|Metal Sound|Steel *(Physical)*|0|85|40|
|34|Steel Wing|Steel *(Physical)*|70|90|25|
|39|Whirlwind|Normal *(Physical)*|0|100|20|
|42|Air Slash|Flying *(Physical)*|75|95|15|
|45|Slash|Normal *(Physical)*|70|100|20|
|50|Night Slash|Dark *(Special)*|70|100|20|
|55|Brave Bird|Flying *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Houndour
ID: 229

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 24|[Houndoom](#houndoom)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Ember|Fire *(Special)*|40|100|25|
|4|Howl|Normal *(Physical)*|0|0|40|
|8|Smog|Poison *(Physical)*|30|70|20|
|13|Roar|Normal *(Physical)*|0|100|20|
|17|Bite|Dark *(Special)*|60|100|25|
|20|Odor Sleuth|Normal *(Physical)*|0|100|40|
|25|Snarl|Dark *(Special)*|55|95|10|
|28|Fire Fang|Fire *(Special)*|65|95|15|
|32|Feint Attack|Dark *(Special)*|60|0|20|
|37|Snatch|Dark *(Special)*|0|100|10|
|40|Dark Pulse|Dark *(Special)*|80|100|15|
|44|Flamethrower|Fire *(Special)*|90|100|15|
|49|Crunch|Dark *(Special)*|80|100|15|
|52|Nasty Plot|Dark *(Special)*|0|0|20|
|56|Inferno|Fire *(Special)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Houndoom
ID: 230

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Thunder Fang|Electric *(Special)*|65|95|15|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Ember|Fire *(Special)*|40|100|25|
|1|Howl|Normal *(Physical)*|0|0|40|
|1|Smog|Poison *(Physical)*|30|70|20|
|4|Howl|Normal *(Physical)*|0|0|40|
|8|Smog|Poison *(Physical)*|30|70|20|
|13|Roar|Normal *(Physical)*|0|100|20|
|16|Bite|Dark *(Special)*|60|100|25|
|20|Odor Sleuth|Normal *(Physical)*|0|100|40|
|26|Snarl|Dark *(Special)*|55|95|10|
|30|Fire Fang|Fire *(Special)*|65|95|15|
|35|Feint Attack|Dark *(Special)*|60|0|20|
|41|Snatch|Dark *(Special)*|0|100|10|
|45|Dark Pulse|Dark *(Special)*|80|100|15|
|50|Flamethrower|Fire *(Special)*|90|100|15|
|56|Crunch|Dark *(Special)*|80|100|15|
|60|Nasty Plot|Dark *(Special)*|0|0|20|
|65|Inferno|Fire *(Special)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Kingdra
ID: 231

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Yawn|Normal *(Physical)*|0|100|10|
|1|Bubble|Water *(Special)*|30|100|30|
|1|Smokescreen|Normal *(Physical)*|0|100|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Water Gun|Water *(Special)*|40|100|25|
|4|Smokescreen|Normal *(Physical)*|0|100|20|
|8|Leer|Normal *(Physical)*|0|100|30|
|11|Water Gun|Water *(Special)*|40|100|25|
|14|Focus Energy|Normal *(Physical)*|0|0|30|
|18|Bubblebeam|Water *(Special)*|65|100|20|
|23|Agility|Psychic *(Special)*|0|0|30|
|26|Twister|Dragon *(Special)*|40|100|20|
|30|Brine|Water *(Special)*|65|100|10|
|32|Dragonbreath|Dragon *(Special)*|60|100|20|
|40|Hydro Pump|Water *(Special)*|110|80|5|
|48|Dragon Dance|Dragon *(Special)*|0|0|20|
|57|Dragon Pulse|Dragon *(Special)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Phanpy
ID: 232

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 25|[Donphan](#donphan)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Odor Sleuth|Normal *(Physical)*|0|100|40|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|6|Flail|Normal *(Physical)*|1|100|15|
|10|Take Down|Normal *(Physical)*|90|85|20|
|15|Rollout|Rock *(Physical)*|30|90|20|
|19|Mud-Slap|Ground *(Physical)*|20|100|10|
|24|Slam|Normal *(Physical)*|80|75|20|
|28|Endure|Normal *(Physical)*|0|0|10|
|33|Charm|23 *(Physical)*|0|100|20|
|37|Play Rough|23 *(Physical)*|90|90|10|
|42|Double-Edge|Normal *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Donphan
ID: 233

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Ice Shard|Ice *(Special)*|40|100|30|
|1|Fire Fang|Fire *(Special)*|65|95|15|
|1|Thunder Fang|Electric *(Special)*|65|95|15|
|1|Horn Attack|Normal *(Physical)*|65|100|25|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|1|Bulldoze|Ground *(Physical)*|60|100|20|
|6|Rapid Spin|Normal *(Physical)*|20|100|40|
|10|Knock Off|Dark *(Special)*|65|100|25|
|15|Rollout|Rock *(Physical)*|30|90|20|
|19|Magnitude|Ground *(Physical)*|1|100|30|
|24|Slam|Normal *(Physical)*|80|75|20|
|25|Fury Attack|Normal *(Physical)*|15|85|20|
|31|Assurance|Dark *(Special)*|60|100|10|
|39|Scary Face|Normal *(Physical)*|0|90|10|
|46|Earthquake|Ground *(Physical)*|100|100|10|
|54|Giga Impact|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Porygon2
ID: 234

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Conversion|Normal *(Physical)*|0|0|30|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Conversion 2|Normal *(Physical)*|0|100|30|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|7|Psybeam|Psychic *(Special)*|65|100|20|
|12|Agility|Psychic *(Special)*|0|0|30|
|18|Recover|Normal *(Physical)*|0|0|10|
|23|Curse|??? *(Physical)*|0|0|10|
|29|Signal Beam|Bug *(Physical)*|75|100|15|
|34|Recycle|Normal *(Physical)*|0|100|10|
|40|Discharge|Electric *(Special)*|80|100|15|
|45|Lock-On|Normal *(Physical)*|0|100|5|
|51|Tri Attack|Normal *(Physical)*|80|100|10|
|56|Magic Coat|Psychic *(Special)*|0|100|15|
|62|Zap Cannon|Electric *(Special)*|100|50|5|
|67|Hyper Beam|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Stantler
ID: 235

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|3|Leer|Normal *(Physical)*|0|100|30|
|7|Astonish|Ghost *(Physical)*|30|100|15|
|10|Hypnosis|Psychic *(Special)*|0|60|20|
|13|Stomp|Normal *(Physical)*|65|100|20|
|16|Sand-Attack|Ground *(Physical)*|0|100|15|
|21|Take Down|Normal *(Physical)*|90|85|20|
|23|Confuse Ray|Ghost *(Physical)*|0|100|10|
|27|Calm Mind|Psychic *(Special)*|0|0|20|
|33|Role Play|Psychic *(Special)*|0|100|10|
|38|Zen Headbutt|Psychic *(Special)*|80|100|15|
|43|Jump Kick|Fight *(Physical)*|100|95|10|
|49|Imprison|Psychic *(Special)*|0|100|10|
|55|Horn Leech|Grass *(Special)*|75|100|10|

## Smeargle
ID: 236

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Sketch|Normal *(Physical)*|0|0|1|
|11|Sketch|Normal *(Physical)*|0|0|1|
|21|Sketch|Normal *(Physical)*|0|0|1|
|31|Sketch|Normal *(Physical)*|0|0|1|
|41|Sketch|Normal *(Physical)*|0|0|1|
|51|Sketch|Normal *(Physical)*|0|0|1|
|61|Sketch|Normal *(Physical)*|0|0|1|
|71|Sketch|Normal *(Physical)*|0|0|1|
|81|Sketch|Normal *(Physical)*|0|0|1|
|91|Sketch|Normal *(Physical)*|0|0|1|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Tyrogue
ID: 237

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level High Attack 20|[Hitmonlee](#hitmonlee)|
|Level Attack matches Defense 20|[Hitmontop](#hitmontop)|
|Level High Defense 20|[Hitmonchan](#hitmonchan)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Helping Hand|Normal *(Physical)*|0|100|20|
|1|Fake Out|Normal *(Physical)*|40|100|10|
|1|Foresight|Normal *(Physical)*|0|100|40|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Hitmontop
ID: 238

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Revenge|Fight *(Physical)*|60|100|10|
|1|Rolling Kick|Fight *(Physical)*|60|85|15|
|6|Focus Energy|Normal *(Physical)*|0|0|30|
|10|Pursuit|Dark *(Special)*|40|100|20|
|15|Quick Attack|Normal *(Physical)*|40|100|30|
|19|Triple Kick|Fight *(Physical)*|10|90|10|
|24|Rapid Spin|Normal *(Physical)*|20|100|40|
|28|Counter|Fight *(Physical)*|1|100|20|
|33|Sucker Punch|Dark *(Special)*|80|100|5|
|37|Agility|Psychic *(Special)*|0|0|30|
|42|Drill Run|Ground *(Physical)*|80|100|10|
|46|Mach Punch|Fight *(Physical)*|40|100|30|
|46|Bullet Punch|Steel *(Physical)*|40|100|30|
|51|Detect|Fight *(Physical)*|0|0|5|
|55|Close Combat|Fight *(Physical)*|120|100|5|
|60|Endeavor|Normal *(Physical)*|1|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Smoochum
ID: 239

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Jynx](#jynx)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Pound|Normal *(Physical)*|40|100|35|
|5|Lick|Ghost *(Physical)*|30|100|30|
|8|Sweet Kiss|23 *(Physical)*|0|75|10|
|11|Powder Snow|Ice *(Special)*|40|100|25|
|15|Confusion|Psychic *(Special)*|50|100|25|
|18|Sing|Normal *(Physical)*|0|55|15|
|21|Heart Stamp|Psychic *(Special)*|60|100|25|
|25|Mean Look|Normal *(Physical)*|0|100|5|
|28|Fake Tears|Dark *(Special)*|0|100|20|
|31|Miracle Eye|Psychic *(Special)*|0|100|40|
|35|Avalanche|Ice *(Special)*|60|100|10|
|38|Psychic|Psychic *(Special)*|90|100|10|
|41|Copycat|Normal *(Physical)*|0|0|20|
|45|Perish Song|Normal *(Physical)*|0|0|5|
|48|Blizzard|Ice *(Special)*|110|70|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Elekid
ID: 240

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Electabuzz](#electabuzz)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Quick Attack|Normal *(Physical)*|40|100|30|
|1|Leer|Normal *(Physical)*|0|100|30|
|5|Thundershock|Electric *(Special)*|40|100|30|
|8|Low Kick|Fight *(Physical)*|1|100|20|
|12|Swift|Normal *(Physical)*|60|0|20|
|15|Shock Wave|Electric *(Special)*|60|0|20|
|19|Thunder Wave|Electric *(Special)*|0|100|20|
|22|Electroweb|Electric *(Special)*|55|95|15|
|26|Light Screen|Psychic *(Special)*|0|0|30|
|29|Thunderpunch|Electric *(Special)*|75|100|15|
|33|Discharge|Electric *(Special)*|80|100|15|
|36|Screech|Normal *(Physical)*|0|85|40|
|40|Thunderbolt|Electric *(Special)*|90|100|15|
|43|Thunder|Electric *(Special)*|110|70|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Magby
ID: 241

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Magmar](#magmar)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Smog|Poison *(Physical)*|30|70|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|5|Ember|Fire *(Special)*|40|100|25|
|8|Smokescreen|Normal *(Physical)*|0|100|20|
|12|Feint Attack|Dark *(Special)*|60|0|20|
|15|Fire Spin|Fire *(Special)*|35|85|15|
|19|Clear Smog|Poison *(Physical)*|50|0|15|
|22|Flame Burst|Fire *(Special)*|70|100|15|
|26|Confuse Ray|Ghost *(Physical)*|0|100|10|
|29|Fire Punch|Fire *(Special)*|75|100|15|
|33|Lava Plume|Fire *(Special)*|80|100|15|
|36|Sunny Day|Fire *(Special)*|0|0|5|
|40|Flamethrower|Fire *(Special)*|90|100|15|
|43|Fire Blast|Fire *(Special)*|110|85|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Miltank
ID: 242

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|3|Growl|Normal *(Physical)*|0|100|40|
|5|Defense Curl|Normal *(Physical)*|0|0|40|
|8|Stomp|Normal *(Physical)*|65|100|20|
|11|Milk Drink|Normal *(Physical)*|0|0|10|
|15|Bide|Normal *(Physical)*|1|100|10|
|19|Rollout|Rock *(Physical)*|30|90|20|
|24|Body Slam|Normal *(Physical)*|85|100|15|
|29|Zen Headbutt|Psychic *(Special)*|80|100|15|
|35|Curse|??? *(Physical)*|0|0|10|
|41|Dizzy Punch|Normal *(Physical)*|70|100|10|
|48|Heal Bell|Normal *(Physical)*|0|0|5|
|55|Wake-Up Slap|Fight *(Physical)*|70|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Blissey
ID: 243

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|1|Pound|Normal *(Physical)*|40|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|5|Tail Whip|Normal *(Physical)*|0|100|30|
|9|Refresh|Normal *(Physical)*|0|100|20|
|12|Doubleslap|Normal *(Physical)*|15|85|10|
|16|Softboiled|Normal *(Physical)*|0|0|10|
|20|Helping Hand|Normal *(Physical)*|0|100|20|
|23|Minimize|Normal *(Physical)*|0|0|10|
|27|Take Down|Normal *(Physical)*|90|85|20|
|31|Sing|Normal *(Physical)*|0|55|15|
|34|Sweet Kiss|23 *(Physical)*|0|75|10|
|38|Heal Pulse|Psychic *(Special)*|0|0|10|
|42|Egg Bomb|Normal *(Physical)*|100|75|10|
|46|Light Screen|Psychic *(Special)*|0|0|30|
|50|Wish|Normal *(Physical)*|0|100|10|
|54|Double-Edge|Normal *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Raikou
ID: 244

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bite|Dark *(Special)*|60|100|25|
|1|Leer|Normal *(Physical)*|0|100|30|
|8|Thundershock|Electric *(Special)*|40|100|30|
|15|Roar|Normal *(Physical)*|0|100|20|
|22|Quick Attack|Normal *(Physical)*|40|100|30|
|29|Spark|Electric *(Special)*|65|100|20|
|36|Reflect|Psychic *(Special)*|0|0|20|
|43|Crunch|Dark *(Special)*|80|100|15|
|50|Thunder Fang|Electric *(Special)*|65|95|15|
|57|Discharge|Electric *(Special)*|80|100|15|
|64|Extrasensory|Psychic *(Special)*|80|100|20|
|71|Rain Dance|Water *(Special)*|0|0|5|
|78|Calm Mind|Psychic *(Special)*|0|0|20|
|85|Thunder|Electric *(Special)*|110|70|10|
|92|Aura Sphere|Fight *(Physical)*|80|0|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Entei
ID: 245

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bite|Dark *(Special)*|60|100|25|
|1|Leer|Normal *(Physical)*|0|100|30|
|8|Ember|Fire *(Special)*|40|100|25|
|15|Roar|Normal *(Physical)*|0|100|20|
|22|Fire Spin|Fire *(Special)*|35|85|15|
|29|Stomp|Normal *(Physical)*|65|100|20|
|36|Flamethrower|Fire *(Special)*|90|100|15|
|43|Swagger|Normal *(Physical)*|0|90|15|
|50|Fire Fang|Fire *(Special)*|65|95|15|
|57|Lava Plume|Fire *(Special)*|80|100|15|
|64|Extrasensory|Psychic *(Special)*|80|100|20|
|71|Fire Blast|Fire *(Special)*|110|85|5|
|78|Calm Mind|Psychic *(Special)*|0|0|20|
|85|Sacred Fire|Fire *(Special)*|100|95|5|
|92|Eruption|Fire *(Special)*|150|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Suicune
ID: 246

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bite|Dark *(Special)*|60|100|25|
|1|Leer|Normal *(Physical)*|0|100|30|
|8|Bubblebeam|Water *(Special)*|65|100|20|
|15|Rain Dance|Water *(Special)*|0|0|5|
|22|Gust|Flying *(Physical)*|40|100|35|
|29|Aurora Beam|Ice *(Special)*|65|100|20|
|36|Mist|Ice *(Special)*|0|0|30|
|43|Mirror Coat|Psychic *(Special)*|1|100|20|
|50|Ice Fang|Ice *(Special)*|65|95|15|
|57|Air Slash|Flying *(Physical)*|75|95|15|
|64|Extrasensory|Psychic *(Special)*|80|100|20|
|71|Hydro Pump|Water *(Special)*|110|80|5|
|78|Calm Mind|Psychic *(Special)*|0|0|20|
|85|Blizzard|Ice *(Special)*|110|70|5|
|92|Sheer Cold|Ice *(Special)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Larvitar
ID: 247

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Pupitar](#pupitar)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bite|Dark *(Special)*|60|100|25|
|1|Leer|Normal *(Physical)*|0|100|30|
|5|Sandstorm|Rock *(Physical)*|0|0|10|
|10|Screech|Normal *(Physical)*|0|85|40|
|14|Iron Head|Steel *(Physical)*|80|100|15|
|19|Rock Slide|Rock *(Physical)*|75|90|10|
|23|Scary Face|Normal *(Physical)*|0|90|10|
|28|Thrash|Normal *(Physical)*|120|100|20|
|32|Dark Pulse|Dark *(Special)*|80|100|15|
|37|Payback|Dark *(Special)*|50|100|10|
|41|Crunch|Dark *(Special)*|80|100|15|
|46|Earthquake|Ground *(Physical)*|100|100|10|
|50|Stone Edge|Rock *(Physical)*|100|80|5|
|55|Hyper Beam|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Pupitar
ID: 248

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 55|[Tyranitar](#tyranitar)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bite|Dark *(Special)*|60|100|25|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Sandstorm|Rock *(Physical)*|0|0|10|
|1|Screech|Normal *(Physical)*|0|85|40|
|5|Sandstorm|Rock *(Physical)*|0|0|10|
|10|Screech|Normal *(Physical)*|0|85|40|
|14|Iron Head|Steel *(Physical)*|80|100|15|
|19|Rock Slide|Rock *(Physical)*|75|90|10|
|23|Scary Face|Normal *(Physical)*|0|90|10|
|28|Thrash|Normal *(Physical)*|120|100|20|
|34|Dark Pulse|Dark *(Special)*|80|100|15|
|41|Payback|Dark *(Special)*|50|100|10|
|47|Crunch|Dark *(Special)*|80|100|15|
|54|Earthquake|Ground *(Physical)*|100|100|10|
|60|Stone Edge|Rock *(Physical)*|100|80|5|
|67|Hyper Beam|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Tyranitar
ID: 249

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Thunder Fang|Electric *(Special)*|65|95|15|
|1|Ice Fang|Ice *(Special)*|65|95|15|
|1|Fire Fang|Fire *(Special)*|65|95|15|
|1|Bite|Dark *(Special)*|60|100|25|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Sandstorm|Rock *(Physical)*|0|0|10|
|1|Screech|Normal *(Physical)*|0|85|40|
|5|Sandstorm|Rock *(Physical)*|0|0|10|
|10|Screech|Normal *(Physical)*|0|85|40|
|14|Iron Head|Steel *(Physical)*|80|100|15|
|19|Rock Slide|Rock *(Physical)*|75|90|10|
|23|Scary Face|Normal *(Physical)*|0|90|10|
|28|Thrash|Normal *(Physical)*|120|100|20|
|34|Dark Pulse|Dark *(Special)*|80|100|15|
|41|Payback|Dark *(Special)*|50|100|10|
|47|Crunch|Dark *(Special)*|80|100|15|
|54|Earthquake|Ground *(Physical)*|100|100|10|
|63|Stone Edge|Rock *(Physical)*|100|80|5|
|73|Hyper Beam|Normal *(Physical)*|150|90|5|
|82|Giga Impact|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Lugia
ID: 250

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Whirlwind|Normal *(Physical)*|0|100|20|
|1|Weather Ball|Normal *(Physical)*|50|100|10|
|9|Gust|Flying *(Physical)*|40|100|35|
|15|Dragon Pulse|Dragon *(Special)*|90|100|10|
|23|Extrasensory|Psychic *(Special)*|80|100|20|
|29|Rain Dance|Water *(Special)*|0|0|5|
|37|Hydro Pump|Water *(Special)*|110|80|5|
|43|Aeroblast|Flying *(Physical)*|100|95|5|
|50|Punishment|Dark *(Special)*|60|100|5|
|57|Ancientpower|Rock *(Physical)*|60|100|5|
|65|Safeguard|Normal *(Physical)*|0|0|25|
|71|Recover|Normal *(Physical)*|0|0|10|
|79|Future Sight|Psychic *(Special)*|120|100|15|
|85|Nature Power|Normal *(Physical)*|0|0|20|
|93|Calm Mind|Psychic *(Special)*|0|0|20|
|99|Sky Attack|Flying *(Physical)*|140|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Ho-Oh
ID: 251

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Whirlwind|Normal *(Physical)*|0|100|20|
|1|Weather Ball|Normal *(Physical)*|50|100|10|
|9|Gust|Flying *(Physical)*|40|100|35|
|15|Brave Bird|Flying *(Physical)*|120|100|15|
|23|Extrasensory|Psychic *(Special)*|80|100|20|
|29|Sunny Day|Fire *(Special)*|0|0|5|
|37|Fire Blast|Fire *(Special)*|110|85|5|
|43|Sacred Fire|Fire *(Special)*|100|95|5|
|50|Punishment|Dark *(Special)*|60|100|5|
|57|Ancientpower|Rock *(Physical)*|60|100|5|
|65|Safeguard|Normal *(Physical)*|0|0|25|
|71|Recover|Normal *(Physical)*|0|0|10|
|79|Future Sight|Psychic *(Special)*|120|100|15|
|85|Nature Power|Normal *(Physical)*|0|0|20|
|93|Calm Mind|Psychic *(Special)*|0|0|20|
|99|Sky Attack|Flying *(Physical)*|140|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Treecko
ID: 253

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 16|[Grovyle](#grovyle)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Pound|Normal *(Physical)*|40|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|6|Absorb|Grass *(Special)*|20|100|20|
|11|Quick Attack|Normal *(Physical)*|40|100|30|
|16|Pursuit|Dark *(Special)*|40|100|20|
|21|Screech|Normal *(Physical)*|0|85|40|
|26|Mega Drain|Grass *(Special)*|40|100|15|
|31|Agility|Psychic *(Special)*|0|0|30|
|36|Slam|Normal *(Physical)*|80|75|20|
|41|Detect|Fight *(Physical)*|0|0|5|
|46|Giga Drain|Grass *(Special)*|75|100|10|
|51|Energy Ball|Grass *(Special)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Grovyle
ID: 254

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 36|[Sceptile](#sceptile)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Pound|Normal *(Physical)*|40|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Absorb|Grass *(Special)*|20|100|20|
|1|Quick Attack|Normal *(Physical)*|40|100|30|
|6|Absorb|Grass *(Special)*|20|100|20|
|11|Quick Attack|Normal *(Physical)*|40|100|30|
|16|Fury Cutter|Bug *(Physical)*|40|95|20|
|17|Pursuit|Dark *(Special)*|40|100|20|
|23|Screech|Normal *(Physical)*|0|85|40|
|29|Leaf Blade|Grass *(Special)*|90|100|15|
|35|Agility|Psychic *(Special)*|0|0|30|
|41|Slam|Normal *(Physical)*|80|75|20|
|47|Detect|Fight *(Physical)*|0|0|5|
|53|False Swipe|Normal *(Physical)*|40|100|40|
|59|Leaf Storm|Grass *(Special)*|130|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Sceptile
ID: 255

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Night Slash|Dark *(Special)*|70|100|20|
|1|Pound|Normal *(Physical)*|40|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Absorb|Grass *(Special)*|20|100|20|
|1|Quick Attack|Normal *(Physical)*|40|100|30|
|6|Absorb|Grass *(Special)*|20|100|20|
|11|Quick Attack|Normal *(Physical)*|40|100|30|
|16|X-Scissor|Bug *(Physical)*|80|100|15|
|17|Pursuit|Dark *(Special)*|40|100|20|
|23|Screech|Normal *(Physical)*|0|85|40|
|29|Leaf Blade|Grass *(Special)*|90|100|15|
|35|Agility|Psychic *(Special)*|0|0|30|
|41|Slam|Normal *(Physical)*|80|75|20|
|47|Detect|Fight *(Physical)*|0|0|5|
|53|False Swipe|Normal *(Physical)*|40|100|40|
|59|Leaf Storm|Grass *(Special)*|130|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Torchic
ID: 256

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 16|[Combusken](#combusken)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|7|Focus Energy|Normal *(Physical)*|0|0|30|
|10|Ember|Fire *(Special)*|40|100|25|
|16|Peck|Flying *(Physical)*|35|100|35|
|19|Sand-Attack|Ground *(Physical)*|0|100|15|
|25|Fire Spin|Fire *(Special)*|35|85|15|
|28|Quick Attack|Normal *(Physical)*|40|100|30|
|34|Slash|Normal *(Physical)*|70|100|20|
|37|Mirror Move|Flying *(Physical)*|0|0|20|
|43|Flamethrower|Fire *(Special)*|90|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Combusken
ID: 257

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 36|[Blaziken](#blaziken)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Focus Energy|Normal *(Physical)*|0|0|30|
|1|Ember|Fire *(Special)*|40|100|25|
|7|Focus Energy|Normal *(Physical)*|0|0|30|
|10|Ember|Fire *(Special)*|40|100|25|
|16|Double Kick|Fight *(Physical)*|30|100|30|
|17|Peck|Flying *(Physical)*|35|100|35|
|21|Sand-Attack|Ground *(Physical)*|0|100|15|
|28|Bulk Up|Fight *(Physical)*|0|0|20|
|32|Quick Attack|Normal *(Physical)*|40|100|30|
|39|Slash|Normal *(Physical)*|70|100|20|
|43|Mirror Move|Flying *(Physical)*|0|0|20|
|50|Sky Uppercut|Fight *(Physical)*|85|90|15|
|54|Flare Blitz|Fire *(Special)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Blaziken
ID: 258

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Fire Punch|Fire *(Special)*|75|100|15|
|1|Hi Jump Kick|Fight *(Physical)*|130|90|10|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Focus Energy|Normal *(Physical)*|0|0|30|
|1|Ember|Fire *(Special)*|40|100|25|
|7|Focus Energy|Normal *(Physical)*|0|0|30|
|10|Ember|Fire *(Special)*|40|100|25|
|16|Double Kick|Fight *(Physical)*|30|100|30|
|17|Peck|Flying *(Physical)*|35|100|35|
|21|Sand-Attack|Ground *(Physical)*|0|100|15|
|28|Bulk Up|Fight *(Physical)*|0|0|20|
|32|Quick Attack|Normal *(Physical)*|40|100|30|
|36|Blaze Kick|Fire *(Special)*|85|90|10|
|42|Slash|Normal *(Physical)*|70|100|20|
|49|Brave Bird|Flying *(Physical)*|120|100|15|
|59|Sky Uppercut|Fight *(Physical)*|85|90|15|
|66|Flare Blitz|Fire *(Special)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Mudkip
ID: 259

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 16|[Marshtomp](#marshtomp)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|6|Mud-Slap|Ground *(Physical)*|20|100|10|
|10|Water Gun|Water *(Special)*|40|100|25|
|15|Bide|Normal *(Physical)*|1|100|10|
|19|Foresight|Normal *(Physical)*|0|100|40|
|24|Mud Sport|Ground *(Physical)*|0|100|15|
|28|Take Down|Normal *(Physical)*|90|85|20|
|33|Whirlpool|Water *(Special)*|35|85|15|
|37|Protect|Normal *(Physical)*|0|0|10|
|42|Hydro Pump|Water *(Special)*|110|80|5|
|46|Endeavor|Normal *(Physical)*|1|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Marshtomp
ID: 260

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 36|[Swampert](#swampert)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Mud-Slap|Ground *(Physical)*|20|100|10|
|1|Water Gun|Water *(Special)*|40|100|25|
|6|Mud-Slap|Ground *(Physical)*|20|100|10|
|10|Water Gun|Water *(Special)*|40|100|25|
|15|Bide|Normal *(Physical)*|1|100|10|
|16|Mud Shot|Ground *(Physical)*|55|95|15|
|20|Foresight|Normal *(Physical)*|0|100|40|
|25|Mud Bomb|Ground *(Physical)*|65|85|10|
|31|Take Down|Normal *(Physical)*|90|85|20|
|37|Muddy Water|Water *(Special)*|90|85|10|
|42|Protect|Normal *(Physical)*|0|0|10|
|46|Earthquake|Ground *(Physical)*|100|100|10|
|53|Endeavor|Normal *(Physical)*|1|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Swampert
ID: 261

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Mud-Slap|Ground *(Physical)*|20|100|10|
|1|Water Gun|Water *(Special)*|40|100|25|
|6|Mud-Slap|Ground *(Physical)*|20|100|10|
|10|Water Gun|Water *(Special)*|40|100|25|
|15|Bide|Normal *(Physical)*|1|100|10|
|16|Mud Shot|Ground *(Physical)*|55|95|15|
|20|Foresight|Normal *(Physical)*|0|100|40|
|25|Mud Bomb|Ground *(Physical)*|65|85|10|
|31|Take Down|Normal *(Physical)*|90|85|20|
|39|Muddy Water|Water *(Special)*|90|85|10|
|46|Protect|Normal *(Physical)*|0|0|10|
|52|Earthquake|Ground *(Physical)*|100|100|10|
|61|Endeavor|Normal *(Physical)*|1|100|5|
|69|Hammer Arm|Fight *(Physical)*|100|90|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Poochyena
ID: 262

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 18|[Mightyena](#mightyena)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|5|Howl|Normal *(Physical)*|0|0|40|
|9|Sand-Attack|Ground *(Physical)*|0|100|15|
|13|Bite|Dark *(Special)*|60|100|25|
|17|Odor Sleuth|Normal *(Physical)*|0|100|40|
|21|Roar|Normal *(Physical)*|0|100|20|
|25|Swagger|Normal *(Physical)*|0|90|15|
|29|Snarl|Dark *(Special)*|55|95|10|
|33|Scary Face|Normal *(Physical)*|0|90|10|
|37|Taunt|Dark *(Special)*|0|100|20|
|41|Snatch|Dark *(Special)*|0|100|10|
|45|Take Down|Normal *(Physical)*|90|85|20|
|49|Sucker Punch|Dark *(Special)*|80|100|5|
|53|Crunch|Dark *(Special)*|80|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Mightyena
ID: 263

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Poison Fang|Poison *(Physical)*|50|100|15|
|1|Fire Fang|Fire *(Special)*|65|95|15|
|1|Ice Fang|Ice *(Special)*|65|95|15|
|1|Thunder Fang|Electric *(Special)*|65|95|15|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Howl|Normal *(Physical)*|0|0|40|
|1|Sand-Attack|Ground *(Physical)*|0|100|15|
|1|Bite|Dark *(Special)*|60|100|25|
|5|Howl|Normal *(Physical)*|0|0|40|
|9|Sand-Attack|Ground *(Physical)*|0|100|15|
|13|Bite|Dark *(Special)*|60|100|25|
|17|Odor Sleuth|Normal *(Physical)*|0|100|40|
|22|Roar|Normal *(Physical)*|0|100|20|
|27|Swagger|Normal *(Physical)*|0|90|15|
|32|Snarl|Dark *(Special)*|55|95|10|
|37|Scary Face|Normal *(Physical)*|0|90|10|
|42|Taunt|Dark *(Special)*|0|100|20|
|47|Snatch|Dark *(Special)*|0|100|10|
|52|Take Down|Normal *(Physical)*|90|85|20|
|57|Assurance|Dark *(Special)*|60|100|10|
|62|Sucker Punch|Dark *(Special)*|80|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Zigzagoon
ID: 264

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 20|[Linoone](#linoone)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|5|Tail Whip|Normal *(Physical)*|0|100|30|
|9|Headbutt|Normal *(Physical)*|70|100|15|
|13|Sand-Attack|Ground *(Physical)*|0|100|15|
|17|Odor Sleuth|Normal *(Physical)*|0|100|40|
|21|Mud Sport|Ground *(Physical)*|0|100|15|
|25|Pin Missile|Bug *(Physical)*|25|95|20|
|29|Covet|Normal *(Physical)*|60|100|40|
|33|Switcheroo|Dark *(Special)*|0|100|10|
|37|Flail|Normal *(Physical)*|1|100|15|
|41|Rest|Psychic *(Special)*|0|0|10|
|45|Belly Drum|Normal *(Physical)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Linoone
ID: 265

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Seed Bomb|Grass *(Special)*|80|100|15|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Rototiller|Ground *(Physical)*|0|0|10|
|5|Tail Whip|Normal *(Physical)*|0|100|30|
|9|Headbutt|Normal *(Physical)*|70|100|15|
|13|Sand-Attack|Ground *(Physical)*|0|100|15|
|17|Odor Sleuth|Normal *(Physical)*|0|100|40|
|23|Mud Sport|Ground *(Physical)*|0|100|15|
|29|Fury Swipes|Normal *(Physical)*|18|80|15|
|35|Covet|Normal *(Physical)*|60|100|40|
|41|Switcheroo|Dark *(Special)*|0|100|10|
|47|Slash|Normal *(Physical)*|70|100|20|
|53|Rest|Psychic *(Special)*|0|0|10|
|59|Belly Drum|Normal *(Physical)*|0|0|10|
|65|Extremespeed|Normal *(Physical)*|80|100|5|

## Wurmple
ID: 266

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level Odd Personality 7|[Silcoon](#silcoon)|
|Level Even Personality 7|[Cascoon](#cascoon)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|String Shot|Bug *(Physical)*|0|95|40|
|5|Poison Sting|Poison *(Physical)*|15|100|35|
|15|Bug Bite|Bug *(Physical)*|60|100|20|

## Silcoon
ID: 267

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 10|[Beautifly](#beautifly)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Harden|Normal *(Physical)*|0|0|30|
|7|Harden|Normal *(Physical)*|0|0|30|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Beautifly
ID: 268

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Absorb|Grass *(Special)*|20|100|20|
|10|Absorb|Grass *(Special)*|20|100|20|
|13|Gust|Flying *(Physical)*|40|100|35|
|17|Stun Spore|Grass *(Special)*|0|75|30|
|20|Morning Sun|Normal *(Physical)*|0|0|5|
|24|Mega Drain|Grass *(Special)*|40|100|15|
|27|Whirlwind|Normal *(Physical)*|0|100|20|
|31|Attract|Normal *(Physical)*|0|100|15|
|34|Silver Wind|Bug *(Physical)*|60|100|5|
|38|Giga Drain|Grass *(Special)*|75|100|10|
|41|Bug Buzz|Bug *(Physical)*|90|100|10|
|45|Quiver Dance|Bug *(Physical)*|0|0|20|

## Cascoon
ID: 269

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 10|[Dustox](#dustox)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Harden|Normal *(Physical)*|0|0|30|
|7|Harden|Normal *(Physical)*|0|0|30|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Dustox
ID: 270

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Confusion|Psychic *(Special)*|50|100|25|
|10|Confusion|Psychic *(Special)*|50|100|25|
|13|Gust|Flying *(Physical)*|40|100|35|
|17|Protect|Normal *(Physical)*|0|0|10|
|20|Moonlight|23 *(Physical)*|0|0|5|
|24|Psybeam|Psychic *(Special)*|65|100|20|
|27|Whirlwind|Normal *(Physical)*|0|100|20|
|31|Light Screen|Psychic *(Special)*|0|0|30|
|34|Silver Wind|Bug *(Physical)*|60|100|5|
|38|Toxic|Poison *(Physical)*|0|90|10|
|41|Bug Buzz|Bug *(Physical)*|90|100|10|
|45|Quiver Dance|Bug *(Physical)*|0|0|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Lotad
ID: 271

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 14|[Lombre](#lombre)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Astonish|Ghost *(Physical)*|30|100|15|
|3|Growl|Normal *(Physical)*|0|100|40|
|5|Absorb|Grass *(Special)*|20|100|20|
|7|Nature Power|Normal *(Physical)*|0|0|20|
|11|Mist|Ice *(Special)*|0|0|30|
|15|Mud-Slap|Ground *(Physical)*|20|100|10|
|19|Mega Drain|Grass *(Special)*|40|100|15|
|25|Bubblebeam|Water *(Special)*|65|100|20|
|31|Zen Headbutt|Psychic *(Special)*|80|100|15|
|37|Rain Dance|Water *(Special)*|0|0|5|
|45|Energy Ball|Grass *(Special)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Lombre
ID: 272

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 97|[Ludicolo](#ludicolo)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Astonish|Ghost *(Physical)*|30|100|15|
|3|Growl|Normal *(Physical)*|0|100|40|
|5|Absorb|Grass *(Special)*|20|100|20|
|7|Nature Power|Normal *(Physical)*|0|0|20|
|11|Fake Out|Normal *(Physical)*|40|100|10|
|15|Fury Swipes|Normal *(Physical)*|18|80|15|
|19|Water Sport|Water *(Special)*|0|100|15|
|25|Bubblebeam|Water *(Special)*|65|100|20|
|31|Zen Headbutt|Psychic *(Special)*|80|100|15|
|37|Uproar|Normal *(Physical)*|50|100|10|
|45|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Ludicolo
ID: 273

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Astonish|Ghost *(Physical)*|30|100|15|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Mega Drain|Grass *(Special)*|40|100|15|
|1|Nature Power|Normal *(Physical)*|0|0|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Seedot
ID: 274

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 14|[Nuzleaf](#nuzleaf)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bide|Normal *(Physical)*|1|100|10|
|3|Harden|Normal *(Physical)*|0|0|30|
|7|Growth|Normal *(Physical)*|0|0|40|
|13|Nature Power|Normal *(Physical)*|0|0|20|
|21|Synthesis|Grass *(Special)*|0|0|5|
|31|Sunny Day|Fire *(Special)*|0|0|5|
|43|Explosion|Normal *(Physical)*|250|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Nuzleaf
ID: 275

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 98|[Shiftry](#shiftry)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Razor Leaf|Grass *(Special)*|55|95|25|
|1|Pound|Normal *(Physical)*|40|100|35|
|3|Harden|Normal *(Physical)*|0|0|30|
|7|Growth|Normal *(Physical)*|0|0|40|
|13|Nature Power|Normal *(Physical)*|0|0|20|
|19|Fake Out|Normal *(Physical)*|40|100|10|
|25|Torment|Dark *(Special)*|0|100|15|
|31|Feint Attack|Dark *(Special)*|60|0|20|
|37|Razor Wind|Normal *(Physical)*|80|100|10|
|43|Swagger|Normal *(Physical)*|0|90|15|
|49|Extrasensory|Psychic *(Special)*|80|100|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Shedinja
ID: 276

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|5|Leech Life|Bug *(Physical)*|20|100|15|
|9|Sand-Attack|Ground *(Physical)*|0|100|15|
|14|Fury Swipes|Normal *(Physical)*|18|80|15|
|19|Mind Reader|Normal *(Physical)*|0|100|5|
|25|Spite|Ghost *(Physical)*|0|100|10|
|31|Confuse Ray|Ghost *(Physical)*|0|100|10|
|38|Shadow Sneak|Ghost *(Physical)*|40|100|30|
|45|Grudge|Ghost *(Physical)*|0|100|5|
|52|Endure|Normal *(Physical)*|0|0|10|
|59|Shadow Ball|Ghost *(Physical)*|80|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|

## Taillow
ID: 277

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 22|[Swellow](#swellow)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|4|Focus Energy|Normal *(Physical)*|0|0|30|
|8|Quick Attack|Normal *(Physical)*|40|100|30|
|13|Wing Attack|Flying *(Physical)*|60|100|35|
|19|Double Team|Normal *(Physical)*|0|0|15|
|26|Endeavor|Normal *(Physical)*|1|100|5|
|34|Aerial Ace|Flying *(Physical)*|60|0|20|
|43|Agility|Psychic *(Special)*|0|0|30|
|53|Air Slash|Flying *(Physical)*|75|95|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|

## Spinda
ID: 278

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|5|Uproar|Normal *(Physical)*|50|100|10|
|10|Copycat|Normal *(Physical)*|0|0|20|
|14|Feint Attack|Dark *(Special)*|60|0|20|
|19|Psybeam|Psychic *(Special)*|65|100|20|
|23|Hypnosis|Psychic *(Special)*|0|60|20|
|28|Dizzy Punch|Normal *(Physical)*|70|100|10|
|32|Sucker Punch|Dark *(Special)*|80|100|5|
|37|Teeter Dance|Normal *(Physical)*|0|100|20|
|41|Psych Up|Normal *(Physical)*|0|0|10|
|46|Double-Edge|Normal *(Physical)*|120|100|15|
|50|Flail|Normal *(Physical)*|1|100|15|
|55|Thrash|Normal *(Physical)*|120|100|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|

## Wingull
ID: 279

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 25|[Pelipper](#pelipper)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Water Gun|Water *(Special)*|40|100|25|
|6|Supersonic|Normal *(Physical)*|0|55|20|
|9|Wing Attack|Flying *(Physical)*|60|100|35|
|14|Mist|Ice *(Special)*|0|0|30|
|17|Water Pulse|Water *(Special)*|60|100|20|
|22|Quick Attack|Normal *(Physical)*|40|100|30|
|26|Roost|Flying *(Physical)*|0|0|10|
|30|Pursuit|Dark *(Special)*|40|100|20|
|33|Air Cutter|Flying *(Physical)*|60|95|25|
|38|Agility|Psychic *(Special)*|0|0|30|
|42|Aerial Ace|Flying *(Physical)*|60|0|20|
|46|Air Slash|Flying *(Physical)*|75|95|15|
|49|Hurricane|Flying *(Physical)*|110|70|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM03|Surf|Water *(Special)*|90|100|15|

## Armaldo
ID: 280

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Aqua Tail|Water *(Special)*|90|90|10|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|1|Mud Sport|Ground *(Physical)*|0|100|15|
|1|Water Gun|Water *(Special)*|40|100|25|
|7|Mud Sport|Ground *(Physical)*|0|100|15|
|13|Water Gun|Water *(Special)*|40|100|25|
|19|Metal Claw|Steel *(Physical)*|50|95|35|
|25|Protect|Normal *(Physical)*|0|0|10|
|31|Ancientpower|Rock *(Physical)*|60|100|5|
|37|Fury Cutter|Bug *(Physical)*|40|95|20|
|46|Slash|Normal *(Physical)*|70|100|20|
|55|Rock Blast|Rock *(Physical)*|25|80|10|
|67|Crush Claw|Normal *(Physical)*|75|95|10|
|73|X-Scissor|Bug *(Physical)*|80|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Ralts
ID: 281

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 20|[Kirlia](#kirlia)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|6|Confusion|Psychic *(Special)*|50|100|25|
|10|Double Team|Normal *(Physical)*|0|0|15|
|12|Teleport|Psychic *(Special)*|0|0|20|
|17|Safeguard|Normal *(Physical)*|0|0|25|
|21|Magical Leaf|Grass *(Special)*|60|0|20|
|23|Heal Pulse|Psychic *(Special)*|0|0|10|
|28|Calm Mind|Psychic *(Special)*|0|0|20|
|32|Psychic|Psychic *(Special)*|90|100|10|
|34|Imprison|Psychic *(Special)*|0|100|10|
|39|Future Sight|Psychic *(Special)*|120|100|15|
|43|Charm|23 *(Physical)*|0|100|20|
|45|Hypnosis|Psychic *(Special)*|0|60|20|
|50|Dream Eater|Psychic *(Special)*|100|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Kirlia
ID: 282

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Gardevoir](#gardevoir)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Confusion|Psychic *(Special)*|50|100|25|
|1|Double Team|Normal *(Physical)*|0|0|15|
|1|Teleport|Psychic *(Special)*|0|0|20|
|6|Confusion|Psychic *(Special)*|50|100|25|
|10|Double Team|Normal *(Physical)*|0|0|15|
|12|Teleport|Psychic *(Special)*|0|0|20|
|17|Safeguard|Normal *(Physical)*|0|0|25|
|22|Magical Leaf|Grass *(Special)*|60|0|20|
|25|Heal Pulse|Psychic *(Special)*|0|0|10|
|31|Calm Mind|Psychic *(Special)*|0|0|20|
|36|Psychic|Psychic *(Special)*|90|100|10|
|39|Imprison|Psychic *(Special)*|0|100|10|
|45|Future Sight|Psychic *(Special)*|120|100|15|
|50|Charm|23 *(Physical)*|0|100|20|
|53|Hypnosis|Psychic *(Special)*|0|60|20|
|60|Dream Eater|Psychic *(Special)*|100|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Pelipper
ID: 283

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Water Gun|Water *(Special)*|40|100|25|
|1|Water Sport|Water *(Special)*|0|100|15|
|1|Wing Attack|Flying *(Physical)*|60|100|35|
|6|Supersonic|Normal *(Physical)*|0|55|20|
|9|Wing Attack|Flying *(Physical)*|60|100|35|
|14|Mist|Ice *(Special)*|0|0|30|
|17|Water Pulse|Water *(Special)*|60|100|20|
|22|Payback|Dark *(Special)*|50|100|10|
|25|Protect|Normal *(Physical)*|0|0|10|
|28|Roost|Flying *(Physical)*|0|0|10|
|34|Brine|Water *(Special)*|65|100|10|
|39|Stockpile|Normal *(Physical)*|0|0|10|
|39|Spit Up|Normal *(Physical)*|100|100|10|
|39|Swallow|Normal *(Physical)*|0|0|10|
|46|Knock Off|Dark *(Special)*|65|100|25|
|52|Hydro Pump|Water *(Special)*|110|80|5|
|58|Hurricane|Flying *(Physical)*|110|70|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Surskit
ID: 284

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 22|[Masquerain](#masquerain)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bubble|Water *(Special)*|30|100|30|
|7|Quick Attack|Normal *(Physical)*|40|100|30|
|13|Sweet Scent|Normal *(Physical)*|0|100|20|
|19|Water Sport|Water *(Special)*|0|100|15|
|25|Bubblebeam|Water *(Special)*|65|100|20|
|31|Agility|Psychic *(Special)*|0|0|30|
|37|Mist|Ice *(Special)*|0|0|30|
|37|Haze|Ice *(Special)*|0|0|30|
|43|Baton Pass|Normal *(Physical)*|0|0|40|
|46|Sticky Web|Bug *(Physical)*|0|0|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Swellow
ID: 285

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Pluck|Flying *(Physical)*|60|100|20|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Focus Energy|Normal *(Physical)*|0|0|30|
|1|Quick Attack|Normal *(Physical)*|40|100|30|
|4|Focus Energy|Normal *(Physical)*|0|0|30|
|8|Quick Attack|Normal *(Physical)*|40|100|30|
|13|Wing Attack|Flying *(Physical)*|60|100|35|
|19|Double Team|Normal *(Physical)*|0|0|15|
|28|Endeavor|Normal *(Physical)*|1|100|5|
|38|Aerial Ace|Flying *(Physical)*|60|0|20|
|49|Agility|Psychic *(Special)*|0|0|30|
|61|Air Slash|Flying *(Physical)*|75|95|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Shroomish
ID: 286

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 23|[Breloom](#breloom)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Absorb|Grass *(Special)*|20|100|20|
|5|Tackle|Normal *(Physical)*|50|100|35|
|9|Stun Spore|Grass *(Special)*|0|75|30|
|13|Leech Seed|Grass *(Special)*|0|90|10|
|17|Mega Drain|Grass *(Special)*|40|100|15|
|21|Headbutt|Normal *(Physical)*|70|100|15|
|25|Poisonpowder|Poison *(Physical)*|0|75|35|
|29|Bullet Seed|Grass *(Special)*|25|100|30|
|33|Growth|Normal *(Physical)*|0|0|40|
|37|Giga Drain|Grass *(Special)*|75|100|10|
|41|Seed Bomb|Grass *(Special)*|80|100|15|
|45|Spore|Grass *(Special)*|0|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Roselia
ID: 287

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Absorb|Grass *(Special)*|20|100|20|
|4|Growth|Normal *(Physical)*|0|0|40|
|7|Poison Sting|Poison *(Physical)*|15|100|35|
|10|Stun Spore|Grass *(Special)*|0|75|30|
|13|Mega Drain|Grass *(Special)*|40|100|15|
|16|Leech Seed|Grass *(Special)*|0|90|10|
|19|Magical Leaf|Grass *(Special)*|60|0|20|
|22|Grasswhistle|Grass *(Special)*|0|55|15|
|25|Giga Drain|Grass *(Special)*|75|100|10|
|28|Toxic Spikes|Poison *(Physical)*|0|0|20|
|31|Sweet Scent|Normal *(Physical)*|0|100|20|
|34|Ingrain|Grass *(Special)*|0|100|20|
|37|Petal Dance|Grass *(Special)*|120|100|10|
|40|Toxic|Poison *(Physical)*|0|90|10|
|43|Aromatherapy|Grass *(Special)*|0|0|5|
|46|Synthesis|Grass *(Special)*|0|0|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Slakoth
ID: 288

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 18|[Vigoroth](#vigoroth)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Yawn|Normal *(Physical)*|0|100|10|
|7|Encore|Normal *(Physical)*|0|100|5|
|13|Slack Off|Normal *(Physical)*|0|0|10|
|19|Feint Attack|Dark *(Special)*|60|0|20|
|25|Amnesia|Psychic *(Special)*|0|0|20|
|31|Covet|Normal *(Physical)*|60|100|40|
|37|Sucker Punch|Dark *(Special)*|80|100|5|
|43|Counter|Fight *(Physical)*|1|100|20|
|49|Flail|Normal *(Physical)*|1|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Vigoroth
ID: 289

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 36|[Slaking](#slaking)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Focus Energy|Normal *(Physical)*|0|0|30|
|1|Encore|Normal *(Physical)*|0|100|5|
|1|Uproar|Normal *(Physical)*|50|100|10|
|7|Encore|Normal *(Physical)*|0|100|5|
|13|Uproar|Normal *(Physical)*|50|100|10|
|19|Fury Swipes|Normal *(Physical)*|18|80|15|
|25|Endure|Normal *(Physical)*|0|0|10|
|31|Slash|Normal *(Physical)*|70|100|20|
|37|Counter|Fight *(Physical)*|1|100|20|
|43|Night Slash|Dark *(Special)*|70|100|20|
|49|Focus Punch|Fight *(Physical)*|150|100|20|
|55|Reversal|Fight *(Physical)*|1|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Shiftry
ID: 290

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Feint Attack|Dark *(Special)*|60|0|20|
|1|Whirlwind|Normal *(Physical)*|0|100|20|
|1|Nasty Plot|Dark *(Special)*|0|0|20|
|1|Razor Leaf|Grass *(Special)*|55|95|25|
|19|Leaf Tornado|Grass *(Special)*|65|90|10|
|49|Leaf Storm|Grass *(Special)*|130|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Nincada
ID: 291

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level And New Pokemon 20|[Ninjask](#ninjask)|
|Level But New Pokemon 20|[Shedinja](#shedinja)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|5|Leech Life|Bug *(Physical)*|20|100|15|
|9|Sand-Attack|Ground *(Physical)*|0|100|15|
|14|Fury Swipes|Normal *(Physical)*|18|80|15|
|19|Mind Reader|Normal *(Physical)*|0|100|5|
|25|False Swipe|Normal *(Physical)*|40|100|40|
|31|Mud-Slap|Ground *(Physical)*|20|100|10|
|38|Metal Claw|Steel *(Physical)*|50|95|35|
|45|Dig|Ground *(Physical)*|80|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Ninjask
ID: 292

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bug Bite|Bug *(Physical)*|60|100|20|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|1|Leech Life|Bug *(Physical)*|20|100|15|
|1|Sand-Attack|Ground *(Physical)*|0|100|15|
|5|Leech Life|Bug *(Physical)*|20|100|15|
|9|Sand-Attack|Ground *(Physical)*|0|100|15|
|14|Fury Swipes|Normal *(Physical)*|18|80|15|
|19|Mind Reader|Normal *(Physical)*|0|100|5|
|20|Double Team|Normal *(Physical)*|0|0|15|
|20|Fury Cutter|Bug *(Physical)*|40|95|20|
|20|Screech|Normal *(Physical)*|0|85|40|
|25|Swords Dance|Normal *(Physical)*|0|0|20|
|31|Slash|Normal *(Physical)*|70|100|20|
|38|Agility|Psychic *(Special)*|0|0|30|
|45|Baton Pass|Normal *(Physical)*|0|0|40|
|52|X-Scissor|Bug *(Physical)*|80|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Tropius
ID: 293

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Gust|Flying *(Physical)*|40|100|35|
|7|Growth|Normal *(Physical)*|0|0|40|
|11|Razor Leaf|Grass *(Special)*|55|95|25|
|17|Stomp|Normal *(Physical)*|65|100|20|
|21|Sweet Scent|Normal *(Physical)*|0|100|20|
|27|Whirlwind|Normal *(Physical)*|0|100|20|
|31|Magical Leaf|Grass *(Special)*|60|0|20|
|37|Body Slam|Normal *(Physical)*|85|100|15|
|41|Synthesis|Grass *(Special)*|0|0|5|
|47|Leaf Tornado|Grass *(Special)*|65|90|10|
|51|Air Slash|Flying *(Physical)*|75|95|15|
|57|Dragon Dance|Dragon *(Special)*|0|0|20|
|61|Solarbeam|Grass *(Special)*|120|100|10|
|67|Nature Power|Normal *(Physical)*|0|0|20|
|71|Leaf Storm|Grass *(Special)*|130|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|

## Whismur
ID: 294

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 20|[Loudred](#loudred)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Pound|Normal *(Physical)*|40|100|35|
|5|Uproar|Normal *(Physical)*|50|100|10|
|11|Astonish|Ghost *(Physical)*|30|100|15|
|15|Howl|Normal *(Physical)*|0|0|40|
|21|Supersonic|Normal *(Physical)*|0|55|20|
|25|Stomp|Normal *(Physical)*|65|100|20|
|31|Screech|Normal *(Physical)*|0|85|40|
|35|Roar|Normal *(Physical)*|0|100|20|
|41|Zen Headbutt|Psychic *(Special)*|80|100|15|
|45|Rest|Psychic *(Special)*|0|0|10|
|45|Sleep Talk|Normal *(Physical)*|0|0|10|
|51|Hyper Voice|Normal *(Physical)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Loudred
ID: 295

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 40|[Exploud](#exploud)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Pound|Normal *(Physical)*|40|100|35|
|1|Uproar|Normal *(Physical)*|50|100|10|
|1|Astonish|Ghost *(Physical)*|30|100|15|
|1|Howl|Normal *(Physical)*|0|0|40|
|5|Uproar|Normal *(Physical)*|50|100|10|
|11|Astonish|Ghost *(Physical)*|30|100|15|
|15|Howl|Normal *(Physical)*|0|0|40|
|20|Bite|Dark *(Special)*|60|100|25|
|23|Supersonic|Normal *(Physical)*|0|55|20|
|29|Stomp|Normal *(Physical)*|65|100|20|
|37|Screech|Normal *(Physical)*|0|85|40|
|43|Roar|Normal *(Physical)*|0|100|20|
|51|Zen Headbutt|Psychic *(Special)*|80|100|15|
|57|Rest|Psychic *(Special)*|0|0|10|
|57|Sleep Talk|Normal *(Physical)*|0|0|10|
|65|Hyper Voice|Normal *(Physical)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Flygon
ID: 296

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Sonicboom|Normal *(Physical)*|1|90|20|
|1|Sand-Attack|Ground *(Physical)*|0|100|15|
|1|Feint Attack|Dark *(Special)*|60|0|20|
|1|Sand Tomb|Ground *(Physical)*|35|85|15|
|4|Sand-Attack|Ground *(Physical)*|0|100|15|
|7|Feint Attack|Dark *(Special)*|60|0|20|
|10|Sand Tomb|Ground *(Physical)*|35|85|15|
|13|Bug Bite|Bug *(Physical)*|60|100|20|
|17|Bide|Normal *(Physical)*|1|100|10|
|21|Bulldoze|Ground *(Physical)*|60|100|20|
|25|Rock Slide|Rock *(Physical)*|75|90|10|
|29|Supersonic|Normal *(Physical)*|0|55|20|
|34|Screech|Normal *(Physical)*|0|85|40|
|35|Dragonbreath|Dragon *(Special)*|60|100|20|
|39|Earth Power|Ground *(Physical)*|90|100|10|
|44|Sandstorm|Rock *(Physical)*|0|0|10|
|45|Dragon Tail|Dragon *(Special)*|60|90|10|
|49|Hyper Beam|Normal *(Physical)*|150|90|5|
|55|Dragon Claw|Dragon *(Special)*|80|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Makuhita
ID: 297

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 24|[Hariyama](#hariyama)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Focus Energy|Normal *(Physical)*|0|0|30|
|4|Sand-Attack|Ground *(Physical)*|0|100|15|
|7|Arm Thrust|Fight *(Physical)*|15|100|20|
|10|Vital Throw|Fight *(Physical)*|70|100|10|
|13|Fake Out|Normal *(Physical)*|40|100|10|
|16|Whirlwind|Normal *(Physical)*|0|100|20|
|19|Knock Off|Dark *(Special)*|65|100|25|
|22|Smellingsalt|Normal *(Physical)*|70|100|10|
|25|Belly Drum|Normal *(Physical)*|0|0|10|
|28|Force Palm|Fight *(Physical)*|60|100|10|
|31|Seismic Toss|Fight *(Physical)*|1|100|20|
|34|Wake-Up Slap|Fight *(Physical)*|70|100|10|
|37|Endure|Normal *(Physical)*|0|0|10|
|40|Close Combat|Fight *(Physical)*|120|100|5|
|43|Reversal|Fight *(Physical)*|1|100|15|
|46|Circle Throw|Fight *(Physical)*|60|90|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Solrock
ID: 298

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|1|Confusion|Psychic *(Special)*|50|100|25|
|5|Rock Slide|Rock *(Physical)*|75|90|10|
|9|Fire Spin|Fire *(Special)*|35|85|15|
|13|Rock Polish|Rock *(Physical)*|0|0|20|
|17|Psywave|Psychic *(Special)*|1|100|15|
|21|Helping Hand|Normal *(Physical)*|0|100|20|
|25|Rock Slide|Rock *(Physical)*|75|90|10|
|29|Cosmic Power|Psychic *(Special)*|0|0|20|
|33|Psychic|Psychic *(Special)*|90|100|10|
|37|Morning Sun|Normal *(Physical)*|0|0|5|
|41|Stone Edge|Rock *(Physical)*|100|80|5|
|45|Solarbeam|Grass *(Special)*|120|100|10|
|49|Explosion|Normal *(Physical)*|250|100|5|
|53|Fire Blast|Fire *(Special)*|110|85|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|

## Claydol
ID: 299

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Teleport|Psychic *(Special)*|0|0|20|
|1|Harden|Normal *(Physical)*|0|0|30|
|1|Confusion|Psychic *(Special)*|50|100|25|
|1|Rapid Spin|Normal *(Physical)*|20|100|40|
|4|Rapid Spin|Normal *(Physical)*|20|100|40|
|7|Mud-Slap|Ground *(Physical)*|20|100|10|
|10|Rock Tomb|Rock *(Physical)*|60|95|15|
|13|Psybeam|Psychic *(Special)*|65|100|20|
|17|Miracle Eye|Psychic *(Special)*|0|100|40|
|21|Ancientpower|Rock *(Physical)*|60|100|5|
|25|Selfdestruct|Normal *(Physical)*|200|100|5|
|28|Extrasensory|Psychic *(Special)*|80|100|20|
|31|Cosmic Power|Psychic *(Special)*|0|0|20|
|34|Reflect|Psychic *(Special)*|0|0|20|
|34|Light Screen|Psychic *(Special)*|0|0|30|
|36|Hyper Beam|Normal *(Physical)*|150|90|5|
|40|Earth Power|Ground *(Physical)*|90|100|10|
|47|Sandstorm|Rock *(Physical)*|0|0|10|
|54|Explosion|Normal *(Physical)*|250|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Wailord
ID: 300

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Splash|Normal *(Physical)*|0|0|40|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Water Gun|Water *(Special)*|40|100|25|
|1|Rollout|Rock *(Physical)*|30|90|20|
|4|Growl|Normal *(Physical)*|0|100|40|
|7|Water Gun|Water *(Special)*|40|100|25|
|11|Rollout|Rock *(Physical)*|30|90|20|
|14|Whirlpool|Water *(Special)*|35|85|15|
|17|Astonish|Ghost *(Physical)*|30|100|15|
|21|Water Pulse|Water *(Special)*|60|100|20|
|24|Mist|Ice *(Special)*|0|0|30|
|27|Rest|Psychic *(Special)*|0|0|10|
|31|Brine|Water *(Special)*|65|100|10|
|34|Water Spout|Water *(Special)*|150|100|5|
|37|Amnesia|Psychic *(Special)*|0|0|20|
|46|Dive|Water *(Special)*|60|100|10|
|54|Bounce|Flying *(Physical)*|85|85|5|
|62|Hydro Pump|Water *(Special)*|110|80|5|
|70|Body Slam|Normal *(Physical)*|85|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Skitty
ID: 301

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Stone 94|[Delcatty](#delcatty)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Fake Out|Normal *(Physical)*|40|100|10|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Tackle|Normal *(Physical)*|50|100|35|
|4|Foresight|Normal *(Physical)*|0|100|40|
|8|Attract|Normal *(Physical)*|0|100|15|
|11|Sing|Normal *(Physical)*|0|55|15|
|15|Doubleslap|Normal *(Physical)*|15|85|10|
|18|Copycat|Normal *(Physical)*|0|0|20|
|22|Assist|Normal *(Physical)*|0|100|20|
|25|Charm|23 *(Physical)*|0|100|20|
|29|Feint Attack|Dark *(Special)*|60|0|20|
|32|Wake-Up Slap|Fight *(Physical)*|70|100|10|
|36|Covet|Normal *(Physical)*|60|100|40|
|39|Heal Bell|Normal *(Physical)*|0|0|5|
|42|Double-Edge|Normal *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Torkoal
ID: 302

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Ember|Fire *(Special)*|40|100|25|
|4|Smog|Poison *(Physical)*|30|70|20|
|7|Withdraw|Water *(Special)*|0|0|40|
|12|Curse|??? *(Physical)*|0|0|10|
|17|Fire Spin|Fire *(Special)*|35|85|15|
|20|Smokescreen|Normal *(Physical)*|0|100|20|
|23|Rapid Spin|Normal *(Physical)*|20|100|40|
|28|Flamethrower|Fire *(Special)*|90|100|15|
|33|Body Slam|Normal *(Physical)*|85|100|15|
|36|Protect|Normal *(Physical)*|0|0|10|
|39|Lava Plume|Fire *(Special)*|80|100|15|
|44|Iron Defense|Steel *(Physical)*|0|0|15|
|49|Amnesia|Psychic *(Special)*|0|0|20|
|52|Flail|Normal *(Physical)*|1|100|15|
|55|Clear Smog|Poison *(Physical)*|50|0|15|
|60|Eruption|Fire *(Special)*|150|100|5|
|65|Shell Smash|Normal *(Physical)*|0|0|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Minun
ID: 303

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|3|Thunder Wave|Electric *(Special)*|0|100|20|
|7|Quick Attack|Normal *(Physical)*|40|100|30|
|10|Helping Hand|Normal *(Physical)*|0|100|20|
|15|Spark|Electric *(Special)*|65|100|20|
|17|Encore|Normal *(Physical)*|0|100|5|
|21|Charm|23 *(Physical)*|0|100|20|
|24|Copycat|Normal *(Physical)*|0|0|20|
|29|Discharge|Electric *(Special)*|80|100|15|
|31|Swift|Normal *(Physical)*|60|0|20|
|35|Charm|23 *(Physical)*|0|100|20|
|38|Charge|Electric *(Special)*|0|100|20|
|42|Thunder|Electric *(Special)*|110|70|10|
|44|Baton Pass|Normal *(Physical)*|0|0|40|
|48|Agility|Psychic *(Special)*|0|0|30|
|51|Signal Beam|Bug *(Physical)*|75|100|15|
|56|Nasty Plot|Dark *(Special)*|0|0|20|
|63|Sweet Kiss|23 *(Physical)*|0|75|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Relicanth
ID: 304

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|8|Water Gun|Water *(Special)*|40|100|25|
|15|Rock Tomb|Rock *(Physical)*|60|95|15|
|22|Yawn|Normal *(Physical)*|0|100|10|
|29|Take Down|Normal *(Physical)*|90|85|20|
|36|Mud Sport|Ground *(Physical)*|0|100|15|
|43|Ancientpower|Rock *(Physical)*|60|100|5|
|50|Double-Edge|Normal *(Physical)*|120|100|15|
|57|Dive|Water *(Special)*|60|100|10|
|64|Rest|Psychic *(Special)*|0|0|10|
|71|Hydro Pump|Water *(Special)*|110|80|5|
|78|Head Smash|Rock *(Physical)*|150|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Aron
ID: 305

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 32|[Lairon](#lairon)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|4|Mud-Slap|Ground *(Physical)*|20|100|10|
|8|Headbutt|Normal *(Physical)*|70|100|15|
|11|Metal Claw|Steel *(Physical)*|50|95|35|
|15|Iron Defense|Steel *(Physical)*|0|0|15|
|18|Roar|Normal *(Physical)*|0|100|20|
|22|Take Down|Normal *(Physical)*|90|85|20|
|25|Iron Head|Steel *(Physical)*|80|100|15|
|29|Protect|Normal *(Physical)*|0|0|10|
|32|Metal Sound|Steel *(Physical)*|0|85|40|
|36|Iron Tail|Steel *(Physical)*|100|75|15|
|39|Rock Polish|Rock *(Physical)*|0|0|20|
|43|Head Smash|Rock *(Physical)*|150|80|5|
|46|Double-Edge|Normal *(Physical)*|120|100|15|
|50|Endeavor|Normal *(Physical)*|1|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Lairon
ID: 306

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 42|[Aggron](#aggron)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|1|Mud-Slap|Ground *(Physical)*|20|100|10|
|1|Headbutt|Normal *(Physical)*|70|100|15|
|4|Mud-Slap|Ground *(Physical)*|20|100|10|
|8|Headbutt|Normal *(Physical)*|70|100|15|
|11|Metal Claw|Steel *(Physical)*|50|95|35|
|15|Iron Defense|Steel *(Physical)*|0|0|15|
|18|Roar|Normal *(Physical)*|0|100|20|
|22|Take Down|Normal *(Physical)*|90|85|20|
|25|Iron Head|Steel *(Physical)*|80|100|15|
|29|Protect|Normal *(Physical)*|0|0|10|
|34|Metal Sound|Steel *(Physical)*|0|85|40|
|40|Iron Tail|Steel *(Physical)*|100|75|15|
|45|Rock Polish|Rock *(Physical)*|0|0|20|
|51|Head Smash|Rock *(Physical)*|150|80|5|
|56|Double-Edge|Normal *(Physical)*|120|100|15|
|62|Endeavor|Normal *(Physical)*|1|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Mawile
ID: 307

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Play Rough|23 *(Physical)*|90|90|10|
|1|Fairy Wind|23 *(Physical)*|40|100|15|
|1|Astonish|Ghost *(Physical)*|30|100|15|
|1|Taunt|Dark *(Special)*|0|100|20|
|1|Growl|Normal *(Physical)*|0|100|40|
|6|Fake Tears|Dark *(Special)*|0|100|20|
|11|Bite|Dark *(Special)*|60|100|25|
|16|Sweet Scent|Normal *(Physical)*|0|100|20|
|21|Vicegrip|Normal *(Physical)*|55|100|30|
|26|Feint Attack|Dark *(Special)*|60|0|20|
|31|Baton Pass|Normal *(Physical)*|0|0|40|
|36|Crunch|Dark *(Special)*|80|100|15|
|41|Iron Defense|Steel *(Physical)*|0|0|15|
|46|Sucker Punch|Dark *(Special)*|80|100|5|
|50|Stockpile|Normal *(Physical)*|0|0|10|
|50|Spit Up|Normal *(Physical)*|100|100|10|
|50|Swallow|Normal *(Physical)*|0|0|10|
|56|Iron Head|Steel *(Physical)*|80|100|15|
|60|Play Rough|23 *(Physical)*|90|90|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Meditite
ID: 308

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 37|[Medicham](#medicham)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bide|Normal *(Physical)*|1|100|10|
|4|Meditate|Psychic *(Special)*|0|0|40|
|8|Confusion|Psychic *(Special)*|50|100|25|
|11|Detect|Fight *(Physical)*|0|0|5|
|15|Hidden Power|Normal *(Physical)*|1|100|15|
|18|Mind Reader|Normal *(Physical)*|0|100|5|
|22|Fake Out|Normal *(Physical)*|40|100|10|
|25|Calm Mind|Psychic *(Special)*|0|0|20|
|29|Force Palm|Fight *(Physical)*|60|100|10|
|32|Hi Jump Kick|Fight *(Physical)*|130|90|10|
|36|Psych Up|Normal *(Physical)*|0|0|10|
|39|Acupressure|Normal *(Physical)*|0|0|30|
|43|Psycho Cut|Psychic *(Special)*|70|100|20|
|46|Reversal|Fight *(Physical)*|1|100|15|
|50|Recover|Normal *(Physical)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Hariyama
ID: 309

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bullet Punch|Steel *(Physical)*|40|100|30|
|1|Brine|Water *(Special)*|65|100|10|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Focus Energy|Normal *(Physical)*|0|0|30|
|1|Sand-Attack|Ground *(Physical)*|0|100|15|
|1|Arm Thrust|Fight *(Physical)*|15|100|20|
|4|Sand-Attack|Ground *(Physical)*|0|100|15|
|7|Arm Thrust|Fight *(Physical)*|15|100|20|
|10|Vital Throw|Fight *(Physical)*|70|100|10|
|13|Fake Out|Normal *(Physical)*|40|100|10|
|16|Whirlwind|Normal *(Physical)*|0|100|20|
|19|Knock Off|Dark *(Special)*|65|100|25|
|22|Smellingsalt|Normal *(Physical)*|70|100|10|
|27|Belly Drum|Normal *(Physical)*|0|0|10|
|32|Force Palm|Fight *(Physical)*|60|100|10|
|37|Seismic Toss|Fight *(Physical)*|1|100|20|
|42|Wake-Up Slap|Fight *(Physical)*|70|100|10|
|47|Endure|Normal *(Physical)*|0|0|10|
|52|Close Combat|Fight *(Physical)*|120|100|5|
|57|Reversal|Fight *(Physical)*|1|100|15|
|62|Circle Throw|Fight *(Physical)*|60|90|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Electrike
ID: 310

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 26|[Manectric](#manectric)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|4|Thunder Wave|Electric *(Special)*|0|100|20|
|9|Leer|Normal *(Physical)*|0|100|30|
|12|Howl|Normal *(Physical)*|0|0|40|
|17|Quick Attack|Normal *(Physical)*|40|100|30|
|20|Spark|Electric *(Special)*|65|100|20|
|25|Odor Sleuth|Normal *(Physical)*|0|100|40|
|28|Bite|Dark *(Special)*|60|100|25|
|33|Thunder Fang|Electric *(Special)*|65|95|15|
|36|Roar|Normal *(Physical)*|0|100|20|
|41|Discharge|Electric *(Special)*|80|100|15|
|44|Charge|Electric *(Special)*|0|100|20|
|49|Wild Charge|Electric *(Special)*|90|100|15|
|52|Thunder|Electric *(Special)*|110|70|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Grumpig
ID: 311

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Splash|Normal *(Physical)*|0|0|40|
|1|Psywave|Psychic *(Special)*|1|100|15|
|1|Odor Sleuth|Normal *(Physical)*|0|100|40|
|1|Psybeam|Psychic *(Special)*|65|100|20|
|7|Psywave|Psychic *(Special)*|1|100|15|
|10|Odor Sleuth|Normal *(Physical)*|0|100|40|
|14|Psybeam|Psychic *(Special)*|65|100|20|
|15|Psych Up|Normal *(Physical)*|0|0|10|
|18|Confuse Ray|Ghost *(Physical)*|0|100|10|
|21|Magic Coat|Psychic *(Special)*|0|100|15|
|26|Zen Headbutt|Psychic *(Special)*|80|100|15|
|29|Rest|Psychic *(Special)*|0|0|10|
|29|Snore|Normal *(Physical)*|50|100|15|
|35|Power Gem|Rock *(Physical)*|80|100|20|
|42|Extrasensory|Psychic *(Special)*|80|100|20|
|46|Payback|Dark *(Special)*|50|100|10|
|52|Psychic|Psychic *(Special)*|90|100|10|
|60|Bounce|Flying *(Physical)*|85|85|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Plusle
ID: 312

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|3|Thunder Wave|Electric *(Special)*|0|100|20|
|7|Quick Attack|Normal *(Physical)*|40|100|30|
|10|Helping Hand|Normal *(Physical)*|0|100|20|
|15|Spark|Electric *(Special)*|65|100|20|
|17|Encore|Normal *(Physical)*|0|100|5|
|21|Fake Tears|Dark *(Special)*|0|100|20|
|24|Copycat|Normal *(Physical)*|0|0|20|
|29|Discharge|Electric *(Special)*|80|100|15|
|31|Swift|Normal *(Physical)*|60|0|20|
|35|Fake Tears|Dark *(Special)*|0|100|20|
|38|Charge|Electric *(Special)*|0|100|20|
|42|Thunder|Electric *(Special)*|110|70|10|
|44|Baton Pass|Normal *(Physical)*|0|0|40|
|48|Agility|Psychic *(Special)*|0|0|30|
|51|Signal Beam|Bug *(Physical)*|75|100|15|
|56|Nasty Plot|Dark *(Special)*|0|0|20|
|63|Sweet Kiss|23 *(Physical)*|0|75|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Castform
ID: 313

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|10|Water Gun|Water *(Special)*|40|100|25|
|10|Ember|Fire *(Special)*|40|100|25|
|10|Powder Snow|Ice *(Special)*|40|100|25|
|15|Headbutt|Normal *(Physical)*|70|100|15|
|20|Rain Dance|Water *(Special)*|0|0|5|
|20|Sunny Day|Fire *(Special)*|0|0|5|
|20|Hail|Ice *(Special)*|0|0|10|
|30|Weather Ball|Normal *(Physical)*|50|100|10|
|40|Hydro Pump|Water *(Special)*|110|80|5|
|40|Fire Blast|Fire *(Special)*|110|85|5|
|40|Blizzard|Ice *(Special)*|110|70|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Volbeat
ID: 314

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Flash|Normal *(Physical)*|0|70|20|
|1|Tackle|Normal *(Physical)*|50|100|35|
|5|Double Team|Normal *(Physical)*|0|0|15|
|9|Confuse Ray|Ghost *(Physical)*|0|100|10|
|13|Moonlight|23 *(Physical)*|0|0|5|
|17|Quick Attack|Normal *(Physical)*|40|100|30|
|21|Tail Glow|Bug *(Physical)*|0|0|20|
|25|Signal Beam|Bug *(Physical)*|75|100|15|
|29|Protect|Normal *(Physical)*|0|0|10|
|33|Helping Hand|Normal *(Physical)*|0|100|20|
|37|Zen Headbutt|Psychic *(Special)*|80|100|15|
|41|Bug Buzz|Bug *(Physical)*|90|100|10|
|45|Double-Edge|Normal *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Dusclops
ID: 315

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Fire Punch|Fire *(Special)*|75|100|15|
|1|Ice Punch|Ice *(Special)*|75|100|15|
|1|Thunderpunch|Electric *(Special)*|75|100|15|
|1|Pain Split|Normal *(Physical)*|0|100|20|
|1|Bind|Normal *(Physical)*|15|85|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Night Shade|Ghost *(Physical)*|1|100|15|
|1|Disable|Normal *(Physical)*|0|100|20|
|6|Disable|Normal *(Physical)*|0|100|20|
|9|Foresight|Normal *(Physical)*|0|100|40|
|14|Astonish|Ghost *(Physical)*|30|100|15|
|17|Confuse Ray|Ghost *(Physical)*|0|100|10|
|22|Shadow Sneak|Ghost *(Physical)*|40|100|30|
|25|Pursuit|Dark *(Special)*|40|100|20|
|30|Curse|??? *(Physical)*|0|0|10|
|33|Will-O-Wisp|Fire *(Special)*|0|85|15|
|37|Shadow Punch|Ghost *(Physical)*|60|0|20|
|42|Hex|Ghost *(Physical)*|65|100|10|
|49|Mean Look|Normal *(Physical)*|0|100|5|
|58|Payback|Dark *(Special)*|50|100|10|
|61|Future Sight|Psychic *(Special)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Slaking
ID: 316

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Yawn|Normal *(Physical)*|0|100|10|
|1|Encore|Normal *(Physical)*|0|100|5|
|1|Slack Off|Normal *(Physical)*|0|0|10|
|7|Encore|Normal *(Physical)*|0|100|5|
|13|Slack Off|Normal *(Physical)*|0|0|10|
|19|Feint Attack|Dark *(Special)*|60|0|20|
|25|Amnesia|Psychic *(Special)*|0|0|20|
|31|Covet|Normal *(Physical)*|60|100|40|
|36|Swagger|Normal *(Physical)*|0|90|15|
|37|Sucker Punch|Dark *(Special)*|80|100|5|
|43|Counter|Fight *(Physical)*|1|100|20|
|49|Flail|Normal *(Physical)*|1|100|15|
|55|Punishment|Dark *(Special)*|60|100|5|
|61|Hammer Arm|Fight *(Physical)*|100|90|10|
|67|Giga Impact|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Gulpin
ID: 317

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 26|[Swalot](#swalot)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Pound|Normal *(Physical)*|40|100|35|
|6|Yawn|Normal *(Physical)*|0|100|10|
|9|Poison Gas|Poison *(Physical)*|0|90|40|
|14|Sludge|Poison *(Physical)*|65|100|20|
|17|Amnesia|Psychic *(Special)*|0|0|20|
|23|Encore|Normal *(Physical)*|0|100|5|
|28|Toxic|Poison *(Physical)*|0|90|10|
|34|Acid Spray|Poison *(Physical)*|40|100|20|
|39|Stockpile|Normal *(Physical)*|0|0|10|
|39|Spit Up|Normal *(Physical)*|100|100|10|
|39|Swallow|Normal *(Physical)*|0|0|10|
|44|Sludge Bomb|Poison *(Physical)*|90|100|10|
|49|Gastro Acid|Poison *(Physical)*|0|100|10|
|55|Gunk Shot|Poison *(Physical)*|120|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Milotic
ID: 318

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Water Gun|Water *(Special)*|40|100|25|
|1|Wrap|Normal *(Physical)*|15|90|20|
|5|Water Sport|Water *(Special)*|0|100|15|
|9|Refresh|Normal *(Physical)*|0|100|20|
|13|Water Pulse|Water *(Special)*|60|100|20|
|17|Twister|Dragon *(Special)*|40|100|20|
|21|Recover|Normal *(Physical)*|0|0|10|
|25|Dragon Tail|Dragon *(Special)*|60|90|10|
|29|Aqua Tail|Water *(Special)*|90|90|10|
|33|Rain Dance|Water *(Special)*|0|0|5|
|37|Hydro Pump|Water *(Special)*|110|80|5|
|41|Attract|Normal *(Physical)*|0|100|15|
|45|Safeguard|Normal *(Physical)*|0|0|25|
|49|Haze|Ice *(Special)*|0|0|30|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Carvanha
ID: 319

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Sharpedo](#sharpedo)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Bite|Dark *(Special)*|60|100|25|
|6|Rage|Normal *(Physical)*|20|100|20|
|8|Focus Energy|Normal *(Physical)*|0|0|30|
|11|Scary Face|Normal *(Physical)*|0|90|10|
|16|Ice Fang|Ice *(Special)*|65|95|15|
|18|Screech|Normal *(Physical)*|0|85|40|
|21|Swagger|Normal *(Physical)*|0|90|15|
|26|Assurance|Dark *(Special)*|60|100|10|
|28|Crunch|Dark *(Special)*|80|100|15|
|31|Aqua Jet|Water *(Special)*|40|100|30|
|36|Agility|Psychic *(Special)*|0|0|30|
|38|Take Down|Normal *(Physical)*|90|85|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Masquerain
ID: 320

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bubble|Water *(Special)*|30|100|30|
|1|Quick Attack|Normal *(Physical)*|40|100|30|
|1|Sweet Scent|Normal *(Physical)*|0|100|20|
|1|Water Sport|Water *(Special)*|0|100|15|
|7|Quick Attack|Normal *(Physical)*|40|100|30|
|13|Sweet Scent|Normal *(Physical)*|0|100|20|
|19|Water Sport|Water *(Special)*|0|100|15|
|22|Gust|Flying *(Physical)*|40|100|35|
|26|Scary Face|Normal *(Physical)*|0|90|10|
|33|Stun Spore|Grass *(Special)*|0|75|30|
|40|Silver Wind|Bug *(Physical)*|60|100|5|
|47|Air Slash|Flying *(Physical)*|75|95|15|
|54|Whirlwind|Normal *(Physical)*|0|100|20|
|61|Bug Buzz|Bug *(Physical)*|90|100|10|
|68|Quiver Dance|Bug *(Physical)*|0|0|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Wailmer
ID: 321

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 40|[Wailord](#wailord)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Splash|Normal *(Physical)*|0|0|40|
|4|Growl|Normal *(Physical)*|0|100|40|
|7|Water Gun|Water *(Special)*|40|100|25|
|11|Rollout|Rock *(Physical)*|30|90|20|
|14|Whirlpool|Water *(Special)*|35|85|15|
|17|Astonish|Ghost *(Physical)*|30|100|15|
|21|Water Pulse|Water *(Special)*|60|100|20|
|24|Mist|Ice *(Special)*|0|0|30|
|27|Rest|Psychic *(Special)*|0|0|10|
|31|Brine|Water *(Special)*|65|100|10|
|34|Water Spout|Water *(Special)*|150|100|5|
|37|Amnesia|Psychic *(Special)*|0|0|20|
|41|Dive|Water *(Special)*|60|100|10|
|44|Bounce|Flying *(Physical)*|85|85|5|
|47|Hydro Pump|Water *(Special)*|110|80|5|
|50|Body Slam|Normal *(Physical)*|85|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Manectric
ID: 322

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Fire Fang|Fire *(Special)*|65|95|15|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Thunder Wave|Electric *(Special)*|0|100|20|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Howl|Normal *(Physical)*|0|0|40|
|4|Thunder Wave|Electric *(Special)*|0|100|20|
|9|Leer|Normal *(Physical)*|0|100|30|
|12|Howl|Normal *(Physical)*|0|0|40|
|17|Quick Attack|Normal *(Physical)*|40|100|30|
|20|Spark|Electric *(Special)*|65|100|20|
|25|Odor Sleuth|Normal *(Physical)*|0|100|40|
|30|Bite|Dark *(Special)*|60|100|25|
|37|Thunder Fang|Electric *(Special)*|65|95|15|
|42|Roar|Normal *(Physical)*|0|100|20|
|49|Discharge|Electric *(Special)*|80|100|15|
|54|Charge|Electric *(Special)*|0|100|20|
|61|Wild Charge|Electric *(Special)*|90|100|15|
|66|Thunder|Electric *(Special)*|110|70|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Numel
ID: 323

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 33|[Camerupt](#camerupt)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Tackle|Normal *(Physical)*|50|100|35|
|5|Ember|Fire *(Special)*|40|100|25|
|8|Magnitude|Ground *(Physical)*|1|100|30|
|12|Focus Energy|Normal *(Physical)*|0|0|30|
|15|Flame Burst|Fire *(Special)*|70|100|15|
|19|Amnesia|Psychic *(Special)*|0|0|20|
|22|Lava Plume|Fire *(Special)*|80|100|15|
|26|Earth Power|Ground *(Physical)*|90|100|10|
|29|Curse|??? *(Physical)*|0|0|10|
|31|Take Down|Normal *(Physical)*|90|85|20|
|36|Yawn|Normal *(Physical)*|0|100|10|
|40|Earthquake|Ground *(Physical)*|100|100|10|
|43|Flamethrower|Fire *(Special)*|90|100|15|
|47|Double-Edge|Normal *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Nosepass
ID: 324

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|4|Harden|Normal *(Physical)*|0|0|30|
|8|Block|Normal *(Physical)*|0|100|5|
|11|Rock Throw|Rock *(Physical)*|50|90|15|
|15|Thunder Wave|Electric *(Special)*|0|100|20|
|18|Rock Blast|Rock *(Physical)*|25|80|10|
|22|Rest|Psychic *(Special)*|0|0|10|
|25|Spark|Electric *(Special)*|65|100|20|
|29|Rock Slide|Rock *(Physical)*|75|90|10|
|32|Power Gem|Rock *(Physical)*|80|100|20|
|36|Sandstorm|Rock *(Physical)*|0|0|10|
|39|Discharge|Electric *(Special)*|80|100|15|
|43|Earth Power|Ground *(Physical)*|90|100|10|
|46|Stone Edge|Rock *(Physical)*|100|80|5|
|50|Lock-On|Normal *(Physical)*|0|100|5|
|50|Zap Cannon|Electric *(Special)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Azurill
ID: 325

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Happiness 0|[Marill](#marill)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Splash|Normal *(Physical)*|0|0|40|
|1|Water Gun|Water *(Special)*|40|100|25|
|2|Tail Whip|Normal *(Physical)*|0|100|30|
|5|Water Sport|Water *(Special)*|0|100|15|
|7|Bubble|Water *(Special)*|30|100|30|
|10|Charm|23 *(Physical)*|0|100|20|
|13|Bubblebeam|Water *(Special)*|65|100|20|
|16|Helping Hand|Normal *(Physical)*|0|100|20|
|20|Slam|Normal *(Physical)*|80|75|20|
|23|Bounce|Flying *(Physical)*|85|85|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Spoink
ID: 326

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 32|[Grumpig](#grumpig)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Splash|Normal *(Physical)*|0|0|40|
|7|Psywave|Psychic *(Special)*|1|100|15|
|10|Odor Sleuth|Normal *(Physical)*|0|100|40|
|14|Psybeam|Psychic *(Special)*|65|100|20|
|15|Psych Up|Normal *(Physical)*|0|0|10|
|18|Confuse Ray|Ghost *(Physical)*|0|100|10|
|21|Magic Coat|Psychic *(Special)*|0|100|15|
|26|Zen Headbutt|Psychic *(Special)*|80|100|15|
|29|Rest|Psychic *(Special)*|0|0|10|
|29|Snore|Normal *(Physical)*|50|100|15|
|33|Power Gem|Rock *(Physical)*|80|100|20|
|38|Extrasensory|Psychic *(Special)*|80|100|20|
|40|Payback|Dark *(Special)*|50|100|10|
|44|Psychic|Psychic *(Special)*|90|100|10|
|50|Bounce|Flying *(Physical)*|85|85|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Breloom
ID: 327

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Drain Punch|Fight *(Physical)*|75|100|10|
|1|Focus Punch|Fight *(Physical)*|150|100|20|
|1|Absorb|Grass *(Special)*|20|100|20|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Stun Spore|Grass *(Special)*|0|75|30|
|1|Leech Seed|Grass *(Special)*|0|90|10|
|5|Tackle|Normal *(Physical)*|50|100|35|
|9|Stun Spore|Grass *(Special)*|0|75|30|
|13|Leech Seed|Grass *(Special)*|0|90|10|
|17|Mega Drain|Grass *(Special)*|40|100|15|
|21|Headbutt|Normal *(Physical)*|70|100|15|
|23|Mach Punch|Fight *(Physical)*|40|100|30|
|25|Counter|Fight *(Physical)*|1|100|20|
|29|Force Palm|Fight *(Physical)*|60|100|10|
|33|Sky Uppercut|Fight *(Physical)*|85|90|15|
|37|Mind Reader|Normal *(Physical)*|0|100|5|
|41|Seed Bomb|Grass *(Special)*|80|100|15|
|45|Dynamicpunch|Fight *(Physical)*|100|50|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Sharpedo
ID: 328

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Hydro Pump|Water *(Special)*|110|80|5|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Bite|Dark *(Special)*|60|100|25|
|1|Rage|Normal *(Physical)*|20|100|20|
|1|Focus Energy|Normal *(Physical)*|0|0|30|
|6|Rage|Normal *(Physical)*|20|100|20|
|8|Focus Energy|Normal *(Physical)*|0|0|30|
|11|Scary Face|Normal *(Physical)*|0|90|10|
|16|Ice Fang|Ice *(Special)*|65|95|15|
|18|Screech|Normal *(Physical)*|0|85|40|
|21|Swagger|Normal *(Physical)*|0|90|15|
|26|Assurance|Dark *(Special)*|60|100|10|
|28|Crunch|Dark *(Special)*|80|100|15|
|30|Slash|Normal *(Physical)*|70|100|20|
|34|Aqua Jet|Water *(Special)*|40|100|30|
|40|Taunt|Dark *(Special)*|0|100|20|
|45|Agility|Psychic *(Special)*|0|0|30|
|50|Skull Bash|Normal *(Physical)*|130|100|10|
|56|Night Slash|Dark *(Special)*|70|100|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Trapinch
ID: 329

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 35|[Vibrava](#vibrava)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bite|Dark *(Special)*|60|100|25|
|4|Sand-Attack|Ground *(Physical)*|0|100|15|
|7|Feint Attack|Dark *(Special)*|60|0|20|
|10|Sand Tomb|Ground *(Physical)*|35|85|15|
|13|Bug Bite|Bug *(Physical)*|60|100|20|
|17|Bide|Normal *(Physical)*|1|100|10|
|21|Bulldoze|Ground *(Physical)*|60|100|20|
|25|Rock Slide|Rock *(Physical)*|75|90|10|
|29|Dig|Ground *(Physical)*|80|100|10|
|34|Crunch|Dark *(Special)*|80|100|15|
|39|Earth Power|Ground *(Physical)*|90|100|10|
|44|Sandstorm|Rock *(Physical)*|0|0|10|
|49|Hyper Beam|Normal *(Physical)*|150|90|5|
|55|Earthquake|Ground *(Physical)*|100|100|10|
|61|Giga Drain|Grass *(Special)*|75|100|10|
|67|Superpower|Fight *(Physical)*|120|100|5|
|73|Fissure|Ground *(Physical)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Vibrava
ID: 330

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 45|[Flygon](#flygon)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Sonicboom|Normal *(Physical)*|1|90|20|
|1|Sand-Attack|Ground *(Physical)*|0|100|15|
|1|Feint Attack|Dark *(Special)*|60|0|20|
|1|Sand Tomb|Ground *(Physical)*|35|85|15|
|4|Sand-Attack|Ground *(Physical)*|0|100|15|
|7|Feint Attack|Dark *(Special)*|60|0|20|
|10|Sand Tomb|Ground *(Physical)*|35|85|15|
|13|Bug Bite|Bug *(Physical)*|60|100|20|
|17|Bide|Normal *(Physical)*|1|100|10|
|21|Bulldoze|Ground *(Physical)*|60|100|20|
|25|Rock Slide|Rock *(Physical)*|75|90|10|
|29|Supersonic|Normal *(Physical)*|0|55|20|
|34|Screech|Normal *(Physical)*|0|85|40|
|35|Dragonbreath|Dragon *(Special)*|60|100|20|
|39|Earth Power|Ground *(Physical)*|90|100|10|
|44|Sandstorm|Rock *(Physical)*|0|0|10|
|49|Hyper Beam|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Walrein
ID: 331

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Crunch|Dark *(Special)*|80|100|15|
|1|Super Fang|Normal *(Physical)*|1|90|10|
|1|Brine|Water *(Special)*|65|100|10|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|1|Powder Snow|Ice *(Special)*|40|100|25|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Water Gun|Water *(Special)*|40|100|25|
|7|Encore|Normal *(Physical)*|0|100|5|
|13|Ice Ball|Ice *(Special)*|30|90|20|
|19|Body Slam|Normal *(Physical)*|85|100|15|
|25|Aurora Beam|Ice *(Special)*|65|100|20|
|31|Hail|Ice *(Special)*|0|0|10|
|32|Swagger|Normal *(Physical)*|0|90|15|
|39|Rest|Psychic *(Special)*|0|0|10|
|39|Snore|Normal *(Physical)*|50|100|15|
|44|Ice Fang|Ice *(Special)*|65|95|15|
|52|Blizzard|Ice *(Special)*|110|70|5|
|65|Sheer Cold|Ice *(Special)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Cacnea
ID: 332

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 32|[Cacturne](#cacturne)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Poison Sting|Poison *(Physical)*|15|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|5|Absorb|Grass *(Special)*|20|100|20|
|9|Growth|Normal *(Physical)*|0|0|40|
|13|Leech Seed|Grass *(Special)*|0|90|10|
|17|Sand-Attack|Ground *(Physical)*|0|100|15|
|21|Pin Missile|Bug *(Physical)*|25|95|20|
|25|Ingrain|Grass *(Special)*|0|100|20|
|29|Feint Attack|Dark *(Special)*|60|0|20|
|33|Spikes|Ground *(Physical)*|0|0|20|
|37|Sucker Punch|Dark *(Special)*|80|100|5|
|41|Payback|Dark *(Special)*|50|100|10|
|45|Needle Arm|Grass *(Special)*|60|100|15|
|49|Cotton Spore|Grass *(Special)*|0|85|40|
|53|Sandstorm|Rock *(Physical)*|0|0|10|
|57|Destiny Bond|Ghost *(Physical)*|0|0|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Medicham
ID: 333

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Zen Headbutt|Psychic *(Special)*|80|100|15|
|1|Fire Punch|Fire *(Special)*|75|100|15|
|1|Thunderpunch|Electric *(Special)*|75|100|15|
|1|Ice Punch|Ice *(Special)*|75|100|15|
|1|Bide|Normal *(Physical)*|1|100|10|
|1|Meditate|Psychic *(Special)*|0|0|40|
|1|Confusion|Psychic *(Special)*|50|100|25|
|1|Detect|Fight *(Physical)*|0|0|5|
|4|Meditate|Psychic *(Special)*|0|0|40|
|8|Confusion|Psychic *(Special)*|50|100|25|
|11|Detect|Fight *(Physical)*|0|0|5|
|15|Hidden Power|Normal *(Physical)*|1|100|15|
|18|Mind Reader|Normal *(Physical)*|0|100|5|
|22|Fake Out|Normal *(Physical)*|40|100|10|
|25|Calm Mind|Psychic *(Special)*|0|0|20|
|29|Force Palm|Fight *(Physical)*|60|100|10|
|32|Hi Jump Kick|Fight *(Physical)*|130|90|10|
|36|Psych Up|Normal *(Physical)*|0|0|10|
|42|Acupressure|Normal *(Physical)*|0|0|30|
|49|Psycho Cut|Psychic *(Special)*|70|100|20|
|55|Reversal|Fight *(Physical)*|1|100|15|
|62|Recover|Normal *(Physical)*|0|0|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|

## Swablu
ID: 334

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 35|[Altaria](#altaria)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|4|Astonish|Ghost *(Physical)*|30|100|15|
|8|Sing|Normal *(Physical)*|0|55|15|
|10|Fury Attack|Normal *(Physical)*|15|85|20|
|13|Safeguard|Normal *(Physical)*|0|0|25|
|15|Mist|Ice *(Special)*|0|0|30|
|18|Gust|Flying *(Physical)*|40|100|35|
|21|Nature Power|Normal *(Physical)*|0|0|20|
|25|Take Down|Normal *(Physical)*|90|85|20|
|29|Refresh|Normal *(Physical)*|0|100|20|
|34|Mirror Move|Flying *(Physical)*|0|0|20|
|39|Cotton Guard|Grass *(Special)*|0|0|20|
|42|Dragon Pulse|Dragon *(Special)*|90|100|10|
|48|Perish Song|Normal *(Physical)*|0|0|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Seviper
ID: 335

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Wrap|Normal *(Physical)*|15|90|20|
|1|Lick|Ghost *(Physical)*|30|100|30|
|5|Bite|Dark *(Special)*|60|100|25|
|9|Swagger|Normal *(Physical)*|0|90|15|
|12|Poison Tail|Poison *(Physical)*|50|100|25|
|16|Screech|Normal *(Physical)*|0|85|40|
|20|Venoshock|Poison *(Physical)*|65|100|10|
|23|Glare|Normal *(Physical)*|0|100|30|
|27|Poison Fang|Poison *(Physical)*|50|100|15|
|31|Night Slash|Dark *(Special)*|70|100|20|
|34|Scary Face|Normal *(Physical)*|0|90|10|
|38|Haze|Ice *(Special)*|0|0|30|
|42|Poison Jab|Poison *(Physical)*|80|100|20|
|45|Crunch|Dark *(Special)*|80|100|15|
|49|Coil|Poison *(Physical)*|0|0|20|
|53|Aqua Tail|Water *(Special)*|90|90|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Banette
ID: 336

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Knock Off|Dark *(Special)*|65|100|25|
|1|Screech|Normal *(Physical)*|0|85|40|
|1|Night Shade|Ghost *(Physical)*|1|100|15|
|1|Curse|??? *(Physical)*|0|0|10|
|7|Night Shade|Ghost *(Physical)*|1|100|15|
|10|Spite|Ghost *(Physical)*|0|100|10|
|13|Will-O-Wisp|Fire *(Special)*|0|85|15|
|16|Shadow Sneak|Ghost *(Physical)*|40|100|30|
|19|Curse|??? *(Physical)*|0|0|10|
|22|Feint Attack|Dark *(Special)*|60|0|20|
|26|Hex|Ghost *(Physical)*|65|100|10|
|30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|34|Sucker Punch|Dark *(Special)*|80|100|5|
|40|Destiny Bond|Ghost *(Physical)*|0|0|5|
|46|Snatch|Dark *(Special)*|0|100|10|
|52|Grudge|Ghost *(Physical)*|0|100|5|
|58|Trick|Psychic *(Special)*|0|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Glalie
ID: 337

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Powder Snow|Ice *(Special)*|40|100|25|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Double Team|Normal *(Physical)*|0|0|15|
|1|Bite|Dark *(Special)*|60|100|25|
|4|Double Team|Normal *(Physical)*|0|0|15|
|10|Bite|Dark *(Special)*|60|100|25|
|13|Icy Wind|Ice *(Special)*|55|95|15|
|19|Headbutt|Normal *(Physical)*|70|100|15|
|22|Protect|Normal *(Physical)*|0|0|10|
|28|Ice Fang|Ice *(Special)*|65|95|15|
|31|Crunch|Dark *(Special)*|80|100|15|
|37|Ice Beam|Ice *(Special)*|90|100|10|
|40|Hail|Ice *(Special)*|0|0|10|
|51|Blizzard|Ice *(Special)*|110|70|5|
|59|Sheer Cold|Ice *(Special)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Lunatone
ID: 338

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|1|Confusion|Psychic *(Special)*|50|100|25|
|5|Rock Slide|Rock *(Physical)*|75|90|10|
|9|Hypnosis|Psychic *(Special)*|0|60|20|
|13|Rock Polish|Rock *(Physical)*|0|0|20|
|17|Psywave|Psychic *(Special)*|1|100|15|
|21|Helping Hand|Normal *(Physical)*|0|100|20|
|25|Rock Slide|Rock *(Physical)*|75|90|10|
|29|Cosmic Power|Psychic *(Special)*|0|0|20|
|33|Psychic|Psychic *(Special)*|90|100|10|
|37|Moonlight|23 *(Physical)*|0|0|5|
|41|Stone Edge|Rock *(Physical)*|100|80|5|
|45|Future Sight|Psychic *(Special)*|120|100|15|
|49|Explosion|Normal *(Physical)*|250|100|5|
|53|Moonblast|23 *(Physical)*|95|100|40|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Sableye
ID: 339

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Scratch|Normal *(Physical)*|40|100|35|
|4|Foresight|Normal *(Physical)*|0|100|40|
|8|Night Shade|Ghost *(Physical)*|1|100|15|
|11|Astonish|Ghost *(Physical)*|30|100|15|
|15|Fury Swipes|Normal *(Physical)*|18|80|15|
|18|Fake Out|Normal *(Physical)*|40|100|10|
|22|Detect|Fight *(Physical)*|0|0|5|
|25|Shadow Sneak|Ghost *(Physical)*|40|100|30|
|29|Knock Off|Dark *(Special)*|65|100|25|
|32|Feint Attack|Dark *(Special)*|60|0|20|
|36|Confuse Ray|Ghost *(Physical)*|0|100|10|
|39|Shadow Claw|Ghost *(Physical)*|70|100|15|
|43|Power Gem|Rock *(Physical)*|80|100|20|
|46|Moonlight|23 *(Physical)*|0|0|5|
|50|Punishment|Dark *(Special)*|60|100|5|
|53|Zen Headbutt|Psychic *(Special)*|80|100|15|
|57|Shadow Ball|Ghost *(Physical)*|80|100|15|
|60|Mean Look|Normal *(Physical)*|0|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Barboach
ID: 340

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Whiscash](#whiscash)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Mud-Slap|Ground *(Physical)*|20|100|10|
|6|Mud Sport|Ground *(Physical)*|0|100|15|
|6|Water Sport|Water *(Special)*|0|100|15|
|10|Water Gun|Water *(Special)*|40|100|25|
|14|Mud Bomb|Ground *(Physical)*|65|85|10|
|18|Amnesia|Psychic *(Special)*|0|0|20|
|22|Water Pulse|Water *(Special)*|60|100|20|
|26|Magnitude|Ground *(Physical)*|1|100|30|
|31|Rest|Psychic *(Special)*|0|0|10|
|31|Snore|Normal *(Physical)*|50|100|15|
|35|Aqua Tail|Water *(Special)*|90|90|10|
|39|Earthquake|Ground *(Physical)*|100|100|10|
|43|Future Sight|Psychic *(Special)*|120|100|15|
|47|Fissure|Ground *(Physical)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Luvdisc
ID: 341

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|4|Charm|23 *(Physical)*|0|100|20|
|7|Water Gun|Water *(Special)*|40|100|25|
|9|Agility|Psychic *(Special)*|0|0|30|
|14|Take Down|Normal *(Physical)*|90|85|20|
|17|Icy Wind|Ice *(Special)*|55|95|15|
|22|Water Pulse|Water *(Special)*|60|100|20|
|27|Attract|Normal *(Physical)*|0|100|15|
|31|Flail|Normal *(Physical)*|1|100|15|
|37|Sweet Kiss|23 *(Physical)*|0|75|10|
|40|Hydro Pump|Water *(Special)*|110|80|5|
|46|Rain Dance|Water *(Special)*|0|0|5|
|51|Heal Pulse|Psychic *(Special)*|0|0|10|
|55|Safeguard|Normal *(Physical)*|0|0|25|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|

## Corphish
ID: 342

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Crawdaunt](#crawdaunt)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Bubble|Water *(Special)*|30|100|30|
|7|Harden|Normal *(Physical)*|0|0|30|
|10|Vicegrip|Normal *(Physical)*|55|100|30|
|13|Leer|Normal *(Physical)*|0|100|30|
|20|Bubblebeam|Water *(Special)*|65|100|20|
|23|Protect|Normal *(Physical)*|0|0|10|
|26|Knock Off|Dark *(Special)*|65|100|25|
|32|Taunt|Dark *(Special)*|0|100|20|
|35|Night Slash|Dark *(Special)*|70|100|20|
|38|Crabhammer|Water *(Special)*|100|90|10|
|44|Swords Dance|Normal *(Physical)*|0|0|20|
|47|Crunch|Dark *(Special)*|80|100|15|
|53|Guillotine|Normal *(Physical)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Kecleon
ID: 343

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Thief|Dark *(Special)*|60|100|10|
|1|Tail Whip|Normal *(Physical)*|0|100|30|
|1|Astonish|Ghost *(Physical)*|30|100|15|
|1|Lick|Ghost *(Physical)*|30|100|30|
|1|Scratch|Normal *(Physical)*|40|100|35|
|4|Bind|Normal *(Physical)*|15|85|20|
|7|Feint Attack|Dark *(Special)*|60|0|20|
|10|Fury Swipes|Normal *(Physical)*|18|80|15|
|14|Skill Swap|Psychic *(Special)*|0|100|10|
|18|Psybeam|Psychic *(Special)*|65|100|20|
|22|Shadow Sneak|Ghost *(Physical)*|40|100|30|
|27|Slash|Normal *(Physical)*|70|100|20|
|32|Screech|Normal *(Physical)*|0|85|40|
|37|Substitute|Normal *(Physical)*|0|0|10|
|43|Sucker Punch|Dark *(Special)*|80|100|5|
|49|Shadow Claw|Ghost *(Physical)*|70|100|15|
|55|Ancientpower|Rock *(Physical)*|60|100|5|
|58|Power Whip|Grass *(Special)*|120|85|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Baltoy
ID: 344

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 36|[Claydol](#claydol)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Harden|Normal *(Physical)*|0|0|30|
|1|Confusion|Psychic *(Special)*|50|100|25|
|4|Rapid Spin|Normal *(Physical)*|20|100|40|
|7|Mud-Slap|Ground *(Physical)*|20|100|10|
|10|Rock Tomb|Rock *(Physical)*|60|95|15|
|13|Psybeam|Psychic *(Special)*|65|100|20|
|17|Miracle Eye|Psychic *(Special)*|0|100|40|
|21|Ancientpower|Rock *(Physical)*|60|100|5|
|25|Selfdestruct|Normal *(Physical)*|200|100|5|
|28|Extrasensory|Psychic *(Special)*|80|100|20|
|31|Cosmic Power|Psychic *(Special)*|0|0|20|
|34|Reflect|Psychic *(Special)*|0|0|20|
|34|Light Screen|Psychic *(Special)*|0|0|30|
|37|Earth Power|Ground *(Physical)*|90|100|10|
|41|Sandstorm|Rock *(Physical)*|0|0|10|
|45|Explosion|Normal *(Physical)*|250|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Illumise
ID: 345

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Tackle|Normal *(Physical)*|50|100|35|
|5|Sweet Scent|Normal *(Physical)*|0|100|20|
|9|Charm|23 *(Physical)*|0|100|20|
|13|Moonlight|23 *(Physical)*|0|0|5|
|17|Quick Attack|Normal *(Physical)*|40|100|30|
|21|Wish|Normal *(Physical)*|0|100|10|
|25|Encore|Normal *(Physical)*|0|100|5|
|29|Flatter|Dark *(Special)*|0|100|15|
|33|Helping Hand|Normal *(Physical)*|0|100|20|
|37|Zen Headbutt|Psychic *(Special)*|80|100|15|
|41|Bug Buzz|Bug *(Physical)*|90|100|10|
|45|Covet|Normal *(Physical)*|60|100|40|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|

## Lileep
ID: 346

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 40|[Cradily](#cradily)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Astonish|Ghost *(Physical)*|30|100|15|
|1|Constrict|Normal *(Physical)*|10|100|35|
|8|Acid|Poison *(Physical)*|50|100|30|
|15|Ingrain|Grass *(Special)*|0|100|20|
|22|Confuse Ray|Ghost *(Physical)*|0|100|10|
|29|Amnesia|Psychic *(Special)*|0|0|20|
|36|Gastro Acid|Poison *(Physical)*|0|100|10|
|43|Ancientpower|Rock *(Physical)*|60|100|5|
|50|Energy Ball|Grass *(Special)*|90|100|10|
|57|Stockpile|Normal *(Physical)*|0|0|10|
|57|Spit Up|Normal *(Physical)*|100|100|10|
|57|Swallow|Normal *(Physical)*|0|0|10|
|64|Giga Drain|Grass *(Special)*|75|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Cradily
ID: 347

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Stealth Rock|Rock *(Physical)*|0|0|20|
|1|Astonish|Ghost *(Physical)*|30|100|15|
|1|Constrict|Normal *(Physical)*|10|100|35|
|1|Acid|Poison *(Physical)*|50|100|30|
|1|Ingrain|Grass *(Special)*|0|100|20|
|8|Acid|Poison *(Physical)*|50|100|30|
|15|Ingrain|Grass *(Special)*|0|100|20|
|22|Confuse Ray|Ghost *(Physical)*|0|100|10|
|29|Amnesia|Psychic *(Special)*|0|0|20|
|36|Gastro Acid|Poison *(Physical)*|0|100|10|
|46|Ancientpower|Rock *(Physical)*|60|100|5|
|56|Energy Ball|Grass *(Special)*|90|100|10|
|66|Stockpile|Normal *(Physical)*|0|0|10|
|66|Spit Up|Normal *(Physical)*|100|100|10|
|66|Swallow|Normal *(Physical)*|0|0|10|
|75|Giga Drain|Grass *(Special)*|75|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Anorith
ID: 348

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 40|[Armaldo](#armaldo)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|7|Mud Sport|Ground *(Physical)*|0|100|15|
|13|Water Gun|Water *(Special)*|40|100|25|
|19|Metal Claw|Steel *(Physical)*|50|95|35|
|25|Protect|Normal *(Physical)*|0|0|10|
|31|Ancientpower|Rock *(Physical)*|60|100|5|
|37|Fury Cutter|Bug *(Physical)*|40|95|20|
|43|Slash|Normal *(Physical)*|70|100|20|
|49|Rock Blast|Rock *(Physical)*|25|80|10|
|55|Crush Claw|Normal *(Physical)*|75|95|10|
|61|X-Scissor|Bug *(Physical)*|80|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Crawdaunt
ID: 349

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Dragon Dance|Dragon *(Special)*|0|0|20|
|1|Bubble|Water *(Special)*|30|100|30|
|1|Harden|Normal *(Physical)*|0|0|30|
|1|Vicegrip|Normal *(Physical)*|55|100|30|
|1|Leer|Normal *(Physical)*|0|100|30|
|7|Harden|Normal *(Physical)*|0|0|30|
|10|Vicegrip|Normal *(Physical)*|55|100|30|
|13|Leer|Normal *(Physical)*|0|100|30|
|20|Bubblebeam|Water *(Special)*|65|100|20|
|23|Protect|Normal *(Physical)*|0|0|10|
|26|Knock Off|Dark *(Special)*|65|100|25|
|30|Superpower|Fight *(Physical)*|120|100|5|
|34|Taunt|Dark *(Special)*|0|100|20|
|39|Night Slash|Dark *(Special)*|70|100|20|
|44|Crabhammer|Water *(Special)*|100|90|10|
|52|Swords Dance|Normal *(Physical)*|0|0|20|
|57|Crunch|Dark *(Special)*|80|100|15|
|65|Guillotine|Normal *(Physical)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Feebas
ID: 350

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Beauty 170|[Milotic](#milotic)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Splash|Normal *(Physical)*|0|0|40|
|15|Tackle|Normal *(Physical)*|50|100|35|
|30|Flail|Normal *(Physical)*|1|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Aggron
ID: 351

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Stealth Rock|Rock *(Physical)*|0|0|20|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Harden|Normal *(Physical)*|0|0|30|
|1|Mud-Slap|Ground *(Physical)*|20|100|10|
|1|Headbutt|Normal *(Physical)*|70|100|15|
|4|Mud-Slap|Ground *(Physical)*|20|100|10|
|8|Headbutt|Normal *(Physical)*|70|100|15|
|11|Metal Claw|Steel *(Physical)*|50|95|35|
|15|Iron Defense|Steel *(Physical)*|0|0|15|
|18|Roar|Normal *(Physical)*|0|100|20|
|22|Take Down|Normal *(Physical)*|90|85|20|
|25|Iron Head|Steel *(Physical)*|80|100|15|
|29|Protect|Normal *(Physical)*|0|0|10|
|34|Metal Sound|Steel *(Physical)*|0|85|40|
|40|Iron Tail|Steel *(Physical)*|100|75|15|
|42|Superpower|Fight *(Physical)*|120|100|5|
|48|Rock Polish|Rock *(Physical)*|0|0|20|
|57|Head Smash|Rock *(Physical)*|150|80|5|
|65|Double-Edge|Normal *(Physical)*|120|100|15|
|74|Endeavor|Normal *(Physical)*|1|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Delcatty
ID: 352

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Fake Out|Normal *(Physical)*|40|100|10|
|1|Attract|Normal *(Physical)*|0|100|15|
|1|Sing|Normal *(Physical)*|0|55|15|
|1|Doubleslap|Normal *(Physical)*|15|85|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Absol
ID: 353

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Detect|Fight *(Physical)*|0|0|5|
|1|Taunt|Dark *(Special)*|0|100|20|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|4|Leer|Normal *(Physical)*|0|100|30|
|9|Quick Attack|Normal *(Physical)*|40|100|30|
|12|Pursuit|Dark *(Special)*|40|100|20|
|17|Taunt|Dark *(Special)*|0|100|20|
|20|Bite|Dark *(Special)*|60|100|25|
|25|Double Team|Normal *(Physical)*|0|0|15|
|28|Slash|Normal *(Physical)*|70|100|20|
|33|Swords Dance|Normal *(Physical)*|0|0|20|
|36|Future Sight|Psychic *(Special)*|120|100|15|
|41|Night Slash|Dark *(Special)*|70|100|20|
|44|Detect|Fight *(Physical)*|0|0|5|
|47|Psycho Cut|Psychic *(Special)*|70|100|20|
|50|Sucker Punch|Dark *(Special)*|80|100|5|
|57|Razor Wind|Normal *(Physical)*|80|100|10|
|60|Play Rough|23 *(Physical)*|90|90|10|
|65|Perish Song|Normal *(Physical)*|0|0|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Shuppet
ID: 354

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 37|[Banette](#banette)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Knock Off|Dark *(Special)*|65|100|25|
|4|Screech|Normal *(Physical)*|0|85|40|
|7|Night Shade|Ghost *(Physical)*|1|100|15|
|10|Spite|Ghost *(Physical)*|0|100|10|
|13|Will-O-Wisp|Fire *(Special)*|0|85|15|
|16|Shadow Sneak|Ghost *(Physical)*|40|100|30|
|19|Curse|??? *(Physical)*|0|0|10|
|22|Feint Attack|Dark *(Special)*|60|0|20|
|26|Hex|Ghost *(Physical)*|65|100|10|
|30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|34|Sucker Punch|Dark *(Special)*|80|100|5|
|38|Destiny Bond|Ghost *(Physical)*|0|0|5|
|42|Snatch|Dark *(Special)*|0|100|10|
|46|Grudge|Ghost *(Physical)*|0|100|5|
|50|Trick|Psychic *(Special)*|0|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Wynaut
ID: 355

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 15|[Wobbuffet](#wobbuffet)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Splash|Normal *(Physical)*|0|0|40|
|1|Charm|23 *(Physical)*|0|100|20|
|1|Encore|Normal *(Physical)*|0|100|5|
|15|Counter|Fight *(Physical)*|1|100|20|
|15|Mirror Coat|Psychic *(Special)*|1|100|20|
|15|Safeguard|Normal *(Physical)*|0|0|25|
|15|Destiny Bond|Ghost *(Physical)*|0|0|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Duskull
ID: 356

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 37|[Dusclops](#dusclops)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Night Shade|Ghost *(Physical)*|1|100|15|
|6|Disable|Normal *(Physical)*|0|100|20|
|9|Foresight|Normal *(Physical)*|0|100|40|
|14|Astonish|Ghost *(Physical)*|30|100|15|
|17|Confuse Ray|Ghost *(Physical)*|0|100|10|
|22|Shadow Sneak|Ghost *(Physical)*|40|100|30|
|25|Pursuit|Dark *(Special)*|40|100|20|
|30|Curse|??? *(Physical)*|0|0|10|
|33|Will-O-Wisp|Fire *(Special)*|0|85|15|
|38|Hex|Ghost *(Physical)*|65|100|10|
|41|Mean Look|Normal *(Physical)*|0|100|5|
|46|Payback|Dark *(Special)*|50|100|10|
|49|Future Sight|Psychic *(Special)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Swalot
ID: 357

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Pound|Normal *(Physical)*|40|100|35|
|1|Yawn|Normal *(Physical)*|0|100|10|
|1|Poison Gas|Poison *(Physical)*|0|90|40|
|1|Sludge|Poison *(Physical)*|65|100|20|
|6|Yawn|Normal *(Physical)*|0|100|10|
|9|Poison Gas|Poison *(Physical)*|0|90|40|
|14|Sludge|Poison *(Physical)*|65|100|20|
|17|Amnesia|Psychic *(Special)*|0|0|20|
|23|Encore|Normal *(Physical)*|0|100|5|
|26|Body Slam|Normal *(Physical)*|85|100|15|
|30|Toxic|Poison *(Physical)*|0|90|10|
|38|Acid Spray|Poison *(Physical)*|40|100|20|
|45|Stockpile|Normal *(Physical)*|0|0|10|
|45|Spit Up|Normal *(Physical)*|100|100|10|
|45|Swallow|Normal *(Physical)*|0|0|10|
|52|Sludge Bomb|Poison *(Physical)*|90|100|10|
|59|Gastro Acid|Poison *(Physical)*|0|100|10|
|66|Gunk Shot|Poison *(Physical)*|120|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM09|Bullet Seed|Grass *(Special)*|25|100|30|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM19|Giga Drain|Grass *(Special)*|75|100|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Deoxys
ID: 358

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Wrap|Normal *(Physical)*|15|90|20|
|9|Night Shade|Ghost *(Physical)*|1|100|15|
|17|Teleport|Psychic *(Special)*|0|0|20|
|25|Taunt|Dark *(Special)*|0|100|20|
|33|Pursuit|Dark *(Special)*|40|100|20|
|41|Psychic|Psychic *(Special)*|90|100|10|
|49|Superpower|Fight *(Physical)*|120|100|5|
|57|Spikes|Ground *(Physical)*|0|0|20|
|65|Zen Headbutt|Psychic *(Special)*|80|100|15|
|73|Cosmic Power|Psychic *(Special)*|0|0|20|
|81|Zap Cannon|Electric *(Special)*|100|50|5|
|89|Psycho Boost|Psychic *(Special)*|140|90|5|
|97|Hyper Beam|Normal *(Physical)*|150|90|5|
|97|Giga Impact|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Gorebyss
ID: 359

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Whirlpool|Water *(Special)*|35|85|15|
|6|Confusion|Psychic *(Special)*|50|100|25|
|10|Agility|Psychic *(Special)*|0|0|30|
|15|Water Pulse|Water *(Special)*|60|100|20|
|19|Amnesia|Psychic *(Special)*|0|0|20|
|24|Drain Kiss|23 *(Physical)*|75|100|10|
|28|Attract|Normal *(Physical)*|0|100|15|
|33|Baton Pass|Normal *(Physical)*|0|0|40|
|37|Dive|Water *(Special)*|60|100|10|
|42|Psychic|Psychic *(Special)*|90|100|10|
|46|Aqua Tail|Water *(Special)*|90|90|10|
|51|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM46|Thief|Dark *(Special)*|60|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Altaria
ID: 360

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Moonblast|23 *(Physical)*|95|100|40|
|1|Peck|Flying *(Physical)*|35|100|35|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Astonish|Ghost *(Physical)*|30|100|15|
|1|Sing|Normal *(Physical)*|0|55|15|
|4|Astonish|Ghost *(Physical)*|30|100|15|
|8|Sing|Normal *(Physical)*|0|55|15|
|10|Fury Attack|Normal *(Physical)*|15|85|20|
|13|Safeguard|Normal *(Physical)*|0|0|25|
|15|Mist|Ice *(Special)*|0|0|30|
|18|Gust|Flying *(Physical)*|40|100|35|
|21|Nature Power|Normal *(Physical)*|0|0|20|
|25|Take Down|Normal *(Physical)*|90|85|20|
|29|Refresh|Normal *(Physical)*|0|100|20|
|34|Dragon Dance|Dragon *(Special)*|0|0|20|
|35|Dragonbreath|Dragon *(Special)*|60|100|20|
|42|Cotton Guard|Grass *(Special)*|0|0|20|
|48|Dragon Pulse|Dragon *(Special)*|90|100|10|
|57|Perish Song|Normal *(Physical)*|0|0|5|
|64|Sky Attack|Flying *(Physical)*|140|90|5|

## Cacturne
ID: 361

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Drain Punch|Fight *(Physical)*|75|100|10|
|1|Poison Sting|Poison *(Physical)*|15|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Absorb|Grass *(Special)*|20|100|20|
|1|Growth|Normal *(Physical)*|0|0|40|
|5|Absorb|Grass *(Special)*|20|100|20|
|9|Growth|Normal *(Physical)*|0|0|40|
|13|Leech Seed|Grass *(Special)*|0|90|10|
|17|Sand-Attack|Ground *(Physical)*|0|100|15|
|21|Pin Missile|Bug *(Physical)*|25|95|20|
|25|Ingrain|Grass *(Special)*|0|100|20|
|29|Feint Attack|Dark *(Special)*|60|0|20|
|35|Spikes|Ground *(Physical)*|0|0|20|
|41|Sucker Punch|Dark *(Special)*|80|100|5|
|47|Payback|Dark *(Special)*|50|100|10|
|53|Needle Arm|Grass *(Special)*|60|100|15|
|59|Cotton Spore|Grass *(Special)*|0|85|40|
|65|Sandstorm|Rock *(Physical)*|0|0|10|
|71|Destiny Bond|Ghost *(Physical)*|0|0|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Snorunt
ID: 362

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 42|[Glalie](#glalie)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Powder Snow|Ice *(Special)*|40|100|25|
|1|Leer|Normal *(Physical)*|0|100|30|
|4|Double Team|Normal *(Physical)*|0|0|15|
|10|Bite|Dark *(Special)*|60|100|25|
|13|Icy Wind|Ice *(Special)*|55|95|15|
|19|Headbutt|Normal *(Physical)*|70|100|15|
|22|Protect|Normal *(Physical)*|0|0|10|
|28|Ice Fang|Ice *(Special)*|65|95|15|
|31|Crunch|Dark *(Special)*|80|100|15|
|37|Ice Shard|Ice *(Special)*|40|100|30|
|40|Hail|Ice *(Special)*|0|0|10|
|46|Blizzard|Ice *(Special)*|110|70|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Camerupt
ID: 363

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Tackle|Normal *(Physical)*|50|100|35|
|1|Ember|Fire *(Special)*|40|100|25|
|1|Magnitude|Ground *(Physical)*|1|100|30|
|5|Ember|Fire *(Special)*|40|100|25|
|8|Magnitude|Ground *(Physical)*|1|100|30|
|12|Focus Energy|Normal *(Physical)*|0|0|30|
|15|Flame Burst|Fire *(Special)*|70|100|15|
|19|Amnesia|Psychic *(Special)*|0|0|20|
|22|Lava Plume|Fire *(Special)*|80|100|15|
|26|Earth Power|Ground *(Physical)*|90|100|10|
|29|Curse|??? *(Physical)*|0|0|10|
|31|Take Down|Normal *(Physical)*|90|85|20|
|33|Rock Slide|Rock *(Physical)*|75|90|10|
|39|Yawn|Normal *(Physical)*|0|100|10|
|46|Earthquake|Ground *(Physical)*|100|100|10|
|52|Eruption|Fire *(Special)*|150|100|5|
|59|Fissure|Ground *(Physical)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Spheal
ID: 364

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 32|[Sealeo](#sealeo)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|1|Powder Snow|Ice *(Special)*|40|100|25|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Water Gun|Water *(Special)*|40|100|25|
|7|Encore|Normal *(Physical)*|0|100|5|
|13|Ice Ball|Ice *(Special)*|30|90|20|
|19|Body Slam|Normal *(Physical)*|85|100|15|
|25|Aurora Beam|Ice *(Special)*|65|100|20|
|31|Hail|Ice *(Special)*|0|0|10|
|37|Rest|Psychic *(Special)*|0|0|10|
|37|Snore|Normal *(Physical)*|50|100|15|
|43|Blizzard|Ice *(Special)*|110|70|5|
|49|Sheer Cold|Ice *(Special)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Sealeo
ID: 365

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 44|[Walrein](#walrein)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Defense Curl|Normal *(Physical)*|0|0|40|
|1|Powder Snow|Ice *(Special)*|40|100|25|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Water Gun|Water *(Special)*|40|100|25|
|7|Encore|Normal *(Physical)*|0|100|5|
|13|Ice Ball|Ice *(Special)*|30|90|20|
|19|Body Slam|Normal *(Physical)*|85|100|15|
|25|Aurora Beam|Ice *(Special)*|65|100|20|
|31|Hail|Ice *(Special)*|0|0|10|
|32|Swagger|Normal *(Physical)*|0|90|15|
|39|Rest|Psychic *(Special)*|0|0|10|
|39|Snore|Normal *(Physical)*|50|100|15|
|47|Blizzard|Ice *(Special)*|110|70|5|
|55|Sheer Cold|Ice *(Special)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Exploud
ID: 366

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Ice Fang|Ice *(Special)*|65|95|15|
|1|Fire Fang|Fire *(Special)*|65|95|15|
|1|Thunder Fang|Electric *(Special)*|65|95|15|
|1|Pound|Normal *(Physical)*|40|100|35|
|1|Uproar|Normal *(Physical)*|50|100|10|
|1|Astonish|Ghost *(Physical)*|30|100|15|
|1|Howl|Normal *(Physical)*|0|0|40|
|5|Uproar|Normal *(Physical)*|50|100|10|
|11|Astonish|Ghost *(Physical)*|30|100|15|
|15|Howl|Normal *(Physical)*|0|0|40|
|20|Bite|Dark *(Special)*|60|100|25|
|23|Supersonic|Normal *(Physical)*|0|55|20|
|29|Stomp|Normal *(Physical)*|65|100|20|
|37|Screech|Normal *(Physical)*|0|85|40|
|40|Crunch|Dark *(Special)*|80|100|15|
|45|Roar|Normal *(Physical)*|0|100|20|
|55|Zen Headbutt|Psychic *(Special)*|80|100|15|
|63|Rest|Psychic *(Special)*|0|0|10|
|63|Sleep Talk|Normal *(Physical)*|0|0|10|
|71|Hyper Voice|Normal *(Physical)*|90|100|10|
|80|Boomburst|Normal *(Physical)*|140|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Clamperl
ID: 367

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Trade Item 192|[Huntail](#huntail)|
|Trade Item 193|[Gorebyss](#gorebyss)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Clamp|Water *(Special)*|35|85|10|
|1|Water Gun|Water *(Special)*|40|100|25|
|1|Whirlpool|Water *(Special)*|35|85|15|
|1|Iron Defense|Steel *(Physical)*|0|0|15|
|51|Shell Smash|Normal *(Physical)*|0|0|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Huntail
ID: 368

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Whirlpool|Water *(Special)*|35|85|15|
|6|Bite|Dark *(Special)*|60|100|25|
|10|Screech|Normal *(Physical)*|0|85|40|
|15|Water Pulse|Water *(Special)*|60|100|20|
|19|Scary Face|Normal *(Physical)*|0|90|10|
|24|Ice Fang|Ice *(Special)*|65|95|15|
|28|Brine|Water *(Special)*|65|100|10|
|33|Baton Pass|Normal *(Physical)*|0|0|40|
|37|Dive|Water *(Special)*|60|100|10|
|42|Crunch|Dark *(Special)*|80|100|15|
|46|Aqua Tail|Water *(Special)*|90|90|10|
|51|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Zangoose
ID: 369

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Scratch|Normal *(Physical)*|40|100|35|
|1|Leer|Normal *(Physical)*|0|100|30|
|5|Quick Attack|Normal *(Physical)*|40|100|30|
|8|Fury Cutter|Bug *(Physical)*|40|95|20|
|12|Pursuit|Dark *(Special)*|40|100|20|
|15|Slash|Normal *(Physical)*|70|100|20|
|19|Knock Off|Dark *(Special)*|65|100|25|
|22|Crush Claw|Normal *(Physical)*|75|95|10|
|26|Revenge|Fight *(Physical)*|60|100|10|
|29|False Swipe|Normal *(Physical)*|40|100|40|
|33|Detect|Fight *(Physical)*|0|0|5|
|36|X-Scissor|Bug *(Physical)*|80|100|15|
|40|Taunt|Dark *(Special)*|0|100|20|
|43|Swords Dance|Normal *(Physical)*|0|0|20|
|47|Close Combat|Fight *(Physical)*|120|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Whiscash
ID: 370

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Dragon Dance|Dragon *(Special)*|0|0|20|
|1|Zen Headbutt|Psychic *(Special)*|80|100|15|
|1|Tickle|Normal *(Physical)*|0|100|20|
|1|Mud-Slap|Ground *(Physical)*|20|100|10|
|1|Mud Sport|Ground *(Physical)*|0|100|15|
|1|Water Sport|Water *(Special)*|0|100|15|
|6|Mud Sport|Ground *(Physical)*|0|100|15|
|6|Water Sport|Water *(Special)*|0|100|15|
|10|Water Gun|Water *(Special)*|40|100|25|
|14|Mud Bomb|Ground *(Physical)*|65|85|10|
|18|Amnesia|Psychic *(Special)*|0|0|20|
|22|Water Pulse|Water *(Special)*|60|100|20|
|26|Magnitude|Ground *(Physical)*|1|100|30|
|33|Rest|Psychic *(Special)*|0|0|10|
|33|Snore|Normal *(Physical)*|50|100|15|
|39|Aqua Tail|Water *(Special)*|90|90|10|
|45|Earthquake|Ground *(Physical)*|100|100|10|
|51|Future Sight|Psychic *(Special)*|120|100|15|
|57|Fissure|Ground *(Physical)*|1|30|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Gardevoir
ID: 371

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Stored Power|Psychic *(Special)*|20|100|10|
|1|Growl|Normal *(Physical)*|0|100|40|
|1|Confusion|Psychic *(Special)*|50|100|25|
|1|Double Team|Normal *(Physical)*|0|0|15|
|1|Teleport|Psychic *(Special)*|0|0|20|
|6|Confusion|Psychic *(Special)*|50|100|25|
|10|Double Team|Normal *(Physical)*|0|0|15|
|12|Teleport|Psychic *(Special)*|0|0|20|
|17|Wish|Normal *(Physical)*|0|100|10|
|22|Magical Leaf|Grass *(Special)*|60|0|20|
|25|Heal Pulse|Psychic *(Special)*|0|0|10|
|33|Calm Mind|Psychic *(Special)*|0|0|20|
|40|Psychic|Psychic *(Special)*|90|100|10|
|45|Imprison|Psychic *(Special)*|0|100|10|
|53|Future Sight|Psychic *(Special)*|120|100|15|
|60|Charm|23 *(Physical)*|0|100|20|
|65|Hypnosis|Psychic *(Special)*|0|60|20|
|73|Dream Eater|Psychic *(Special)*|100|100|15|
|80|Moonblast|23 *(Physical)*|95|100|40|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Bagon
ID: 372

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 30|[Shelgon](#shelgon)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Rage|Normal *(Physical)*|20|100|20|
|5|Bite|Dark *(Special)*|60|100|25|
|10|Leer|Normal *(Physical)*|0|100|30|
|16|Headbutt|Normal *(Physical)*|70|100|15|
|20|Focus Energy|Normal *(Physical)*|0|0|30|
|25|Ember|Fire *(Special)*|40|100|25|
|31|Dragonbreath|Dragon *(Special)*|60|100|20|
|35|Zen Headbutt|Psychic *(Special)*|80|100|15|
|40|Scary Face|Normal *(Physical)*|0|90|10|
|46|Crunch|Dark *(Special)*|80|100|15|
|50|Dragon Claw|Dragon *(Special)*|80|100|15|
|55|Double-Edge|Normal *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Shelgon
ID: 373

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 50|[Salamence](#salamence)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Rage|Normal *(Physical)*|20|100|20|
|1|Bite|Dark *(Special)*|60|100|25|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Headbutt|Normal *(Physical)*|70|100|15|
|5|Bite|Dark *(Special)*|60|100|25|
|10|Leer|Normal *(Physical)*|0|100|30|
|16|Headbutt|Normal *(Physical)*|70|100|15|
|20|Focus Energy|Normal *(Physical)*|0|0|30|
|25|Ember|Fire *(Special)*|40|100|25|
|30|Protect|Normal *(Physical)*|0|0|10|
|32|Dragonbreath|Dragon *(Special)*|60|100|20|
|37|Zen Headbutt|Psychic *(Special)*|80|100|15|
|43|Scary Face|Normal *(Physical)*|0|90|10|
|50|Crunch|Dark *(Special)*|80|100|15|
|55|Dragon Claw|Dragon *(Special)*|80|100|15|
|61|Double-Edge|Normal *(Physical)*|120|100|15|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Salamence
ID: 374

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Dragon Dance|Dragon *(Special)*|0|0|20|
|1|Fire Fang|Fire *(Special)*|65|95|15|
|1|Thunder Fang|Electric *(Special)*|65|95|15|
|1|Rage|Normal *(Physical)*|20|100|20|
|1|Bite|Dark *(Special)*|60|100|25|
|1|Leer|Normal *(Physical)*|0|100|30|
|1|Headbutt|Normal *(Physical)*|70|100|15|
|5|Bite|Dark *(Special)*|60|100|25|
|10|Leer|Normal *(Physical)*|0|100|30|
|16|Headbutt|Normal *(Physical)*|70|100|15|
|20|Focus Energy|Normal *(Physical)*|0|0|30|
|25|Ember|Fire *(Special)*|40|100|25|
|30|Protect|Normal *(Physical)*|0|0|10|
|32|Dragonbreath|Dragon *(Special)*|60|100|20|
|37|Zen Headbutt|Psychic *(Special)*|80|100|15|
|43|Scary Face|Normal *(Physical)*|0|90|10|
|50|Fly|Flying *(Physical)*|70|95|15|
|53|Crunch|Dark *(Special)*|80|100|15|
|61|Dragon Claw|Dragon *(Special)*|80|100|15|
|70|Double-Edge|Normal *(Physical)*|120|100|15|
|80|Outrage|Dragon *(Special)*|120|100|10|

## Beldum
ID: 375

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 20|[Metang](#metang)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Take Down|Normal *(Physical)*|90|85|20|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Metang
ID: 376

**Evolutions:**
| Method | Evolution |
|--------|-----------|
|Level 45|[Metagross](#metagross)|

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Stealth Rock|Rock *(Physical)*|0|0|20|
|1|Take Down|Normal *(Physical)*|90|85|20|
|1|Metal Claw|Steel *(Physical)*|50|95|35|
|1|Confusion|Psychic *(Special)*|50|100|25|
|20|Confusion|Psychic *(Special)*|50|100|25|
|20|Metal Claw|Steel *(Physical)*|50|95|35|
|23|Pursuit|Dark *(Special)*|40|100|20|
|26|Miracle Eye|Psychic *(Special)*|0|100|40|
|29|Zen Headbutt|Psychic *(Special)*|80|100|15|
|32|Bullet Punch|Steel *(Physical)*|40|100|30|
|35|Scary Face|Normal *(Physical)*|0|90|10|
|38|Agility|Psychic *(Special)*|0|0|30|
|41|Psychic|Psychic *(Special)*|90|100|10|
|44|Meteor Mash|Steel *(Physical)*|90|90|10|
|47|Iron Defense|Steel *(Physical)*|0|0|15|
|50|Hyper Beam|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM36|Sludge Bomb|Poison *(Physical)*|90|100|10|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Metagross
ID: 377

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Stealth Rock|Rock *(Physical)*|0|0|20|
|1|Take Down|Normal *(Physical)*|90|85|20|
|1|Metal Claw|Steel *(Physical)*|50|95|35|
|1|Confusion|Psychic *(Special)*|50|100|25|
|20|Confusion|Psychic *(Special)*|50|100|25|
|20|Metal Claw|Steel *(Physical)*|50|95|35|
|23|Pursuit|Dark *(Special)*|40|100|20|
|26|Miracle Eye|Psychic *(Special)*|0|100|40|
|29|Zen Headbutt|Psychic *(Special)*|80|100|15|
|32|Bullet Punch|Steel *(Physical)*|40|100|30|
|35|Scary Face|Normal *(Physical)*|0|90|10|
|38|Agility|Psychic *(Special)*|0|0|30|
|41|Psychic|Psychic *(Special)*|90|100|10|
|44|Meteor Mash|Steel *(Physical)*|90|90|10|
|45|Hammer Arm|Fight *(Physical)*|100|90|10|
|55|Iron Defense|Steel *(Physical)*|0|0|15|
|65|Hyper Beam|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Regirock
ID: 378

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Explosion|Normal *(Physical)*|250|100|5|
|1|Stomp|Normal *(Physical)*|65|100|20|
|9|Rock Throw|Rock *(Physical)*|50|90|15|
|17|Curse|??? *(Physical)*|0|0|10|
|25|Superpower|Fight *(Physical)*|120|100|5|
|33|Ancientpower|Rock *(Physical)*|60|100|5|
|41|Iron Defense|Steel *(Physical)*|0|0|15|
|49|Charge Beam|Electric *(Special)*|50|90|10|
|57|Lock-On|Normal *(Physical)*|0|100|5|
|65|Zap Cannon|Electric *(Special)*|100|50|5|
|73|Stone Edge|Rock *(Physical)*|100|80|5|
|81|Hammer Arm|Fight *(Physical)*|100|90|10|
|89|Hyper Beam|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Regice
ID: 379

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Explosion|Normal *(Physical)*|250|100|5|
|1|Stomp|Normal *(Physical)*|65|100|20|
|9|Icy Wind|Ice *(Special)*|55|95|15|
|17|Curse|??? *(Physical)*|0|0|10|
|25|Superpower|Fight *(Physical)*|120|100|5|
|33|Ancientpower|Rock *(Physical)*|60|100|5|
|41|Amnesia|Psychic *(Special)*|0|0|20|
|49|Charge Beam|Electric *(Special)*|50|90|10|
|57|Lock-On|Normal *(Physical)*|0|100|5|
|65|Zap Cannon|Electric *(Special)*|100|50|5|
|73|Ice Beam|Ice *(Special)*|90|100|10|
|81|Hammer Arm|Fight *(Physical)*|100|90|10|
|89|Hyper Beam|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Rayquaza
ID: 380

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Twister|Dragon *(Special)*|40|100|20|
|5|Scary Face|Normal *(Physical)*|0|90|10|
|15|Crunch|Dark *(Special)*|80|100|15|
|20|Hyper Voice|Normal *(Physical)*|90|100|10|
|30|Rest|Psychic *(Special)*|0|0|10|
|35|Air Slash|Flying *(Physical)*|75|95|15|
|45|Ancientpower|Rock *(Physical)*|60|100|5|
|50|Outrage|Dragon *(Special)*|120|100|10|
|60|Dragon Dance|Dragon *(Special)*|0|0|20|
|65|Fly|Flying *(Physical)*|70|95|15|
|75|Extremespeed|Normal *(Physical)*|80|100|5|
|80|Hyper Beam|Normal *(Physical)*|150|90|5|
|90|Dragon Pulse|Dragon *(Special)*|90|100|10|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM45|Attract|Normal *(Physical)*|0|100|15|
|TM47|Steel Wing|Steel *(Physical)*|70|90|25|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Registeel
ID: 382

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Explosion|Normal *(Physical)*|250|100|5|
|1|Stomp|Normal *(Physical)*|65|100|20|
|9|Metal Claw|Steel *(Physical)*|50|95|35|
|17|Curse|??? *(Physical)*|0|0|10|
|25|Superpower|Fight *(Physical)*|120|100|5|
|33|Ancientpower|Rock *(Physical)*|60|100|5|
|41|Iron Defense|Steel *(Physical)*|0|0|15|
|41|Amnesia|Psychic *(Special)*|0|0|20|
|49|Charge Beam|Electric *(Special)*|50|90|10|
|57|Lock-On|Normal *(Physical)*|0|100|5|
|65|Zap Cannon|Electric *(Special)*|100|50|5|
|73|Iron Head|Steel *(Physical)*|80|100|15|
|73|Flash Cannon|Steel *(Physical)*|80|100|10|
|81|Hammer Arm|Fight *(Physical)*|100|90|10|
|89|Hyper Beam|Normal *(Physical)*|150|90|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM07|Hail|Ice *(Special)*|0|0|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## Kyogre
ID: 383

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Water Pulse|Water *(Special)*|60|100|20|
|5|Scary Face|Normal *(Physical)*|0|90|10|
|15|Body Slam|Normal *(Physical)*|85|100|15|
|20|Muddy Water|Water *(Special)*|90|85|10|
|30|Rest|Psychic *(Special)*|0|0|10|
|35|Ice Beam|Ice *(Special)*|90|100|10|
|45|Ancientpower|Rock *(Physical)*|60|100|5|
|50|Water Spout|Water *(Special)*|150|100|5|
|60|Calm Mind|Psychic *(Special)*|0|0|20|
|65|Aqua Tail|Water *(Special)*|90|90|10|
|75|Sheer Cold|Ice *(Special)*|1|30|5|
|80|Thunder|Electric *(Special)*|110|70|10|
|90|Hydro Pump|Water *(Special)*|110|80|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM28|Dig|Ground *(Physical)*|80|100|10|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Groudon
ID: 384

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Mud Shot|Ground *(Physical)*|55|95|15|
|5|Scary Face|Normal *(Physical)*|0|90|10|
|15|Lava Plume|Fire *(Special)*|80|100|15|
|20|Hammer Arm|Fight *(Physical)*|100|90|10|
|30|Rest|Psychic *(Special)*|0|0|10|
|35|Earthquake|Ground *(Physical)*|100|100|10|
|45|Ancientpower|Rock *(Physical)*|60|100|5|
|50|Eruption|Fire *(Special)*|150|100|5|
|60|Bulk Up|Fight *(Physical)*|0|0|20|
|65|Earth Power|Ground *(Physical)*|90|100|10|
|75|Fissure|Ground *(Physical)*|1|30|5|
|80|Solarbeam|Grass *(Special)*|120|100|10|
|90|Fire Blast|Fire *(Special)*|110|85|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM02|Dragon Claw|Dragon *(Special)*|80|100|15|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM05|Roar|Normal *(Physical)*|0|100|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM08|Bulk Up|Fight *(Physical)*|0|0|20|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM14|Blizzard|Ice *(Special)*|110|70|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM23|Iron Tail|Steel *(Physical)*|100|75|15|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM26|Earthquake|Ground *(Physical)*|100|100|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM35|Flamethrower|Fire *(Special)*|90|100|15|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM38|Fire Blast|Fire *(Special)*|110|85|5|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM50|Overheat|Fire *(Special)*|130|90|5|
|HM02|Fly|Flying *(Physical)*|70|95|15|
|HM03|Surf|Water *(Special)*|90|100|15|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|
|HM07|Waterfall|Water *(Special)*|80|100|15|
|HM08|Dive|Water *(Special)*|60|100|10|

## MissingNo.
ID: 385

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Sky Attack|Flying *(Physical)*|140|90|5|
|5|Super Glitch|??? *(Physical)*|75|95|13|
|10|Psychic|Psychic *(Special)*|90|100|10|
|15|Confuse Ray|Ghost *(Physical)*|0|100|10|
|54|Aeroblast|Flying *(Physical)*|100|95|5|
|63|Roost|Flying *(Physical)*|0|0|10|
|70|Dark Pulse|Dark *(Special)*|80|100|15|
|82|Transform|Normal *(Physical)*|0|0|10|
|96|Doom Desire|Steel *(Physical)*|140|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM37|Sandstorm|Rock *(Physical)*|0|0|10|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|HM05|Flash|Normal *(Physical)*|0|70|20|

## Jirachi
ID: 386

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Wish|Normal *(Physical)*|0|100|10|
|1|Confusion|Psychic *(Special)*|50|100|25|
|5|Rest|Psychic *(Special)*|0|0|10|
|10|Swift|Normal *(Physical)*|60|0|20|
|15|Helping Hand|Normal *(Physical)*|0|100|20|
|20|Psychic|Psychic *(Special)*|90|100|10|
|25|Refresh|Normal *(Physical)*|0|100|20|
|30|Rest|Psychic *(Special)*|0|0|10|
|35|Zen Headbutt|Psychic *(Special)*|80|100|15|
|40|Double-Edge|Normal *(Physical)*|120|100|15|
|45|Stealth Rock|Rock *(Physical)*|0|0|20|
|50|Healing Wish|Psychic *(Special)*|0|0|10|
|55|Future Sight|Psychic *(Special)*|120|100|15|
|60|Cosmic Power|Psychic *(Special)*|0|0|20|
|65|Iron Head|Steel *(Physical)*|80|100|15|
|70|Doom Desire|Steel *(Physical)*|140|100|5|

**Compatible TM Moves:**
|TM|Move|Type|Power|Accuracy|PP|
|-|-|-|-|-|-|
|TM01|Focus Punch|Fight *(Physical)*|150|100|20|
|TM03|Water Pulse|Water *(Special)*|60|100|20|
|TM04|Calm Mind|Psychic *(Special)*|0|0|20|
|TM06|Toxic|Poison *(Physical)*|0|90|10|
|TM10|Hidden Power|Normal *(Physical)*|1|100|15|
|TM11|Sunny Day|Fire *(Special)*|0|0|5|
|TM12|Taunt|Dark *(Special)*|0|100|20|
|TM13|Ice Beam|Ice *(Special)*|90|100|10|
|TM15|Hyper Beam|Normal *(Physical)*|150|90|5|
|TM16|Light Screen|Psychic *(Special)*|0|0|30|
|TM17|Protect|Normal *(Physical)*|0|0|10|
|TM18|Rain Dance|Water *(Special)*|0|0|5|
|TM20|Safeguard|Normal *(Physical)*|0|0|25|
|TM21|Frustration|Normal *(Physical)*|1|100|20|
|TM22|Solarbeam|Grass *(Special)*|120|100|10|
|TM24|Thunderbolt|Electric *(Special)*|90|100|15|
|TM25|Thunder|Electric *(Special)*|110|70|10|
|TM27|Return|Normal *(Physical)*|1|100|20|
|TM29|Psychic|Psychic *(Special)*|90|100|10|
|TM30|Shadow Ball|Ghost *(Physical)*|80|100|15|
|TM31|Brick Break|Fight *(Physical)*|75|100|15|
|TM32|Double Team|Normal *(Physical)*|0|0|15|
|TM33|Reflect|Psychic *(Special)*|0|0|20|
|TM34|Shock Wave|Electric *(Special)*|60|0|20|
|TM39|Rock Tomb|Rock *(Physical)*|60|95|15|
|TM40|Aerial Ace|Flying *(Physical)*|60|0|20|
|TM41|Torment|Dark *(Special)*|0|100|15|
|TM42|Facade|Normal *(Physical)*|70|100|20|
|TM43|Secret Power|Normal *(Physical)*|70|100|20|
|TM44|Rest|Psychic *(Special)*|0|0|10|
|TM48|Skill Swap|Psychic *(Special)*|0|100|10|
|TM49|Snatch|Dark *(Special)*|0|100|10|
|HM01|Cut|Normal *(Physical)*|50|95|30|
|HM04|Strength|Normal *(Physical)*|80|100|15|
|HM05|Flash|Normal *(Physical)*|0|70|20|
|HM06|Rock Smash|Fight *(Physical)*|20|100|15|

## Celebi
ID: 387

**Learned Moves:**
|Level|Move|Type|Power|Ac	curacy|PP|
|-|-|-|-|-|-|
|1|Nasty Plot|Dark *(Special)*|0|0|20|
|1|Leech Seed|Grass *(Special)*|0|90|10|
|1|Confusion|Psychic *(Special)*|50|100|25|
|1|Recover|Normal *(Physical)*|0|0|10|
|1|Heal Bell|Normal *(Physical)*|0|0|5|
|10|Safeguard|Normal *(Physical)*|0|0|25|
|19|Magical Leaf|Grass *(Special)*|60|0|20|
|28|Ancientpower|Rock *(Physical)*|60|100|5|
|37|Baton Pass|Normal *(Physical)*|0|0|40|
|46|Giga Drain|Grass *(Special)*|75|100|10|
|55|Heal Pulse|Psychic *(Special)*|0|0|10|
|64|Future Sight|Psychic *(Special)*|120|100|15|
|73|Healing Wish|Psychic *(Special)*|0|0|10|
|82|Leaf Storm|Grass *(Special)*|130|90|5|
|91|Perish Song|Normal *(Physical)*|0|0|5|

