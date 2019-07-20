---
title: I helped invent utility-based CSS, but I wouldn't recommend using it
date: 2019-07-11
draft: true
---

Okay now that you've survived the click bait title, don't shake a fist at me if you're currently using utility-based (aka functional) CSS.
It's fine to use. It has its place in the world, and you shouldn't listen to dogma anyhow.

Adam Morse and I started digging into the work Nicole Sullivan was doing circa 2015(?) with OOCSS. It took me a little convincing at first, but after it clicked it was eye opening.
We both took the idea and ran with it.
Adam was more focused on creating a highly-performant, complete replacement for traditional css and I was more interested in making a small toolkit to speed up the design and development of my team.
Theses ideas became Tachyons and Basscss, respectively.

## Constraint-based design

These libraries are rooted in the idea of constraint-based design

Instead of allowing the full expressiveness of css To run loose in a code base,
These libraries were meant to make it easier to do the right thing by confirming to predefined colors, typographic styles, negative space scales, and other styles,
While still allowing these values to be quickly defined exactly where they're needed

In 2015, many people were not ready for this approach
It flew in the face of everything we'd previously learned about "writing good css"
one man even had a hissy fit about it
Haters gonna hate.

But the fact that more and more people were seeing the negative effects of writing this so-called good css, the idea caught on to some degree

## The Modern front end

Fast forward to now.
I, like many front end developers,
Have been building applications with React for a few years now

While there are other front end tech stacks to consider, React has become the industry standard. There are still many Rails apps in the world and teams using Angular, but any "modern" front end stack is largely based on the same component-based foundation as React

It's just a much better way to build user interfaces. Even Apple’s SwiftUI
For iOS looks heavily inspired by React.

## Abstractions

While I too miss the simplicity of view source and using ftp to update a site live on the web, due to the nature of software, abstractions have been built on top of the lower-level APIs and they will continue to do so.

This isn't the result of anyone trying to be exclusive, but it's the same entropy that's found everywhere in software development
We'll keep stacking this house of cards higher and higher until it crushes us all or until we've programmed robots to do it for us

## Modern CSS

A large swatch of problems that Functional/Utility-based CSS aimed to solve are largely solved by CSS-in-JS libraries

That is, most JS-based approaches to CSS abstract away the need to dance around specificity wars or try to enforce a particular naming convention

They also work extremely well with bundle splitting approaches and handle things like "critical css" without the author even needing to be aware of how it works

For younger front end developers, I would guess that not having to learn (as much) about specifity actually makes authoring css more inclusive.

The isolated nature of CSS-in-JS is worth the price of admission alone

The heavy level of scrutiny required for simple CSS changes has mostly gone away – I can't imagine going back to working how I used to

		Code changes that would've caused issues with vanilla css slip right into production causing no harm at all
		I've seen some code changes that would've been blockers before merge into production.m because the code was isolated


 (and others like it including Smacss, BEM, and ITCSS)

You can compare CSS-in-JS to sass. Sass tried to solve some problems with authoring css. It got a lot of things wrong but it got a few things right.

Some of the things it got right are now baked into css - i.e. custom properties
Some of the other good parts are baked into modern css in js tools - i.e. nested syntax for pseudoclasses

CSS-in-JS will also get some things wrong, inevitably.

What I'm trying to say is:
If you're working on a modern front end app, use Emotion or Styled Components.
If you like using constraint based design and making things look consistent, use Styled System.
If you're not using React, Vuejs, or Angular, don't sweat it.
Eventually the good stuff will make it out of this tiny user land exploration that's happening right now.
If you're happy using Tachyons, use it. It's good and it works.

		If you like some of what Tachyons was trying to do, but you're



