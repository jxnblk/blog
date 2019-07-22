---
title: Space
date: 2019-07-22
---

In 2013, when I started working on an early version of Basscss, I needed a variable name for the values to use in the scales for margin and padding.
I considered using either the word *margin* or *padding*, but quickly decided that either one would imply that the values couldn't be used for the other.
This word needed to be universally applicable, so I chose the word *space*, because I wanted to use it for negative space.
It's also sometimes called *white space* because the color of most paper is white, and it represents the parts of a page where ink isn't applied in printing.

Later on, as I decided on naming conventions for other scales to use in the system,
naming was mostly derived from CSS naming conventions.
The typographic scale used *font-size*, and the `font-size` property was the only one that used values from that scale.
Naming these sorts of scales was much easier.

In moving these conventions to JavaScript with Rebass, and later Styled System, I adopted the common convention using plurals for objects and arrays.
The one outlier in this naming convention was the uncountable noun *space*.

I didn't receive many questions about this in my own libraries at first.
It wasn't until other people were writing their own variations of this with their own unique naming conventions that I started to receive questions about why *space* wasn't plural like the other scales.
Why didn't I name it *spaces* or *spacing*?
In my mind, this sounded like bikeshedding, and I referenced the words *negative space*, *white space*, and even *outer space*
Attempting to "pluralize" a word like *outer spaces* sounds ridiculous and wrong to my English-speaking brain, and the alternatives people were suggesting do not accurately describe what margin and padding are meant to achieve in visual design.

If you wanted a punchline to this post, there isn't one.
Uncountable nouns are a weird part of the English language,
and I'd be perfectly happy if the English language didn't have plurals at all.
