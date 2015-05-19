---
title: 'Designing in the Browser Faster'
date: '04-14-2014'
crossposted:
  - https://medium.com/@jxnblk/designing-in-the-browser-faster-bd413d2bc4f3
---

I’ve been dabbling with HTML and CSS for years—building small websites for myself and friends and building prototypes to test designs. And, while I’ve been fascinated with the idea of designing in the browser for a long time, it wasn’t until recently that it’s become much, much faster for me than using traditional design software.

## Getting faster
Practice has certainly helped, but what really sped up my ability to design and iterate in code was an approach called Object Oriented CSS, or OOCSS. My friend and colleague sent me down this scary-sounding path over a year ago, and I haven’t looked back since. He gave me a ton of reading material, coached me with code reviews, and constantly challenged me. Most of the articles on OOCSS focus on front-end performance, code maintenance benefits, and things like naming conventions. What most people don’t tell you is how much faster it can make designing in code.

## Do one thing well
At its core, OOCSS focuses on highly reusable styles that follow the open/closed principle—that is, they’re open for extension, but closed for modification. They do one thing and do it well. You can think of them as something like layer effects or color swatches. When I’m fleshing out a design, I spend a lot of time adjusting spacing, font sizes, colors, and other small details. I often don’t know what combination of styles each element should have before I see it in context.

## Don’t make assumptions
For new web projects, I usually start with a base type scale, spacing scale, and a rough color palette. Having these separated into single-purpose utilities gives me the flexibility to jump straight into HTML and experiment, without having to constantly write and rewrite CSS. I try not to make assumptions about what any one element or module will end up looking like. Instead, I make sure each element feels right in context, then create more defined patterns when needed.

## Content-centric design
Using single-purpose styles aligns well with the concept of content-centric design. Defining heading styles without knowing what they say or where they’re located can be difficult. Having the ability to quickly adjust type hierarchy, color, and other styles to get the rhythm, balance, and gestalt right is key to successfully designing in the browser.

## From paper to prototype
Using this approach, I typically go directly from notes and paper sketches to building prototypes in code. The only time I open graphic applications like Illustrator or Photoshop are when I need to create image assets to use in code. And with tools like Github, I can try out a number of iterations on different branches in a non-destructive way.

## Choose the right tools
Personally, this has sped up my workflow tremendously, and every designer I’ve introduced to this approach has picked it up quickly and enthusiastically. You might find OOCSS to be a useful addition to your design toolkit as well.

