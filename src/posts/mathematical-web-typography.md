---
title: Mathematical Web Typography
created: 06-23-2015
tags:
  - css
  - typography
  - math
related:
  - name: Basscss
    href: http://basscss.com
draft: true
---


When it comes to designing for the Web
I like to follow a handful of general principles.
First, design for the medium, or as Frank Chimero puts it,
follow [“the grain of the Web”](http://frankchimero.com/writing/the-webs-grain/).
The web is fluid - based on screens and devices of varying sizes –
and typography on the Web should reflect that.
Second, design [content-out](http://alistapart.com/article/content-out-layout),
which usually means designing around a strong typographical base since the large majority of Web content and UI is text.
And last, design with [modular scales](http://alistapart.com/article/more-meaningful-typography).
Things built on the Web should be fluid and infinitely scalable.
Using modular scales in a design compliments that idea and keeps things organized in the face of growing complexity.

## Handling Complexity

Often when looking at how different sites have handled typography, I see similar problems arise.
Instead of sticking to a limited, modular scale, any one site might have hundreds of font sizes declared
and many more margin and padding declarations affecting the white space.
Instead of conforming to a common convention that could help users make sense of the underlying complexity,
these sites have added to the cognitive overhead with little to no benefit for the user.
In my experience, a page rarely needs more than six font sizes to effectively convey its information hierarchy,
and that’s exactly how many font sizes are provided with HTML headings.

## Context-Specific Approaches

Instead of focusing on systems that enhance the content,
design solutions often focus on singular context-specific problems and introduce 
[magic numbers](https://css-tricks.com/magic-numbers-in-css/) that quickly grow out of hand.
These context-specific problems should inform the larger system, not break it.
While these one-off cases may seem harmless in isolation,
they often cause increasing complexity in a code base, and can lead to unintended side effects –
increasing technical debt and slowing down development speed.
While there may not be any one way to solve these problems,
many sites try to address them with a style guide and well-defined typographic systems.

## Screen Media

Many typographic conventions have been around for centuries,
but most of that knowledge was based on technology that involved physical pieces of metal and paper media.
The majority of these conventions are still applicable on the Web,
but I also think that the different constraints and capabilities of screens warrant some new approaches.

## Start with the Defaults

The browser defaults for font sizes provide a great starting point for developing a robust typographic system.
Since some of the values result in non-integer pixel values,
I tend to normalize and round the numbers to make them more scalable and easier to work with. 

Default | Pixels   | Normalized | Normalized Rem
--------|----------|------------|--------
0.67em  | 10.72px  | 12px       | .75rem
0.83em  | 13.28px  | 14px       | .875rem
inherit | 16px     | 16px       | 1rem
1.17em  | 18.72px  | 20px       | 1.25rem
1.5em   | 24px     | 24px       | 1.5rem
2em     | 32px     | 32px       | 2rem

## Powers of Two

Taking a look at the numbers used in screen-based media, there are a lot of powers of two.
The default font size for most browsers is 16px, which is 2<sup>4</sup>.
Screens are digital media, and everything boils down to binary bits and bytes.
Because they are directly tied to graphics memory,
nearly all screen dimensions are based on sums of powers of two, and are often divisible by 16.
For example, the [XGA](https://en.wikipedia.org/wiki/Graphics_display_resolution#XGA_.281024.C3.97768.29)
display standard is 1024&times;768px, which converted to rems (or divided by 16) is 64&times;48rem.

## Modular Scales and Factors

Working with numbers based on powers of two can result in an entire system of rational, often integer, numbers.
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

This is similar to how imperial units – such as inches, ounces, and pounds
– or how units of time in Western music are divided.
While evolution gave us ten fingers, and base 10 number systems arised from that,
working with powers of two can be a more suitable convention for digital media.

## 1rem as a Base Unit

When setting type, especially body copy, 1rem doesn’t always fit the content and the typeface used,
and it’s often desirable to use other font sizes.
Instead of altering the base font size and dealing with less-than-ideal numbers and complex calculations,
I keep 1rem as the default and derive all other typographic sizes from that base.
For example, setting body copy to 1.125rem (18px) and keeping other UI elements tied to the base 1rem
can make spacing and alignment adjustments much simpler and help create a natural rhythm in the visual design.

## Line Height

In many stylesheets I see line-heights that are calculated as a quotient of the target line-height and the font size.
This sometimes leads to irrational, magic numbers that need to be rounded and can cause unforeseen and unintended consequences.

```css
/* Calculated from the target line-height */
.small-copy {
  font-size: 14px;
  line-height: 1.4285714; /* 20px, e.g. 20 divided by 14 */
}
.body-copy {
  font-size: 18px;
  line-height: 1.3888889; /* 25px, e.g. 25 divided by 18 */
}
```

Not only do browsers handle subpixel rounding differently,
this can also cause issues when inheritance and scaling font sizes comes in to play,
which can lead to type scales with line heights coupled to each font size
and less DRY, less flexible code.

On the other hand, keeping numbers tied to the same system yields interesting results.
The line heights below are computed to seemingly unrelated numbers: 21 and 27px.

```css
/* Using 1rem as a base */
.small-copy {
  font-size: .875rem;
  line-height: 1.5; /* 21px */
}
.body-copy {
  font-size: 1.125rem;
  line-height: 1.5; /* 27px */
}
```

The sum of these two numbers is 48px,
which is the same line height for 32px type when set to 1.5.
Although it might not seem like much, when applied to an entire typographic system,
this approach can yield many subtle relationships among different parts of the design.

## White Space

Font sizes and line heights are only parts of a typographic system.
The white space between headings, paragraphs, and other elements plays a crucial part
in creating typographic color and visual rhythm.
For many of the same reasons listed above, and to stick to a content-out approach,
I tend to base margin and padding values on numbers derived from the same typographic system
and use a modular scale.

For example, [Basscss](http://basscss.com) uses the following scale for margin and padding declarations.

Step | Value
-----|------
1    | .5rem
2    | 1rem
3    | 2rem
4    | 4rem

## Conclusion

This is just one approach to creating modular typographic systems on the Web
and only scratches the surface on some of the underlying details.
Hopefully this can help inform building more robust,
fault tolerant design systems that
promote consistency, reduce technical debt,
and make designing and developing for the Web more efficient and more enjoyable.

<!--
## Separation of Concerns
font-size separate from weight and other attributes -->


