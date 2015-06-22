---
title: Mathematical Web Typography
created: 06-10-2015
tags:
  - css
  - typography
  - math
related:
  - name: Basscss
    href: http://basscss.com
draft: true
---


When it comes to designing for the web there are a handfull of principles that I like to follow.
First and foremost, designing for the medium, or as Frank Chimero puts it,
following [“the grain of the Web”](http://frankchimero.com/writing/the-webs-grain/).
The web is fluid and largely based on screens and other devices of varying sizes,
and typography on the Web should reflect that.
Second, designing
[content-out](http://alistapart.com/article/content-out-layout),
which generally means designing around a strong typographical base since the large majority of Web content is text.
And last, designing with modular scales. Things built on the Web should be fluid and infinitely scalable.
Using modular scales in a design compliments that idea and keeps things simple in the face of growing complexity.

## Growing Complexity

Often when looking at how different sites have handled typography, I see similar problems arise.
Instead of sticking to a limited, modular type scale, any one site might have hundreds of font sizes declared.
Instead of conforming to a common convention that could help users navigate and make sense of the underlying complexity,
these sites have added to the cognitive overhead with little to no benefit for the user.
In my experience, a page rarely needs more than six font sizes to effectively convey its information hierarchy,
and that’s exactly how many font sizes are provided with HTML headings.

## Context-Specific Approaches

Instead of focusing on systems that enhance the content,
designers often focus on singular context-specific problems and introduce magic numbers that quickly grow out of hand.
These context-specific problems should inform the larger system, not break it.
While these one-off cases may seem harmless in isolation,
they often cause increasing complexity in a code base, and can lead to unintended side effects –
increasing technical debt and slowing down development speed.
I'm not entirely sure how to prevent this from happening,
but I suspect that setting up a well-designed, flexible typographic system that works in many situations can help deter it.

## Screen Media

While many typographic conventions have been around for centuries,
most of that knowledge was based on technology that involved physical pieces of metal and paper media.
I think that the large majority of that knowledge is still applicable on the Web,
but I also think that the different constraints and capabilities of screens warrants some new approaches.

## Start with the Defaults

The default type scale most browsers implement provides a great starting point for developing a robust typographic system.
Since some of the values result in non-integers,
I tend to normalize and round the numbers to make them more scalable and easier to work with. 

Default | Pixels   | Normalized | Rem
--------|----------|------------|--------
0.67em  | 10.72px  | 12px       | .75rem
0.83em  | 13.28px  | 14px       | .875rem
inherit | 16px     | 16px       | 1rem
1.17em  | 18.72px  | 20px       | 1.25rem
1.5em   | 24px     | 24px       | 1.5rem
2em     | 32px     | 32px       | 2rem

## Powers of Two

Paying attention to numbers used for screen-based media, there are a lot of powers of two.
The default font size for most browsers is 16px, which is 2<sup>4</sup>.
Since screens are digital media, everything boils down to binary and is based around bits and bytes.
Because screens are directly tied to graphics memory,
nearly all their different dimensions are based on sums of powers of two, and are often divisible by 16.
For example, the [XGA](https://en.wikipedia.org/wiki/Graphics_display_resolution#XGA_.281024.C3.97768.29)
display standard is 1024&times;768px, which converted to rems (or divided by 16) is 64&times;48rem.


## Modular Scales and Factors

Working with numbers based on powers of two can result in an entire system of rational numbers (often integers).
The normalized scale above starts with 16px (1rem) as a base, and multiplies each by specific factors to create integers.
Taking this normalized scale and setting a line-height of either 1.25 or 1.5 yields the following pixel values.

Font Size | 1.25 Line Height | 1.5 Line Height
----------|------------------|----------------
12px      | 15px             | 18px
14px      | 17.5px           | 21px
16px      | 20px             | 24px
20px      | 25px             | 30px
24px      | 30px             | 36px
32px      | 40px             | 48px

These factors are all based on fractions with a power of two denominator – or based on halves and doubles.

Fraction | Decimal
---------|--------
1/2      | 0.5
1/4      | 0.25
1/8      | 0.125
1/16     | 0.0625

This is similar to how imperial units such as inches or units of time in Western music are divided.
While evolution gave us ten fingers, and base 10 number systems arised from that,
working with powers of two can be a more suitable convention for digital media.

## Line Height and White Space

## Separation of Concerns
- font-size separate from weight and other attributes

<!--

- Principles
  - Content-out
  - Grain of the Web
- Problem
  - Magic Numbers
  - Side Effects
  - Base 10 Numbers
- Solution
  - Browser defaults
  - 16px/1rem
  - Powers of Two
  - Screen resolutions
  - 1 / Power of two
  - Double/Half Modular Scales
  - Line Height
  - White Space
  - Separation of Concerns


I'm a huge fan of modular scales, content-out layouts, and designing things that follow the grain of the web.
Over the years, I've used some off-the-cuff math to help when typesetting and handling layout.

If you look at screen technology, you'll encounter a lot of powers of two or sums of powers of two.
I don't know exactly how this works, but I suspect this has to do with bits and bytes.
For each place added in a binary number, you'll have twice as many numbers.
So once you've dedicated hardware to handle one more byte, you might as well use double what you had without it.

On the web, numbers based around powers of two are your friend.
The default font size for most browsers is 16px - a power of two that visually works well when doubling or halving,
but not so well when working with thirds or other prime numbers.

I like to base all modular scales off of this base unit.
Occasionally, body copy will be adjusted depending on the font, but the base unit of measurement remains in tact.

Often in stylesheets I see line-heights that are calculated as a quotient of the target line-height and the font size.
This sometimes leads to irrational, magic numbers that need to be rounded and can cause unforeseen and unintended consequences.
Not only to browsers handle subpixel rounding differently, this can cause issues when scaling font sizes comes in to play.
Sometimes this leads to type scales with line height set for each font size, which means less DRY, less flexible code.

Multipliers/Factors
If you start with 16, half of that, 8px, is much too small for font size.
When building out a scale, I tend to use a set of factors to multiply by.
For example 1.25rem is 20px - a nice, sensible number.
For line height, 1.5 is generally a good starting point, and the product of 16 x 1.5 is 24px, another nice, clean number.
When looking at modular type scales and these multipliers, a natural pattern emerges.
All the "good" factors for dealing with a 16px base tend to be increments of 1 divided by a power of two.
For example, 1/2 = .5, 1/4 = .25, 1/8 = .125, etc.
// This should be a table
(This is also how inches are divided)

---

- powers of two - bits and bytes
- screen resolutions
- 2 4 8 16 32 64 128 256
- the rem 16px
- white space
- rational numbers
- alignment
- flexibility
- magic numbers
- deriving line height values from desired product
- unintended side effects

- base 10, can be halved not quartered

---

- Content-out
- Modular scales
- Browser defaults
- 16px & powers of two
- Doubles and halves
- uine-height
- Margin/padding white space
- separation of concerns in CSS


-->


