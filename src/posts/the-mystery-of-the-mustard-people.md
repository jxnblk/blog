---
title: The Mystery of the Mustard People
date: 2023-08-21
devlog: 2
tags:
  - devlog
  - unity
  - materials
  - shaders
---

One of the more perplexing bugs I encountered working on [Novantica][] so far was when all the NPC extras in the game suddenly turned a greenish-yellow color.
I had just swapped out URP materials for ones using a new shader, so I suspected that change made this happen,
but I didn't want to revert back to the old materials.
To add icing to the cake, this issue was only happening in builds, not in the editor.
I started to dig in, but didn't realize it would take so long to track down.

[novantica]: https://novanticagame.com

<!-- more -->

![Screenshot showing yellow colored NPCs](https://blog.jxnblk.com/images/mustard/pizza.jpg)

At first, since I didn't know how to reproduce the issue in the editor,
I tried swapping different materials and shaders on one of the character models to see if it was related to any prefabs used to spawn the extras.
No luck, the character was still yellow.
After a bit of fruitless searching on the Unity forums,
I tried moving the model to different scenes and sometimes the material worked and other times not.
I also noticed that the NPCs that were loaded from additive scenes didn't suffer the same ailment, as seen in the screenshot above.
Those scenes were [Addressables][], so I started to suspect it was something related to how I'd set up shared materials across scenes with the Addressables system.

[addressables]: https://docs.unity3d.com/2021.3/Documentation/Manual/com.unity.addressables.html

<figure>
  <img src='https://blog.jxnblk.com/images/mustard/addressables.png' alt='Screenshot of Unity Addressables editor options' />
  <figcaption>
    Changing this option to <em>Use Existing Build</em> made the issue reproducible in the editor
  </figcaption>
</figure>

I switched the Unity Addressables _Play Mode Script_ option to _Use Existing Build_ and was able to start reproducing the issue in the editor.
It felt like I was onto something.

![](https://blog.jxnblk.com/images/mustard/hotel.jpg)

The next thing I tried was adding all the game's materials and textures to a new Addressables group.
This seemed to fix the yellow people problem, but now the materials were missing from some of the additively loaded Addressable scenes.
If you're familiar with Unity, the magenta colored objects in the screenshot above mean that the materials are missing.
I tried a few different ways of grouping the materials in Addressables, but still wasn't able to get everything working as expected.

At this point, I went outside to take a walk and clear my head.
_Why were the characters turning yellow?_
_They should be rendering in magenta if the material was missing._
_The shader looked like it was supposed to but only the color was off..._

Then it dawned on me.
When I got back to the computer, I swapped the texture on the character material to confirm my suspicion.
The material _was_, in fact, working, but the UV maps were wrong.
But why?

<figure>
  <img src='https://blog.jxnblk.com/images/mustard/character-texture.png' alt='The texture used to color the low poly character models' />
  <figcaption>
    The texture used to color the low poly character models.
  </figcaption>
</figure>

This time, I found some [useful hints](https://forum.unity.com/threads/warning-to-all-my-friends-beware-optimise-mesh-data.544735/) from the forums.
It turns out the default _Optimize Mesh Data_ setting on the imported character models was causing the UV map to get lost somewhere along the way.
As you can see in the texture above, the UV map controls how the low poly models are colored.
For some reason, the UV map was only set for one of these colors.

<figure>
  <img
    src='https://blog.jxnblk.com/images/mustard/optimize-mesh.png'
    alt='Screenshot of the Optimize Mesh option for the imported model'
  />
  <figcaption>
    The default setting for Optimize Mesh was the culprit all along
  </figcaption>
</figure>

After disabling this on all the imported FBX models, everything was rendering as expected again.
Case closed.

If you've run into similar issues with Unity, I hope this post was helpful,
but if you know of another or better way to avoid this issue, please let me know.

_Alternative titles considered for this post:_

- What is up with all these wasabi people?
- Perplexed by the pea soup people
- The curious case of caper colored characters
