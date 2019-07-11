---
title: CSS in JS
date: 2019-07-11
draft: true
---

Why I use CSS in JS

I love CSS. I love JS. CSS-in-JS is like a match made in heaven.
While others have enumerated on some of the overall reasons people have adopted cij, I wanted to share some of my personal experiences in using some of these tools over the years

I like (a simultaneously horrified) to compare CIJ to Sass.
When Syntactically awesome stylesheets first hit the scene,
It put many people off

Sass was an attempt to make authoring CSS better for teams at scale. In practice, it helped some but a lot of the same problems with working with CSS on large teams still reared their ugly heads – and other new, unwelcome problems showed up as well

After the experiment that was Sass had boiled over, CSS now has custom properties, which is a huge win for CSS (go team!)

Unfortunately some of the same problems from before (global scope, snowballing CSS filesize, etc)
we're still affecting teams of more than one person

To counteract some of this, we invented authoring methodologies like oocss, functional-utility css, BEM

I helped invent utility-based CSS and I can't in good faith recommend it to anyone at this point

CSS-in-JS removes a whole class of problems that we used to struggle with and I shudder to imagine having to go back to working that way again

CSS-in-JS is a disease [ref] but one I've come to live comfortably with
More of a symbiotic parasite maybe

Why do I like it so much?

## Typos

In CSS, you can make a typo, merge a PR, and ship to production very easily
If you write styles in JS, 9 times out of ten, it'll break if you make a mistake. And if your brave enough to write typescript, there's the excellent CSS properties type definitions to help you even more

It sounds like a silly thing that something like a longer would be able to catch, but I can tell you from experience that a lot of css typos live long lives out in the wild without anyone noticing

- Type checking???

## Unit testing

I've used tools like Karma to try to unit test styles before, and while it did work, I never want to set something like that up again
With CSS in JS libraries, unit testing comes so easily, you'd be silly not to write tests to ensure that clicking a button updates styles like you'd expect them to
In component based UI development this feels like table stakes

Objects

Objects are great. In any language.
Css rulesets are essentially objects.
In CSS you can't merge or nest objects in quite the ways you might imagine
Instead you'll have to brave the world that is css selectors and specificity nightmares to combine two rulesets together
And you'll have to group all your viewport-width based styles together in another parent object instead of writing them inline where you're thinking about them

Writing styles in js object notation feels like a no brainer
You can spread objects to merge them into others
You can create dictionaries of objects to change styles based on props
You can use native js math expressions as values
Hell you can use anything and everything in the entire js ecosystem as a value
Don't have the function you want
Create it and publish it

Not worrying about Selectors

- shudders
- I don't even wanna think about thinking about selectors so I'll just say that they are not missed at all

Arrays

Functions

Functions are great y'all


- Sass isn't a language that's written anywhere else
- It has its own bespoke syntax that is non transerable
- If you write css in js you'll be strengthening your js skills, which should be very useful for front end devs
- If you graduated a Bootcamp where they didn't teach you anything about css, count yourself lucky if you're using css in js, because that means the overall number of things you have to leave has been dramatically reduced

---

Links for reference:
- Sunil Pai for snook gist


Typos
Type checking
Unit testing
Objects
Arrays
Functions
