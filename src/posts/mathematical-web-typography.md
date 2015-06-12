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

- Content-out
- Modular scales
- Browser defaults
- 16px & powers of two
- Doubles and halves
- uine-height
- Margin/padding white space
- separation of concerns in CSS


---

I'm a huge fan of modular scales, content-out layouts, and designing things that follow the grain of the web. Over the years, I've used some off-the-cuff math to help when typesetting and handling layout.

If you look at screen technology, you'll encounter a lot of powers of two or sums of powers of two. I don't know exactly how this works, but I suspect this has to do with bits and bytes. For each place added in a binary number, you'll have twice as many numbers. So once you've dedicated hardware to handle one more byte, you might as well use double what you had without it.

On the web, numbers based around powers of two are your friend. The default font size for most browsers is 16px - a power of two that visually works well when doubling or halving, but not so well when working with thirds or other prime numbers.

I like to base all modular scales off of this base unit. Occasionally, body copy will be adjusted depending on the font, but the base unit of measurement remains in tact.

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

