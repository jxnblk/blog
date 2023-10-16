---
title: Modular Characters Part II
date: 2023-10-17
devlog: 4
draft: true
tags:
  - devlog
  - unity
  - blender
  - character design
  - mixamo
---

After redesigning the NPC characters in Novantica to use modular parts and color schemes, I realized that the approach I had set up wouldn't for the game due to poor performance.

<!-- more -->

_This is a two-part series. Read [Modular Characters Part I](/posts/modular-characters-part-one) here._


<!--
- perf
- other games - rendering crowds
- GPUi thing
- Mesh Animator
  - magic
  - special shader
  - bakes animation frames into texture
  - custom script to animate the texture
  - trade off: memory consumption
- exporting separate characters based on the modular parts
  - less modular than before
  - still using texture swap
- first attempt
  - baking idle, walking, sitting poses for each model
  - 60 fps
  - way too big
  - instantiating a character would cause the game to pause on a frame
- baking just idle and walking 30 FPS
  - smooth instantiation
- sitting NPCs
  - tried mesh animator mesh mode, didn't work
  - used the same idea, but baked static meshes for each pose
    - loop each character
    - loop each pose
    - bake mesh
  - standard URP shader
  - custom script to randomize sitting pose
- results
  - before: 15-30 FPS on Steam Deck ~64 npcs
  - after: 60 FPS on Steam Deck ~128 npcs

-->
