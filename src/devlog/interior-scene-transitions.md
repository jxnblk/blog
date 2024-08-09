---
title: Interior Scene Transitions in Unity
date: 2023-10-19
devlog: 4
image: https://jxnblk.com/images/isolated-interior/devlog-04.jpg
tags:
  - devlog
  - unity
  - scene management
---

[Novantica][] is set in an open world environment with various interior scenes that asynchronously load in when the player is nearby.
When I started developing the game, I was originally planning to use a top-down third-person perspective, like many of my favorite old adventure games.
Because it was set in an urban environment, I also wanted the player to be able to look up towards the sky and get a sense of the urban architecture.
I tried a few different approaches to shifting the camera based on how the player was moving, but never quite achieved what I'd hoped to.
Eventually I decide to make the camera work like many third-person perspective games and allow the user to move the camera using the right stick on a controller.

This approach worked really well for the open outdoor areas, but made the interior scenes feel cramped and awkward.
Many other games just leave things to the player to figure out, but I've never really liked how games did that.
I can't tell you how many times I would stop in the middle of a cave in _Tears of the Kingdom_ just to look around and try to understand where, exactly, Link was in relation to the cave.
This free camera movement also made some of the puzzle mechanics in the Novantica awkward – e.g. making it difficult to see where a box needed to be pushed.

Then, I had an idea I wanted to test out...

[Novantica]: https://novanticagame.com

<iframe
  title="Screencap of Novantica game interior camera transition"
  src="https://jxnblk-redditembed2.web.val.run?id=17at2r7&sub=Unity3D"
  width="960"
  style="width:100%;aspect-ratio:16/10;border:none"
></iframe>

<!--
<blockquote class="reddit-embed-bq" style="height:500px" data-embed-height="500"><a href="https://www.reddit.com/r/Unity3D/comments/17at2r7/interior_scene_transition_what_do_you_think/">Interior scene transition - what do you think?</a><br> by<a href="https://www.reddit.com/user/vantomgames/">u/vantomgames</a> in<a href="https://www.reddit.com/r/Unity3D/">Unity3D</a></blockquote><script async="" src="https://embed.reddit.com/widgets.js" charset="UTF-8"></script>
-->
<br />

<!-- more -->

In the video above, I tested out a simple way to make the world fade away and draw focus on the interior scene when entering.
This felt like it gave the puzzles in these scenes a bit more breathing room and allows the player to position the camera in a top-down way without feeling claustrophobic.
I really liked the general effect, but the implementation needed some work.

This first version uses a URP [Camera Stack][] with the culling mask rendering the _Interior_ layer, along with some of the other mechanic-related layers.
The world is faded out using _Post Exposure_ in Post Processing's _Color Adjustments_, and the interior camera is enabled.
This made it so that the background color had to be black (or a dimmed world) and so that the interior would suddenly pop into view without a smooth transition.

To be able to cross-fade between the two, I decided to use a RenderTexture to render the interior camera (with the interior-specific layers) and add that RenderTexture to a RawImage component that the main camera could render.
By controlling the alpha channel of the RawImage component, the interior scene could be faded in and out over top of the main camera's view.
This also gave me control of the background color used when showing this isolated interior view.
I could render any solid background color or even be transparent to allow other objects to cover up the main camera's view.

I tried using a blur effect on the view from the main camera as a background, which looked kind of cool, but felt disorienting and distracting when moving the camera around. So, I decided to stick with a solid color.

Most of the logic needed for this effect is handled by a single script attached to the new interior camera.
This script uses a reference to the interior camera itself, a RenderTexture for the output of this camera, and a RawImage that will display the RenderTexture.
I use LeanTween for the transition and expose the duration and timing functions for customization.
I also have a boolean for detecting whether the interior view is active or not.

```cs
using UnityEngine;
using UnityEngine.UI;

public class InteriorCamera : MonoBehaviour {
  public Camera cam; // Interior layer w/ culling
  public RenderTexture texture;
  public RawImage output; // UI layer + UI Camera Stack
  public float duration = 0.5f;
  public LeanTweenType easeIn = LeanTweenType.easeInCubic;
  public LeanTweenType easeOut = LeanTweenType.easeOutCubic;

  [Header("State")]
  public bool active = false;
}
```

