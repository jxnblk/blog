---
title: Unity InputSystem Touchscreen Detector
date: 2023-10-05
draft: true
devlog: 3
tags:
  - devlog
  - unity
  - input
  - controller
  - mobile
  - touchscreen
  - tutorial
---

When I first started working on [Novantica][], I was considering releasing on iOS in addition to Steam and used TestFlight to manage development builds on my phone.
I've always intended for the game to work well with gamepads/controllers, but I also wanted a way to play test the game using an on-screen virtual controller.

I decided to use the [InputSystem][] package so that the game would support most gamepads and it includes a very easy way to build a custom on-screen controller with the [OnScreenControl][] component.
For the iOS build of the game, a custom on-screen controller shows, and automatically hides when a controller is connected.
It took a bit of fiddling with the InputSystem to get this to work, and I'd like to share how I set this up.

First, make sure you have the InputSystem installed and enabled in your project.
Find or create some images assets to use for any joysticks or buttons you want to use for the on-screen controller, then create a UI canvas for the controller, adding and positioning the joystick and buttons to suit your needs.

The controller I had in the iOS builds looked like this:

\[IMAGE\]

Next, create a new script for hiding and showing the on-screen virtual controller.

\[GIST\]

Add this script to a parent component and hook up the UI canvas in the inspector.
To test this out in the editor, enter play mode, and you should see the on-screen virtual controller.
Now connect a gamepad to your computer; the virtual controller should disappear.
Disconnecting the physical controller should make the on-screen virtual controller reappear.

[novantica]: https://novanticagame.com
[inputsystem]: https://docs.unity3d.com/Packages/com.unity.inputsystem@1.7/manual/index.html
[onscreencontrol]: https://docs.unity3d.com/Packages/com.unity.inputsystem@1.7/manual/OnScreen.html
