---
title: "Procedural Cave Generation"
date: 2014-05-20
description: A cellular-automata approach to procedurally generating organic cave systems for 2D games.
tags:
  - procedural-generation
  - game-development
hasVideo: false
draft: true
---
What's better than procedural generation with an organic twist?

![Procedural Cave Generation Banner Image](https://media.fisher.sh/blog/2014/05/20/procedural-cave-generation/procedural-cave-generation-banner-image.png)

In one of my [**previous**](http://fisherevans.com/blog/post/dungeon-generation) posts I used a method to generate random dungeons based on graphs. In my implementation the rooms were rectangles, connected by hallways that would turn at 90 degrees \- perfect for a dungeon. But caves have a different set of requirements:

* Cave passages need to be fluid and have curves.  
* Cave walls need to be rugged, not confined to the 90 degree X and Y grid.  
* Cave passages need to have dynamic widths: some larger, some smaller.  
* Caves need larger areas, "caverns".

With these requirements in mind, I thought that if I randomly generate points on a grid and connected them with a [**Relative Neighborhood Graph**](http://en.wikipedia.org/wiki/Relative_neighborhood_graph) I could somehow morph the edges to create the curves and more "natural" walls.

To start, I generated the random points. The process is pretty straightforward \- I have a predefined area within which I want the cave (defined by a width, height, and some padding).

```java
int x, y;
for (int pointId = 0; pointId < _pointCount; pointId++) {
    x = _random.nextInt(_width - _padding * 2) + _padding;
    y = _random.nextInt(_height - _padding * 2) + _padding;
    _points[pointId] = new Point(x, y);
}
```

![random points](https://media.fisher.sh/blog/2014/05/20/procedural-cave-generation/random-points.png)

Then I connected them with lines as an [**RNG**](http://en.wikipedia.org/wiki/Relative_neighborhood_graph) graph. In short, it's an undirected graph where you connect any two points (a, b) where there isn't a third point (c) that is closer to both (a) and (b) than (a) and (b) are to each other.

```java
Point a, b, c; // the three points
float abDist, acDist, bcDist; // the distances we care about (stored as a squared distance)
boolean isEdge;
for (int aid = 0; aid < _pointCount; aid++) {
    for (int bid = aid + 1; bid < _pointCount; bid++) { // for every pair of points (a and b)
        isEdge = true; // assume it's an edge
        a = _points[aid];
        b = _points[bid];
        abDist = a.squaredDistance(b);
        for (int cid = 0; cid < _pointCount; cid++) { // for all points other than a and b
            if (cid == aid || cid == bid) continue;
            c = _points[cid];
            acDist = a.squaredDistance(c);
            bcDist = b.squaredDistance(c);
            if (acDist < abDist && bcDist < abDist) { // if c is closer to b and a, then a is to b
                isEdge = false; // it's not an edge
                break; // and we can stop looking for this set of a and b
            }
        }
        if (isEdge) a.edges.add(b); // if no other point (c) is closer, make an edge!
    }
}
```

![points connected via RNG](https://media.fisher.sh/blog/2014/05/20/procedural-cave-generation/points-connected-via-rng.png)

So, now I have a basis for a cave system. I've got loops and passage ways and it's not confined to 90 degree turns. There's one catch though: it's not very natural (yet). The passage ways are a uniform width and there is no "curviness" to the walls. So I started looking around. I was focused on biologic and organic growth. I thought I could let the cave "grow." I found [**Cellular Automaton**](http://en.wikipedia.org/wiki/Cellular_automaton); the basis of [**Conway's Game of Life**](http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). From there I found a lot of great resources on the [**Procedural Content Generation Wiki**](http://pcg.wikidot.com/pcg-algorithm:caves), specifically [**this one**](http://www.roguebasin.com/index.php?title=Cellular_Automata_Method_for_Generating_Random_Cave-Like_Levels) by Jlund3. But it has its issues: you couldn't control the shapes of the cave and there were chances of pockets of air that weren't connected to each other.

I ended up coming to the conclusion that I could treat my above image like a [**petri dish**](http://en.wikipedia.org/wiki/Petri_dish) and pretend the lines I drew of my graph were like lines of some kind of organic goop. Then after I gave it some time, the organic goop could grow and form more natural structures and pathways. From here on out the entire process is basically greyscale pixel manipulation. For the entrance and exit I drew some larger shapes to ensure they would grow to an adequate size for stairs or ladders. This was now my starting "petri dish."

![cave passages chosen](https://media.fisher.sh/blog/2014/05/20/procedural-cave-generation/cave-passages-chosen.png)

Now I needed to come up with an algorithm that would "let the pixels grow." The basis of following algorithm is that if a pixel is "large" enough (i.e. it's value is above a certain threshold), it will grow into other neighboring pixels.

```java
// amount: the growth amount if a growth is to occur
// seedLimit: for every pixel, only let it grow if it meets this threshold
// chance: if a pixel meets the threshold, it should only grow into its neighbors
//         this percentage of the time
// growRadius: size of the growth area - as a square around the seed pixel.
public void grow(float amount, float seedLimit, float chance, int growthRadius) {
    // hold the pixel growth separate from the map while we calculate the growth
    float[][] growth = new float[_height][_width];
    int tx, ty;
    for (int y = 0; y < _height; y++) {
        for (int x = 0; x < _width; x++) { // for each pixel
            if (_map[y][x] >= seedLimit) { // if this pixel meets the threshold - it's a seed!
                // loop through all neighbors within the radius
                for (int dy = -growthRadius; dy <= growthRadius; dy++) {
                    for (int dx = -growthRadius; dx <= growthRadius; dx++) {
                        tx = x + dx;
                        ty = y + dy;
                        // don't grow outside the map boundaries
                        if (tx < 0 || ty < 0 || tx >= _width || ty >= _height) continue;
                        // double the seed pixel's amount when it grows
                        else if (tx == x && ty == y) growth[y][x] = _map[y][x];
                        // roll the dice, if it meets the chance, grow that neighbor
                        else if (_random.nextFloat() <= chance) growth[ty][tx] += amount; //\_map[y][x];*
                    }
                }
            }
        }
    }
    // apply the accumulated growths to the map itself
    for (int y = 0; y < _height; y++)
        for (int x = 0; x < _width; x++)
            _map[y][x] = clamp(_map[y][x] + growth[y][x]);
}
```

We'll want to run this growth algorithm a couple times (come on, bacteria doesn't grow in 10 seconds flat). To make that a little easier we can create a little helper method:

```java
public void growMultiple(int count, float amount, float seedLimit, float chance, int growthRadius) {
    for (int run = 0; run < count; run++)
        grow(amount, seedLimit, chance, growthRadius);
}
```

We can then use this method to grow our cave system. This is the trickiest part; seemingly small changes to the parameters can create huge changes in the output. Play around with different growth amounts, chances, radii, etc. You can create big, wide smooth caves; or cramped jagged caves pretty easily. I found the following to create a pretty decent "cave" looking result.

```java
oc.growMultiple(8, 1f, 1f, 0.05f, 1);
oc.growMultiple(1, 0.3333f, 1f, 0.5f, 1);
oc.growMultiple(3, 0.05f, 0.5f, 1f, 1);
```

![growing the cave organically](https://media.fisher.sh/blog/2014/05/20/procedural-cave-generation/growing-the-cave-organically.png)

Awesome, this looks good. However, tiles don't really work with "gradient" or "blurred" edges, so we need to pass it through a simple contrast filter to make the edges sharp and tile-worthy.

```java
public void contrast(float threshold) {
    for(int y = 0;y < _height;y++) {
        for(int x = 0;x < _width;x++) { // for each pixel
            // if it's above the threshold, set it to 1, otherwise, 0
            _map[y][x] = _map[y][x] >= threshold ? 1 : 0;
        }
    }
}
```

And that's it. It's ready to be converted into a tile map. Here's a sample result, I've drawn over the start and end areas (green and red boxes) as well as the underlying graph so you could easily see the extent of the growth:

![end result](https://media.fisher.sh/blog/2014/05/20/procedural-cave-generation/end-result.png)

*You can find the full source code [**here**](https://github.com/fisherevans/ProceduralGeneration/blob/master/src/com/fisherevans/proc_gen/caves/OrganicCaves.java).*