For the method to fade into the isolated interior view, I check whether the isolated view is already active and return early if needed.
The interior camera and RawImage are both enabled, then I use `LeanTween.value` to pass a float to the `UpdateFade` method.
The `UpdateFade` method changes the alpha value of a private `color` field.
If I decide to transition something else in addition to the RawImage, it can be handled in `UpdateFade`.

```cs
  Color color = Color.white;

  public void FadeIn () {
    if (active) return;
    cam.enabled = true;
    output.enabled = true;
    LeanTween.value(gameObject, UpdateFade, 0f, 1f, duration)
      .setEase(easeIn)
      .setOnComplete(() => {
        Debug.Log($"[InteriorCamera] FadeIn");
      });
    active = true;
  }

  void UpdateFade (float n) {
    color.a = n;
    output.color = color;
  }
```

For the method to fade out, it's the same thing in reverse, but I make use of LeanTween's `setOnComplete` method to disable the camera and RawImage after the transition is complete.

```cs
  public void FadeOut () {
    if (!active) return;
    LeanTween.value(gameObject, UpdateFade, 1f, 0f, duration)
      .setEase(easeOut)
      .setOnComplete(() => {
        Debug.Log($"[InteriorCamera] FadeOut");
        cam.enabled = false;
        output.enabled = false;
      });
    active = false;
  }
```

You can see what this looks like in the screenshots below.

<figure>
  <img
    src='https://jxnblk.com/images/isolated-interior/isolated-interior-outside.jpg'
    alt='Screenshot of player standing outside building'
  />
  <figcaption>
    The default view in the game, where the whole world is visible
  </figcaption>
</figure>

<figure>
  <img
    src='https://jxnblk.com/images/isolated-interior/isolated-interior-inside.jpg'
    alt='Screenshot of player standing inside building'
  />
  <figcaption>
    The isolated interior view when the player enters
  </figcaption>
</figure>

Because [Novantica][] supports multiple resolutions, this effect doesn't work when the resolution of the game isn't 4K.
To handle different resolutions and changing the resolution while playing, I added a method to set the RenderTexture to match the main camera resolution and use `LateUpdate` to check when it has changed.

```cs
  float aspect = 1f;
  int width = 3840;
  int height = 2160;

  void Start () {
    Init();
  }

  void Init () {
    aspect = Camera.main.aspect;
    width = Camera.main.pixelWidth;
    height = Camera.main.pixelHeight;
    texture = new RenderTexture(width, height, 32);
    cam.targetTexture = texture;
    output.texture = texture;
  }

  void LateUpdate () {
    if (!active) return;
    if (Camera.main.aspect != aspect || Camera.main.pixelWidth != width) {
      Init();
    }
  }
```

To use this script, I have an `InteriorTrigger` script that uses trigger colliders to detect when the player is inside a building.
I use a singleton pattern in this `InteriorCamera` script to allow the trigger components to enable and disable the interior camera across different scenes (each interior is a separate Addressable scene in the game).

You can use whatever makes sense for your game's architecture to enable and disable the interior camera, but the singleton setup looks something like this:

```cs
  public static InteriorCamera instance;

  void Awake () {
    if (instance == null) instance = this;
    else Destroy(this.gameObject);
  }
```

The end result:

<blockquote class="reddit-embed-bq" style="height:500px" data-embed-height="500"><a href="https://www.reddit.com/r/Unity3D/comments/17bkh8g/interior_scene_transition_take_two/">Interior scene transition - take two</a><br> by<a href="https://www.reddit.com/user/vantomgames/">u/vantomgames</a> in<a href="https://www.reddit.com/r/Unity3D/">Unity3D</a></blockquote><script async="" src="https://embed.reddit.com/widgets.js" charset="UTF-8"></script>
<br />

If you'd like to set up something similar in your project, here is the full source code for the component:

<script src="https://gist.github.com/jxnblk/296850435694b95569ff09347756ce9e.js"></script>

[Camera Stack]: https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@17.0/manual/camera-stacking.html

<!--

- approach
- code
- results
- tweaks/adjustments

-->
