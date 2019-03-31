---
title: How react-geomicons Works
date: 2015-06-10
tags:
  - react
  - svg
  - icons
  - geomicons
related:
  - name: react-geomicons
    href: http://jxnblk.com/react-geomicons
  - name: Geomicons
    href: http://geomicons.com
draft: true
---

# How react-geomicons Works

[Geomicons Open](http://geomicons.com) is an SVG icon set completely hand-coded using the Path element.
The first version’s source was built in complete SVG, but I soon realized that the wrapping SVG and Path elements were the exact same for each icon.
In an effort to DRY things up, I set up a rudimentary build process that would take source code containing only the Path elements’ `d` attribute value and create valid SVG code.

I also built a rough icon injection script...

- geomicons-open as npm module
- paths object
- react-geomicons dependency
- wrapping dumb component


