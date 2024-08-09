---
title: Modular Characters Part I
date: 2023-10-16
devlog: 3
image: https://jxnblk.com/images/modular-npcs/modular-characters.jpg
tags:
  - devlog
  - unity
  - blender
  - character design
  - mixamo
---

<img
  src='https://jxnblk.com/images/modular-npcs/in-game-crowd.jpg'
  alt='Screenshot from Novantica with NPC crowd walking in the street'
/>

Since [Novantica][] is set in a futuristic city, I always wanted to make sure the game had a certain level of city life – people walking around, bots zooming by, drones buzzing, trams gliding, and bikes rolling along.
I hadn't done much 3D modeling before learning Unity, and, while modeling props, buildings, and other blockish things didn't seem to difficult, I struggled with creating humanoid characters.
I knew that I wanted something low-poly, simple, and a bit cartoonish for the game's characters, but I'll admit that character design is probably not my strong suit.

[novantica]: https://novanticagame.com

<!-- more -->

<figure>
  <img
    src='https://jxnblk.com/images/modular-npcs/early-sketches.jpg'
    alt='Rough character sketches'
  />
  <figcaption>
    Early character sketches
  </figcaption>
</figure>

I watched a lot of video tutorials and studied characters from other games, and I settled on a general style that I felt was good enough, but wanted to polish the character artwork before releasing the game.
I also wanted to improve upon the diversity and variety, while giving the NPCs just a little bit more personality.

<figure>
  <img
    src='https://jxnblk.com/images/modular-npcs/early-aries.jpg'
    alt='Screenshot of low poly character standing in the street'
  />
  <figcaption>
    A very early, prototype version of the main character Aries
  </figcaption>
</figure>

<figure>
  <img
    src='https://jxnblk.com/images/modular-npcs/old-extras.jpg'
    alt='Screenshot of the earlier versions of the NPC extras'
  />
  <figcaption>
    The first version of NPC extras
  </figcaption>
</figure>

The existing NPCs were just a set of different models, with different hair styles, body shapes, and clothing. As you walked through the city, you'd inevitably encounter the same model over and over again.
I could explain it away in the game by saying that the story involves time travel, but I wanted more random variety of the NPCs populating the city.
The best way I could think of achieving this was by modularizing the characters so that I could randomly generate any number of NPCs using primitive parts and different color palettes.

<figure>
  <img
    src='https://jxnblk.com/images/modular-npcs/main-characters-before-after.jpg'
    alt='Screenshot of the main characters, before and after'
  />
  <figcaption>
    Main characters, before and after
  </figcaption>
</figure>

I started with rebuilding the core characters in Blender to try to nail down an approach and style that fit better with the feel of the game.
Once I was happy with the general look and feel, I started building out modular characters based on this style.
Starting with a base body type, I added multiple different models for hair styles, tops, bottoms, shoes, and accessories like sunglasses and hats.

<figure>
  <img
    src='https://jxnblk.com/images/modular-npcs/blender-parts.jpg'
    alt='Screenshot of the model in Blender'
  />
  <figcaption>
    The first body type with all modular parts shown and an example of only showing one set of the modular parts
  </figcaption>
</figure>

For coloring the models, I created several new textures that are UV mapped based on skin, hair, and colors for the tops, bottoms, shoes, and accessories.
This way I could swap the texture on the model to change the complexion and colors of the outfits independent from the parts.

<figure>
  <img
    src='https://jxnblk.com/images/modular-npcs/textures.jpg'
    alt='Screenshot of the model in Blender'
  />
  <figcaption>
    Some of the textures used to color the modular characters
  </figcaption>
</figure>

Once I had a decent number of parts, I exported all the parts together as a single FBX file, which I uploaded to Mixamo to rig for the game.

<figure>
  <img
    src='https://jxnblk.com/images/modular-npcs/mixamo-rigging.jpg'
    alt='Screenshot of rigging the character in Mixamo'
  />
  <figcaption>
    Rigging the model with all modular parts together
  </figcaption>
</figure>

I brought the rigged model into Unity and created a material for the new textures.
In Unity, each modular part is a separate game object within the model, and I wrote a script to randomize the different part shown for each section of the model, i.e. hair, top, bottom, shoes, and accessory.

<figure>
  <img
    src='https://jxnblk.com/images/modular-npcs/game-objects.jpg'
    alt='Screenshot of the models hierarchy in Unity'
  />
  <figcaption>
    The modular parts are all separate game objects in Unity
  </figcaption>
</figure>

<figure>
  <img
    src='https://jxnblk.com/images/modular-npcs/unity-scripts.jpg'
    alt='Screenshot of the modular character scripts inspectors'
  />
  <figcaption>
    The Unity script allows for an array of named sections, each with an array of possible parts to render
  </figcaption>
</figure>

The `ModularCharacter` script randomizes which part to show for each section, and the `ModularColors` script randomizes which texture to use for the whole model.

<script src="https://gist.github.com/jxnblk/3e21f2494863b4e13a79c783bb05f248.js"></script>

Although I ended up not using it, I also had an array of rules to ensure that specific tops would always match their bottoms for things like aprons and suits.

By randomizing the parts of each section along with the colors used in the textures and the scale of the model, this gave me a huge variety of different possibilities for each NPC's prefab instance.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Modular NPC extras – WIP <a href="https://t.co/Oo70RK4w8d">pic.twitter.com/Oo70RK4w8d</a></p>&mdash; Brent Jackson (@jxnblk) <a href="https://twitter.com/jxnblk/status/1697718113041551800?ref_src=twsrc%5Etfw">September 1, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><p lang="zxx" dir="ltr"><a href="https://t.co/5eJseDIDUi">pic.twitter.com/5eJseDIDUi</a></p>&mdash; Brent Jackson (@jxnblk) <a href="https://twitter.com/jxnblk/status/1713916006962192648?ref_src=twsrc%5Etfw">October 16, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

At this point, I was quite pleased with the results.
I continued by adding another body shape and adding blend shapes to the models and scripts and started replacing the prefabs used in the `Crowd` script that randomly places the NPCs near the character and gives them a destination to walk to.

The results felt a lot better in the game, and it was much more difficult to spot "clones" of other characters with this much variety.

<blockquote class="twitter-tweet"><p lang="zxx" dir="ltr"><a href="https://t.co/0hzGEAWZpt">pic.twitter.com/0hzGEAWZpt</a></p>&mdash; Brent Jackson (@jxnblk) <a href="https://twitter.com/jxnblk/status/1713932201975300490?ref_src=twsrc%5Etfw">October 16, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

At this point, and if you know much about Unity, you can probably guess what happened next: the FPS tanked.
Rendering a crowd of animated NPCs can already be taxing, and with this new modular character approach, each prefab now had multiple Skinned Mesh Renderers to draw which caused the CPU usage to spike.

I was still happy with the look of these new characters and wasn't about to roll back all these changes, so I started experimenting with ways to make this work in the game without killing the performance.
I'll explain what I did in the next devlog post, so stay tuned...

